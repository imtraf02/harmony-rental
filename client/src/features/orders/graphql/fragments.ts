import { graphql } from "@/gql";

export const orderFragment = graphql(`
  fragment Order on Order {
    id
    code
    customer {
      id
      name
      phone
      address
    }
    rentalDate
    returnDate
    returnedAt
    eventDate
    eventType
    totalAmount
    depositPaid
    balanceDue
    status
    paymentStatus
    lateFee
    damageFee
    note
    items {
      id
      item {
        id
        code
        variant {
          id
          size
          color
          imageUrl
          product {
            id
            name
          }
        }
      }
      rentalPrice
      deposit
      damageNote
    }
    createdAt
  }
`);
