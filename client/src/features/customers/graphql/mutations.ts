import { graphql } from "@/gql";

export const createCustomer = graphql(`
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      ...Customer
    }
  }
`);

export const updateCustomer = graphql(`
  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      ...Customer
    }
  }
`);

export const deleteCustomer = graphql(`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      ...Customer
    }
  }
`);
