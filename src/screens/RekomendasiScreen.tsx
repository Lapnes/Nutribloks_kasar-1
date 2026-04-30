import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNutriContext } from "@/context/NutriContext";
import type { PlateItem } from "@/types";

interface RekomendasiScreenProps {
  onBack: () => void;
  onUseMenu: (items: PlateItem[]) => void;
}

const MOCK_MEAL_SETS = [
  {
    id: "set-1",
    title: "Paket Hemat Berserat",
    price: 8000,
    alasan: "Riwayat mingguanmu menunjukkan asupan lemak jenuh tinggi. Paket ini rendah lemak dan ramah di kantong.",
    items: [
      { name: "Nasi Putih", price: 3000, emoji: "🍚", type: "carb", calories: 200, description: "Sumber energi utama" },
      { name: "Tempe Goreng", price: 2000, emoji: "🧆", type: "protein", calories: 150, description: "Protein nabati murah" },
      { name: "Tumis Kangkung", price: 3000, emoji: "🥬", type: "veggie", calories: 50, description: "Sayuran hijau segar" },
    ],
  },
  {
    id: "set-2",
    title: "Paket Recovery Otot",
    price: 18000,
    alasan: "Kemarin kamu defisit protein. Kombinasi ayam dan telur ini akan memenuhi blok protein merahmu secara optimal.",
    items: [
      { name: "Nasi Putih", price: 3000, emoji: "🍚", type: "carb", calories: 200, description: "Sumber energi utama" },
      { name: "Ayam Bakar", price: 9000, emoji: "🍗", type: "protein", calories: 250, description: "Tinggi protein" },
      { name: "Telur Dadar", price: 4000, emoji: "🍳", type: "protein", calories: 90, description: "Protein mudah cerna" },
      { name: "Buah Pisang", price: 2000, emoji: "🍌", type: "veggie", calories: 105, description: "Karbohidrat cepat" },
    ],
  },
];

export function RekomendasiScreen({ onBack, onUseMenu }: RekomendasiScreenProps) {
  const { profile } = useNutriContext();

  const handleUseMenu = (items: any[]) => {
    // Convert to PlateItem by adding a unique instanceId
    const plateItems: PlateItem[] = items.map((item) => ({
      id: `${item.name.toLowerCase().replace(/ /g, "-")}`,
      name: item.name,
      price: item.price,
      type: item.type,
      emoji: item.emoji,
      calories: item.calories,
      description: item.description,
      instanceId: `rekomendasi-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    }));
    onUseMenu(plateItems);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-8 bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 shrink-0 h-10 w-10"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight flex items-center gap-2">
            Rekomendasi AI <Sparkles size={18} className="text-orange-500" />
          </h1>
        </div>
        <div className="bg-zinc-900/80 rounded-xl p-3 border border-orange-500/20 shadow-sm flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Batas Anggaran Harianmu:
          </p>
          <p className="text-sm font-black text-orange-500">
            Rp {profile.dailyBudget.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-6 flex flex-col gap-5">
        {MOCK_MEAL_SETS.map((set, idx) => (
          <motion.div
            key={set.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.4 }}
            className="bg-zinc-900 border border-white/10 rounded-3xl p-5 flex flex-col gap-4 shadow-md"
          >
            {/* Title & Price */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-extrabold text-white leading-tight">
                {set.title}
              </h2>
              <div className="bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30 shrink-0">
                <span className="text-orange-500 font-bold text-sm">
                  Rp {set.price.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Items Included (Chips) */}
            <div className="flex flex-wrap gap-2">
              {set.items.map((item, i) => (
                <div
                  key={i}
                  className="bg-zinc-800 border border-white/5 rounded-full px-3 py-1.5 flex items-center gap-1.5"
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-xs font-semibold text-zinc-200">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* AI Reasoning */}
            <div className="bg-orange-950/30 border border-orange-500/20 rounded-xl p-3 flex gap-3 mt-1">
              <div className="mt-0.5 text-orange-400 shrink-0">
                <Info size={16} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-orange-400 mb-0.5 uppercase tracking-wide">
                  Alasan AI
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {set.alasan}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => handleUseMenu(set.items)}
              className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl h-12 shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
            >
              Gunakan Menu Ini
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
