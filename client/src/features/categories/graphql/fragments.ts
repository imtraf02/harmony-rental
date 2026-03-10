import { graphql } from "@/gql";

export const categoryFragment = graphql(`
  fragment Category on Category {
    id
    name
    description
  }
`);
