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
// Right: Carb (large)
// Left-Top: Protein
// Left-Bottom: Veggie/Fat
const COMPARTMENT_ZONES = [
  { name: "carb", label: "Karbohidrat", x: 140, y: 0, w: 140, h: 310 },
  { name: "protein", label: "Protein", x: 0, y: 0, w: 140, h: 155 },
  { name: "veggie", label: "Sayur/Lemak", x: 0, y: 155, w: 140, h: 155 },
  { name: "fat", label: "Sayur/Lemak", x: 0, y: 155, w: 140, h: 155 },
];

export function VirtualPlate({ items, onRemove, isDragOver, onDragOver }: VirtualPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);

  const handlePointerEnter = () => onDragOver(true);
  const handlePointerLeave = () => onDragOver(false);

  // Position items based on their type
  const getItemPositions = (items: PlateItem[]) => {
    const typeCounters: Record<string, number> = {};
    return items.map((item) => {
      const type = item.type === "veggie" || item.type === "fat" ? item.type : (item.type === "protein" ? "protein" : "carb");
      const counter = typeCounters[type] || 0;
      typeCounters[type] = (counter + 1) % 4;

      const zone = COMPARTMENT_ZONES.find((z) => z.name === type) || COMPARTMENT_ZONES[0];
      const col = counter % 2;
      const row = Math.floor(counter / 2);
      const spacing = 55;

      return {
        item,
        left: zone.x + col * spacing + 15,
        top: zone.y + row * spacing + 25,
      };
    });
  };

  const positions = getItemPositions(items);

  return (
    <div className="flex flex-col items-center gap-3">

      {/* Rectangular Plate with Compartments */}
      <motion.div
        ref={plateRef}
        className="relative border-4 rounded-xl overflow-hidden shadow-2xl"
        style={{
          width: 280,
          height: 310,
          backgroundColor: "#18181b", // zinc-900 (lighter dark-gray)
          borderColor: "#f97316" // orange-500
        }}
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
        >
          {/* Vertical divider (center) */}
          <line x1="140" y1="0" x2="140" y2="310" stroke="#f97316" strokeWidth="3" />
          {/* Horizontal divider (left section) */}
          <line x1="0" y1="155" x2="140" y2="155" stroke="#f97316" strokeWidth="3" />
        </svg>

        {/* Compartment Labels */}
        <div className="absolute top-2 right-2 text-[10px] font-bold text-orange-500/50 uppercase">
          Karbohidrat
        </div>
        <div className="absolute top-2 left-2 text-[10px] font-bold text-orange-500/50 uppercase">
          Protein
        </div>
        <div className="absolute bottom-2 left-2 text-[10px] font-bold text-orange-500/50 uppercase">
          Sayur & Lemak
        </div>

        {/* Center emoji when empty */}
        {items.length === 0 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-4xl">🍱</div>
            <p className="text-xs font-medium text-muted-foreground text-center px-4">
              Seret makanan ke dalam Bento
            </p>
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
            className="absolute inset-0 flex items-center justify-center pointer-events-none bg-orange-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

          </motion.div>
        )}
      </motion.div>

    </div>
  );
}
