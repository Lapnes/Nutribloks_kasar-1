import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FoodItem } from "@/types";
import { MACRO_COLORS, MACRO_LABELS } from "@/data/foods";

interface FoodCardProps {
  food: FoodItem;
  disabled: boolean;
  onDragStart: (food: FoodItem) => void;
  onTap: (food: FoodItem) => void;
}

export function FoodCard({ food, disabled, onDragStart, onTap }: FoodCardProps) {
  const accentColor = MACRO_COLORS[food.type];

  return (
    <motion.div
      className={cn(
        "relative flex-shrink-0 w-28 rounded-2xl border bg-card shadow-sm cursor-grab active:cursor-grabbing select-none overflow-hidden",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
      drag={!disabled}
      dragSnapToOrigin
      dragElastic={0.3}
      whileDrag={{ scale: 1.08, zIndex: 50, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
      whileTap={{ scale: 0.97 }}
      onDragStart={() => !disabled && onDragStart(food)}
      onTap={() => !disabled && onTap(food)}
      style={{ touchAction: "none" }}
    >
      {/* Color accent top bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-2.5 flex flex-col gap-1">
        {/* Emoji */}
        <div className="text-3xl text-center leading-none py-1">{food.emoji}</div>

        {/* Name */}
        <p className="text-xs font-semibold text-center text-foreground leading-tight line-clamp-2">
          {food.name}
        </p>

        {/* Macro badge */}
        <div
          className="mx-auto mt-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white"
          style={{ backgroundColor: accentColor }}
        >
          {MACRO_LABELS[food.type]}
        </div>

        {/* Price */}
        <p className="text-center text-[11px] font-semibold text-muted-foreground mt-0.5">
          Rp {food.price.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Disabled overlay label */}
      {disabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-2xl">
          <span className="text-[9px] font-bold text-muted-foreground rotate-[-15deg] bg-muted px-2 py-0.5 rounded-full">
            Melebihi Anggaran
          </span>
        </div>
      )}
    </motion.div>
  );
}
