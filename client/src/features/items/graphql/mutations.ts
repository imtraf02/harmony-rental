import { graphql } from "@/gql";

export const createProduct = graphql(`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...Product
    }
  }
`);

export const createProductVariant = graphql(`
  mutation CreateProductVariant($input: CreateProductVariantInput!) {
    createProductVariant(input: $input) {
      ...Variant
    }
  }
`);

export const createItem = graphql(`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) {
      ...Item
    }
  }
`);

export const updateItem = graphql(`
  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) {
      ...Item
    }
  }
`);

export const deleteItem = graphql(`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`);
