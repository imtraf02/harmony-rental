/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
	  };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	/** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
	DateTime: { input: string; output: string };
	File: { input: File; output: File };
};

export type Category = {
	__typename?: "Category";
	description: Scalars["String"]["output"];
	id: Scalars["ID"]["output"];
	name: Scalars["String"]["output"];
	products: Array<Product>;
};

export type CreateCategoryInput = {
	description: Scalars["String"]["input"];
	name: Scalars["String"]["input"];
};

export type CreateCustomerInput = {
	address?: InputMaybe<Scalars["String"]["input"]>;
	name: Scalars["String"]["input"];
	note?: InputMaybe<Scalars["String"]["input"]>;
	phone: Scalars["String"]["input"];
};

export type CreateItemInput = {
	code: Scalars["String"]["input"];
	note?: InputMaybe<Scalars["String"]["input"]>;
	status?: InputMaybe<ItemStatus>;
	variantId: Scalars["String"]["input"];
};

export type CreateOrderInput = {
	customer?: InputMaybe<CreateCustomerInput>;
	customerId?: InputMaybe<Scalars["String"]["input"]>;
	depositPaid: Scalars["Int"]["input"];
	eventDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	eventType?: InputMaybe<Scalars["String"]["input"]>;
	items: Array<CreateOrderItemInput>;
	note?: InputMaybe<Scalars["String"]["input"]>;
	rentalDate: Scalars["DateTime"]["input"];
	returnDate: Scalars["DateTime"]["input"];
	totalAmount: Scalars["Int"]["input"];
};

export type CreateOrderItemInput = {
	deposit: Scalars["Int"]["input"];
	itemId: Scalars["String"]["input"];
	rentalPrice: Scalars["Int"]["input"];
};

export type CreateProductInput = {
	categoryId: Scalars["String"]["input"];
	description?: InputMaybe<Scalars["String"]["input"]>;
	name: Scalars["String"]["input"];
};

export type CreateProductVariantInput = {
	color?: InputMaybe<Scalars["String"]["input"]>;
	deposit: Scalars["Int"]["input"];
	image?: InputMaybe<Scalars["File"]["input"]>;
	imageUrl?: InputMaybe<Scalars["String"]["input"]>;
	productId: Scalars["String"]["input"];
	rentalPrice: Scalars["Int"]["input"];
	size?: InputMaybe<Scalars["String"]["input"]>;
};

export type Customer = {
	__typename?: "Customer";
	address: Scalars["String"]["output"];
	createdAt: Scalars["DateTime"]["output"];
	id: Scalars["ID"]["output"];
	name: Scalars["String"]["output"];
	note: Scalars["String"]["output"];
	orders: Array<Order>;
	phone: Scalars["String"]["output"];
};

export type DashboardAnalytics = {
	__typename?: "DashboardAnalytics";
	activeOrders: Scalars["Int"]["output"];
	chart: Array<DashboardChartPoint>;
	depositCollected: Scalars["Int"]["output"];
	outstandingBalance: Scalars["Int"]["output"];
	overdueReturns: Array<DashboardDueOrder>;
	rangeEnd: Scalars["DateTime"]["output"];
	rangeStart: Scalars["DateTime"]["output"];
	totalOrders: Scalars["Int"]["output"];
	totalRevenue: Scalars["Int"]["output"];
	upcomingReturns: Array<DashboardDueOrder>;
};

export type DashboardChartPoint = {
	__typename?: "DashboardChartPoint";
	date: Scalars["String"]["output"];
	orders: Scalars["Int"]["output"];
	revenue: Scalars["Int"]["output"];
};

export type DashboardDueOrder = {
	__typename?: "DashboardDueOrder";
	balanceDue: Scalars["Int"]["output"];
	code: Scalars["String"]["output"];
	customerName: Scalars["String"]["output"];
	customerPhone: Scalars["String"]["output"];
	daysToDue: Scalars["Int"]["output"];
	id: Scalars["ID"]["output"];
	rentalDate: Scalars["DateTime"]["output"];
	returnDate: Scalars["DateTime"]["output"];
	status: OrderStatus;
	totalAmount: Scalars["Int"]["output"];
};

export enum DashboardTimePreset {
	Custom = "CUSTOM",
	Last_30Days = "LAST_30_DAYS",
	ThisMonth = "THIS_MONTH",
}

export type Item = {
	__typename?: "Item";
	code: Scalars["String"]["output"];
	createdAt: Scalars["DateTime"]["output"];
	futureRentals: Array<ItemFutureRental>;
	id: Scalars["ID"]["output"];
	note: Scalars["String"]["output"];
	status: ItemStatus;
	updatedAt: Scalars["DateTime"]["output"];
	variant: ProductVariant;
	variantId: Scalars["String"]["output"];
};

export type ItemFutureRental = {
	__typename?: "ItemFutureRental";
	customerName: Scalars["String"]["output"];
	orderCode: Scalars["String"]["output"];
	orderId: Scalars["ID"]["output"];
	rentalDate: Scalars["DateTime"]["output"];
	returnDate: Scalars["DateTime"]["output"];
};

export enum ItemStatus {
	Available = "AVAILABLE",
	Maintenance = "MAINTENANCE",
	Rented = "RENTED",
}

export type Mutation = {
	__typename?: "Mutation";
	createCategory: Category;
	createCustomer: Customer;
	createItem: Item;
	createOrder: Order;
	createProduct: Product;
	createProductVariant: ProductVariant;
	deleteCategory: Category;
	deleteCustomer: Customer;
	deleteItem: Item;
	deleteOrder: Order;
	deleteProduct: Product;
	deleteProductVariant: ProductVariant;
	recordOrderPayment: Order;
	updateCategory: Category;
	updateCustomer: Customer;
	updateItem: Item;
	updateOrder: Order;
	updateOrderItem: Order;
	updateOrderStatus: Order;
	updatePaymentStatus: Order;
	updateProduct: Product;
	updateProductVariant: ProductVariant;
	updateProductVariantImage: ProductVariant;
	uploadImage: Scalars["String"]["output"];
};

export type MutationCreateCategoryArgs = {
	input: CreateCategoryInput;
};

export type MutationCreateCustomerArgs = {
	input: CreateCustomerInput;
};

export type MutationCreateItemArgs = {
	input: CreateItemInput;
};

export type MutationCreateOrderArgs = {
	input: CreateOrderInput;
};

export type MutationCreateProductArgs = {
	input: CreateProductInput;
};

export type MutationCreateProductVariantArgs = {
	input: CreateProductVariantInput;
};

export type MutationDeleteCategoryArgs = {
	id: Scalars["ID"]["input"];
};

export type MutationDeleteCustomerArgs = {
	id: Scalars["ID"]["input"];
};

export type MutationDeleteItemArgs = {
	id: Scalars["ID"]["input"];
};

export type MutationDeleteOrderArgs = {
	id: Scalars["ID"]["input"];
};

export type MutationDeleteProductArgs = {
	id: Scalars["ID"]["input"];
};

export type MutationDeleteProductVariantArgs = {
	id: Scalars["ID"]["input"];
};

export type MutationRecordOrderPaymentArgs = {
	input: RecordOrderPaymentInput;
};

export type MutationUpdateCategoryArgs = {
	id: Scalars["ID"]["input"];
	input: UpdateCategoryInput;
};

export type MutationUpdateCustomerArgs = {
	id: Scalars["ID"]["input"];
	input: UpdateCustomerInput;
};

export type MutationUpdateItemArgs = {
	id: Scalars["ID"]["input"];
	input: UpdateItemInput;
};

export type MutationUpdateOrderArgs = {
	id: Scalars["ID"]["input"];
	input: UpdateOrderInput;
};

export type MutationUpdateOrderItemArgs = {
	damageNote: Scalars["String"]["input"];
	id: Scalars["ID"]["input"];
};

export type MutationUpdateOrderStatusArgs = {
	id: Scalars["ID"]["input"];
	status: OrderStatus;
};

export type MutationUpdatePaymentStatusArgs = {
	id: Scalars["ID"]["input"];
	status: PaymentStatus;
};

export type MutationUpdateProductArgs = {
	id: Scalars["ID"]["input"];
	input: UpdateProductInput;
};

export type MutationUpdateProductVariantArgs = {
	id: Scalars["ID"]["input"];
	input: UpdateProductVariantInput;
};

export type MutationUpdateProductVariantImageArgs = {
	id: Scalars["ID"]["input"];
	image: Scalars["File"]["input"];
};

export type MutationUploadImageArgs = {
	file: Scalars["File"]["input"];
};

export type Order = {
	__typename?: "Order";
	balanceDue: Scalars["Int"]["output"];
	code: Scalars["String"]["output"];
	createdAt: Scalars["DateTime"]["output"];
	customer: Customer;
	damageFee: Scalars["Int"]["output"];
	depositPaid: Scalars["Int"]["output"];
	eventDate?: Maybe<Scalars["DateTime"]["output"]>;
	eventType?: Maybe<Scalars["String"]["output"]>;
	id: Scalars["ID"]["output"];
	items: Array<OrderItem>;
	lateFee: Scalars["Int"]["output"];
	note: Scalars["String"]["output"];
	paymentStatus: PaymentStatus;
	payments: Array<Payment>;
	rentalDate: Scalars["DateTime"]["output"];
	returnDate: Scalars["DateTime"]["output"];
	returnedAt?: Maybe<Scalars["DateTime"]["output"]>;
	status: OrderStatus;
	totalAmount: Scalars["Int"]["output"];
	updatedAt: Scalars["DateTime"]["output"];
};

export type OrderItem = {
	__typename?: "OrderItem";
	damageNote: Scalars["String"]["output"];
	deposit: Scalars["Int"]["output"];
	id: Scalars["ID"]["output"];
	item: Item;
	order: Order;
	rentalPrice: Scalars["Int"]["output"];
};

export enum OrderStatus {
	Cancelled = "CANCELLED",
	Confirmed = "CONFIRMED",
	Pending = "PENDING",
	PickedUp = "PICKED_UP",
	Returned = "RETURNED",
}

export type Payment = {
	__typename?: "Payment";
	amount: Scalars["Int"]["output"];
	id: Scalars["ID"]["output"];
	method: Scalars["String"]["output"];
	note: Scalars["String"]["output"];
	order: Order;
	paidAt: Scalars["DateTime"]["output"];
};

export enum PaymentStatus {
	Deposited = "DEPOSITED",
	Paid = "PAID",
	Unpaid = "UNPAID",
}

export type Product = {
	__typename?: "Product";
	category: Category;
	categoryId: Scalars["String"]["output"];
	createdAt: Scalars["DateTime"]["output"];
	description: Scalars["String"]["output"];
	id: Scalars["ID"]["output"];
	name: Scalars["String"]["output"];
	variants: Array<ProductVariant>;
};

export type ProductVariant = {
	__typename?: "ProductVariant";
	availableCount: Scalars["Int"]["output"];
	color: Scalars["String"]["output"];
	createdAt: Scalars["DateTime"]["output"];
	deposit: Scalars["Int"]["output"];
	id: Scalars["ID"]["output"];
	imageUrl?: Maybe<Scalars["String"]["output"]>;
	items: Array<Item>;
	itemsCount: Scalars["Int"]["output"];
	product: Product;
	productId: Scalars["String"]["output"];
	rentalPrice: Scalars["Int"]["output"];
	size: Scalars["String"]["output"];
	updatedAt: Scalars["DateTime"]["output"];
};

export type Query = {
	__typename?: "Query";
	categories: Array<Category>;
	customer?: Maybe<Customer>;
	customers: Array<Customer>;
	dashboardAnalytics: DashboardAnalytics;
	item: Item;
	items: Array<Item>;
	order?: Maybe<Order>;
	orders: Array<Order>;
	ordersByProduct: Array<Order>;
	ordersByProductCount: Scalars["Int"]["output"];
	ordersCount: Scalars["Int"]["output"];
	paymentHistory: Array<Payment>;
	paymentHistoryCount: Scalars["Int"]["output"];
	product: Product;
	productVariant: ProductVariant;
	productVariants: Array<ProductVariant>;
	products: Array<Product>;
	upcomingReturns: Array<DashboardDueOrder>;
};

export type QueryCustomerArgs = {
	id: Scalars["ID"]["input"];
};

export type QueryDashboardAnalyticsArgs = {
	endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	preset?: InputMaybe<DashboardTimePreset>;
	startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	upcomingDays?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryItemArgs = {
	id: Scalars["ID"]["input"];
};

export type QueryItemsArgs = {
	variantId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryOrderArgs = {
	id: Scalars["ID"]["input"];
};

export type QueryOrdersArgs = {
	page?: InputMaybe<Scalars["Int"]["input"]>;
	pageSize?: InputMaybe<Scalars["Int"]["input"]>;
	paymentStatuses?: InputMaybe<Array<PaymentStatus>>;
	search?: InputMaybe<Scalars["String"]["input"]>;
	statuses?: InputMaybe<Array<OrderStatus>>;
};

export type QueryOrdersByProductArgs = {
	page?: InputMaybe<Scalars["Int"]["input"]>;
	pageSize?: InputMaybe<Scalars["Int"]["input"]>;
	productId: Scalars["String"]["input"];
};

export type QueryOrdersByProductCountArgs = {
	productId: Scalars["String"]["input"];
};

export type QueryOrdersCountArgs = {
	paymentStatuses?: InputMaybe<Array<PaymentStatus>>;
	search?: InputMaybe<Scalars["String"]["input"]>;
	statuses?: InputMaybe<Array<OrderStatus>>;
};

export type QueryPaymentHistoryArgs = {
	endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	pageSize?: InputMaybe<Scalars["Int"]["input"]>;
	search?: InputMaybe<Scalars["String"]["input"]>;
	startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryPaymentHistoryCountArgs = {
	endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	search?: InputMaybe<Scalars["String"]["input"]>;
	startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type QueryProductArgs = {
	id: Scalars["ID"]["input"];
};

export type QueryProductVariantArgs = {
	id: Scalars["ID"]["input"];
};

export type QueryProductVariantsArgs = {
	productId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryProductsArgs = {
	categoryId?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryUpcomingReturnsArgs = {
	days?: InputMaybe<Scalars["Int"]["input"]>;
};

export type RecordOrderPaymentInput = {
	amount: Scalars["Int"]["input"];
	method: Scalars["String"]["input"];
	note?: InputMaybe<Scalars["String"]["input"]>;
	orderId: Scalars["String"]["input"];
	paidAt?: InputMaybe<Scalars["DateTime"]["input"]>;
};

export type Subscription = {
	__typename?: "Subscription";
	orderUpdated: Scalars["String"]["output"];
};

export type SubscriptionOrderUpdatedArgs = {
	id?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateCategoryInput = {
	description: Scalars["String"]["input"];
	name: Scalars["String"]["input"];
};

export type UpdateCustomerInput = {
	address?: InputMaybe<Scalars["String"]["input"]>;
	name?: InputMaybe<Scalars["String"]["input"]>;
	note?: InputMaybe<Scalars["String"]["input"]>;
	phone?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateItemInput = {
	code?: InputMaybe<Scalars["String"]["input"]>;
	note?: InputMaybe<Scalars["String"]["input"]>;
	status?: InputMaybe<ItemStatus>;
	variantId?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateOrderInput = {
	damageFee?: InputMaybe<Scalars["Int"]["input"]>;
	depositPaid?: InputMaybe<Scalars["Int"]["input"]>;
	eventDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	eventType?: InputMaybe<Scalars["String"]["input"]>;
	lateFee?: InputMaybe<Scalars["Int"]["input"]>;
	note?: InputMaybe<Scalars["String"]["input"]>;
	rentalDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	returnDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	returnedAt?: InputMaybe<Scalars["DateTime"]["input"]>;
	status?: InputMaybe<OrderStatus>;
	totalAmount?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateOrderItemInput = {
	damageNote?: InputMaybe<Scalars["String"]["input"]>;
	deposit?: InputMaybe<Scalars["Int"]["input"]>;
	id?: InputMaybe<Scalars["String"]["input"]>;
	itemId?: InputMaybe<Scalars["String"]["input"]>;
	rentalPrice?: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateProductInput = {
	categoryId?: InputMaybe<Scalars["String"]["input"]>;
	description?: InputMaybe<Scalars["String"]["input"]>;
	name?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateProductVariantInput = {
	color?: InputMaybe<Scalars["String"]["input"]>;
	deposit?: InputMaybe<Scalars["Int"]["input"]>;
	image?: InputMaybe<Scalars["File"]["input"]>;
	imageUrl?: InputMaybe<Scalars["String"]["input"]>;
	rentalPrice?: InputMaybe<Scalars["Int"]["input"]>;
	size?: InputMaybe<Scalars["String"]["input"]>;
};

export type CategoryFragment = {
	__typename?: "Category";
	id: string;
	name: string;
	description: string;
};

export type CreateCategoryMutationVariables = Exact<{
	input: CreateCategoryInput;
}>;

export type CreateCategoryMutation = {
	__typename?: "Mutation";
	createCategory: {
		__typename?: "Category";
		id: string;
		name: string;
		description: string;
	};
};

export type UpdateCategoryMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	input: UpdateCategoryInput;
}>;

export type UpdateCategoryMutation = {
	__typename?: "Mutation";
	updateCategory: {
		__typename?: "Category";
		id: string;
		name: string;
		description: string;
	};
};

export type DeleteCategoryMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type DeleteCategoryMutation = {
	__typename?: "Mutation";
	deleteCategory: { __typename?: "Category"; id: string };
};

export type CategoriesQueryVariables = Exact<{ [key: string]: never }>;

export type CategoriesQuery = {
	__typename?: "Query";
	categories: Array<{
		__typename?: "Category";
		id: string;
		name: string;
		description: string;
	}>;
};

export type CustomerFragment = {
	__typename?: "Customer";
	id: string;
	name: string;
	phone: string;
	address: string;
	note: string;
	createdAt: string;
};

export type CreateCustomerMutationVariables = Exact<{
	input: CreateCustomerInput;
}>;

export type CreateCustomerMutation = {
	__typename?: "Mutation";
	createCustomer: {
		__typename?: "Customer";
		id: string;
		name: string;
		phone: string;
		address: string;
		note: string;
		createdAt: string;
	};
};

export type UpdateCustomerMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	input: UpdateCustomerInput;
}>;

export type UpdateCustomerMutation = {
	__typename?: "Mutation";
	updateCustomer: {
		__typename?: "Customer";
		id: string;
		name: string;
		phone: string;
		address: string;
		note: string;
		createdAt: string;
	};
};

export type DeleteCustomerMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type DeleteCustomerMutation = {
	__typename?: "Mutation";
	deleteCustomer: {
		__typename?: "Customer";
		id: string;
		name: string;
		phone: string;
		address: string;
		note: string;
		createdAt: string;
	};
};

export type CustomersQueryVariables = Exact<{ [key: string]: never }>;

export type CustomersQuery = {
	__typename?: "Query";
	customers: Array<{
		__typename?: "Customer";
		id: string;
		name: string;
		phone: string;
		address: string;
		note: string;
		createdAt: string;
	}>;
};

export type CustomerQueryVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type CustomerQuery = {
	__typename?: "Query";
	customer?: {
		__typename?: "Customer";
		id: string;
		name: string;
		phone: string;
		address: string;
		note: string;
		createdAt: string;
	} | null;
};

export type DashboardAnalyticsQueryVariables = Exact<{
	preset: DashboardTimePreset;
	startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	upcomingDays?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type DashboardAnalyticsQuery = {
	__typename?: "Query";
	dashboardAnalytics: {
		__typename?: "DashboardAnalytics";
		rangeStart: string;
		rangeEnd: string;
		totalOrders: number;
		totalRevenue: number;
		depositCollected: number;
		outstandingBalance: number;
		activeOrders: number;
		chart: Array<{
			__typename?: "DashboardChartPoint";
			date: string;
			orders: number;
			revenue: number;
		}>;
		upcomingReturns: Array<{
			__typename?: "DashboardDueOrder";
			id: string;
			code: string;
			customerName: string;
			customerPhone: string;
			rentalDate: string;
			returnDate: string;
			totalAmount: number;
			balanceDue: number;
			status: OrderStatus;
			daysToDue: number;
		}>;
		overdueReturns: Array<{
			__typename?: "DashboardDueOrder";
			id: string;
			code: string;
			customerName: string;
			customerPhone: string;
			rentalDate: string;
			returnDate: string;
			totalAmount: number;
			balanceDue: number;
			status: OrderStatus;
			daysToDue: number;
		}>;
	};
};

export type InventoryItemsQueryVariables = Exact<{
	variantId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type InventoryItemsQuery = {
	__typename?: "Query";
	items: Array<{
		__typename?: "Item";
		id: string;
		code: string;
		variantId: string;
		status: ItemStatus;
		note: string;
		createdAt: string;
		updatedAt: string;
		futureRentals: Array<{
			__typename?: "ItemFutureRental";
			orderId: string;
			orderCode: string;
			rentalDate: string;
			returnDate: string;
			customerName: string;
		}>;
		variant: {
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
			product: {
				__typename?: "Product";
				id: string;
				name: string;
				categoryId: string;
				category: { __typename?: "Category"; id: string };
			};
		};
	}>;
};

export type VariantFragment = {
	__typename?: "ProductVariant";
	id: string;
	productId: string;
	size: string;
	color: string;
	rentalPrice: number;
	deposit: number;
	imageUrl?: string | null;
	itemsCount: number;
	availableCount: number;
	createdAt: string;
	updatedAt: string;
};

export type ProductFragment = {
	__typename?: "Product";
	id: string;
	name: string;
	categoryId: string;
	description: string;
	createdAt: string;
	category: { __typename?: "Category"; id: string; name: string };
	variants: Array<{
		__typename?: "ProductVariant";
		id: string;
		productId: string;
		size: string;
		color: string;
		rentalPrice: number;
		deposit: number;
		imageUrl?: string | null;
		itemsCount: number;
		availableCount: number;
		createdAt: string;
		updatedAt: string;
	}>;
};

export type ItemFragment = {
	__typename?: "Item";
	id: string;
	code: string;
	variantId: string;
	status: ItemStatus;
	note: string;
	createdAt: string;
	updatedAt: string;
	variant: {
		__typename?: "ProductVariant";
		id: string;
		productId: string;
		size: string;
		color: string;
		rentalPrice: number;
		deposit: number;
		imageUrl?: string | null;
		itemsCount: number;
		availableCount: number;
		createdAt: string;
		updatedAt: string;
		product: {
			__typename?: "Product";
			id: string;
			name: string;
			categoryId: string;
			category: { __typename?: "Category"; id: string };
		};
	};
};

export type CreateProductMutationVariables = Exact<{
	input: CreateProductInput;
}>;

export type CreateProductMutation = {
	__typename?: "Mutation";
	createProduct: {
		__typename?: "Product";
		id: string;
		name: string;
		categoryId: string;
		description: string;
		createdAt: string;
		category: { __typename?: "Category"; id: string; name: string };
		variants: Array<{
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
		}>;
	};
};

export type CreateProductVariantMutationVariables = Exact<{
	input: CreateProductVariantInput;
}>;

export type CreateProductVariantMutation = {
	__typename?: "Mutation";
	createProductVariant: {
		__typename?: "ProductVariant";
		id: string;
		productId: string;
		size: string;
		color: string;
		rentalPrice: number;
		deposit: number;
		imageUrl?: string | null;
		itemsCount: number;
		availableCount: number;
		createdAt: string;
		updatedAt: string;
	};
};

export type CreateItemMutationVariables = Exact<{
	input: CreateItemInput;
}>;

export type CreateItemMutation = {
	__typename?: "Mutation";
	createItem: {
		__typename?: "Item";
		id: string;
		code: string;
		variantId: string;
		status: ItemStatus;
		note: string;
		createdAt: string;
		updatedAt: string;
		variant: {
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
			product: {
				__typename?: "Product";
				id: string;
				name: string;
				categoryId: string;
				category: { __typename?: "Category"; id: string };
			};
		};
	};
};

export type UpdateItemMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	input: UpdateItemInput;
}>;

export type UpdateItemMutation = {
	__typename?: "Mutation";
	updateItem: {
		__typename?: "Item";
		id: string;
		code: string;
		variantId: string;
		status: ItemStatus;
		note: string;
		createdAt: string;
		updatedAt: string;
		variant: {
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
			product: {
				__typename?: "Product";
				id: string;
				name: string;
				categoryId: string;
				category: { __typename?: "Category"; id: string };
			};
		};
	};
};

export type DeleteItemMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type DeleteItemMutation = {
	__typename?: "Mutation";
	deleteItem: { __typename?: "Item"; id: string };
};

export type ItemsQueryVariables = Exact<{
	variantId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ItemsQuery = {
	__typename?: "Query";
	items: Array<{
		__typename?: "Item";
		id: string;
		code: string;
		variantId: string;
		status: ItemStatus;
		note: string;
		createdAt: string;
		updatedAt: string;
		variant: {
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
			product: {
				__typename?: "Product";
				id: string;
				name: string;
				categoryId: string;
				category: { __typename?: "Category"; id: string };
			};
		};
	}>;
};

export type ProductsQueryVariables = Exact<{
	categoryId?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type ProductsQuery = {
	__typename?: "Query";
	products: Array<{
		__typename?: "Product";
		id: string;
		name: string;
		categoryId: string;
		description: string;
		createdAt: string;
		category: { __typename?: "Category"; id: string; name: string };
		variants: Array<{
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
		}>;
	}>;
};

export type ProductVariantsQueryVariables = Exact<{
	productId: Scalars["String"]["input"];
}>;

export type ProductVariantsQuery = {
	__typename?: "Query";
	productVariants: Array<{
		__typename?: "ProductVariant";
		id: string;
		productId: string;
		size: string;
		color: string;
		rentalPrice: number;
		deposit: number;
		imageUrl?: string | null;
		itemsCount: number;
		availableCount: number;
		createdAt: string;
		updatedAt: string;
	}>;
};

export type UpcomingReturnsNotificationQueryVariables = Exact<{
	days?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type UpcomingReturnsNotificationQuery = {
	__typename?: "Query";
	upcomingReturns: Array<{
		__typename?: "DashboardDueOrder";
		id: string;
		code: string;
		customerName: string;
		customerPhone: string;
		returnDate: string;
		totalAmount: number;
		balanceDue: number;
		status: OrderStatus;
		daysToDue: number;
	}>;
};

export type OrderUpdatedSubscriptionVariables = Exact<{
	id?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type OrderUpdatedSubscription = {
	__typename?: "Subscription";
	orderUpdated: string;
};

export type OrderFragment = {
	__typename?: "Order";
	id: string;
	code: string;
	rentalDate: string;
	returnDate: string;
	returnedAt?: string | null;
	eventDate?: string | null;
	eventType?: string | null;
	totalAmount: number;
	depositPaid: number;
	balanceDue: number;
	status: OrderStatus;
	paymentStatus: PaymentStatus;
	lateFee: number;
	damageFee: number;
	note: string;
	createdAt: string;
	customer: {
		__typename?: "Customer";
		id: string;
		name: string;
		phone: string;
		address: string;
	};
	items: Array<{
		__typename?: "OrderItem";
		id: string;
		rentalPrice: number;
		deposit: number;
		damageNote: string;
		item: {
			__typename?: "Item";
			id: string;
			code: string;
			variant: {
				__typename?: "ProductVariant";
				id: string;
				size: string;
				color: string;
				imageUrl?: string | null;
				product: { __typename?: "Product"; id: string; name: string };
			};
		};
	}>;
};

export type CreateOrderMutationVariables = Exact<{
	input: CreateOrderInput;
}>;

export type CreateOrderMutation = {
	__typename?: "Mutation";
	createOrder: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	};
};

export type UpdateOrderStatusMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	status: OrderStatus;
}>;

export type UpdateOrderStatusMutation = {
	__typename?: "Mutation";
	updateOrderStatus: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	};
};

export type UpdatePaymentStatusMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	status: PaymentStatus;
}>;

export type UpdatePaymentStatusMutation = {
	__typename?: "Mutation";
	updatePaymentStatus: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	};
};

export type UpdateOrderMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	input: UpdateOrderInput;
}>;

export type UpdateOrderMutation = {
	__typename?: "Mutation";
	updateOrder: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	};
};

export type DeleteOrderMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type DeleteOrderMutation = {
	__typename?: "Mutation";
	deleteOrder: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	};
};

export type UpdateOrderItemMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	damageNote: Scalars["String"]["input"];
}>;

export type UpdateOrderItemMutation = {
	__typename?: "Mutation";
	updateOrderItem: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	};
};

export type OrdersQueryVariables = Exact<{
	statuses?: InputMaybe<Array<OrderStatus> | OrderStatus>;
	paymentStatuses?: InputMaybe<Array<PaymentStatus> | PaymentStatus>;
	search?: InputMaybe<Scalars["String"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	pageSize?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type OrdersQuery = {
	__typename?: "Query";
	ordersCount: number;
	orders: Array<{
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	}>;
};

export type OrderQueryVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type OrderQuery = {
	__typename?: "Query";
	order?: {
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		returnedAt?: string | null;
		eventDate?: string | null;
		eventType?: string | null;
		totalAmount: number;
		depositPaid: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		lateFee: number;
		damageFee: number;
		note: string;
		createdAt: string;
		customer: {
			__typename?: "Customer";
			id: string;
			name: string;
			phone: string;
			address: string;
		};
		items: Array<{
			__typename?: "OrderItem";
			id: string;
			rentalPrice: number;
			deposit: number;
			damageNote: string;
			item: {
				__typename?: "Item";
				id: string;
				code: string;
				variant: {
					__typename?: "ProductVariant";
					id: string;
					size: string;
					color: string;
					imageUrl?: string | null;
					product: { __typename?: "Product"; id: string; name: string };
				};
			};
		}>;
	} | null;
};

export type RecordOrderPaymentMutationVariables = Exact<{
	input: RecordOrderPaymentInput;
}>;

export type RecordOrderPaymentMutation = {
	__typename?: "Mutation";
	recordOrderPayment: {
		__typename?: "Order";
		id: string;
		depositPaid: number;
		balanceDue: number;
		paymentStatus: PaymentStatus;
	};
};

export type PaymentHistoryQueryVariables = Exact<{
	search?: InputMaybe<Scalars["String"]["input"]>;
	startDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	endDate?: InputMaybe<Scalars["DateTime"]["input"]>;
	page?: InputMaybe<Scalars["Int"]["input"]>;
	pageSize?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type PaymentHistoryQuery = {
	__typename?: "Query";
	paymentHistoryCount: number;
	paymentHistory: Array<{
		__typename?: "Payment";
		id: string;
		amount: number;
		method: string;
		note: string;
		paidAt: string;
		order: {
			__typename?: "Order";
			id: string;
			code: string;
			status: OrderStatus;
			paymentStatus: PaymentStatus;
			balanceDue: number;
			totalAmount: number;
			customer: { __typename?: "Customer"; name: string; phone: string };
		};
	}>;
};

export type UpdateProductVariantImageMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	image: Scalars["File"]["input"];
}>;

export type UpdateProductVariantImageMutation = {
	__typename?: "Mutation";
	updateProductVariantImage: {
		__typename?: "ProductVariant";
		id: string;
		imageUrl?: string | null;
		updatedAt: string;
	};
};

export type ProductRelatedOrdersQueryVariables = Exact<{
	productId: Scalars["String"]["input"];
	page?: InputMaybe<Scalars["Int"]["input"]>;
	pageSize?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type ProductRelatedOrdersQuery = {
	__typename?: "Query";
	ordersByProductCount: number;
	ordersByProduct: Array<{
		__typename?: "Order";
		id: string;
		code: string;
		rentalDate: string;
		returnDate: string;
		totalAmount: number;
		balanceDue: number;
		status: OrderStatus;
		paymentStatus: PaymentStatus;
		customer: { __typename?: "Customer"; name: string; phone: string };
	}>;
};

export type UpdateProductMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	input: UpdateProductInput;
}>;

export type UpdateProductMutation = {
	__typename?: "Mutation";
	updateProduct: {
		__typename?: "Product";
		id: string;
		name: string;
		categoryId: string;
		description: string;
		createdAt: string;
		category: { __typename?: "Category"; id: string; name: string };
		variants: Array<{
			__typename?: "ProductVariant";
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			itemsCount: number;
			availableCount: number;
			createdAt: string;
			updatedAt: string;
		}>;
	};
};

export type DeleteProductMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type DeleteProductMutation = {
	__typename?: "Mutation";
	deleteProduct: { __typename?: "Product"; id: string };
};

export type UpdateProductVariantMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
	input: UpdateProductVariantInput;
}>;

export type UpdateProductVariantMutation = {
	__typename?: "Mutation";
	updateProductVariant: {
		__typename?: "ProductVariant";
		id: string;
		productId: string;
		size: string;
		color: string;
		rentalPrice: number;
		deposit: number;
		imageUrl?: string | null;
		itemsCount: number;
		availableCount: number;
		createdAt: string;
		updatedAt: string;
	};
};

export type DeleteProductVariantMutationVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type DeleteProductVariantMutation = {
	__typename?: "Mutation";
	deleteProductVariant: { __typename?: "ProductVariant"; id: string };
};

export type UploadImageMutationVariables = Exact<{
	file: Scalars["File"]["input"];
}>;

export type UploadImageMutation = {
	__typename?: "Mutation";
	uploadImage: string;
};

export type ProductQueryVariables = Exact<{
	id: Scalars["ID"]["input"];
}>;

export type ProductQuery = {
	__typename?: "Query";
	product: {
		__typename?: "Product";
		id: string;
		name: string;
		categoryId: string;
		description: string;
		createdAt: string;
		variants: Array<{
			__typename?: "ProductVariant";
			itemsCount: number;
			availableCount: number;
			id: string;
			productId: string;
			size: string;
			color: string;
			rentalPrice: number;
			deposit: number;
			imageUrl?: string | null;
			createdAt: string;
			updatedAt: string;
			items: Array<{
				__typename?: "Item";
				id: string;
				code: string;
				status: ItemStatus;
				note: string;
			}>;
		}>;
		category: { __typename?: "Category"; id: string; name: string };
	};
};

export const CategoryFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Category" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Category" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "description" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CategoryFragment, unknown>;
export const CustomerFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Customer" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Customer" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "phone" } },
					{ kind: "Field", name: { kind: "Name", value: "address" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CustomerFragment, unknown>;
export const VariantFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<VariantFragment, unknown>;
export const ProductFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Product" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Product" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "categoryId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "category" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "description" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variants" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<ProductFragment, unknown>;
export const ItemFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Item" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Item" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{ kind: "Field", name: { kind: "Name", value: "variantId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variant" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "product" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "name" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "categoryId" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "category" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<ItemFragment, unknown>;
export const OrderFragmentDoc = {
	kind: "Document",
	definitions: [
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<OrderFragment, unknown>;
export const CreateCategoryDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateCategory" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "CreateCategoryInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createCategory" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Category" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Category" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Category" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "description" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	CreateCategoryMutation,
	CreateCategoryMutationVariables
>;
export const UpdateCategoryDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateCategory" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "UpdateCategoryInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateCategory" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Category" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Category" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Category" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "description" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateCategoryMutation,
	UpdateCategoryMutationVariables
>;
export const DeleteCategoryDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "DeleteCategory" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "deleteCategory" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	DeleteCategoryMutation,
	DeleteCategoryMutationVariables
>;
export const CategoriesDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Categories" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "categories" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Category" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Category" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Category" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "description" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CategoriesQuery, CategoriesQueryVariables>;
export const CreateCustomerDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateCustomer" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "CreateCustomerInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createCustomer" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Customer" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Customer" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Customer" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "phone" } },
					{ kind: "Field", name: { kind: "Name", value: "address" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	CreateCustomerMutation,
	CreateCustomerMutationVariables
>;
export const UpdateCustomerDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateCustomer" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "UpdateCustomerInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateCustomer" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Customer" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Customer" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Customer" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "phone" } },
					{ kind: "Field", name: { kind: "Name", value: "address" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateCustomerMutation,
	UpdateCustomerMutationVariables
>;
export const DeleteCustomerDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "DeleteCustomer" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "deleteCustomer" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Customer" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Customer" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Customer" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "phone" } },
					{ kind: "Field", name: { kind: "Name", value: "address" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	DeleteCustomerMutation,
	DeleteCustomerMutationVariables
>;
export const CustomersDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Customers" },
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "customers" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Customer" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Customer" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Customer" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "phone" } },
					{ kind: "Field", name: { kind: "Name", value: "address" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CustomersQuery, CustomersQueryVariables>;
export const CustomerDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Customer" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Customer" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Customer" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Customer" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "phone" } },
					{ kind: "Field", name: { kind: "Name", value: "address" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CustomerQuery, CustomerQueryVariables>;
export const DashboardAnalyticsDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "DashboardAnalytics" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "preset" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "DashboardTimePreset" },
						},
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "startDate" },
					},
					type: {
						kind: "NamedType",
						name: { kind: "Name", value: "DateTime" },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "endDate" },
					},
					type: {
						kind: "NamedType",
						name: { kind: "Name", value: "DateTime" },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "upcomingDays" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "dashboardAnalytics" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "preset" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "preset" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "startDate" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "startDate" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "endDate" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "endDate" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "upcomingDays" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "upcomingDays" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "rangeStart" } },
								{ kind: "Field", name: { kind: "Name", value: "rangeEnd" } },
								{ kind: "Field", name: { kind: "Name", value: "totalOrders" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "totalRevenue" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "depositCollected" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "outstandingBalance" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "activeOrders" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "chart" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "date" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "orders" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "revenue" },
											},
										],
									},
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "upcomingReturns" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "customerName" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "customerPhone" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "rentalDate" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "returnDate" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "totalAmount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "balanceDue" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "status" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "daysToDue" },
											},
										],
									},
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "overdueReturns" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "customerName" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "customerPhone" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "rentalDate" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "returnDate" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "totalAmount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "balanceDue" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "status" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "daysToDue" },
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	DashboardAnalyticsQuery,
	DashboardAnalyticsQueryVariables
>;
export const InventoryItemsDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "InventoryItems" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "variantId" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "variantId" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "variantId" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "code" } },
								{ kind: "Field", name: { kind: "Name", value: "variantId" } },
								{ kind: "Field", name: { kind: "Name", value: "status" } },
								{ kind: "Field", name: { kind: "Name", value: "note" } },
								{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
								{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "futureRentals" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{
												kind: "Field",
												name: { kind: "Name", value: "orderId" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "orderCode" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "rentalDate" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "returnDate" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "customerName" },
											},
										],
									},
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "variant" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "productId" },
											},
											{ kind: "Field", name: { kind: "Name", value: "size" } },
											{ kind: "Field", name: { kind: "Name", value: "color" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "rentalPrice" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "deposit" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "imageUrl" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "itemsCount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "availableCount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "createdAt" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "updatedAt" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "product" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "name" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "categoryId" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "category" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<InventoryItemsQuery, InventoryItemsQueryVariables>;
export const CreateProductDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateProduct" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "CreateProductInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createProduct" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Product" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Product" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Product" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "categoryId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "category" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "description" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variants" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	CreateProductMutation,
	CreateProductMutationVariables
>;
export const CreateProductVariantDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateProductVariant" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "CreateProductVariantInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createProductVariant" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	CreateProductVariantMutation,
	CreateProductVariantMutationVariables
>;
export const CreateItemDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateItem" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "CreateItemInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createItem" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Item" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Item" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Item" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{ kind: "Field", name: { kind: "Name", value: "variantId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variant" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "product" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "name" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "categoryId" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "category" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CreateItemMutation, CreateItemMutationVariables>;
export const UpdateItemDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateItem" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "UpdateItemInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateItem" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Item" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Item" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Item" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{ kind: "Field", name: { kind: "Name", value: "variantId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variant" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "product" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "name" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "categoryId" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "category" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateItemMutation, UpdateItemMutationVariables>;
export const DeleteItemDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "DeleteItem" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "deleteItem" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<DeleteItemMutation, DeleteItemMutationVariables>;
export const ItemsDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Items" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "variantId" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "variantId" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "variantId" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Item" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Item" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Item" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{ kind: "Field", name: { kind: "Name", value: "variantId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variant" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "product" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "name" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "categoryId" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "category" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<ItemsQuery, ItemsQueryVariables>;
export const ProductsDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Products" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "categoryId" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "products" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "categoryId" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "categoryId" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Product" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Product" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Product" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "categoryId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "category" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "description" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variants" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<ProductsQuery, ProductsQueryVariables>;
export const ProductVariantsDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "ProductVariants" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "productId" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "String" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "productVariants" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "productId" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "productId" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	ProductVariantsQuery,
	ProductVariantsQueryVariables
>;
export const UpcomingReturnsNotificationDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "UpcomingReturnsNotification" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "days" } },
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "upcomingReturns" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "days" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "days" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "code" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "customerName" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "customerPhone" },
								},
								{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
								{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
								{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
								{ kind: "Field", name: { kind: "Name", value: "status" } },
								{ kind: "Field", name: { kind: "Name", value: "daysToDue" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpcomingReturnsNotificationQuery,
	UpcomingReturnsNotificationQueryVariables
>;
export const OrderUpdatedDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "subscription",
			name: { kind: "Name", value: "OrderUpdated" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "orderUpdated" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	OrderUpdatedSubscription,
	OrderUpdatedSubscriptionVariables
>;
export const CreateOrderDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "CreateOrder" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "CreateOrderInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "createOrder" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const UpdateOrderStatusDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateOrderStatus" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "status" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "OrderStatus" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateOrderStatus" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "status" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "status" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateOrderStatusMutation,
	UpdateOrderStatusMutationVariables
>;
export const UpdatePaymentStatusDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdatePaymentStatus" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "status" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "PaymentStatus" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updatePaymentStatus" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "status" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "status" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdatePaymentStatusMutation,
	UpdatePaymentStatusMutationVariables
>;
export const UpdateOrderDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateOrder" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "UpdateOrderInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateOrder" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<UpdateOrderMutation, UpdateOrderMutationVariables>;
export const DeleteOrderDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "DeleteOrder" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "deleteOrder" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<DeleteOrderMutation, DeleteOrderMutationVariables>;
export const UpdateOrderItemDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateOrderItem" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "damageNote" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "String" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateOrderItem" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "damageNote" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "damageNote" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateOrderItemMutation,
	UpdateOrderItemMutationVariables
>;
export const OrdersDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Orders" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "statuses" },
					},
					type: {
						kind: "ListType",
						type: {
							kind: "NonNullType",
							type: {
								kind: "NamedType",
								name: { kind: "Name", value: "OrderStatus" },
							},
						},
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "paymentStatuses" },
					},
					type: {
						kind: "ListType",
						type: {
							kind: "NonNullType",
							type: {
								kind: "NamedType",
								name: { kind: "Name", value: "PaymentStatus" },
							},
						},
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "search" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
				},
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "pageSize" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "orders" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "statuses" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "statuses" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "paymentStatuses" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "paymentStatuses" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "search" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "search" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "page" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "page" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "pageSize" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "pageSize" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
					{
						kind: "Field",
						name: { kind: "Name", value: "ordersCount" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "statuses" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "statuses" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "paymentStatuses" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "paymentStatuses" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "search" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "search" },
								},
							},
						],
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<OrdersQuery, OrdersQueryVariables>;
export const OrderDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Order" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "order" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Order" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Order" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Order" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "code" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "customer" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
								{ kind: "Field", name: { kind: "Name", value: "phone" } },
								{ kind: "Field", name: { kind: "Name", value: "address" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
					{ kind: "Field", name: { kind: "Name", value: "returnedAt" } },
					{ kind: "Field", name: { kind: "Name", value: "eventDate" } },
					{ kind: "Field", name: { kind: "Name", value: "eventType" } },
					{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
					{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
					{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
					{ kind: "Field", name: { kind: "Name", value: "status" } },
					{ kind: "Field", name: { kind: "Name", value: "paymentStatus" } },
					{ kind: "Field", name: { kind: "Name", value: "lateFee" } },
					{ kind: "Field", name: { kind: "Name", value: "damageFee" } },
					{ kind: "Field", name: { kind: "Name", value: "note" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "items" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "item" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "variant" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "size" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "color" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "imageUrl" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "product" },
															selectionSet: {
																kind: "SelectionSet",
																selections: [
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "id" },
																	},
																	{
																		kind: "Field",
																		name: { kind: "Name", value: "name" },
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
								{ kind: "Field", name: { kind: "Name", value: "deposit" } },
								{ kind: "Field", name: { kind: "Name", value: "damageNote" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<OrderQuery, OrderQueryVariables>;
export const RecordOrderPaymentDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "RecordOrderPayment" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "RecordOrderPaymentInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "recordOrderPayment" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "depositPaid" } },
								{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "paymentStatus" },
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	RecordOrderPaymentMutation,
	RecordOrderPaymentMutationVariables
>;
export const PaymentHistoryDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "PaymentHistory" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "search" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "startDate" },
					},
					type: {
						kind: "NamedType",
						name: { kind: "Name", value: "DateTime" },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "endDate" },
					},
					type: {
						kind: "NamedType",
						name: { kind: "Name", value: "DateTime" },
					},
				},
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "pageSize" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "paymentHistory" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "search" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "search" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "startDate" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "startDate" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "endDate" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "endDate" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "page" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "page" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "pageSize" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "pageSize" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "amount" } },
								{ kind: "Field", name: { kind: "Name", value: "method" } },
								{ kind: "Field", name: { kind: "Name", value: "note" } },
								{ kind: "Field", name: { kind: "Name", value: "paidAt" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "order" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "id" } },
											{ kind: "Field", name: { kind: "Name", value: "code" } },
											{
												kind: "Field",
												name: { kind: "Name", value: "status" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "paymentStatus" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "balanceDue" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "totalAmount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "customer" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "name" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "phone" },
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
					{
						kind: "Field",
						name: { kind: "Name", value: "paymentHistoryCount" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "search" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "search" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "startDate" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "startDate" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "endDate" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "endDate" },
								},
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<PaymentHistoryQuery, PaymentHistoryQueryVariables>;
export const UpdateProductVariantImageDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateProductVariantImage" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "image" },
					},
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "File" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateProductVariantImage" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "image" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "image" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
								{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateProductVariantImageMutation,
	UpdateProductVariantImageMutationVariables
>;
export const ProductRelatedOrdersDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "ProductRelatedOrders" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "productId" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "String" },
						},
					},
				},
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "pageSize" },
					},
					type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "ordersByProduct" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "productId" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "productId" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "page" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "page" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "pageSize" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "pageSize" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "code" } },
								{ kind: "Field", name: { kind: "Name", value: "rentalDate" } },
								{ kind: "Field", name: { kind: "Name", value: "returnDate" } },
								{ kind: "Field", name: { kind: "Name", value: "totalAmount" } },
								{ kind: "Field", name: { kind: "Name", value: "balanceDue" } },
								{ kind: "Field", name: { kind: "Name", value: "status" } },
								{
									kind: "Field",
									name: { kind: "Name", value: "paymentStatus" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "customer" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{ kind: "Field", name: { kind: "Name", value: "name" } },
											{ kind: "Field", name: { kind: "Name", value: "phone" } },
										],
									},
								},
							],
						},
					},
					{
						kind: "Field",
						name: { kind: "Name", value: "ordersByProductCount" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "productId" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "productId" },
								},
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	ProductRelatedOrdersQuery,
	ProductRelatedOrdersQueryVariables
>;
export const UpdateProductDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateProduct" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "UpdateProductInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateProduct" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Product" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Product" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Product" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "categoryId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "category" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "description" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variants" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateProductMutation,
	UpdateProductMutationVariables
>;
export const DeleteProductDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "DeleteProduct" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "deleteProduct" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	DeleteProductMutation,
	DeleteProductMutationVariables
>;
export const UpdateProductVariantDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UpdateProductVariant" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
				{
					kind: "VariableDefinition",
					variable: {
						kind: "Variable",
						name: { kind: "Name", value: "input" },
					},
					type: {
						kind: "NonNullType",
						type: {
							kind: "NamedType",
							name: { kind: "Name", value: "UpdateProductVariantInput" },
						},
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "updateProductVariant" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
							{
								kind: "Argument",
								name: { kind: "Name", value: "input" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "input" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	UpdateProductVariantMutation,
	UpdateProductVariantMutationVariables
>;
export const DeleteProductVariantDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "DeleteProductVariant" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "deleteProductVariant" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	DeleteProductVariantMutation,
	DeleteProductVariantMutationVariables
>;
export const UploadImageDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "mutation",
			name: { kind: "Name", value: "UploadImage" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "file" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "File" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "uploadImage" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "file" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "file" },
								},
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<UploadImageMutation, UploadImageMutationVariables>;
export const ProductDocument = {
	kind: "Document",
	definitions: [
		{
			kind: "OperationDefinition",
			operation: "query",
			name: { kind: "Name", value: "Product" },
			variableDefinitions: [
				{
					kind: "VariableDefinition",
					variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
					type: {
						kind: "NonNullType",
						type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
					},
				},
			],
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{
						kind: "Field",
						name: { kind: "Name", value: "product" },
						arguments: [
							{
								kind: "Argument",
								name: { kind: "Name", value: "id" },
								value: {
									kind: "Variable",
									name: { kind: "Name", value: "id" },
								},
							},
						],
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Product" },
								},
								{
									kind: "Field",
									name: { kind: "Name", value: "variants" },
									selectionSet: {
										kind: "SelectionSet",
										selections: [
											{
												kind: "FragmentSpread",
												name: { kind: "Name", value: "Variant" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "itemsCount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "availableCount" },
											},
											{
												kind: "Field",
												name: { kind: "Name", value: "items" },
												selectionSet: {
													kind: "SelectionSet",
													selections: [
														{
															kind: "Field",
															name: { kind: "Name", value: "id" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "code" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "status" },
														},
														{
															kind: "Field",
															name: { kind: "Name", value: "note" },
														},
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Variant" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "ProductVariant" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "productId" } },
					{ kind: "Field", name: { kind: "Name", value: "size" } },
					{ kind: "Field", name: { kind: "Name", value: "color" } },
					{ kind: "Field", name: { kind: "Name", value: "rentalPrice" } },
					{ kind: "Field", name: { kind: "Name", value: "deposit" } },
					{ kind: "Field", name: { kind: "Name", value: "imageUrl" } },
					{ kind: "Field", name: { kind: "Name", value: "itemsCount" } },
					{ kind: "Field", name: { kind: "Name", value: "availableCount" } },
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
					{ kind: "Field", name: { kind: "Name", value: "updatedAt" } },
				],
			},
		},
		{
			kind: "FragmentDefinition",
			name: { kind: "Name", value: "Product" },
			typeCondition: {
				kind: "NamedType",
				name: { kind: "Name", value: "Product" },
			},
			selectionSet: {
				kind: "SelectionSet",
				selections: [
					{ kind: "Field", name: { kind: "Name", value: "id" } },
					{ kind: "Field", name: { kind: "Name", value: "name" } },
					{ kind: "Field", name: { kind: "Name", value: "categoryId" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "category" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{ kind: "Field", name: { kind: "Name", value: "id" } },
								{ kind: "Field", name: { kind: "Name", value: "name" } },
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "description" } },
					{
						kind: "Field",
						name: { kind: "Name", value: "variants" },
						selectionSet: {
							kind: "SelectionSet",
							selections: [
								{
									kind: "FragmentSpread",
									name: { kind: "Name", value: "Variant" },
								},
							],
						},
					},
					{ kind: "Field", name: { kind: "Name", value: "createdAt" } },
				],
			},
		},
	],
} as unknown as DocumentNode<ProductQuery, ProductQueryVariables>;
