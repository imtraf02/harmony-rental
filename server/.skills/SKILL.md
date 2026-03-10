---
name: Tom-Ny Backend Guidelines
description: Backend development rules for the tom-ny server (Bun, Nix, GraphQL, Prisma).
---

# Tom-Ny Backend Guidelines

This document defines the rules for the **server application**.

Backend stack:

- Bun runtime
- GraphQL
- Pothos
- Prisma
- PostgreSQL

---

# Runtime & Environment

The backend uses **Bun**.

Rules:

- Always run the backend inside **nix-shell**.
- Do NOT use npm, yarn, or pnpm.
- Use **bun** for dependency management and scripts.

Correct:

```bash
nix-shell
bun install
bun run dev
```
