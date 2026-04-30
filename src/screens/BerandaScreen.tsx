import { motion } from "framer-motion";
import { Flame, Target, TrendingUp, Award } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MACRO_COLORS, MACRO_LABELS } from "@/data/foods";
import type { RiwayatEntry } from "@/types";

interface BerandaScreenProps {
  history: RiwayatEntry[];
  onGoToNutriLab: () => void;
}

export function BerandaScreen({ history, onGoToNutriLab }: BerandaScreenProps) {
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  const todayEntries = history.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const totalCaloriesToday = todayEntries.reduce(
    (sum, e) => sum + e.items.reduce((s, i) => s + i.calories, 0),
    0
  );
  const streak = Math.min(history.filter((e) => e.isBalanced).length, 7);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground capitalize">{today}</p>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
              Halo, Sobat Sehat! 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Sudah rakit menu sehatmu hari ini?
            </p>
          </div>
        </div>
      </div>

      {/* Hero CTA */}
      <div className="px-4 mb-4">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={onGoToNutriLab}
          className="relative overflow-hidden rounded-3xl cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #fca311 0%, #ef233c 100%)",
          }}
        >
          <div className="p-5">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              NutriLab
            </p>
            <h2 className="text-white text-xl font-extrabold mt-1 leading-tight">
              Rakit Menu Sehatmu Sekarang
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Simulasikan piring ideal dengan anggaran pas
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
              <span className="text-white text-xs font-bold">Mulai Rakit →</span>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 text-8xl opacity-20 select-none">🍽️</div>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="px-4 grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Flame, label: "Kalori Hari Ini", value: `${totalCaloriesToday}`, unit: "kkal", color: "#ef233c" },
          { icon: Target, label: "Sesi Hari Ini", value: `${todayEntries.length}`, unit: "sesi", color: "#fca311" },
          { icon: Award, label: "Streak Sehat", value: `${streak}`, unit: "hari", color: "#2a9d8f" },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <div
            key={label}
            className="rounded-2xl border bg-card p-3 flex flex-col items-center gap-1"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon size={14} style={{ color }} />
            </div>
            <p className="text-lg font-extrabold text-foreground leading-none">{value}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider text-center leading-tight">
              {unit}
            </p>
          </div>
        ))}
      </div>

      {/* Nutrition tips */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Panduan Makronutrien
        </p>
        <div className="flex flex-col gap-2">
          {(["carb", "protein", "veggie", "fat"] as const).map((type) => {
            const targets: Record<string, { pct: number; tip: string }> = {
              carb: { pct: 50, tip: "50% piring = karbohidrat kompleks" },
              protein: { pct: 25, tip: "25% piring = protein hewani/nabati" },
              veggie: { pct: 25, tip: "25% piring = sayur dan buah segar" },
              fat: { pct: 10, tip: "Lemak sehat secukupnya" },
            };
            const { pct, tip } = targets[type];
            return (
              <div key={type} className="flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5">
                <div
                  className="w-3 h-3 rounded-sm shrink-0"
                  style={{ backgroundColor: MACRO_COLORS[type] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">
                      {MACRO_LABELS[type]}
                    </span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-1">{tip}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      {history.length > 0 && (
        <div className="px-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Aktivitas Terbaru
          </p>
          <div className="flex flex-col gap-2">
            {history.slice(-3).reverse().map((entry) => (
              <div key={entry.id} className="rounded-2xl border bg-card px-3 py-2.5 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${entry.isBalanced ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"}`}>
                  {entry.isBalanced ? "✅" : "⚠️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">
                    {entry.items.map((i) => i.name).join(", ")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Rp {entry.totalPrice.toLocaleString("id-ID")} •{" "}
                    {new Date(entry.date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <Badge variant={entry.isBalanced ? "default" : "secondary"} className="text-[9px]">
                  {entry.isBalanced ? "Seimbang" : "Kurang"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length === 0 && (
        <div className="px-4">
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 flex flex-col items-center gap-2">
            <TrendingUp size={28} className="text-muted-foreground" />
            <p className="text-sm font-semibold text-muted-foreground text-center">
              Belum ada aktivitas
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Simpan menu dari NutriLab untuk melihat riwayatmu di sini
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
