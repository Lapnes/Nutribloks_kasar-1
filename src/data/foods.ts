import type { FoodItem } from "@/types";

export const FOOD_CATALOG: FoodItem[] = [
  {
    id: "nasi-putih",
    name: "Nasi Putih",
    price: 3000,
    type: "carb",
    emoji: "🍚",
    calories: 130,
    description: "Sumber karbohidrat utama",
  },
  {
    id: "tempe-goreng",
    name: "Tempe Goreng",
    price: 2000,
    type: "protein",
    emoji: "🟫",
    calories: 160,
    description: "Protein nabati kaya serat",
  },
  {
    id: "ayam-bakar",
    name: "Ayam Bakar",
    price: 10000,
    type: "protein",
    emoji: "🍗",
    calories: 220,
    description: "Protein hewani pilihan",
  },
  {
    id: "tumis-kangkung",
    name: "Tumis Kangkung",
    price: 4000,
    type: "veggie",
    emoji: "🥬",
    calories: 40,
    description: "Sayur hijau kaya vitamin",
  },
  {
    id: "tahu-goreng",
    name: "Tahu Goreng",
    price: 1500,
    type: "protein",
    emoji: "🟡",
    calories: 80,
    description: "Protein nabati ringan",
  },
  {
    id: "mie-goreng",
    name: "Mie Goreng",
    price: 5000,
    type: "carb",
    emoji: "🍜",
    calories: 350,
    description: "Karbohidrat siap saji",
  },
  {
    id: "alpukat",
    name: "Alpukat",
    price: 4000,
    type: "fat",
    emoji: "🥑",
    calories: 160,
    description: "Lemak sehat omega",
  },
];

export const MACRO_COLORS: Record<string, string> = {
  carb: "#fca311",
  protein: "#ef233c",
  fat: "#0077b6",
  veggie: "#2a9d8f",
};

export const MACRO_LABELS: Record<string, string> = {
  carb: "Karbohidrat",
  protein: "Protein",
  fat: "Lemak",
  veggie: "Sayur",
};

export const MACRO_SIZES: Record<string, string> = {
  carb: "w-14 h-14",
  protein: "w-11 h-11",
  fat: "w-9 h-9",
  veggie: "w-10 h-10",
};
