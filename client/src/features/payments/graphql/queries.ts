import { gql } from "@apollo/client";

export const PAYMENT_HISTORY_QUERY = gql`
	query PaymentHistory(
		$search: String
		$startDate: DateTime
		$endDate: DateTime
		$page: Int
		$pageSize: Int
	) {
		paymentHistory(
			search: $search
			startDate: $startDate
			endDate: $endDate
			page: $page
			pageSize: $pageSize
		) {
			id
			amount
			method
			note
			paidAt
			order {
				id
				code
				status
				paymentStatus
				balanceDue
				totalAmount
				customer {
					name
					phone
				}
			}
		}
		paymentHistoryCount(search: $search, startDate: $startDate, endDate: $endDate)
	}
`;
