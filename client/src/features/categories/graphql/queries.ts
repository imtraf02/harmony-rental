import { graphql } from "@/gql";

export const categories = graphql(`
  query Categories {
    categories {
      ...Category
    }
  }
`);
