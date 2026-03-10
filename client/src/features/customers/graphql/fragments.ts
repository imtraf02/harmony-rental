import { graphql } from "@/gql";

export const CUSTOMER_FRAGMENT = graphql(`
  fragment Customer on Customer {
    id
    name
    phone
    address
    note
    createdAt
  }
`);
