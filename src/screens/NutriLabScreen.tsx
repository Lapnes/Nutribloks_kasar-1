import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Save, Wallet } from "lucide-react";
import { VirtualPlate } from "@/components/VirtualPlate";
import { FoodCard } from "@/components/FoodCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { FOOD_CATALOG } from "@/data/foods";
import type { FoodItem, PlateItem, RiwayatEntry } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNutriContext } from "@/context/NutriContext";

interface NutriLabScreenProps {
  preloadedItems?: PlateItem[];
  onSaveToHistory?: (entry: RiwayatEntry) => void;
}

export function NutriLabScreen({ preloadedItems = [], onSaveToHistory }: NutriLabScreenProps) {
  const { remainingBudget, addIntake } = useNutriContext();
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
      if (totalPrice + food.price > remainingBudget + 1) return;
      const instance: PlateItem = {
        ...food,
        instanceId: `${food.id}-${Date.now()}-${Math.random()}`,
      };
      setPlateItems((prev) => [...prev, instance]);
      setIsDragOver(false);
      setDragCandidate(null);
    },
    [totalPrice, remainingBudget]
  );

  // Tap-to-add (mobile friendly alternative to drag)
  const handleTap = useCallback(
    (food: FoodItem) => {
      if (totalPrice + food.price > remainingBudget) return;
      const instance: PlateItem = {
        ...food,
        instanceId: `${food.id}-${Date.now()}-${Math.random()}`,
      };
      setPlateItems((prev) => [...prev, instance]);
    },
    [totalPrice, remainingBudget]
  );

  const handleRemove = useCallback((instanceId: string) => {
    setPlateItems((prev) => prev.filter((i) => i.instanceId !== instanceId));
  }, []);

  const handleReset = () => {
    setPlateItems([]);
    setIsDragOver(false);
  };

  const handleSave = () => {
    if (!onSaveToHistory || plateItems.length === 0) return;
    const types = new Set(plateItems.map((i) => i.type));
    
    // Add nutrients to todayIntake
    const plateCarbs = plateItems.filter(i => i.type === "carb").reduce((sum, i) => sum + i.calories / 4, 0); // rough conversion
    const plateProtein = plateItems.filter(i => i.type === "protein").reduce((sum, i) => sum + i.calories / 4, 0);
    const plateFat = plateItems.filter(i => i.type === "fat").reduce((sum, i) => sum + i.calories / 9, 0);
    const plateCalories = plateItems.reduce((sum, i) => sum + i.calories, 0);

    const intake = {
      carbs: plateCarbs,
      protein: plateProtein,
      fat: plateFat,
      calories: plateCalories,
    };

    const entry: RiwayatEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toISOString(),
      items: plateItems,
      totalPrice,
      isBalanced: types.has("carb") && types.has("protein") && (types.has("veggie") || types.has("fat")),
      intake: intake,
    };
    
    addIntake(intake);
    onSaveToHistory(entry);
    setSavedNotice(true);
    
    setTimeout(() => {
      setSavedNotice(false);
      setPlateItems([]);
    }, 2000);
  };

  // Handle pointer up on plate div to detect drop
  const handlePlatePointerUp = useCallback(() => {
    if (dragCandidate && isDragOver) {
      handleDrop(dragCandidate);
    }
  }, [dragCandidate, isDragOver, handleDrop]);

  const isOverBudget = (food: FoodItem) => totalPrice + food.price > remainingBudget;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">NutriLab</h1>
          <p className="text-xs text-muted-foreground">Rakit menu sehat sesuai anggaran</p>
        </div>
        <Badge variant="secondary" className="text-xs font-semibold px-2 py-1 bg-zinc-800 text-white border border-white/10">
          {plateItems.length} item
        </Badge>
      </div>

      {/* Budget section */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl border border-white/5 bg-zinc-900 p-4 flex items-center gap-4 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0 border border-orange-500/20">
            <Wallet size={20} className="text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
              Sisa Anggaran Hari Ini
            </p>
            <p className="text-sm font-bold text-emerald-400">
              Rp {remainingBudget.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">
              Total Harga Menu
            </p>
            <motion.p
              key={totalPrice}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className={`text-base font-black ${
                totalPrice > remainingBudget ? "text-red-500" : "text-white"
              }`}
            >
              Rp {totalPrice.toLocaleString("id-ID")}
            </motion.p>
            {/* Budget bar */}
            <div className="mt-1.5 w-24 h-1.5 rounded-full bg-zinc-800 overflow-hidden ml-auto">
              <motion.div
                className="h-full rounded-full"
                style={{
                  backgroundColor: totalPrice > remainingBudget ? "#ef4444" : "#f97316",
                }}
                animate={{ width: `${Math.min((totalPrice / Math.max(remainingBudget, 1)) * 100, 100)}%` }}
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
      <div className="px-4 mt-5 flex gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-xl gap-1.5 h-12 bg-zinc-900 border-white/10 text-white hover:bg-zinc-800 hover:text-white"
          onClick={handleReset}
          disabled={plateItems.length === 0}
        >
          <RotateCcw size={16} />
          Reset
        </Button>
        <Button
          size="sm"
          className="flex-[2] rounded-xl gap-1.5 relative h-12 text-base font-bold"
          onClick={handleSave}
          disabled={plateItems.length === 0}
          style={{ backgroundColor: "#f97316", color: "#fff" }}
        >
          <Save size={16} />
          Simpan Menu
          <AnimatePresence>
            {savedNotice && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-zinc-950 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg"
              >
                Berhasil Tersimpan!
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      {/* Feedback panel */}
      <div className="px-4 mt-4">
        <FeedbackPanel items={plateItems} totalPrice={totalPrice} budget={remainingBudget} />
      </div>

      {/* Food catalog */}
      <div className="mt-5 mb-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Katalog Makanan
          </p>
          <p className="text-[10px] text-muted-foreground font-medium">Seret / Ketuk</p>
        </div>
        <div className="pl-4 flex gap-3 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
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
