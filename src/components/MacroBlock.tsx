import { motion } from "framer-motion";
import { X } from "lucide-react";
import { MACRO_COLORS } from "@/data/foods";
import type { PlateItem } from "@/types";

interface MacroBlockProps {
  item: PlateItem;
  onRemove: (instanceId: string) => void;
  style?: React.CSSProperties;
}

const BLOCK_DIMS: Record<string, { w: number; h: number; r: number }> = {
  carb: { w: 60, h: 60, r: 12 },
  protein: { w: 46, h: 46, r: 10 },
  fat: { w: 38, h: 38, r: 9 },
  veggie: { w: 42, h: 42, r: 10 },
};

export function MacroBlock({ item, onRemove, style }: MacroBlockProps) {
  const color = MACRO_COLORS[item.type];
  const dims = BLOCK_DIMS[item.type];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -15, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      exit={{ scale: 0, rotate: 15, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className="absolute group"
      style={{ ...style, width: dims.w, height: dims.h }}
    >
      <div
        className="w-full h-full flex items-center justify-center text-white text-sm font-bold shadow-md relative"
        style={{
          backgroundColor: color,
          borderRadius: dims.r,
          boxShadow: `0 4px 12px ${color}55`,
        }}
      >
        <span className="text-xs leading-none opacity-90">{item.emoji}</span>

        {/* Remove button */}
        <motion.button
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.instanceId);
          }}
        >
          <X size={9} />
        </motion.button>
      </div>
    </motion.div>
  );
}
