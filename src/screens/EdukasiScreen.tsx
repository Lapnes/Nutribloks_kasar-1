import { motion } from "framer-motion";
import { ChevronLeft, BookOpen, PlayCircle, CheckCircle, Book, Layers, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EdukasiScreenProps {
  onBack: () => void;
  onStartLesson?: () => void;
  onOpenModulDetail?: () => void;
  onOpenFlashcard?: () => void;
  onOpenNutriQuest?: () => void;
}

const MOCK_MODULES = [
  {
    id: 1,
    title: "Mengenal Makronutrien Dasar",
    description: "Pelajari apa itu karbohidrat, protein, dan lemak serta fungsinya.",
    progress: 100,
    status: "Selesai",
  },
  {
    id: 2,
    title: "Bahaya Kalori Kosong & Lemak Trans",
    description: "Kenali jenis makanan yang dapat merugikan kesehatan jangka panjang.",
    progress: 40,
    status: "Lanjutkan",
  },
  {
    id: 3,
    title: "Cara Membaca Siluet Piring Ideal",
    description: "Panduan praktis mengatur porsi makan harian dengan gizi seimbang.",
    progress: 0,
    status: "Mulai",
  },
];

export function EdukasiScreen({ 
  onBack, 
  onStartLesson,
  onOpenModulDetail,
  onOpenFlashcard,
  onOpenNutriQuest
}: EdukasiScreenProps) {
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-8 bg-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md px-4 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 shrink-0 h-10 w-10"
          >
            <ChevronLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              Pusat Pembelajaran
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pahami nutrisi lewat modul interaktif
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mt-6 flex flex-col gap-4">
        {MOCK_MODULES.map((mod, idx) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
            className="bg-zinc-900 border border-white/10 rounded-2xl flex overflow-hidden shadow-sm hover:bg-zinc-800/80 transition-colors duration-200"
          >
            {/* Left Column (Main Content - approx 75%) */}
            <div className="flex-1 p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                    mod.status === "Selesai"
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-500"
                      : mod.status === "Lanjutkan"
                      ? "bg-orange-500/20 border-orange-500/30 text-orange-500"
                      : "bg-blue-500/20 border-blue-500/30 text-blue-500"
                  }`}
                >
                  {mod.status === "Selesai" && <CheckCircle size={20} />}
                  {mod.status === "Lanjutkan" && <PlayCircle size={20} />}
                  {mod.status === "Mulai" && <BookOpen size={20} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white leading-tight mb-1">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="mt-1 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      mod.status === "Selesai"
                        ? "bg-emerald-500"
                        : "bg-orange-500"
                    }`}
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-zinc-300 w-8 text-right">
                  {mod.progress}%
                </span>
              </div>

              <Button
                onClick={() => onStartLesson && onStartLesson()}
                className={`w-full mt-1 h-9 rounded-xl text-[13px] font-bold transition-all ${
                  mod.status === "Selesai"
                    ? "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {mod.status === "Selesai" ? "Ulangi Kuis" : mod.status === "Lanjutkan" ? "Lanjutkan Kuis" : "Mulai Kuis"}
              </Button>
            </div>

            {/* Right Column (Action Icons - approx 25%) */}
            <div className="w-16 shrink-0 border-l border-white/5 flex flex-col">
              <button 
                onClick={() => onOpenModulDetail && onOpenModulDetail()}
                className="flex-1 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <Book size={18} className="text-emerald-500" />
                <span className="text-[8px] font-bold text-zinc-400 uppercase">Modul</span>
              </button>
              <button 
                onClick={() => onOpenFlashcard && onOpenFlashcard()}
                className="flex-1 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors border-b border-white/5"
              >
                <Layers size={18} className="text-blue-500" />
                <span className="text-[8px] font-bold text-zinc-400 uppercase">Flash</span>
              </button>
              <button 
                onClick={() => onOpenNutriQuest && onOpenNutriQuest()}
                className="flex-1 flex flex-col items-center justify-center gap-1 hover:bg-white/5 transition-colors"
              >
                <Target size={18} className="text-orange-500" />
                <span className="text-[8px] font-bold text-orange-500 uppercase">Quest</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
