---
name: Backend Core & Environment (Bun, NixOS, Prisma)
description: Hướng dẫn cốt lõi về môi trường, cách chạy lệnh và thao tác với Database Prisma trên NixOS.
---

# Tom-Ny Backend Core Environment

Tài liệu này định nghĩa các quy tắc bắt buộc về môi trường và công cụ cơ sở dữ liệu cho dự án **Server**.

## 1. Runtime & Quản lý Package
- **Runtime:** Dự án sử dụng **Bun**. 
- **Tuyệt đối KHÔNG sử dụng:** `npm`, `yarn`, hoặc `pnpm`.
- Lệnh cài đặt package: `bun install <package>`
- Lệnh chạy script: `bun run <script>`

## 2. Đặc thù hệ điều hành (NixOS)
Vì hệ điều hành đang sử dụng là **NixOS**, Prisma Engine không thể hoạt động trực tiếp do thiếu các thư viện C tiêu chuẩn ở những đường dẫn mặc định của Linux.
Do đó, mọi lệnh tương tác với Database (Prisma) và Runtime **BẮT BUỘC** phải chạy bên trong `nix-shell` (được cấu hình sẵn ở `shell.nix`).

**Quy tắc:**
Khi cần thực thi các lệnh liên quan đến hệ thống, prisma, hãy gói lệnh bằng:
```bash
nix-shell --run "bun <lệnh>"
```
Ví dụ:
```bash
nix-shell --run "bun install"
nix-shell --run "bun run dev"
```

## 3. Database & Prisma
- **Database:** PostgreSQL.
- **ORM:** Prisma (`prisma/schema.prisma`).
- **Thực thi Prisma Scripts:** 
  Vì lý do NixOS đã nêu trên, khi thay đổi schema hay thao tác với DB, hãy sử dụng các script đã định nghĩa trong `package.json` và chạy qua `nix-shell`:
  - Format/Lint schema: `nix-shell --run "bun run db:generate"` (Lệnh này sẽ tự động tạo Prisma Client và Pothos Types).
  - Migrate DB: `nix-shell --run "bun run db:migrate"`
  - Seed DB: `nix-shell --run "bun run db:seed"`
  - Xóa và force reset DB: `nix-shell --run "bun run db:reset"`
- **Lưu ý Code DB:** Context của database nằm ở file `src/db.ts`. Prisma được khởi tạo sử dụng `@prisma/adapter-pg`. Không sửa cách kết nối này nếu không được yêu cầu.
