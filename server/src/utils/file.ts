import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { GraphQLError } from "graphql";
import { env } from "../env";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"image/gif",
	"image/svg+xml",
];

function sanitizeFileName(name: string): string {
	return name
		.replace(/[^a-zA-Z0-9._-]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
}

function validateFile(file: File) {
	if (file.size > MAX_FILE_SIZE) {
		throw new GraphQLError(
			`File quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Tối đa ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
		);
	}

	if (!ALLOWED_MIME_TYPES.includes(file.type)) {
		throw new GraphQLError(
			`Loại file không hợp lệ (${file.type}). Chỉ chấp nhận: ${ALLOWED_MIME_TYPES.join(", ")}.`,
		);
	}
}

function uploadsDir(): string {
	return env.UPLOADS_DIR ?? "public/uploads";
}

export async function saveFile(file: File): Promise<string> {
	validateFile(file);

	const dir = uploadsDir();
	await mkdir(dir, { recursive: true });

	const sanitized = sanitizeFileName(file.name);
	const fileName = `${Date.now()}-${sanitized}`;
	const filePath = path.join(dir, fileName);

	// Prevent path traversal
	const resolved = path.resolve(filePath);
	const root = path.resolve(dir);
	if (!(resolved === root || resolved.startsWith(root + path.sep))) {
		throw new GraphQLError("Đường dẫn file không hợp lệ.");
	}

	await Bun.write(filePath, file);

	return `/uploads/${fileName}`;
}

export async function deleteUploadedFile(
	fileUrl?: string | null,
): Promise<void> {
	if (!fileUrl || !fileUrl.startsWith("/uploads/")) return;

	const dir = uploadsDir();
	const fileName = fileUrl.replace(/^\/uploads\//, "");
	const filePath = path.join(dir, fileName);

	// Prevent path traversal
	const resolved = path.resolve(filePath);
	const root = path.resolve(dir);
	if (!(resolved === root || resolved.startsWith(root + path.sep))) return;

	try {
		await unlink(filePath);
	} catch {
		// Ignore when file does not exist or cannot be removed.
	}
}
