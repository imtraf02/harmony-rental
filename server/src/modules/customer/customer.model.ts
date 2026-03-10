import { z } from "zod";
import { builder } from "../../builder";

const phoneRegex = /^(0|\+84)[0-9]{8,12}$/;

export const Customer = builder.prismaObject("Customer", {
	fields: (t) => ({
		id: t.exposeID("id"),
		name: t.exposeString("name"),
		phone: t.exposeString("phone"),
		address: t.exposeString("address"),
		note: t.exposeString("note"),
		orders: t.relation("orders"),
		createdAt: t.expose("createdAt", { type: "DateTime" }),
	}),
});

export const CreateCustomerInput = builder.inputType("CreateCustomerInput", {
	fields: (t) => ({
		name: t.string({
			required: true,
			validate: z.string().min(1, "Tên khách hàng không được để trống").max(100, "Tên tối đa 100 ký tự"),
		}),
		phone: t.string({
			required: true,
			validate: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ (VD: 0901234567)"),
		}),
		address: t.string({
			validate: z.string().max(300, "Địa chỉ tối đa 300 ký tự"),
		}),
		note: t.string({
			validate: z.string().max(500, "Ghi chú tối đa 500 ký tự"),
		}),
	}),
});

export const UpdateCustomerInput = builder.inputType("UpdateCustomerInput", {
	fields: (t) => ({
		name: t.string({
			validate: z.string().min(1, "Tên khách hàng không được để trống").max(100, "Tên tối đa 100 ký tự"),
		}),
		phone: t.string({
			validate: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ"),
		}),
		address: t.string({
			validate: z.string().max(300, "Địa chỉ tối đa 300 ký tự"),
		}),
		note: t.string({
			validate: z.string().max(500, "Ghi chú tối đa 500 ký tự"),
		}),
	}),
});
