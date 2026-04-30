import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Scan, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOOD_CATALOG } from "@/data/foods";
import type { PlateItem } from "@/types";

interface ScanScreenProps {
  onScanComplete: (items: PlateItem[]) => void;
}

type ScanState = "idle" | "scanning" | "done";

export function ScanScreen({ onScanComplete }: ScanScreenProps) {
  const [state, setState] = useState<ScanState>("idle");

  const handleScan = () => {
    setState("scanning");
    setTimeout(() => {
      setState("done");
      // Predefined scan result: nasi + ayam bakar + tumis kangkung
      const predefined: PlateItem[] = [
        { ...FOOD_CATALOG[0], instanceId: `scan-${Date.now()}-0` },
        { ...FOOD_CATALOG[2], instanceId: `scan-${Date.now()}-1` },
        { ...FOOD_CATALOG[3], instanceId: `scan-${Date.now()}-2` },
      ];
      setTimeout(() => {
        onScanComplete(predefined);
      }, 800);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Scan Visual</h1>
        <p className="text-xs text-muted-foreground">Foto makananmu untuk analisis gizi instan</p>
      </div>

      {/* Camera viewfinder */}
      <div className="px-4 flex-1 flex flex-col gap-4">
        <div className="relative rounded-3xl overflow-hidden aspect-square bg-zinc-900 flex items-center justify-center">
          {/* Simulated camera feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />

          {/* Corner guides */}
          {["top-3 left-3", "top-3 right-3 rotate-90", "bottom-3 left-3 -rotate-90", "bottom-3 right-3 rotate-180"].map(
            (pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-8 h-8 border-white`}
                style={{
                  borderTopWidth: 3,
                  borderLeftWidth: 3,
                  borderTopColor: "#fca311",
                  borderLeftColor: "#fca311",
                  borderRadius: 4,
                }}
              />
            )
          )}

          {/* Animated scan line */}
          <AnimatePresence>
            {state === "scanning" && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-[#fca311]"
                style={{ boxShadow: "0 0 8px #fca311" }}
                initial={{ top: "10%" }}
                animate={{ top: "90%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {/* Center content */}
          <AnimatePresence mode="wait">
            {state === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-3 z-10"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20">
                  <Camera size={36} className="text-white/70" />
                </div>
                <p className="text-white/60 text-sm text-center px-8">
                  Arahkan kamera ke makananmu
                </p>
              </motion.div>
            )}

            {state === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-3 z-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-2 border-[#fca311]/20 border-t-[#fca311] flex items-center justify-center"
                >
                  <Scan size={24} className="text-[#fca311]" />
                </motion.div>
                <div className="bg-black/60 rounded-xl px-4 py-2">
                  <p className="text-white text-sm font-semibold text-center">
                    AI sedang memproses foto...
                  </p>
                  <p className="text-white/60 text-xs text-center mt-0.5">
                    Mengidentifikasi makanan & porsi
                  </p>
                </div>
              </motion.div>
            )}

            {state === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3 z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-400"
                >
                  <CheckCircle2 size={32} className="text-emerald-400" />
                </motion.div>
                <div className="bg-black/60 rounded-xl px-4 py-2">
                  <p className="text-white text-sm font-semibold text-center">
                    Makanan teridentifikasi!
                  </p>
                  <p className="text-emerald-400 text-xs text-center mt-0.5">
                    Membuka NutriLab...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flash overlay */}
          <AnimatePresence>
            {state === "done" && (
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Scan button */}
        <Button
          size="lg"
          className="w-full rounded-2xl h-14 text-base font-bold gap-2.5 relative overflow-hidden"
          style={{ backgroundColor: state === "idle" ? "#fca311" : "#2a9d8f", color: "#fff" }}
          onClick={handleScan}
          disabled={state !== "idle"}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            animate={state === "scanning" ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          {state === "idle" && <><Camera size={20} />Scan Makanan</>}
          {state === "scanning" && <><Zap size={20} />AI Memproses...</>}
          {state === "done" && <><CheckCircle2 size={20} />Selesai!</>}
        </Button>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: "🔍", title: "Identifikasi", desc: "Jenis & porsi makanan" },
            { emoji: "📊", title: "Analisis", desc: "Kandungan gizi" },
            { emoji: "💡", title: "Saran", desc: "Rekomendasi menu" },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="rounded-2xl border bg-card p-3 flex flex-col items-center gap-1">
              <span className="text-2xl">{emoji}</span>
              <p className="text-xs font-semibold text-foreground text-center">{title}</p>
              <p className="text-[10px] text-muted-foreground text-center leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
