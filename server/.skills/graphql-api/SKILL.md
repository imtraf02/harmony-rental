---
name: GraphQL API Development (Yoga & Pothos)
description: Hướng dẫn cấu trúc code và cách phát triển GraphQL API sử dụng GraphQL Yoga, Pothos, và Zod.
---

# GraphQL API Guidelines

Dự án này sử dụng mô hình **Code-first GraphQL** với các công nghệ:
- **Server:** GraphQL Yoga
- **Schema Builder:** Pothos (`@pothos/core`, `@pothos/plugin-prisma`)
- **Validation:** Zod

## 1. Cấu trúc Thư mục Module
Mỗi Domain / Thực thể trong hệ thống được tách thành một module riêng tại `src/modules/<tên-module>/`. Bạn phải tuân thủ nghiêm ngặt cấu trúc tách file này khi tạo hoặc sửa một tính năng.

Ví dụ cho một module `product`:
- `product.model.ts`: Định nghĩa Object Type của Pothos (`builder.prismaObject`) và Input Type / Validation (`builder.inputType` sử dụng `zod`).
- `product.query.ts`: Định nghĩa các Queries (`builder.queryFields`).
- `product.mutation.ts`: Định nghĩa các Mutations (`builder.mutationFields`).
- `product.subscription.ts` (tuỳ chọn): Định nghĩa Subscriptions qua pubsub.
- `index.ts`: Export tất cả các file trong module này.

## 2. Quy tắc Viết Code Pothos
- **Khởi tạo Type từ Prisma:**
  Sử dụng `builder.prismaObject` để ánh xạ model từ Prisma.
  ```typescript
  export const Product = builder.prismaObject("Product", {
    fields: (t) => ({
      id: t.exposeID("id"),
      name: t.exposeString("name"),
      // Expose relation:
      category: t.relation("category"), 
    }),
  });
  ```
- **Validation Inputs:**
  Luôn xác thực (validate) input bằng Zod trong `builder.inputType`.
  ```typescript
  export const CreateProductInput = builder.inputType("CreateProductInput", {
    fields: (t) => ({
      name: t.string({
        required: true,
        validate: z.string().min(1, "Tên không được để trống"),
      }),
    }),
  });
  ```
- **Queries & Mutations:**
  - Sử dụng `t.prismaField` thay vì `t.field` khi trả về các object Prisma. Pothos Prisma Plugin sẽ tự động quản lý việc select / include (N+1 query problem).
  - Lấy Prisma instance từ GraphQL context: `ctx.prisma`.
  ```typescript
  builder.queryFields((t) => ({
    products: t.prismaField({
      type: [Product],
      resolve: async (query, _root, _args, ctx) => {
        return ctx.prisma.product.findMany({ ...query });
      },
    }),
  }));
  ```

## 3. Quy trình Đăng ký Module Mới
Khi bạn tạo một folder module mới:
1. Đảm bảo có file `index.ts` ở trong folder đó để export toàn bộ.
2. Mở file `src/schema.ts` và import module đó vào (không cần gán vào biến, chỉ cần import để file được thực thi).
   ```typescript
   import "./modules/<tên-module-mới>";
   ```
