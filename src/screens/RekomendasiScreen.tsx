import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNutriContext } from "@/context/NutriContext";

interface RekomendasiScreenProps {
  onBack: () => void;
}

const MOCK_RECOMMENDATIONS = [
  {
    title: "Sumber Karbohidrat",
    colorBorder: "border-[#fca311]",
    items: [
      { name: "Nasi Putih", price: 3000, emoji: "🍚" },
      { name: "Mie Goreng", price: 4000, emoji: "🍜" },
      { name: "Kentang Goreng", price: 5000, emoji: "🍟" },
      { name: "Roti Gandum", price: 3000, emoji: "🍞" },
    ],
  },
  {
    title: "Sumber Protein",
    colorBorder: "border-[#ef233c]",
    items: [
      { name: "Tempe Goreng", price: 2000, emoji: "🧆" },
      { name: "Telur Dadar", price: 4000, emoji: "🍳" },
      { name: "Ikan Nila Goreng", price: 7000, emoji: "🐟" },
      { name: "Ayam Bakar", price: 9000, emoji: "🍗" },
      { name: "Udang Goreng", price: 10000, emoji: "🍤" },
    ],
  },
  {
    title: "Sayur & Buah",
    colorBorder: "border-[#2a9d8f]",
    items: [
      { name: "Tumis Kangkung", price: 3000, emoji: "🥬" },
      { name: "Sayur Sop", price: 4000, emoji: "🥣" },
      { name: "Buah Pisang", price: 2000, emoji: "🍌" },
      { name: "Buah Jeruk", price: 3000, emoji: "🍊" },
    ],
  },
  {
    title: "Lemak & Tambahan",
    colorBorder: "border-[#9ca3af]",
    items: [
      { name: "Susu UHT", price: 4000, emoji: "🥛" },
      { name: "Alpukat", price: 5000, emoji: "🥑" },
      { name: "Kerupuk", price: 1000, emoji: "🍘" },
    ],
  },
];

export function RekomendasiScreen({ onBack }: RekomendasiScreenProps) {
  const { profile } = useNutriContext();

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
          <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
            Rekomendasi Menu Pintar
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
      <div className="px-4 mt-6 flex flex-col gap-8">
        {MOCK_RECOMMENDATIONS.map((category, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
          >
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <div className={`w-2 h-4 rounded-full border-l-4 ${category.colorBorder}`} />
              {category.title}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {category.items.map((item, itemIdx) => (
                <motion.div
                  key={itemIdx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-zinc-900 border-t-[3px] ${category.colorBorder} border-x border-b border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-sm cursor-pointer hover:bg-zinc-800 transition-colors duration-200`}
                >
                  <span className="text-4xl filter drop-shadow-md mb-1">{item.emoji}</span>
                  <p className="text-[11px] font-semibold text-white text-center leading-tight">
                    {item.name}
                  </p>
                  <p className="text-xs font-black text-orange-500">
                    Rp {item.price.toLocaleString("id-ID")}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
