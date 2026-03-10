import { gql } from "@apollo/client";

export const DASHBOARD_ANALYTICS_QUERY = gql`
	query DashboardAnalytics(
		$preset: DashboardTimePreset!
		$startDate: DateTime
		$endDate: DateTime
		$upcomingDays: Int
	) {
		dashboardAnalytics(
			preset: $preset
			startDate: $startDate
			endDate: $endDate
			upcomingDays: $upcomingDays
		) {
			rangeStart
			rangeEnd
			totalOrders
			totalRevenue
			depositCollected
			outstandingBalance
			activeOrders
			chart {
				date
				orders
				revenue
			}
			upcomingReturns {
				id
				code
				customerName
				customerPhone
				rentalDate
				returnDate
				totalAmount
				balanceDue
				status
				daysToDue
			}
			overdueReturns {
				id
				code
				customerName
				customerPhone
				rentalDate
				returnDate
				totalAmount
				balanceDue
				status
				daysToDue
			}
		}
	}
`;
