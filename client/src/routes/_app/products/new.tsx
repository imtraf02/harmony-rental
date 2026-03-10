import { createFileRoute } from "@tanstack/react-router";
import { ProductCreateForm } from "@/features/products";

export const Route = createFileRoute("/_app/products/new")({
	component: ProductCreatePage,
});

function ProductCreatePage() {
	return <ProductCreateForm />;
}
