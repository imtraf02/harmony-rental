export const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function startOfDay(date: Date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(date: Date) {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		23,
		59,
		59,
		999,
	);
}

export function addDays(date: Date, days: number) {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
}

export function formatDateKey(date: Date) {
	return date.toISOString().slice(0, 10);
}

export function calculateRentalDays(rentalDate: Date, returnDate: Date) {
	const rentalStart = startOfDay(rentalDate).getTime();
	const returnStart = startOfDay(returnDate).getTime();
	if (returnStart < rentalStart) {
		throw new Error("Ngày trả phải sau hoặc bằng ngày thuê.");
	}
	const days = Math.ceil((returnStart - rentalStart) / MS_PER_DAY);
	return Math.max(1, days);
}

export function calculateRentalTotalByDays(
	items: { rentalPrice: number }[],
	rentalDate: Date,
	returnDate: Date,
) {
	const rentalDays = calculateRentalDays(rentalDate, returnDate);
	return items.reduce((sum, item) => sum + item.rentalPrice * rentalDays, 0);
}
