import { createFileRoute } from "@tanstack/react-router";
import { ProductDetail, ProductsProvider, ProductsDialogs } from "@/features/products";

export const Route = createFileRoute("/_app/products/$productId")({
	component: ProductDetailPage,
});

function ProductDetailPage() {
	return (
		<ProductsProvider>
			<ProductDetail />
			<ProductsDialogs />
		</ProductsProvider>
	);
}
