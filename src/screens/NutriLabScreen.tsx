import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Save, Wallet } from "lucide-react";
import { VirtualPlate } from "@/components/VirtualPlate";
import { FoodCard } from "@/components/FoodCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { FOOD_CATALOG } from "@/data/foods";
import type { FoodItem, PlateItem, RiwayatEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface NutriLabScreenProps {
  preloadedItems?: PlateItem[];
  onSaveToHistory?: (entry: RiwayatEntry) => void;
}

export function NutriLabScreen({ preloadedItems = [], onSaveToHistory }: NutriLabScreenProps) {
  const [budget, setBudget] = useState(15000);
  const [budgetInput, setBudgetInput] = useState("15000");
  const [plateItems, setPlateItems] = useState<PlateItem[]>(preloadedItems);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCandidate, setDragCandidate] = useState<FoodItem | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const plateRef = useRef<HTMLDivElement>(null);

  const totalPrice = plateItems.reduce((sum, i) => sum + i.price, 0);

  const handleDragStart = useCallback((food: FoodItem) => {
    setDragCandidate(food);
  }, []);

  const handleDrop = useCallback(
    (food: FoodItem) => {
      if (totalPrice + food.price > budget + 1) return;
      const instance: PlateItem = {
        ...food,
        instanceId: `${food.id}-${Date.now()}-${Math.random()}`,
      };
      setPlateItems((prev) => [...prev, instance]);
      setIsDragOver(false);
      setDragCandidate(null);
    },
    [totalPrice, budget]
  );

  // Tap-to-add (mobile friendly alternative to drag)
  const handleTap = useCallback(
    (food: FoodItem) => {
      if (totalPrice + food.price > budget) return;
      const instance: PlateItem = {
        ...food,
        instanceId: `${food.id}-${Date.now()}-${Math.random()}`,
      };
      setPlateItems((prev) => [...prev, instance]);
    },
    [totalPrice, budget]
  );

  const handleRemove = useCallback((instanceId: string) => {
    setPlateItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
  }, []);

  const handleReset = () => {
    setPlateItems([]);
    setIsDragOver(false);
  };

  const handleBudgetChange = (val: string) => {
    setBudgetInput(val);
    const num = parseInt(val.replace(/\D/g, ""), 10);
    if (!isNaN(num)) setBudget(num);
  };

  const handleSave = () => {
    if (!onSaveToHistory || plateItems.length === 0) return;
    const types = new Set(plateItems.map((i) => i.type));
    const entry: RiwayatEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      items: plateItems,
      totalPrice,
      isBalanced: types.has("carb") && types.has("protein") && types.has("veggie"),
    };
    onSaveToHistory(entry);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  // Handle pointer up on plate div to detect drop
  const handlePlatePointerUp = useCallback(() => {
    if (dragCandidate && isDragOver) {
      handleDrop(dragCandidate);
    }
  }, [dragCandidate, isDragOver, handleDrop]);

  const isOverBudget = (food: FoodItem) => totalPrice + food.price > budget;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">NutriLab</h1>
          <p className="text-xs text-muted-foreground">Rakit menu sehat sesuai anggaran</p>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
          {plateItems.length} item
        </Badge>
      </div>

      {/* Budget section */}
      <div className="px-4 mb-3">
        <div className="rounded-2xl border bg-card p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fca311]/15 flex items-center justify-center shrink-0">
            <Wallet size={18} className="text-[#fca311]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
              Batas Anggaran
            </p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-muted-foreground">Rp</span>
              <Input
                type="number"
                value={budgetInput}
                onChange={(e) => handleBudgetChange(e.target.value)}
                className="h-7 text-sm font-bold border-0 shadow-none p-0 focus-visible:ring-0 bg-transparent w-24"
                inputMode="numeric"
              />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">
              Total Harga
            </p>
            <motion.p
              key={totalPrice}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-sm font-bold ${
                totalPrice > budget ? "text-destructive" : "text-foreground"
              }`}
            >
              Rp {totalPrice.toLocaleString("id-ID")}
            </motion.p>
            {/* Budget bar */}
            <div className="mt-1 w-20 h-1 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: totalPrice > budget ? "#ef233c" : "#fca311",
                }}
                animate={{ width: `${Math.min((totalPrice / budget) * 100, 100)}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Virtual plate */}
      <div
        ref={plateRef}
        className="flex justify-center px-4"
        onPointerUp={handlePlatePointerUp}
      >
        <VirtualPlate
          items={plateItems}
          onDrop={handleDrop}
          onRemove={handleRemove}
          isDragOver={isDragOver}
          onDragOver={setIsDragOver}
        />
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl gap-1.5"
          onClick={handleReset}
          disabled={plateItems.length === 0}
        >
          <RotateCcw size={14} />
          Reset
        </Button>
        <Button
          size="sm"
          className="flex-1 rounded-xl gap-1.5 relative"
          onClick={handleSave}
          disabled={plateItems.length === 0}
          style={{ backgroundColor: "#fca311", color: "#fff" }}
        >
          <Save size={14} />
          Simpan ke Riwayat
          <AnimatePresence>
            {savedNotice && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap"
              >
                Tersimpan!
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Feedback panel */}
      <div className="px-4 mt-3">
        <FeedbackPanel items={plateItems} totalPrice={totalPrice} budget={budget} />
      </div>

      {/* Food catalog */}
      <div className="mt-4">
        <div className="px-4 mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Katalog Makanan
          </p>
          <p className="text-[10px] text-muted-foreground">Ketuk untuk tambah ke piring</p>
        </div>
        <div className="pl-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
          {FOOD_CATALOG.map((food) => (
            <div key={food.id} style={{ scrollSnapAlign: "start" }}>
              <FoodCard
                food={food}
                disabled={isOverBudget(food)}
                onDragStart={handleDragStart}
                onTap={handleTap}
              />
            </div>
          ))}
          <div className="w-4 shrink-0" />
        </div>
      </div>
    </div>
  );
}
