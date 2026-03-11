import { format } from "date-fns";
import { vi } from "date-fns/locale";

/**
 * Formats a number as VND currency.
 * @param value The amount to format.
 * @returns A formatted string like "100.000 ₫".
 */
export const formatVnd = (value: number) => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
		maximumFractionDigits: 0,
	}).format(value);
};

/**
 * Formats a date string or object to a standard Vietnamese date format (dd/MM/yyyy).
 * @param date The date to format.
 * @returns A formatted date string.
 */
export const formatDate = (date: string | Date | null | undefined) => {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "dd/MM/yyyy", { locale: vi });
};

/**
 * Formats a date string or object to a short Vietnamese date format (dd/MM).
 * @param date The date to format.
 * @returns A formatted short date string.
 */
export const formatShortDate = (date: string | Date | null | undefined) => {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "dd/MM", { locale: vi });
};

/**
 * Formats a date string or object to include Time (dd/MM/yyyy HH:mm).
 * @param date The date to format.
 * @returns A formatted date-time string.
 */
export const formatDateTime = (date: string | Date | null | undefined) => {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	return format(d, "dd/MM/yyyy HH:mm", { locale: vi });
};
