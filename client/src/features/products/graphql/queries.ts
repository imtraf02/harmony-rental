import { graphql } from "@/gql";

export const productsQuery = graphql(`
  query Products($categoryId: String) {
    products(categoryId: $categoryId) {
      ...Product
    }
  }
`);

export const productQuery = graphql(`
  query Product($id: ID!) {
    product(id: $id) {
      ...Product
      variants {
        ...Variant
        itemsCount
        availableCount
        items {
          id
          code
          status
          note
        }
      }
    }
  }
`);

export const productVariantsQuery = graphql(`
  query ProductVariants($productId: String!) {
    productVariants(productId: $productId) {
      ...Variant
    }
  }
`);
