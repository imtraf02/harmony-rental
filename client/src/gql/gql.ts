/* eslint-disable */

import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
	"\n  fragment Category on Category {\n    id\n    name\n    description\n  }\n": typeof types.CategoryFragmentDoc;
	"\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      ...Category\n    }\n  }\n": typeof types.CreateCategoryDocument;
	"\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...Category\n    }\n  }\n": typeof types.UpdateCategoryDocument;
	"\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteCategoryDocument;
	"\n  query Categories {\n    categories {\n      ...Category\n    }\n  }\n": typeof types.CategoriesDocument;
	"\n  fragment Customer on Customer {\n    id\n    name\n    phone\n    address\n    note\n    createdAt\n  }\n": typeof types.CustomerFragmentDoc;
	"\n  mutation CreateCustomer($input: CreateCustomerInput!) {\n    createCustomer(input: $input) {\n      ...Customer\n    }\n  }\n": typeof types.CreateCustomerDocument;
	"\n  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {\n    updateCustomer(id: $id, input: $input) {\n      ...Customer\n    }\n  }\n": typeof types.UpdateCustomerDocument;
	"\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      ...Customer\n    }\n  }\n": typeof types.DeleteCustomerDocument;
	"\n  query Customers {\n    customers {\n      ...Customer\n    }\n  }\n": typeof types.CustomersDocument;
	"\n  query Customer($id: ID!) {\n    customer(id: $id) {\n      ...Customer\n    }\n  }\n": typeof types.CustomerDocument;
	"\n\tquery DashboardAnalytics(\n\t\t$preset: DashboardTimePreset!\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$upcomingDays: Int\n\t) {\n\t\tdashboardAnalytics(\n\t\t\tpreset: $preset\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tupcomingDays: $upcomingDays\n\t\t) {\n\t\t\trangeStart\n\t\t\trangeEnd\n\t\t\ttotalOrders\n\t\t\ttotalRevenue\n\t\t\tdepositCollected\n\t\t\toutstandingBalance\n\t\t\tactiveOrders\n\t\t\tchart {\n\t\t\t\tdate\n\t\t\t\torders\n\t\t\t\trevenue\n\t\t\t}\n\t\t\tupcomingReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t\toverdueReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t}\n\t}\n": typeof types.DashboardAnalyticsDocument;
	"\n  fragment Variant on ProductVariant {\n    id\n    productId\n    size\n    color\n    rentalPrice\n    deposit\n    imageUrl\n    itemsCount\n    availableCount\n    createdAt\n    updatedAt\n  }\n": typeof types.VariantFragmentDoc;
	"\n  fragment Product on Product {\n    id\n    name\n    categoryId\n    category {\n      id\n      name\n    }\n    description\n    variants {\n      ...Variant\n    }\n    createdAt\n  }\n": typeof types.ProductFragmentDoc;
	"\n  fragment Item on Item {\n    id\n    code\n    variantId\n    variant {\n      ...Variant\n      product {\n        id\n        name\n        categoryId\n        category {\n          id\n        }\n      }\n    }\n    status\n    note\n    createdAt\n    updatedAt\n  }\n": typeof types.ItemFragmentDoc;
	"\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      ...Product\n    }\n  }\n": typeof types.CreateProductDocument;
	"\n  mutation CreateProductVariant($input: CreateProductVariantInput!) {\n    createProductVariant(input: $input) {\n      ...Variant\n    }\n  }\n": typeof types.CreateProductVariantDocument;
	"\n  mutation CreateItem($input: CreateItemInput!) {\n    createItem(input: $input) {\n      ...Item\n    }\n  }\n": typeof types.CreateItemDocument;
	"\n  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {\n    updateItem(id: $id, input: $input) {\n      ...Item\n    }\n  }\n": typeof types.UpdateItemDocument;
	"\n  mutation DeleteItem($id: ID!) {\n    deleteItem(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteItemDocument;
	"\n  query Items($variantId: String) {\n    items(variantId: $variantId) {\n      ...Item\n    }\n  }\n": typeof types.ItemsDocument;
	"\n  query Products($categoryId: String) {\n    products(categoryId: $categoryId) {\n      ...Product\n    }\n  }\n": typeof types.ProductsDocument;
	"\n  query ProductVariants($productId: String!) {\n    productVariants(productId: $productId) {\n      ...Variant\n    }\n  }\n": typeof types.ProductVariantsDocument;
	"\n  fragment Order on Order {\n    id\n    code\n    customer {\n      id\n      name\n      phone\n      address\n    }\n    rentalDate\n    returnDate\n    returnedAt\n    eventDate\n    eventType\n    totalAmount\n    depositPaid\n    balanceDue\n    status\n    paymentStatus\n    lateFee\n    damageFee\n    note\n    items {\n      id\n      item {\n        id\n        code\n        variant {\n          id\n          size\n          color\n          imageUrl\n          product {\n            id\n            name\n          }\n        }\n      }\n      rentalPrice\n      deposit\n      damageNote\n    }\n    createdAt\n  }\n": typeof types.OrderFragmentDoc;
	"\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ...Order\n    }\n  }\n": typeof types.CreateOrderDocument;
	"\n  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {\n    updateOrderStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n": typeof types.UpdateOrderStatusDocument;
	"\n  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {\n    updatePaymentStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n": typeof types.UpdatePaymentStatusDocument;
	"\n  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {\n    updateOrder(id: $id, input: $input) {\n      ...Order\n    }\n  }\n": typeof types.UpdateOrderDocument;
	"\n  mutation DeleteOrder($id: ID!) {\n    deleteOrder(id: $id) {\n      ...Order\n    }\n  }\n": typeof types.DeleteOrderDocument;
	"\n  mutation UpdateOrderItem($id: ID!, $damageNote: String!) {\n    updateOrderItem(id: $id, damageNote: $damageNote) {\n      ...Order\n    }\n  }\n": typeof types.UpdateOrderItemDocument;
	"\n  query Orders($statuses: [OrderStatus!], $paymentStatuses: [PaymentStatus!], $search: String, $page: Int, $pageSize: Int) {\n    orders(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search, page: $page, pageSize: $pageSize) {\n      ...Order\n    }\n    ordersCount(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search)\n  }\n": typeof types.OrdersDocument;
	"\n  query Order($id: ID!) {\n    order(id: $id) {\n      ...Order\n    }\n  }\n": typeof types.OrderDocument;
	"\n\tmutation RecordOrderPayment($input: RecordOrderPaymentInput!) {\n\t\trecordOrderPayment(input: $input) {\n\t\t\tid\n\t\t\tdepositPaid\n\t\t\tbalanceDue\n\t\t\tpaymentStatus\n\t\t}\n\t}\n": typeof types.RecordOrderPaymentDocument;
	"\n\tquery PaymentHistory(\n\t\t$search: String\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$page: Int\n\t\t$pageSize: Int\n\t) {\n\t\tpaymentHistory(\n\t\t\tsearch: $search\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tpage: $page\n\t\t\tpageSize: $pageSize\n\t\t) {\n\t\t\tid\n\t\t\tamount\n\t\t\tmethod\n\t\t\tnote\n\t\t\tpaidAt\n\t\t\torder {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tstatus\n\t\t\t\tpaymentStatus\n\t\t\t\tbalanceDue\n\t\t\t\ttotalAmount\n\t\t\t\tcustomer {\n\t\t\t\t\tname\n\t\t\t\t\tphone\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tpaymentHistoryCount(search: $search, startDate: $startDate, endDate: $endDate)\n\t}\n": typeof types.PaymentHistoryDocument;
	"\n\tmutation UpdateProductVariantImage($id: ID!, $image: File!) {\n\t\tupdateProductVariantImage(id: $id, image: $image) {\n\t\t\tid\n\t\t\timageUrl\n\t\t\tupdatedAt\n\t\t}\n\t}\n": typeof types.UpdateProductVariantImageDocument;
	"\n\tquery ProductRelatedOrders($productId: String!, $page: Int, $pageSize: Int) {\n\t\tordersByProduct(productId: $productId, page: $page, pageSize: $pageSize) {\n\t\t\tid\n\t\t\tcode\n\t\t\trentalDate\n\t\t\treturnDate\n\t\t\ttotalAmount\n\t\t\tbalanceDue\n\t\t\tstatus\n\t\t\tpaymentStatus\n\t\t\tcustomer {\n\t\t\t\tname\n\t\t\t\tphone\n\t\t\t}\n\t\t}\n\t\tordersByProductCount(productId: $productId)\n\t}\n": typeof types.ProductRelatedOrdersDocument;
	"\n  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      ...Product\n    }\n  }\n": typeof types.UpdateProductDocument;
	"\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteProductDocument;
	"\n  mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {\n    updateProductVariant(id: $id, input: $input) {\n      ...Variant\n    }\n  }\n": typeof types.UpdateProductVariantDocument;
	"\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      id\n    }\n  }\n": typeof types.DeleteProductVariantDocument;
	"\n  mutation UploadImage($file: File!) {\n    uploadImage(file: $file)\n  }\n": typeof types.UploadImageDocument;
	"\n  query Product($id: ID!) {\n    product(id: $id) {\n      ...Product\n      variants {\n        ...Variant\n        itemsCount\n        availableCount\n        items {\n          id\n          code\n          status\n          note\n        }\n      }\n    }\n  }\n": typeof types.ProductDocument;
};
const documents: Documents = {
	"\n  fragment Category on Category {\n    id\n    name\n    description\n  }\n":
		types.CategoryFragmentDoc,
	"\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      ...Category\n    }\n  }\n":
		types.CreateCategoryDocument,
	"\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...Category\n    }\n  }\n":
		types.UpdateCategoryDocument,
	"\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n    }\n  }\n":
		types.DeleteCategoryDocument,
	"\n  query Categories {\n    categories {\n      ...Category\n    }\n  }\n":
		types.CategoriesDocument,
	"\n  fragment Customer on Customer {\n    id\n    name\n    phone\n    address\n    note\n    createdAt\n  }\n":
		types.CustomerFragmentDoc,
	"\n  mutation CreateCustomer($input: CreateCustomerInput!) {\n    createCustomer(input: $input) {\n      ...Customer\n    }\n  }\n":
		types.CreateCustomerDocument,
	"\n  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {\n    updateCustomer(id: $id, input: $input) {\n      ...Customer\n    }\n  }\n":
		types.UpdateCustomerDocument,
	"\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      ...Customer\n    }\n  }\n":
		types.DeleteCustomerDocument,
	"\n  query Customers {\n    customers {\n      ...Customer\n    }\n  }\n":
		types.CustomersDocument,
	"\n  query Customer($id: ID!) {\n    customer(id: $id) {\n      ...Customer\n    }\n  }\n":
		types.CustomerDocument,
	"\n\tquery DashboardAnalytics(\n\t\t$preset: DashboardTimePreset!\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$upcomingDays: Int\n\t) {\n\t\tdashboardAnalytics(\n\t\t\tpreset: $preset\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tupcomingDays: $upcomingDays\n\t\t) {\n\t\t\trangeStart\n\t\t\trangeEnd\n\t\t\ttotalOrders\n\t\t\ttotalRevenue\n\t\t\tdepositCollected\n\t\t\toutstandingBalance\n\t\t\tactiveOrders\n\t\t\tchart {\n\t\t\t\tdate\n\t\t\t\torders\n\t\t\t\trevenue\n\t\t\t}\n\t\t\tupcomingReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t\toverdueReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t}\n\t}\n":
		types.DashboardAnalyticsDocument,
	"\n  fragment Variant on ProductVariant {\n    id\n    productId\n    size\n    color\n    rentalPrice\n    deposit\n    imageUrl\n    itemsCount\n    availableCount\n    createdAt\n    updatedAt\n  }\n":
		types.VariantFragmentDoc,
	"\n  fragment Product on Product {\n    id\n    name\n    categoryId\n    category {\n      id\n      name\n    }\n    description\n    variants {\n      ...Variant\n    }\n    createdAt\n  }\n":
		types.ProductFragmentDoc,
	"\n  fragment Item on Item {\n    id\n    code\n    variantId\n    variant {\n      ...Variant\n      product {\n        id\n        name\n        categoryId\n        category {\n          id\n        }\n      }\n    }\n    status\n    note\n    createdAt\n    updatedAt\n  }\n":
		types.ItemFragmentDoc,
	"\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      ...Product\n    }\n  }\n":
		types.CreateProductDocument,
	"\n  mutation CreateProductVariant($input: CreateProductVariantInput!) {\n    createProductVariant(input: $input) {\n      ...Variant\n    }\n  }\n":
		types.CreateProductVariantDocument,
	"\n  mutation CreateItem($input: CreateItemInput!) {\n    createItem(input: $input) {\n      ...Item\n    }\n  }\n":
		types.CreateItemDocument,
	"\n  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {\n    updateItem(id: $id, input: $input) {\n      ...Item\n    }\n  }\n":
		types.UpdateItemDocument,
	"\n  mutation DeleteItem($id: ID!) {\n    deleteItem(id: $id) {\n      id\n    }\n  }\n":
		types.DeleteItemDocument,
	"\n  query Items($variantId: String) {\n    items(variantId: $variantId) {\n      ...Item\n    }\n  }\n":
		types.ItemsDocument,
	"\n  query Products($categoryId: String) {\n    products(categoryId: $categoryId) {\n      ...Product\n    }\n  }\n":
		types.ProductsDocument,
	"\n  query ProductVariants($productId: String!) {\n    productVariants(productId: $productId) {\n      ...Variant\n    }\n  }\n":
		types.ProductVariantsDocument,
	"\n  fragment Order on Order {\n    id\n    code\n    customer {\n      id\n      name\n      phone\n      address\n    }\n    rentalDate\n    returnDate\n    returnedAt\n    eventDate\n    eventType\n    totalAmount\n    depositPaid\n    balanceDue\n    status\n    paymentStatus\n    lateFee\n    damageFee\n    note\n    items {\n      id\n      item {\n        id\n        code\n        variant {\n          id\n          size\n          color\n          imageUrl\n          product {\n            id\n            name\n          }\n        }\n      }\n      rentalPrice\n      deposit\n      damageNote\n    }\n    createdAt\n  }\n":
		types.OrderFragmentDoc,
	"\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ...Order\n    }\n  }\n":
		types.CreateOrderDocument,
	"\n  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {\n    updateOrderStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n":
		types.UpdateOrderStatusDocument,
	"\n  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {\n    updatePaymentStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n":
		types.UpdatePaymentStatusDocument,
	"\n  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {\n    updateOrder(id: $id, input: $input) {\n      ...Order\n    }\n  }\n":
		types.UpdateOrderDocument,
	"\n  mutation DeleteOrder($id: ID!) {\n    deleteOrder(id: $id) {\n      ...Order\n    }\n  }\n":
		types.DeleteOrderDocument,
	"\n  mutation UpdateOrderItem($id: ID!, $damageNote: String!) {\n    updateOrderItem(id: $id, damageNote: $damageNote) {\n      ...Order\n    }\n  }\n":
		types.UpdateOrderItemDocument,
	"\n  query Orders($statuses: [OrderStatus!], $paymentStatuses: [PaymentStatus!], $search: String, $page: Int, $pageSize: Int) {\n    orders(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search, page: $page, pageSize: $pageSize) {\n      ...Order\n    }\n    ordersCount(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search)\n  }\n":
		types.OrdersDocument,
	"\n  query Order($id: ID!) {\n    order(id: $id) {\n      ...Order\n    }\n  }\n":
		types.OrderDocument,
	"\n\tmutation RecordOrderPayment($input: RecordOrderPaymentInput!) {\n\t\trecordOrderPayment(input: $input) {\n\t\t\tid\n\t\t\tdepositPaid\n\t\t\tbalanceDue\n\t\t\tpaymentStatus\n\t\t}\n\t}\n":
		types.RecordOrderPaymentDocument,
	"\n\tquery PaymentHistory(\n\t\t$search: String\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$page: Int\n\t\t$pageSize: Int\n\t) {\n\t\tpaymentHistory(\n\t\t\tsearch: $search\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tpage: $page\n\t\t\tpageSize: $pageSize\n\t\t) {\n\t\t\tid\n\t\t\tamount\n\t\t\tmethod\n\t\t\tnote\n\t\t\tpaidAt\n\t\t\torder {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tstatus\n\t\t\t\tpaymentStatus\n\t\t\t\tbalanceDue\n\t\t\t\ttotalAmount\n\t\t\t\tcustomer {\n\t\t\t\t\tname\n\t\t\t\t\tphone\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tpaymentHistoryCount(search: $search, startDate: $startDate, endDate: $endDate)\n\t}\n":
		types.PaymentHistoryDocument,
	"\n\tmutation UpdateProductVariantImage($id: ID!, $image: File!) {\n\t\tupdateProductVariantImage(id: $id, image: $image) {\n\t\t\tid\n\t\t\timageUrl\n\t\t\tupdatedAt\n\t\t}\n\t}\n":
		types.UpdateProductVariantImageDocument,
	"\n\tquery ProductRelatedOrders($productId: String!, $page: Int, $pageSize: Int) {\n\t\tordersByProduct(productId: $productId, page: $page, pageSize: $pageSize) {\n\t\t\tid\n\t\t\tcode\n\t\t\trentalDate\n\t\t\treturnDate\n\t\t\ttotalAmount\n\t\t\tbalanceDue\n\t\t\tstatus\n\t\t\tpaymentStatus\n\t\t\tcustomer {\n\t\t\t\tname\n\t\t\t\tphone\n\t\t\t}\n\t\t}\n\t\tordersByProductCount(productId: $productId)\n\t}\n":
		types.ProductRelatedOrdersDocument,
	"\n  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      ...Product\n    }\n  }\n":
		types.UpdateProductDocument,
	"\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      id\n    }\n  }\n":
		types.DeleteProductDocument,
	"\n  mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {\n    updateProductVariant(id: $id, input: $input) {\n      ...Variant\n    }\n  }\n":
		types.UpdateProductVariantDocument,
	"\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      id\n    }\n  }\n":
		types.DeleteProductVariantDocument,
	"\n  mutation UploadImage($file: File!) {\n    uploadImage(file: $file)\n  }\n":
		types.UploadImageDocument,
	"\n  query Product($id: ID!) {\n    product(id: $id) {\n      ...Product\n      variants {\n        ...Variant\n        itemsCount\n        availableCount\n        items {\n          id\n          code\n          status\n          note\n        }\n      }\n    }\n  }\n":
		types.ProductDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  fragment Category on Category {\n    id\n    name\n    description\n  }\n",
): (typeof documents)["\n  fragment Category on Category {\n    id\n    name\n    description\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      ...Category\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateCategory($input: CreateCategoryInput!) {\n    createCategory(input: $input) {\n      ...Category\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...Category\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {\n    updateCategory(id: $id, input: $input) {\n      ...Category\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteCategory($id: ID!) {\n    deleteCategory(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Categories {\n    categories {\n      ...Category\n    }\n  }\n",
): (typeof documents)["\n  query Categories {\n    categories {\n      ...Category\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  fragment Customer on Customer {\n    id\n    name\n    phone\n    address\n    note\n    createdAt\n  }\n",
): (typeof documents)["\n  fragment Customer on Customer {\n    id\n    name\n    phone\n    address\n    note\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation CreateCustomer($input: CreateCustomerInput!) {\n    createCustomer(input: $input) {\n      ...Customer\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateCustomer($input: CreateCustomerInput!) {\n    createCustomer(input: $input) {\n      ...Customer\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {\n    updateCustomer(id: $id, input: $input) {\n      ...Customer\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateCustomer($id: ID!, $input: UpdateCustomerInput!) {\n    updateCustomer(id: $id, input: $input) {\n      ...Customer\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      ...Customer\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteCustomer($id: ID!) {\n    deleteCustomer(id: $id) {\n      ...Customer\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Customers {\n    customers {\n      ...Customer\n    }\n  }\n",
): (typeof documents)["\n  query Customers {\n    customers {\n      ...Customer\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Customer($id: ID!) {\n    customer(id: $id) {\n      ...Customer\n    }\n  }\n",
): (typeof documents)["\n  query Customer($id: ID!) {\n    customer(id: $id) {\n      ...Customer\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n\tquery DashboardAnalytics(\n\t\t$preset: DashboardTimePreset!\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$upcomingDays: Int\n\t) {\n\t\tdashboardAnalytics(\n\t\t\tpreset: $preset\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tupcomingDays: $upcomingDays\n\t\t) {\n\t\t\trangeStart\n\t\t\trangeEnd\n\t\t\ttotalOrders\n\t\t\ttotalRevenue\n\t\t\tdepositCollected\n\t\t\toutstandingBalance\n\t\t\tactiveOrders\n\t\t\tchart {\n\t\t\t\tdate\n\t\t\t\torders\n\t\t\t\trevenue\n\t\t\t}\n\t\t\tupcomingReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t\toverdueReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t}\n\t}\n",
): (typeof documents)["\n\tquery DashboardAnalytics(\n\t\t$preset: DashboardTimePreset!\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$upcomingDays: Int\n\t) {\n\t\tdashboardAnalytics(\n\t\t\tpreset: $preset\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tupcomingDays: $upcomingDays\n\t\t) {\n\t\t\trangeStart\n\t\t\trangeEnd\n\t\t\ttotalOrders\n\t\t\ttotalRevenue\n\t\t\tdepositCollected\n\t\t\toutstandingBalance\n\t\t\tactiveOrders\n\t\t\tchart {\n\t\t\t\tdate\n\t\t\t\torders\n\t\t\t\trevenue\n\t\t\t}\n\t\t\tupcomingReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t\toverdueReturns {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tcustomerName\n\t\t\t\tcustomerPhone\n\t\t\t\trentalDate\n\t\t\t\treturnDate\n\t\t\t\ttotalAmount\n\t\t\t\tbalanceDue\n\t\t\t\tstatus\n\t\t\t\tdaysToDue\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  fragment Variant on ProductVariant {\n    id\n    productId\n    size\n    color\n    rentalPrice\n    deposit\n    imageUrl\n    itemsCount\n    availableCount\n    createdAt\n    updatedAt\n  }\n",
): (typeof documents)["\n  fragment Variant on ProductVariant {\n    id\n    productId\n    size\n    color\n    rentalPrice\n    deposit\n    imageUrl\n    itemsCount\n    availableCount\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  fragment Product on Product {\n    id\n    name\n    categoryId\n    category {\n      id\n      name\n    }\n    description\n    variants {\n      ...Variant\n    }\n    createdAt\n  }\n",
): (typeof documents)["\n  fragment Product on Product {\n    id\n    name\n    categoryId\n    category {\n      id\n      name\n    }\n    description\n    variants {\n      ...Variant\n    }\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  fragment Item on Item {\n    id\n    code\n    variantId\n    variant {\n      ...Variant\n      product {\n        id\n        name\n        categoryId\n        category {\n          id\n        }\n      }\n    }\n    status\n    note\n    createdAt\n    updatedAt\n  }\n",
): (typeof documents)["\n  fragment Item on Item {\n    id\n    code\n    variantId\n    variant {\n      ...Variant\n      product {\n        id\n        name\n        categoryId\n        category {\n          id\n        }\n      }\n    }\n    status\n    note\n    createdAt\n    updatedAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      ...Product\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateProduct($input: CreateProductInput!) {\n    createProduct(input: $input) {\n      ...Product\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation CreateProductVariant($input: CreateProductVariantInput!) {\n    createProductVariant(input: $input) {\n      ...Variant\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateProductVariant($input: CreateProductVariantInput!) {\n    createProductVariant(input: $input) {\n      ...Variant\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation CreateItem($input: CreateItemInput!) {\n    createItem(input: $input) {\n      ...Item\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateItem($input: CreateItemInput!) {\n    createItem(input: $input) {\n      ...Item\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {\n    updateItem(id: $id, input: $input) {\n      ...Item\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateItem($id: ID!, $input: UpdateItemInput!) {\n    updateItem(id: $id, input: $input) {\n      ...Item\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation DeleteItem($id: ID!) {\n    deleteItem(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteItem($id: ID!) {\n    deleteItem(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Items($variantId: String) {\n    items(variantId: $variantId) {\n      ...Item\n    }\n  }\n",
): (typeof documents)["\n  query Items($variantId: String) {\n    items(variantId: $variantId) {\n      ...Item\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Products($categoryId: String) {\n    products(categoryId: $categoryId) {\n      ...Product\n    }\n  }\n",
): (typeof documents)["\n  query Products($categoryId: String) {\n    products(categoryId: $categoryId) {\n      ...Product\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query ProductVariants($productId: String!) {\n    productVariants(productId: $productId) {\n      ...Variant\n    }\n  }\n",
): (typeof documents)["\n  query ProductVariants($productId: String!) {\n    productVariants(productId: $productId) {\n      ...Variant\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  fragment Order on Order {\n    id\n    code\n    customer {\n      id\n      name\n      phone\n      address\n    }\n    rentalDate\n    returnDate\n    returnedAt\n    eventDate\n    eventType\n    totalAmount\n    depositPaid\n    balanceDue\n    status\n    paymentStatus\n    lateFee\n    damageFee\n    note\n    items {\n      id\n      item {\n        id\n        code\n        variant {\n          id\n          size\n          color\n          imageUrl\n          product {\n            id\n            name\n          }\n        }\n      }\n      rentalPrice\n      deposit\n      damageNote\n    }\n    createdAt\n  }\n",
): (typeof documents)["\n  fragment Order on Order {\n    id\n    code\n    customer {\n      id\n      name\n      phone\n      address\n    }\n    rentalDate\n    returnDate\n    returnedAt\n    eventDate\n    eventType\n    totalAmount\n    depositPaid\n    balanceDue\n    status\n    paymentStatus\n    lateFee\n    damageFee\n    note\n    items {\n      id\n      item {\n        id\n        code\n        variant {\n          id\n          size\n          color\n          imageUrl\n          product {\n            id\n            name\n          }\n        }\n      }\n      rentalPrice\n      deposit\n      damageNote\n    }\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  mutation CreateOrder($input: CreateOrderInput!) {\n    createOrder(input: $input) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {\n    updateOrderStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {\n    updateOrderStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {\n    updatePaymentStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdatePaymentStatus($id: ID!, $status: PaymentStatus!) {\n    updatePaymentStatus(id: $id, status: $status) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {\n    updateOrder(id: $id, input: $input) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateOrder($id: ID!, $input: UpdateOrderInput!) {\n    updateOrder(id: $id, input: $input) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation DeleteOrder($id: ID!) {\n    deleteOrder(id: $id) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteOrder($id: ID!) {\n    deleteOrder(id: $id) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateOrderItem($id: ID!, $damageNote: String!) {\n    updateOrderItem(id: $id, damageNote: $damageNote) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateOrderItem($id: ID!, $damageNote: String!) {\n    updateOrderItem(id: $id, damageNote: $damageNote) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Orders($statuses: [OrderStatus!], $paymentStatuses: [PaymentStatus!], $search: String, $page: Int, $pageSize: Int) {\n    orders(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search, page: $page, pageSize: $pageSize) {\n      ...Order\n    }\n    ordersCount(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search)\n  }\n",
): (typeof documents)["\n  query Orders($statuses: [OrderStatus!], $paymentStatuses: [PaymentStatus!], $search: String, $page: Int, $pageSize: Int) {\n    orders(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search, page: $page, pageSize: $pageSize) {\n      ...Order\n    }\n    ordersCount(statuses: $statuses, paymentStatuses: $paymentStatuses, search: $search)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Order($id: ID!) {\n    order(id: $id) {\n      ...Order\n    }\n  }\n",
): (typeof documents)["\n  query Order($id: ID!) {\n    order(id: $id) {\n      ...Order\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n\tmutation RecordOrderPayment($input: RecordOrderPaymentInput!) {\n\t\trecordOrderPayment(input: $input) {\n\t\t\tid\n\t\t\tdepositPaid\n\t\t\tbalanceDue\n\t\t\tpaymentStatus\n\t\t}\n\t}\n",
): (typeof documents)["\n\tmutation RecordOrderPayment($input: RecordOrderPaymentInput!) {\n\t\trecordOrderPayment(input: $input) {\n\t\t\tid\n\t\t\tdepositPaid\n\t\t\tbalanceDue\n\t\t\tpaymentStatus\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n\tquery PaymentHistory(\n\t\t$search: String\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$page: Int\n\t\t$pageSize: Int\n\t) {\n\t\tpaymentHistory(\n\t\t\tsearch: $search\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tpage: $page\n\t\t\tpageSize: $pageSize\n\t\t) {\n\t\t\tid\n\t\t\tamount\n\t\t\tmethod\n\t\t\tnote\n\t\t\tpaidAt\n\t\t\torder {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tstatus\n\t\t\t\tpaymentStatus\n\t\t\t\tbalanceDue\n\t\t\t\ttotalAmount\n\t\t\t\tcustomer {\n\t\t\t\t\tname\n\t\t\t\t\tphone\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tpaymentHistoryCount(search: $search, startDate: $startDate, endDate: $endDate)\n\t}\n",
): (typeof documents)["\n\tquery PaymentHistory(\n\t\t$search: String\n\t\t$startDate: DateTime\n\t\t$endDate: DateTime\n\t\t$page: Int\n\t\t$pageSize: Int\n\t) {\n\t\tpaymentHistory(\n\t\t\tsearch: $search\n\t\t\tstartDate: $startDate\n\t\t\tendDate: $endDate\n\t\t\tpage: $page\n\t\t\tpageSize: $pageSize\n\t\t) {\n\t\t\tid\n\t\t\tamount\n\t\t\tmethod\n\t\t\tnote\n\t\t\tpaidAt\n\t\t\torder {\n\t\t\t\tid\n\t\t\t\tcode\n\t\t\t\tstatus\n\t\t\t\tpaymentStatus\n\t\t\t\tbalanceDue\n\t\t\t\ttotalAmount\n\t\t\t\tcustomer {\n\t\t\t\t\tname\n\t\t\t\t\tphone\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tpaymentHistoryCount(search: $search, startDate: $startDate, endDate: $endDate)\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n\tmutation UpdateProductVariantImage($id: ID!, $image: File!) {\n\t\tupdateProductVariantImage(id: $id, image: $image) {\n\t\t\tid\n\t\t\timageUrl\n\t\t\tupdatedAt\n\t\t}\n\t}\n",
): (typeof documents)["\n\tmutation UpdateProductVariantImage($id: ID!, $image: File!) {\n\t\tupdateProductVariantImage(id: $id, image: $image) {\n\t\t\tid\n\t\t\timageUrl\n\t\t\tupdatedAt\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n\tquery ProductRelatedOrders($productId: String!, $page: Int, $pageSize: Int) {\n\t\tordersByProduct(productId: $productId, page: $page, pageSize: $pageSize) {\n\t\t\tid\n\t\t\tcode\n\t\t\trentalDate\n\t\t\treturnDate\n\t\t\ttotalAmount\n\t\t\tbalanceDue\n\t\t\tstatus\n\t\t\tpaymentStatus\n\t\t\tcustomer {\n\t\t\t\tname\n\t\t\t\tphone\n\t\t\t}\n\t\t}\n\t\tordersByProductCount(productId: $productId)\n\t}\n",
): (typeof documents)["\n\tquery ProductRelatedOrders($productId: String!, $page: Int, $pageSize: Int) {\n\t\tordersByProduct(productId: $productId, page: $page, pageSize: $pageSize) {\n\t\t\tid\n\t\t\tcode\n\t\t\trentalDate\n\t\t\treturnDate\n\t\t\ttotalAmount\n\t\t\tbalanceDue\n\t\t\tstatus\n\t\t\tpaymentStatus\n\t\t\tcustomer {\n\t\t\t\tname\n\t\t\t\tphone\n\t\t\t}\n\t\t}\n\t\tordersByProductCount(productId: $productId)\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      ...Product\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {\n    updateProduct(id: $id, input: $input) {\n      ...Product\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteProduct($id: ID!) {\n    deleteProduct(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {\n    updateProductVariant(id: $id, input: $input) {\n      ...Variant\n    }\n  }\n",
): (typeof documents)["\n  mutation UpdateProductVariant($id: ID!, $input: UpdateProductVariantInput!) {\n    updateProductVariant(id: $id, input: $input) {\n      ...Variant\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation DeleteProductVariant($id: ID!) {\n    deleteProductVariant(id: $id) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  mutation UploadImage($file: File!) {\n    uploadImage(file: $file)\n  }\n",
): (typeof documents)["\n  mutation UploadImage($file: File!) {\n    uploadImage(file: $file)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
	source: "\n  query Product($id: ID!) {\n    product(id: $id) {\n      ...Product\n      variants {\n        ...Variant\n        itemsCount\n        availableCount\n        items {\n          id\n          code\n          status\n          note\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query Product($id: ID!) {\n    product(id: $id) {\n      ...Product\n      variants {\n        ...Variant\n        itemsCount\n        availableCount\n        items {\n          id\n          code\n          status\n          note\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
	return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
	TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
