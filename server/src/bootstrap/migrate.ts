import { Client } from "pg";
import { MIGRATIONS } from "./migrations.generated";

type AppliedRow = { name: string; checksum: string };

async function ensureMigrationsTable(client: Client) {
	await client.query(`
    create table if not exists harmony_migrations (
      name text primary key,
      checksum text not null,
      applied_at timestamptz not null default now()
    )
  `);
}

async function appliedMigrations(client: Client): Promise<Map<string, string>> {
	const res = await client.query<AppliedRow>(
		`select name, checksum from harmony_migrations order by applied_at asc`,
	);
	return new Map(res.rows.map((r) => [r.name, r.checksum]));
}

async function tableExists(client: Client, tableName: string): Promise<boolean> {
	const res = await client.query<{ exists: boolean }>(
		`select exists(
      select 1
      from information_schema.tables
      where table_schema = 'public'
        and table_name = $1
    ) as exists`,
		[tableName],
	);
	return Boolean(res.rows?.[0]?.exists);
}

export async function applyEmbeddedMigrations(databaseUrl: string): Promise<void> {
	if (MIGRATIONS.length === 0) return;

	const client = new Client({ connectionString: databaseUrl });
	await client.connect();
	try {
		await ensureMigrationsTable(client);
		const applied = await appliedMigrations(client);

		// Baseline: if the schema already exists (e.g. created by an older bootstrap path),
		// mark all embedded migrations as applied to avoid "already exists" errors.
		if (applied.size === 0 && (await tableExists(client, "customers"))) {
			for (const m of MIGRATIONS) {
				await client.query(
					`insert into harmony_migrations (name, checksum) values ($1, $2) on conflict do nothing`,
					[m.name, m.checksum],
				);
			}
			return;
		}

		for (const m of MIGRATIONS) {
			const existing = applied.get(m.name);
			if (existing) {
				if (existing !== m.checksum) {
					throw new Error(
						`Migration checksum mismatch for ${m.name}. Expected ${m.checksum}, found ${existing}.`,
					);
				}
				continue;
			}

			await client.query("begin");
			try {
				await client.query(m.sql);
				await client.query(
					`insert into harmony_migrations (name, checksum) values ($1, $2)`,
					[m.name, m.checksum],
				);
				await client.query("commit");
			} catch (err) {
				await client.query("rollback");
				throw err;
			}
		}
	} finally {
		await client.end();
	}
}
