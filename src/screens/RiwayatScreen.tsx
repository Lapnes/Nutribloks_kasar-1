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
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            onClick={onClear}
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>

      {/* Summary stats */}
      {history.length > 0 && (
        <div className="px-4 mb-4">
          <div className="rounded-3xl overflow-hidden border border-orange-500/20"
            style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}
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
                  <p className="text-white/80 text-[10px] mt-1 leading-tight">{label}</p>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-white/90 text-[10px] font-medium">Tingkat Keseimbangan</p>
                <p className="text-white text-[10px] font-bold">
                  {history.length > 0 ? Math.round((balanced / history.length) * 100) : 0}%
                </p>
              </div>
              <div className="h-2 rounded-full bg-black/20">
                <motion.div
                  className="h-full rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
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
      <div className="px-4 flex flex-col gap-3">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 py-16"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                <Calendar size={28} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-white">Belum ada riwayat</p>
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
      className="rounded-2xl border border-white/5 bg-zinc-900 overflow-hidden shadow-lg"
    >
      {/* Top stripe */}
      <div
        className="h-1.5"
        style={{ backgroundColor: entry.isBalanced ? "#10b981" : "#eab308" }}
      />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                entry.isBalanced
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-yellow-500/10 border-yellow-500/20"
              }`}
            >
              {entry.isBalanced ? (
                <CheckCircle2 size={20} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={20} className="text-yellow-500" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white">
              Rp {entry.totalPrice.toLocaleString("id-ID")}
            </p>
            <Badge
              variant="secondary"
              className={`text-[9px] mt-1 text-white border-none ${entry.isBalanced ? "bg-emerald-500 hover:bg-emerald-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
            >
              {entry.isBalanced ? "Seimbang" : "Kurang Seimbang"}
            </Badge>
          </div>
        </div>

        {/* Food items */}
        <p className="text-xs font-medium text-white mb-3 line-clamp-2">
          {entry.items.map((i) => i.name).join(" • ")}
        </p>

        {/* Macro dots */}
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.entries(typeCounts).map(([type, count]) => (
            <div
              key={type}
              className="flex items-center gap-1.5 rounded-full px-2 py-1 bg-black/40 border border-white/5"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: MACRO_COLORS[type] }}
              />
              <span className="text-[10px] font-bold text-white/90">
                {MACRO_LABELS[type]} ×{count}
              </span>
            </div>
          ))}
        </div>

        {/* Calorie bar */}
        <div className="mt-2 bg-black/20 rounded-xl p-2 border border-white/5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Total Kalori</span>
            <span className="text-xs font-bold text-white">
              {entry.items.reduce((s, i) => s + i.calories, 0)} <span className="text-[10px] text-muted-foreground font-medium">kkal</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: entry.isBalanced ? "#10b981" : "#eab308" }}
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
