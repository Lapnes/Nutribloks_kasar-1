import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FoodItem, RiwayatEntry } from "@/types";
import { FOOD_CATALOG, MACRO_COLORS, MACRO_LABELS } from "@/data/foods";

interface RecommendationsScreenProps {
  history: RiwayatEntry[];
  budget: number;
  onAddToPlate?: (food: FoodItem) => void;
}

export function RecommendationsScreen({
  history,
  budget,
  onAddToPlate,
}: RecommendationsScreenProps) {
  // Analyze eating patterns and generate recommendations
  const generateRecommendations = () => {
    if (history.length === 0) {
      return [
        {
          icon: "🍚",
          title: "Mulai Dengan Karbohidrat",
          desc: "Pilih sumber karbohidrat kompleks seperti nasi merah atau roti gandum untuk energi berkelanjutan",
          type: "info",
        },
        {
          icon: "🍗",
          title: "Tambahkan Protein",
          desc: "Pastikan setiap porsi memiliki protein untuk membangun otot dan menjaga kenyang lebih lama",
          type: "info",
        },
        {
          icon: "🥬",
          title: "Jangan Lupa Sayur",
          desc: "Sayuran memberikan vitamin dan mineral penting untuk kesehatan tubuh Anda",
          type: "info",
        },
      ];
    }

    const recent = history.slice(-7);
    const recommendations = [];

    // Check carb intake
    const carbCount = recent.filter((e) => e.items.some((i) => i.type === "carb")).length;
    if (carbCount < recent.length * 0.7) {
      recommendations.push({
        icon: "🍚",
        title: "Tingkatkan Karbohidrat",
        desc: "Anda jarang mengonsumsi karbohidrat kompleks. Tambahkan nasi, roti, atau ubi jalar ke menu Anda.",
        type: "warning",
      });
    }

    // Check protein intake
    const proteinCount = recent.filter((e) =>
      e.items.some((i) => i.type === "protein")
    ).length;
    if (proteinCount < recent.length * 0.8) {
      recommendations.push({
        icon: "🍗",
        title: "Penuhi Kebutuhan Protein",
        desc: "Tambahkan daging, telur, tahu, atau ikan untuk protein berkualitas tinggi.",
        type: "warning",
      });
    }

    // Check veggie intake
    const veggieCount = recent.filter((e) =>
      e.items.some((i) => i.type === "veggie")
    ).length;
    if (veggieCount < recent.length * 0.6) {
      recommendations.push({
        icon: "🥬",
        title: "Konsumsi Lebih Banyak Sayur",
        desc: "Sayuran segar kaya akan vitamin dan mineral. Usahakan 2-3 porsi per hari.",
        type: "warning",
      });
    }

    // Budget-conscious recommendation
    const avgSpent = recent.reduce((s, e) => s + e.totalPrice, 0) / recent.length;
    if (avgSpent > budget * 0.9) {
      recommendations.push({
        icon: "💰",
        title: "Hemat Anggaran Makanan",
        desc: `Pilih makanan lokal murah: tahu (Rp 2k), tempe (Rp 2k), telur (Rp 1.5k) yang bergizi tinggi.`,
        type: "info",
      });
    }

    // Balanced eating compliment
    const balanced = recent.filter((e) => e.isBalanced).length;
    if (balanced === recent.length) {
      recommendations.push({
        icon: "⭐",
        title: "Hebat! Menu Anda Seimbang",
        desc: "Terus pertahankan pola makan sehat ini untuk kesehatan optimal.",
        type: "success",
      });
    }

    return recommendations;
  };

  const recommendations = generateRecommendations();

  // Get budget-friendly food recommendations
  const getAffordableFoods = () => {
    return FOOD_CATALOG.filter((f) => f.price <= budget && f.price < 5000)
      .sort((a, b) => a.price - b.price)
      .slice(0, 6);
  };

  const affordableFoods = getAffordableFoods();

  // Calculate statistics
  const stats = {
    totalEntries: history.length,
    balancedMeals: history.filter((e) => e.isBalanced).length,
    avgBudget: history.length > 0 ? Math.round(history.reduce((s, e) => s + e.totalPrice, 0) / history.length) : 0,
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Rekomendasi</h1>
        <p className="text-xs text-muted-foreground">Saran menu sehat berbasis AI</p>
      </div>

      {/* Statistics */}
      {history.length > 0 && (
        <div className="px-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Total Menu", value: stats.totalEntries, icon: "📊" },
              {
                label: "Seimbang",
                value: stats.balancedMeals,
                icon: "✅",
              },
              { label: "Rata-rata", value: `Rp${(stats.avgBudget / 1000).toFixed(0)}k`, icon: "💰" },
            ].map(({ label, value, icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-card p-2.5 flex flex-col items-center gap-0.5"
              >
                <span className="text-2xl">{icon}</span>
                <p className="text-lg font-bold text-foreground">{value}</p>
                <p className="text-[9px] text-muted-foreground text-center leading-tight">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Saran untuk Anda
        </p>
        <div className="flex flex-col gap-2">
          {recommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-2xl border p-3.5 ${
                rec.type === "success"
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : rec.type === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                    : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex gap-3">
                <span className="text-2xl leading-none">{rec.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{rec.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Affordable Food Suggestions */}
      {affordableFoods.length > 0 && (
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Makanan Terjangkau
          </p>
          <div className="flex flex-col gap-2">
            {affordableFoods.map((food) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-card p-3 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{food.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {food.name}
                      </p>
                      <div className="flex gap-1 mt-0.5">
                        <Badge
                          variant="secondary"
                          className="text-[8px]"
                          style={{
                            backgroundColor: `${MACRO_COLORS[food.type]}20`,
                            color: MACRO_COLORS[food.type],
                          }}
                        >
                          {MACRO_LABELS[food.type]}
                        </Badge>
                        <span className="text-[9px] text-muted-foreground">
                          {food.calories} kkal
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-foreground">
                    Rp {food.price.toLocaleString("id-ID")}
                  </p>
                  {onAddToPlate && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-[10px] h-5 px-2 mt-1"
                      onClick={() => onAddToPlate(food)}
                    >
                      + Tambah
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="px-4 mt-auto">
        <div className="rounded-2xl border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400">
              Tips Nutrisi
            </p>
          </div>
          <ul className="text-[9px] text-purple-600 dark:text-purple-300 space-y-1.5 leading-relaxed">
            <li>• Makanan lokal sering lebih murah dan fresh</li>
            <li>• Beli di pasar tradisional lebih hemat dari supermarket</li>
            <li>• Telur, tahu, tempe adalah protein murah berkualitas</li>
            <li>• Sayuran hijau gelap paling kaya nutrisi</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
