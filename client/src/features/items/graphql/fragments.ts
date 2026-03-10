import { graphql } from "@/gql";

export const variantFragment = graphql(`
  fragment Variant on ProductVariant {
    id
    productId
    size
    color
    rentalPrice
    deposit
    imageUrl
    itemsCount
    availableCount
    createdAt
    updatedAt
  }
`);

export const productFragment = graphql(`
  fragment Product on Product {
    id
    name
    categoryId
    category {
      id
      name
    }
    description
    variants {
      ...Variant
    }
    createdAt
  }
`);

export const itemFragment = graphql(`
  fragment Item on Item {
    id
    code
    variantId
    variant {
      ...Variant
      product {
        id
        name
        categoryId
        category {
          id
        }
      }
    }
    status
    note
    createdAt
    updatedAt
  }
`);
