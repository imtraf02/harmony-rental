import { builder } from "./builder";

builder.queryType({});
builder.mutationType({});

import "./modules/category";
import "./modules/product";
import "./modules/item";
import "./modules/customer";
import "./modules/order";
import "./modules/upload";

export const schema = builder.toSchema();
