import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MacroBlock } from "@/components/MacroBlock";
import type { FoodItem, PlateItem } from "@/types";

interface VirtualPlateProps {
  items: PlateItem[];
  onDrop: (food: FoodItem, position: { x: number; y: number }) => void;
  onRemove: (instanceId: string) => void;
  isDragOver: boolean;
  onDragOver: (over: boolean) => void;
}

// Rectangular plate compartments (3 zones)
const COMPARTMENT_ZONES = [
  { name: "carb", label: "Karbohidrat", x: 0, y: 0, w: 140, h: 160 },
  { name: "protein", label: "Protein", x: 150, y: 0, w: 130, h: 160 },
  { name: "veggie", label: "Sayur", x: 0, y: 170, w: 140, h: 140 },
  { name: "fat", label: "Lemak", x: 150, y: 170, w: 130, h: 140 },
];

export function VirtualPlate({ items, onRemove, isDragOver, onDragOver }: VirtualPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);

  const handlePointerEnter = () => onDragOver(true);
  const handlePointerLeave = () => onDragOver(false);

  // Position items based on their type
  const getItemPositions = (items: PlateItem[]) => {
    const typeCounters: Record<string, number> = {};
    return items.map((item) => {
      const type = item.type === "veggie" ? "veggie" : item.type === "fat" ? "fat" : item.type === "protein" ? "protein" : "carb";
      const counter = typeCounters[type] || 0;
      typeCounters[type] = (counter + 1) % 4;

      const zone = COMPARTMENT_ZONES.find((z) => z.name === type) || COMPARTMENT_ZONES[0];
      const col = counter % 2;
      const row = Math.floor(counter / 2);
      const spacing = 65;

      return {
        item,
        left: zone.x + col * spacing + 10,
        top: zone.y + row * spacing + 15,
      };
    });
  };

  const positions = getItemPositions(items);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
        Piring Nutrisi Seimbang
      </p>

      {/* Rectangular Plate with Compartments */}
      <motion.div
        ref={plateRef}
        className="relative border-4 border-gray-400 rounded-lg"
        style={{ width: 280, height: 310, backgroundColor: "#f5f5dc" }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        animate={isDragOver ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Dividing lines for compartments */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="280"
          height="310"
          style={{ borderRadius: "0.5rem" }}
        >
          {/* Vertical divider */}
          <line x1="140" y1="0" x2="140" y2="310" stroke="#ccc" strokeWidth="2" />
          {/* Horizontal divider (top) */}
          <line x1="0" y1="160" x2="280" y2="160" stroke="#ccc" strokeWidth="2" />
          {/* Horizontal divider (bottom section) */}
          <line x1="0" y1="170" x2="280" y2="170" stroke="#ccc" strokeWidth="2" />
        </svg>

        {/* Compartment Labels */}
        <div className="absolute top-1 left-2 text-[9px] font-bold text-gray-500">
          Karbo
        </div>
        <div className="absolute top-1 right-2 text-[9px] font-bold text-gray-500">
          Protein
        </div>
        <div className="absolute bottom-44 left-2 text-[9px] font-bold text-gray-500">
          Sayur
        </div>
        <div className="absolute bottom-44 right-2 text-[9px] font-bold text-gray-500">
          Lemak
        </div>

        {/* Center emoji when empty */}
        {items.length === 0 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-4xl">🍽️</div>
            <p className="text-[9px] text-muted-foreground text-center">Seret makanan</p>
          </motion.div>
        )}

        {/* Macro blocks positioned in compartments */}
        <AnimatePresence>
          {positions.map(({ item, left, top }) => (
            <MacroBlock
              key={item.instanceId}
              item={item}
              onRemove={onRemove}
              style={{
                left,
                top,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Drop indicator */}
        {isDragOver && (
          <motion.div
            className="absolute inset-0 rounded-md flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-[#fca311]/10 rounded-lg w-14 h-14 flex items-center justify-center border-2 border-[#fca311] border-dashed">
              <span className="text-2xl">+</span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Info text */}
      <p className="text-[9px] text-muted-foreground text-center px-4 leading-tight">
        Isi setiap bagian untuk piring yang seimbang
      </p>
    </div>
  );
}
