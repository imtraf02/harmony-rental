import { graphql } from "@/gql";

export const itemsQuery = graphql(`
  query Items($variantId: String) {
    items(variantId: $variantId) {
      ...Item
    }
  }
`);

export const productsQuery = graphql(`
  query Products($categoryId: String) {
    products(categoryId: $categoryId) {
      ...Product
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
