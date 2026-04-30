export type MacroType = "carb" | "protein" | "fat" | "veggie";

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  type: MacroType;
  emoji: string;
  calories: number;
  description: string;
}

export interface PlateItem extends FoodItem {
  instanceId: string;
}

export type ActiveTab = "beranda" | "scan" | "nutrilab" | "riwayat" | "profil" | "rekomendasi" | "pengaturan";

export interface RiwayatEntry {
  id: string;
  date: string;
  items: PlateItem[];
  totalPrice: number;
  isBalanced: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  dailyBudget: number;
  targetCalories: number;
}
