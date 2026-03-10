import { graphql } from "@/gql";

export const customersQuery = graphql(`
  query Customers {
    customers {
      ...Customer
    }
  }
`);

export const customerQuery = graphql(`
  query Customer($id: ID!) {
    customer(id: $id) {
      ...Customer
    }
  }
`);
