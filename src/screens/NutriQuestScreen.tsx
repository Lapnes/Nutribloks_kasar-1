import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Target, CheckCircle, XCircle } from "lucide-react";
import { VirtualPlate } from "@/components/VirtualPlate";
import { FoodCard } from "@/components/FoodCard";
import { FOOD_CATALOG } from "@/data/foods";
import type { FoodItem, PlateItem } from "@/types";
import { Button } from "@/components/ui/button";

interface NutriQuestScreenProps {
  onBack: () => void;
}

export function NutriQuestScreen({ onBack }: NutriQuestScreenProps) {
  const [plateItems, setPlateItems] = useState<PlateItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCandidate, setDragCandidate] = useState<FoodItem | null>(null);
  const [evaluation, setEvaluation] = useState<{show: boolean, isSuccess: boolean, message: string} | null>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  // We ignore budget for the Quest mode logic or just set a static high budget
  const budget = 25000;
  const totalPrice = plateItems.reduce((sum, i) => sum + i.price, 0);

  const handleDragStart = useCallback((food: FoodItem) => {
    setDragCandidate(food);
  }, []);

  const handleDrop = useCallback(
    (food: FoodItem) => {
      if (totalPrice + food.price > budget) return;
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

  // Tap-to-add
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

  const handlePlatePointerUp = useCallback(() => {
    if (dragCandidate && isDragOver) {
      handleDrop(dragCandidate);
    }
  }, [dragCandidate, isDragOver, handleDrop]);

  const handleSubmit = () => {
    const hasProtein = plateItems.some(i => i.type === "protein");
    const hasCarb = plateItems.some(i => i.type === "carb");
    const isSuccess = hasProtein && hasCarb;

    setEvaluation({
      show: true,
      isSuccess,
      message: isSuccess
        ? "Misi Berhasil! Menu ini kaya akan protein dan karbohidrat kompleks, cocok untuk memulihkan energi pekerja."
        : "Misi Gagal! Pekerja butuh Karbohidrat (Blok Kuning) untuk energi dan Protein (Blok Merah) untuk pemulihan otot. Coba lengkapi piringmu lagi.",
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 relative">
      
      {/* 1. THE FIXED HEADER */}
      <div className="w-full shrink-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 shrink-0 h-10 w-10 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Target size={16} className="text-orange-500" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              Nutri-Quest
            </h1>
          </div>
        </div>
      </div>

      {/* 2. THE SCROLLABLE BODY (Middle) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-6 pb-32 flex flex-col gap-6">
        
        {/* Quest Banner */}
        <div className="bg-orange-500/10 border border-orange-500 rounded-2xl p-4 shadow-lg shadow-orange-500/5 shrink-0">
          <h2 className="text-orange-500 font-bold text-sm uppercase tracking-wider mb-2">
            Studi Kasus
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed font-medium">
            Seorang Pekerja Kantor mengalami kantuk dan lemah energi yang kuat. Buatkan makanan yang tepat untuk orang ini dengan budget maksimal <span className="text-orange-400 font-bold">Rp 25.000!</span>
          </p>
        </div>

        {/* Bento Box Canvas */}
        <div className="flex flex-col items-center w-full aspect-[4/5] mx-auto shrink-0">
          <div
            ref={plateRef}
            className="flex justify-center w-full h-full"
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
          <p className="text-[10px] text-muted-foreground mt-3 px-8 text-center">
            Isi setiap bagian dengan proporsi yang sesuai untuk menyelesaikan misi.
          </p>
        </div>

        {/* Food Catalog */}
        <div className="flex flex-col shrink-0">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              KATALOG MAKANAN
            </h2>
            <p className="text-[10px] text-muted-foreground font-medium">Seret / Ketuk</p>
          </div>
          <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 scrollbar-hide" style={{ scrollSnapType: "x mandatory" }}>
            {FOOD_CATALOG.map((food) => (
              <div key={food.id} className="w-32 min-w-[128px] shrink-0" style={{ scrollSnapAlign: "start" }}>
                <FoodCard
                  food={food}
                  disabled={totalPrice + food.price > budget}
                  onDragStart={handleDragStart}
                  onTap={handleTap}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. THE FIXED FOOTER (Action Bar) */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 z-50 pb-safe">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={plateItems.length === 0}
          className="w-full h-14 rounded-2xl bg-orange-500 font-bold text-lg text-white disabled:bg-zinc-800 disabled:text-zinc-500 shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center"
        >
          Submit & Evaluasi Misi
        </motion.button>
      </div>

      {/* Evaluation Modal */}
      <AnimatePresence>
        {evaluation?.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm rounded-3xl p-6 border-2 flex flex-col items-center text-center shadow-2xl ${
                evaluation.isSuccess
                  ? "bg-emerald-950/90 border-emerald-500 shadow-emerald-500/20"
                  : "bg-red-950/90 border-red-500 shadow-red-500/20"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                evaluation.isSuccess ? "bg-emerald-500/20" : "bg-red-500/20"
              }`}>
                {evaluation.isSuccess ? (
                  <CheckCircle size={32} className="text-emerald-500" />
                ) : (
                  <XCircle size={32} className="text-red-500" />
                )}
              </div>
              
              <h2 className={`text-2xl font-black mb-3 ${
                evaluation.isSuccess ? "text-emerald-400" : "text-red-400"
              }`}>
                Analisis AI
              </h2>
              
              <p className="text-zinc-300 font-medium leading-relaxed mb-8">
                {evaluation.message}
              </p>
              
              <Button
                onClick={() => {
                  if (evaluation.isSuccess) {
                    onBack();
                  } else {
                    setEvaluation({ ...evaluation, show: false });
                  }
                }}
                className={`w-full h-14 rounded-2xl font-bold text-lg text-white active:scale-95 transition-all ${
                  evaluation.isSuccess
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {evaluation.isSuccess ? "Kembali ke Edukasi" : "Coba Lagi"}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
