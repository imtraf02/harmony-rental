import { graphql } from "@/gql";

export const createCategory = graphql(`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...Category
    }
  }
`);

export const updateCategory = graphql(`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      ...Category
    }
  }
`);

export const deleteCategory = graphql(`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
    }
  }
`);
