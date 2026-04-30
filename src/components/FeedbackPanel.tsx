import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Utensils } from "lucide-react";
import type { PlateItem } from "@/types";

interface FeedbackPanelProps {
  items: PlateItem[];
  totalPrice: number;
  budget: number;
}

type FeedbackState = "empty" | "unbalanced" | "balanced";

function evaluatePlate(items: PlateItem[]): FeedbackState {
  if (items.length === 0) return "empty";
  const types = new Set(items.map((i) => i.type));
  const hasCarb = types.has("carb");
  const hasProtein = types.has("protein");
  const hasVeggie = types.has("veggie");
  if (hasCarb && hasProtein && hasVeggie) return "balanced";
  return "unbalanced";
}

const FEEDBACK_CONFIG = {
  empty: {
    icon: Utensils,
    bg: "bg-muted",
    border: "border-border",
    iconColor: "text-muted-foreground",
    title: "Ayo rakit menu sehatmu hari ini!",
    subtitle: "Seret makanan ke piring untuk memulai.",
  },
  unbalanced: {
    icon: AlertTriangle,
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-500",
    title: "Komposisi belum seimbang",
    subtitle: "Tambahkan protein nabati atau sayur untuk melengkapi gizimu.",
  },
  balanced: {
    icon: CheckCircle2,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    iconColor: "text-emerald-500",
    title: "Hebat! Gizimu sudah seimbang!",
    subtitle: "Komposisi karbohidrat, protein, dan sayur sudah pas di kantong!",
  },
};

export function FeedbackPanel({ items, totalPrice, budget }: FeedbackPanelProps) {
  const state: FeedbackState = evaluatePlate(items);
  const cfg = FEEDBACK_CONFIG[state];
  const Icon = cfg.icon;
  const overBudget = totalPrice > budget;

  return (
    <div className="flex flex-col gap-2">
      {/* Main feedback card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-3 rounded-2xl border p-3.5 ${cfg.bg} ${cfg.border}`}
        >
          <div className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-snug">{cfg.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{cfg.subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Budget over-limit warning */}
      <AnimatePresence>
        {overBudget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2"
          >
            <AlertTriangle size={14} className="text-destructive shrink-0" />
            <p className="text-xs text-destructive font-medium">
              Total melebihi anggaran sebesar Rp {(totalPrice - budget).toLocaleString("id-ID")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Macro composition mini chart */}
      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-card p-3 flex flex-col gap-2"
        >
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Komposisi Gizi
          </p>
          <MacroComposition items={items} />
        </motion.div>
      )}
    </div>
  );
}

function MacroComposition({ items }: { items: PlateItem[] }) {
  const counts = {
    carb: items.filter((i) => i.type === "carb").length,
    protein: items.filter((i) => i.type === "protein").length,
    veggie: items.filter((i) => i.type === "veggie").length,
    fat: items.filter((i) => i.type === "fat").length,
  };
  const total = items.length;

  const bars = [
    { label: "Karbo", count: counts.carb, color: "#fca311" },
    { label: "Protein", count: counts.protein, color: "#ef233c" },
    { label: "Sayur", count: counts.veggie, color: "#2a9d8f" },
    { label: "Lemak", count: counts.fat, color: "#0077b6" },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {bars.map((bar) => (
        <div key={bar.label} className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-12 shrink-0">{bar.label}</span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color }}
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${(bar.count / total) * 100}%` : "0%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-[10px] font-semibold text-foreground w-4 text-right">
            {bar.count}
          </span>
        </div>
      ))}
    </div>
  );
}
