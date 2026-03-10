import { graphql } from "@/gql";

export const createProduct = graphql(`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      ...Product
    }
  }
`);

export const updateProduct = graphql(`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      ...Product
    }
  }
`);

export const deleteProduct = graphql(`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
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

export const updateProductVariant = graphql(`
  mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {
    updateProductVariant(id: $id, input: $input) {
      ...Variant
    }
  }
`);

export const deleteProductVariant = graphql(`
  mutation DeleteProductVariant($id: ID!) {
    deleteProductVariant(id: $id) {
      id
    }
  }
`);

export const uploadImage = graphql(`
  mutation UploadImage($file: File!) {
    uploadImage(file: $file)
  }
`);
