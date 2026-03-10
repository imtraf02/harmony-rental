export type PaymentMethodOption = {
	label: string;
	value: string;
};

export const paymentMethodItems: PaymentMethodOption[] = [
	{ label: "Tiền mặt", value: "CASH" },
	{ label: "Chuyển khoản ngân hàng", value: "BANK_TRANSFER" },
	{ label: "Thẻ", value: "CARD" },
	{ label: "Ví điện tử", value: "E_WALLET" },
];

export const paymentMethodLabelMap = paymentMethodItems.reduce<
	Record<string, string>
>((acc, item) => {
	acc[item.value] = item.label;
	return acc;
}, {});
