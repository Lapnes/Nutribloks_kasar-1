import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FlashcardScreenProps {
  onBack: () => void;
}

const flashcardsData = [
  {
    front: "Apa fungsi utama Karbohidrat?",
    back: "Sebagai sumber energi utama tubuh. (Seperti bensin untuk mobil)",
  },
  {
    front: "Protein berguna untuk?",
    back: "Membangun dan memperbaiki jaringan tubuh yang rusak, seperti otot.",
  },
  {
    front: "Sebutkan 3 contoh sumber Lemak sehat!",
    back: "Alpukat, kacang-kacangan, dan minyak zaitun.",
  },
];

export function FlashcardScreen({ onBack }: FlashcardScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcardsData[currentIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < flashcardsData.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex((prev) => prev - 1), 150);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 shrink-0 h-10 w-10"
        >
          <ChevronLeft size={20} />
        </Button>
        <div className="text-zinc-400 font-bold text-sm">
          {currentIndex + 1} / {flashcardsData.length}
        </div>
        <div className="w-10" /> {/* spacer for alignment */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
        <div className="w-full max-w-sm aspect-[3/4] relative perspective-1000">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            onClick={handleFlip}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front of Card */}
            <div
              className="absolute w-full h-full backface-hidden bg-zinc-900 border-2 border-zinc-800 rounded-3xl p-8 flex items-center justify-center text-center shadow-xl shadow-black/50"
              style={{ backfaceVisibility: "hidden" }}
            >
              <h2 className="text-2xl font-bold text-white leading-relaxed">
                {currentCard.front}
              </h2>
              <div className="absolute bottom-6 text-zinc-500 text-sm font-semibold uppercase tracking-widest">
                Sentuh untuk membalik
              </div>
            </div>

            {/* Back of Card */}
            <div
              className="absolute w-full h-full backface-hidden bg-orange-500 rounded-3xl p-8 flex items-center justify-center text-center shadow-xl shadow-orange-500/20"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              <h2 className="text-2xl font-bold text-white leading-relaxed">
                {currentCard.back}
              </h2>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-4 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md z-50">
        <div className="flex gap-3 mb-3">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl h-14 border border-zinc-800 disabled:opacity-50"
          >
            Sebelumnya
          </Button>
          {currentIndex === flashcardsData.length - 1 ? (
            <div className="flex-1 flex gap-2">
              <Button
                onClick={onBack}
                className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl h-14 border border-zinc-800"
              >
                Selesai
              </Button>
              <Button
                onClick={() => alert("Fitur tambah flashcard akan segera hadir!")}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14"
              >
                Tambah
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl h-14 border border-zinc-800"
            >
              Lanjut
            </Button>
          )}
        </div>
        <Button
          onClick={handleFlip}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14 text-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          {isFlipped ? "Kembali ke Pertanyaan" : "Balik Kartu"}
        </Button>
      </div>
    </div>
  );
}
