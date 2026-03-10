import {
	type Icon,
	IconCrown,
	IconDiamond,
	IconFlower,
	IconHanger,
	IconHeart,
	IconMars,
	IconMoodHappy,
	IconShirt,
	IconShoe,
	IconSparkles,
	IconTie,
	IconVenus,
} from "@tabler/icons-react";

// Trying to pick icons that are likely available and fitting
const ICON_MAPPING: { keywords: string[]; icon: Icon }[] = [
	{
		keywords: ["vest", "suit", "com-le", "jacket", "áo khoác"],
		icon: IconShirt, // standard
	},
	{
		keywords: [
			"váy",
			"đầm",
			"cô dâu",
			"vay",
			"dam",
			"wedding dress",
			"soiree",
			"soiré",
		],
		icon: IconHeart, // Heart is very "wedding", IconWoman or a dress icon would be better if available
	},
	{
		keywords: ["áo dài", "ao dai", "khăn đóng", "truyền thống"],
		icon: IconMoodHappy,
	},
	{
		keywords: ["phụ kiện", "phu kien", "trâm", "cài tóc", "voan", "lúp"],
		icon: IconSparkles,
	},
	{
		keywords: [
			"trang sức",
			"trang suc",
			"nhẫn",
			"dây chuyền",
			"bông tai",
			"kim cương",
		],
		icon: IconDiamond,
	},
	{
		keywords: ["giày", "giay", "cao gót", "shoes", "sandal"],
		icon: IconShoe,
	},
	{
		keywords: ["cà vạt", "caravat", "ca vat", "tie", "nơ", "bow-tie"],
		icon: IconTie,
	},
	{
		keywords: ["vương miện", "vuong mien", "crown", "tiara"],
		icon: IconCrown,
	},
	{
		keywords: ["hoa", "cưới", "flower", "bouquet"],
		icon: IconFlower,
	},
	{
		keywords: ["nam", "man", "chú rể", "chu re"],
		icon: IconMars,
	},
	{
		keywords: ["nữ", "woman", "girl"],
		icon: IconVenus,
	},
];

export function getCategoryIcon(name: string = ""): Icon {
	const normalized = name.toLowerCase();

	const found = ICON_MAPPING.find((m) =>
		m.keywords.some((keyword) => normalized.includes(keyword)),
	);

	return found?.icon || IconHanger;
}
