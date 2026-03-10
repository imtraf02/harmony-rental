import { graphql } from "@/gql";

export const createOrder = graphql(`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ...Order
    }
  }
`);

export const updateOrderStatus = graphql(`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      ...Order
    }
  }
`);

export const updatePaymentStatus = graphql(`
  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {
    updatePaymentStatus(id: $id, status: $status) {
      ...Order
    }
  }
`);

export const updateOrder = graphql(`
  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      ...Order
    }
  }
`);

export const deleteOrder = graphql(`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id) {
      ...Order
    }
  }
`);

export const updateOrderItem = graphql(`
  mutation UpdateOrderItem($id: ID!, $damageNote: String!) {
    updateOrderItem(id: $id, damageNote: $damageNote) {
      ...Order
    }
  }
`);
