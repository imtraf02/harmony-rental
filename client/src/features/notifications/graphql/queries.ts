import { graphql } from "@/gql";

export const upcomingReturnsQuery = graphql(`
  query UpcomingReturnsNotification($days: Int) {
    upcomingReturns(days: $days) {
      id
      code
      customerName
      customerPhone
      returnDate
      totalAmount
      balanceDue
      status
      daysToDue
    }
  }
`);

export const orderUpdatedSubscription = graphql(`
  subscription OrderUpdated($id: String) {
    orderUpdated(id: $id)
  }
`);
