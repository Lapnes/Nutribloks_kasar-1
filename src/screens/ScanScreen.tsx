import { useState, useRef, useEffect } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Start camera when component mounts
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
      }
    };

    startCamera();

    // Cleanup camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScan = () => {
    setState("scanning");
    
    // In a real app, we would capture the canvas image and send to an API here
    
    setTimeout(() => {
      setState("done");
      // Predefined scan result
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
        <div className="relative rounded-3xl overflow-hidden aspect-square bg-zinc-950 flex items-center justify-center">
          
          {/* Real Camera Feed */}
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Corner guides */}
          {["top-3 left-3", "top-3 right-3 rotate-90", "bottom-3 left-3 -rotate-90", "bottom-3 right-3 rotate-180"].map(
            (pos, i) => (
              <div
                key={i}
                className={`absolute ${pos} w-8 h-8 border-white z-10`}
                style={{
                  borderTopWidth: 3,
                  borderLeftWidth: 3,
                  borderTopColor: "#f97316", // orange-500
                  borderLeftColor: "#f97316",
                  borderRadius: 4,
                }}
              />
            )
          )}

          {/* Animated scan line */}
          <AnimatePresence>
            {state === "scanning" && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-orange-500 z-20"
                style={{ boxShadow: "0 0 8px #f97316" }}
                initial={{ top: "10%" }}
                animate={{ top: "90%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
          </AnimatePresence>

          {/* Center content / Overlay */}
          <AnimatePresence mode="wait">
            {state === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 z-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 rounded-full border-2 border-orange-500/20 border-t-orange-500 flex items-center justify-center"
                >
                  <Scan size={24} className="text-orange-500" />
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
                className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 z-10"
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
                className="absolute inset-0 bg-white z-30"
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
          className="w-full rounded-2xl h-14 text-base font-bold gap-2.5 relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleScan}
          disabled={state !== "idle"}
        >
          <motion.div
            className="absolute inset-0 bg-white/20"
            initial={{ x: "-100%" }}
            animate={state === "scanning" ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          {state === "idle" && <><Camera size={20} />Capture Makanan</>}
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
