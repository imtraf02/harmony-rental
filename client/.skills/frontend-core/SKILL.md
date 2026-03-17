---
name: Frontend Core & Environment (React 19, Tauri, Tailwind v4)
description: Hướng dẫn cốt lõi về môi trường, UI, và luồng phát triển cho Client (React 19, Vite, Tauri).
---

# Tom-Ny Client Core Environment

Tài liệu này định nghĩa các quy tắc phát triển giao diện (UI) và thiết lập môi trường cho ứng dụng **Client** (Desktop App với Tauri & React).

## 1. Runtime & Quản lý Package

- **Package Manager:** Dự án sử dụng **Bun**. Tuyệt đối KHÔNG dùng `npm`, `yarn`, hay `pnpm`.
- Lệnh cài đặt package: `bun install <package>`
- Lệnh chạy lint/format (sử dụng **Biome** thay cho ESLint/Prettier): `bun run check` (hoặc `bun run lint` / `bun run format`).

## 2. Tauri & Môi trường chạy Dev

Dự án được bọc trong **Tauri** (thư mục `src-tauri`). Lệnh chạy dev của Tauri yêu cầu các biến môi trường đặc biệt chỉ định toolchain Rust nội bộ:

- Chạy App (Tauri Desktop): Sử dụng lệnh `bun run tauri:dev` (chỉ chạy khi cần thao tác với Desktop API).
- Chạy Web (Browser): `bun run dev` (chạy trên port 3000 bằng Vite, dùng để test UI thuần túy).

## 3. Tech Stack UI

- **React 19**: Sử dụng functional components, hooks.
- **Tailwind CSS v4**: Phiên bản mới của Tailwind (cấu hình qua `@tailwindcss/vite` plugin trong `vite.config.ts` thay vì `tailwind.config.js`).
- **UI Components**: Dự án sử dụng **shadcn/ui** dựa trên Radix UI (`src/components/ui/`). Khi cần UI mới, ưu tiên tái sử dụng các component có sẵn ở đây trước.
- **Icons**: Sử dụng **Lucide React** (`lucide-react`) và **Tabler Icons** (`@tabler/icons-react`).

## 4. Kiến trúc File/Thư mục cơ bản

- `src/components/`: Chứa các UI Component dùng chung (`ui/`, `layout/`, `data-table/`, v.v.).
- `src/features/`: Chứa mã nguồn chia theo miền nghiệp vụ (Domain-Driven).
- `src/routes/`: Cấu hình routing (được quản lý bởi file-based routing của TanStack Router).
- `src/lib/`: Chứa các hàm utils chung và cấu hình Apollo Client.
- `src/stores/`: Chứa các state quản lý toàn cục bằng Zustand.
