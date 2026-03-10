/* eslint-disable */
import type { Prisma, Customer, Category, Product, ProductVariant, Item, Order, OrderItem, Payment, Maintenance } from "./prisma/client.js";
import type { PothosPrismaDatamodel } from "@pothos/plugin-prisma";
export default interface PrismaTypes {
    Customer: {
        Name: "Customer";
        Shape: Customer;
        Include: Prisma.CustomerInclude;
        Select: Prisma.CustomerSelect;
        OrderBy: Prisma.CustomerOrderByWithRelationInput;
        WhereUnique: Prisma.CustomerWhereUniqueInput;
        Where: Prisma.CustomerWhereInput;
        Create: {};
        Update: {};
        RelationName: "orders";
        ListRelations: "orders";
        Relations: {
            orders: {
                Shape: Order[];
                Name: "Order";
                Nullable: false;
            };
        };
    };
    Category: {
        Name: "Category";
        Shape: Category;
        Include: Prisma.CategoryInclude;
        Select: Prisma.CategorySelect;
        OrderBy: Prisma.CategoryOrderByWithRelationInput;
        WhereUnique: Prisma.CategoryWhereUniqueInput;
        Where: Prisma.CategoryWhereInput;
        Create: {};
        Update: {};
        RelationName: "products";
        ListRelations: "products";
        Relations: {
            products: {
                Shape: Product[];
                Name: "Product";
                Nullable: false;
            };
        };
    };
    Product: {
        Name: "Product";
        Shape: Product;
        Include: Prisma.ProductInclude;
        Select: Prisma.ProductSelect;
        OrderBy: Prisma.ProductOrderByWithRelationInput;
        WhereUnique: Prisma.ProductWhereUniqueInput;
        Where: Prisma.ProductWhereInput;
        Create: {};
        Update: {};
        RelationName: "category" | "variants";
        ListRelations: "variants";
        Relations: {
            category: {
                Shape: Category;
                Name: "Category";
                Nullable: false;
            };
            variants: {
                Shape: ProductVariant[];
                Name: "ProductVariant";
                Nullable: false;
            };
        };
    };
    ProductVariant: {
        Name: "ProductVariant";
        Shape: ProductVariant;
        Include: Prisma.ProductVariantInclude;
        Select: Prisma.ProductVariantSelect;
        OrderBy: Prisma.ProductVariantOrderByWithRelationInput;
        WhereUnique: Prisma.ProductVariantWhereUniqueInput;
        Where: Prisma.ProductVariantWhereInput;
        Create: {};
        Update: {};
        RelationName: "product" | "items";
        ListRelations: "items";
        Relations: {
            product: {
                Shape: Product;
                Name: "Product";
                Nullable: false;
            };
            items: {
                Shape: Item[];
                Name: "Item";
                Nullable: false;
            };
        };
    };
    Item: {
        Name: "Item";
        Shape: Item;
        Include: Prisma.ItemInclude;
        Select: Prisma.ItemSelect;
        OrderBy: Prisma.ItemOrderByWithRelationInput;
        WhereUnique: Prisma.ItemWhereUniqueInput;
        Where: Prisma.ItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "variant" | "orderItems" | "maintenances";
        ListRelations: "orderItems" | "maintenances";
        Relations: {
            variant: {
                Shape: ProductVariant;
                Name: "ProductVariant";
                Nullable: false;
            };
            orderItems: {
                Shape: OrderItem[];
                Name: "OrderItem";
                Nullable: false;
            };
            maintenances: {
                Shape: Maintenance[];
                Name: "Maintenance";
                Nullable: false;
            };
        };
    };
    Order: {
        Name: "Order";
        Shape: Order;
        Include: Prisma.OrderInclude;
        Select: Prisma.OrderSelect;
        OrderBy: Prisma.OrderOrderByWithRelationInput;
        WhereUnique: Prisma.OrderWhereUniqueInput;
        Where: Prisma.OrderWhereInput;
        Create: {};
        Update: {};
        RelationName: "customer" | "items" | "payments";
        ListRelations: "items" | "payments";
        Relations: {
            customer: {
                Shape: Customer;
                Name: "Customer";
                Nullable: false;
            };
            items: {
                Shape: OrderItem[];
                Name: "OrderItem";
                Nullable: false;
            };
            payments: {
                Shape: Payment[];
                Name: "Payment";
                Nullable: false;
            };
        };
    };
    OrderItem: {
        Name: "OrderItem";
        Shape: OrderItem;
        Include: Prisma.OrderItemInclude;
        Select: Prisma.OrderItemSelect;
        OrderBy: Prisma.OrderItemOrderByWithRelationInput;
        WhereUnique: Prisma.OrderItemWhereUniqueInput;
        Where: Prisma.OrderItemWhereInput;
        Create: {};
        Update: {};
        RelationName: "order" | "item";
        ListRelations: never;
        Relations: {
            order: {
                Shape: Order;
                Name: "Order";
                Nullable: false;
            };
            item: {
                Shape: Item;
                Name: "Item";
                Nullable: false;
            };
        };
    };
    Payment: {
        Name: "Payment";
        Shape: Payment;
        Include: Prisma.PaymentInclude;
        Select: Prisma.PaymentSelect;
        OrderBy: Prisma.PaymentOrderByWithRelationInput;
        WhereUnique: Prisma.PaymentWhereUniqueInput;
        Where: Prisma.PaymentWhereInput;
        Create: {};
        Update: {};
        RelationName: "order";
        ListRelations: never;
        Relations: {
            order: {
                Shape: Order;
                Name: "Order";
                Nullable: false;
            };
        };
    };
    Maintenance: {
        Name: "Maintenance";
        Shape: Maintenance;
        Include: Prisma.MaintenanceInclude;
        Select: Prisma.MaintenanceSelect;
        OrderBy: Prisma.MaintenanceOrderByWithRelationInput;
        WhereUnique: Prisma.MaintenanceWhereUniqueInput;
        Where: Prisma.MaintenanceWhereInput;
        Create: {};
        Update: {};
        RelationName: "item";
        ListRelations: never;
        Relations: {
            item: {
                Shape: Item;
                Name: "Item";
                Nullable: false;
            };
        };
    };
}
export function getDatamodel(): PothosPrismaDatamodel { return JSON.parse("{\"datamodel\":{\"models\":{\"Customer\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"phone\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"address\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"orders\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CustomerToOrder\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Category\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Product\",\"kind\":\"object\",\"name\":\"products\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CategoryToProduct\",\"relationFromFields\":[],\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Product\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"name\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"categoryId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Category\",\"kind\":\"object\",\"name\":\"category\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CategoryToProduct\",\"relationFromFields\":[\"categoryId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ProductVariant\",\"kind\":\"object\",\"name\":\"variants\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ProductToProductVariant\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"ProductVariant\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"productId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Product\",\"kind\":\"object\",\"name\":\"product\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ProductToProductVariant\",\"relationFromFields\":[\"productId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"size\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"color\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"rentalPrice\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"deposit\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"imageUrl\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"items\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToProductVariant\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"productId\",\"size\",\"color\"]}]},\"Item\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"code\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"variantId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"ProductVariant\",\"kind\":\"object\",\"name\":\"variant\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToProductVariant\",\"relationFromFields\":[\"variantId\"],\"isUpdatedAt\":false},{\"type\":\"ItemStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OrderItem\",\"kind\":\"object\",\"name\":\"orderItems\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToOrderItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Maintenance\",\"kind\":\"object\",\"name\":\"maintenances\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToMaintenance\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Order\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"code\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":true,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"customerId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Customer\",\"kind\":\"object\",\"name\":\"customer\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"CustomerToOrder\",\"relationFromFields\":[\"customerId\"],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"rentalDate\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"returnDate\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"returnedAt\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"eventDate\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"eventType\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"totalAmount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"depositPaid\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"balanceDue\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OrderStatus\",\"kind\":\"enum\",\"name\":\"status\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"PaymentStatus\",\"kind\":\"enum\",\"name\":\"paymentStatus\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"lateFee\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"damageFee\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"OrderItem\",\"kind\":\"object\",\"name\":\"items\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"Payment\",\"kind\":\"object\",\"name\":\"payments\",\"isRequired\":true,\"isList\":true,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderToPayment\",\"relationFromFields\":[],\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"createdAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"updatedAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"OrderItem\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"orderId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"order\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderToOrderItem\",\"relationFromFields\":[\"orderId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"itemId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"item\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToOrderItem\",\"relationFromFields\":[\"itemId\"],\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"rentalPrice\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"deposit\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"damageNote\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Payment\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"orderId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Order\",\"kind\":\"object\",\"name\":\"order\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"OrderToPayment\",\"relationFromFields\":[\"orderId\"],\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"amount\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"method\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"note\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"paidAt\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]},\"Maintenance\":{\"fields\":[{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"id\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":true,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"itemId\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Item\",\"kind\":\"object\",\"name\":\"item\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"relationName\":\"ItemToMaintenance\",\"relationFromFields\":[\"itemId\"],\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"type\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"String\",\"kind\":\"scalar\",\"name\":\"description\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Int\",\"kind\":\"scalar\",\"name\":\"cost\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"startDate\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"DateTime\",\"kind\":\"scalar\",\"name\":\"endDate\",\"isRequired\":false,\"isList\":false,\"hasDefaultValue\":false,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false},{\"type\":\"Boolean\",\"kind\":\"scalar\",\"name\":\"done\",\"isRequired\":true,\"isList\":false,\"hasDefaultValue\":true,\"isUnique\":false,\"isId\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueIndexes\":[]}}}}"); }