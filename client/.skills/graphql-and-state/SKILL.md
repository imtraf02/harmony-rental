---
name: GraphQL, State & Forms (Apollo, TanStack)
description: Hướng dẫn cấu trúc tính năng, gọi API (Apollo GraphQL), quản lý Form và Routing cho Client.
---

# Client Architecture: GraphQL, State & Features

Dự án áp dụng kiến trúc Domain-Driven (Feature-Sliced) kết hợp cùng hệ sinh thái **TanStack** và **Apollo GraphQL**.

## 1. Cấu trúc một Feature (src/features/)

Thay vì vứt mọi thứ vào components hay pages, mỗi nghiệp vụ (VD: `categories`, `orders`) sẽ có một folder riêng trong `src/features/<tên-feature>/`.
Cấu trúc mẫu của một feature:

- `index.tsx`: Component gốc của tính năng, thường được render ở tầng route.
- `components/`: Các components con chỉ dùng trong tính năng này.
- `graphql/`: Nơi chứa định nghĩa Query và Mutation GraphQL riêng của tính năng (`queries.ts`, `mutations.ts`, `fragments.ts`).
- `stores/` hoặc `providers`: (Tuỳ chọn) Nếu cần quản lý state riêng của màn hình.

## 2. GraphQL & Apollo Client

- **Không tự viết type cho API:** Dự án sử dụng `@graphql-codegen/cli` với preset `client` để tự sinh type TypeScript.
- **Cách định nghĩa Query/Mutation:**
  Import hàm `graphql` từ thư mục được generate `src/gql/`:

  ```typescript
  import { graphql } from "@/gql";

  export const getCategories = graphql(`
    query Categories {
      categories {
        id
        name
        description
      }
    }
  `);
  ```
