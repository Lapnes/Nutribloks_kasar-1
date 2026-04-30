import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Calendar, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MACRO_COLORS, MACRO_LABELS } from "@/data/foods";
import type { RiwayatEntry } from "@/types";

interface RiwayatScreenProps {
  history: RiwayatEntry[];
  onClear: () => void;
}

export function RiwayatScreen({ history, onClear }: RiwayatScreenProps) {
  const balanced = history.filter((e) => e.isBalanced).length;
  const totalSpent = history.reduce((s, e) => s + e.totalPrice, 0);
  const avgPrice = history.length > 0 ? Math.round(totalSpent / history.length) : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Riwayat Makan</h1>
          <p className="text-xs text-muted-foreground">Pantau perkembangan gizi harianmu</p>
        </div>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={onClear}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      {/* Summary stats */}
      {history.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #0077b6 0%, #2a9d8f 100%)" }}
          >
            <div className="p-4 grid grid-cols-3 gap-2">
              {[
                { label: "Total Sesi", value: history.length, unit: "x" },
                { label: "Menu Seimbang", value: balanced, unit: "x" },
                { label: "Rata-rata Biaya", value: `Rp ${(avgPrice / 1000).toFixed(1)}k`, unit: "" },
              ].map(({ label, value, unit }) => (
                <div key={label} className="text-center">
                  <p className="text-white text-xl font-extrabold leading-none">
                    {value}{unit}
                  </p>
                  <p className="text-white/70 text-[10px] mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/80 text-[10px]">Tingkat Keseimbangan</p>
                <p className="text-white text-[10px] font-bold">
                  {history.length > 0 ? Math.round((balanced / history.length) * 100) : 0}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-white/20">
                <motion.div
                  className="h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: history.length > 0 ? `${(balanced / history.length) * 100}%` : "0%" }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History list */}
      <div className="px-4 flex flex-col gap-2">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
                <Calendar size={28} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">Belum ada riwayat</p>
              <p className="text-xs text-muted-foreground text-center px-8">
                Simpan menu dari NutriLab untuk mulai melacak asupan gizimu
              </p>
            </motion.div>
          ) : (
            [...history].reverse().map((entry, i) => (
              <HistoryCard key={entry.id} entry={entry} index={i} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HistoryCard({ entry, index }: { entry: RiwayatEntry; index: number }) {
  const date = new Date(entry.date);
  const typeCounts = entry.items.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl border bg-card overflow-hidden"
    >
      {/* Top stripe */}
      <div
        className="h-1"
        style={{ backgroundColor: entry.isBalanced ? "#2a9d8f" : "#fca311" }}
      />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                entry.isBalanced
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-yellow-100 dark:bg-yellow-900/30"
              }`}
            >
              {entry.isBalanced ? (
                <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle size={14} className="text-yellow-600 dark:text-yellow-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                {date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">
              Rp {entry.totalPrice.toLocaleString("id-ID")}
            </p>
            <Badge
              variant={entry.isBalanced ? "default" : "secondary"}
              className="text-[9px] mt-0.5"
              style={entry.isBalanced ? { backgroundColor: "#2a9d8f" } : {}}
            >
              {entry.isBalanced ? "Seimbang" : "Kurang Seimbang"}
            </Badge>
          </div>
        </div>

        {/* Food items */}
        <p className="text-xs text-muted-foreground mb-2 truncate">
          {entry.items.map((i) => i.name).join(" • ")}
        </p>

        {/* Macro dots */}
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div
              key={type}
              className="flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{ backgroundColor: `${MACRO_COLORS[type]}20` }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: MACRO_COLORS[type] }}
              />
              <span
                className="text-[9px] font-semibold"
                style={{ color: MACRO_COLORS[type] }}
              >
                {MACRO_LABELS[type]} ×{count}
              </span>
            </div>
          ))}
        </div>

        {/* Calorie bar */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[9px] text-muted-foreground">Kalori</span>
            <span className="text-[9px] font-semibold text-foreground">
              {entry.items.reduce((s, i) => s + i.calories, 0)} kkal
            </span>
          </div>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: entry.isBalanced ? "#2a9d8f" : "#fca311" }}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((entry.items.reduce((s, i) => s + i.calories, 0) / 800) * 100, 100)}%`,
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
