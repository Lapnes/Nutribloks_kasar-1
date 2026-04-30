import { motion } from "framer-motion";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModulDetailScreenProps {
  onBack: () => void;
  onOpenAIChat?: () => void;
}

export function ModulDetailScreen({ onBack, onOpenAIChat }: ModulDetailScreenProps) {
  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 relative">
      
      {/* 1. THE FIXED HEADER */}
      <div className="w-full shrink-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 shrink-0 h-10 w-10 whileTap-scale"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
            Baca Modul
          </h1>
        </div>
      </div>

      {/* 2. THE SCROLLABLE BODY (Middle) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
            Mengenal Makronutrien Dasar
          </h2>

          <div className="space-y-6 text-zinc-300 leading-relaxed text-base">
            <section>
              <h3 className="text-xl font-bold text-yellow-500 mb-2">1. Karbohidrat (Blok Kuning)</h3>
              <p>
                Karbohidrat adalah sumber energi utama bagi tubuh kita. Sama seperti bensin pada mobil, tubuh menggunakan karbohidrat untuk menjalankan berbagai aktivitas fisik dan fungsi otak. Contoh: Nasi, roti, kentang, jagung, dan ubi.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-red-500 mb-2">2. Protein (Blok Merah)</h3>
              <p>
                Protein adalah "batu bata" tubuh. Tugas utamanya adalah membangun, memperbaiki jaringan tubuh yang rusak (seperti otot), dan menjaga sistem kekebalan tubuh. Contoh: Ayam, ikan, telur, tahu, dan tempe.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-green-500 mb-2">3. Sayur & Buah (Blok Hijau)</h3>
              <p>
                Kaya akan vitamin, mineral, dan serat. Sangat penting untuk melancarkan pencernaan dan menjaga metabolisme tubuh agar tetap prima.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-100 mb-2">4. Lemak (Blok Putih)</h3>
              <p>
                Lemak sehat sangat penting untuk melindungi organ tubuh, menjaga suhu tubuh, dan membantu penyerapan vitamin (A, D, E, K). Contoh: Alpukat, kacang-kacangan, minyak zaitun, dan kuning telur.
              </p>
            </section>
          </div>
        </motion.div>
      </div>

      {/* 3. THE FIXED FOOTER (Action Bar) */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 z-50 pb-safe">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenAIChat && onOpenAIChat()}
            className="flex-[4] bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-bold rounded-2xl h-14 text-sm gap-2 active:scale-95 transition-all"
          >
            <MessageCircle size={18} />
            Tanya AI
          </Button>
          <Button
            onClick={onBack}
            className="flex-[6] bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14 text-base shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
          >
            Selesai Membaca
          </Button>
        </div>
      </div>
      
    </div>
  );
}
