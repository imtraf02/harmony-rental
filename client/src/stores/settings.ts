import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
	dueSoonDays: number;
	setDueSoonDays: (days: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			dueSoonDays: 3,
			setDueSoonDays: (days: number) => set({ dueSoonDays: days }),
		}),
		{
			name: "harmony-settings",
		},
	),
);
