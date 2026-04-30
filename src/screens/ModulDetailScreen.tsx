import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModulDetailScreenProps {
  onBack: () => void;
}

export function ModulDetailScreen({ onBack }: ModulDetailScreenProps) {
  return (
    <div className="flex flex-col h-full bg-zinc-950 relative">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md px-4 pt-5 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 shrink-0 h-10 w-10"
          >
            <ChevronLeft size={20} />
          </Button>
          <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">
            Baca Modul
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
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

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-4 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-md z-50">
        <Button
          onClick={onBack}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14 text-lg shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          Selesai Membaca
        </Button>
      </div>
    </div>
  );
}
