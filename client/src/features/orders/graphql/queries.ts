import { graphql } from "@/gql";

export const ordersQuery = graphql(`
  query Orders($statuses: [OrderStatus!], $paymentStatuses: [PaymentStatus!], $search: String, $page: Int, $pageSize: Int) {
    orders(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search, page: $page, pageSize: $pageSize) {
      ...Order
    }
    ordersCount(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search)
  }
`);

export const orderQuery = graphql(`
  query Order($id: ID!) {
    order(id: $id) {
      ...Order
    }
  }
`);
