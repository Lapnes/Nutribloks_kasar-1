import { useState } from "react";
import { Settings, Bluetooth, Menu, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

type IoTState = "idle" | "connecting" | "connected";

interface TopAppBarProps {
  onOpenSettings: () => void;
  onOpenRekomendasi?: () => void;
  onOpenEdukasi?: () => void;
}

export function TopAppBar({ onOpenSettings, onOpenRekomendasi, onOpenEdukasi }: TopAppBarProps) {
  const [iotModalOpen, setIotModalOpen] = useState(false);
  const [iotState, setIotState] = useState<IoTState>("idle");

  const handleConnectIoT = () => {
    // In production, this will use the Web Bluetooth API:
    // navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
    // For now, we simulate the loading state
    setIotState("connecting");
    setTimeout(() => {
      setIotState("connected");
    }, 2500);
  };

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-zinc-950 shrink-0">
        <h1 className="text-xl font-bold text-orange-500 tracking-tight">NutriBlocks</h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-white/10 text-white">
            <DropdownMenuItem onClick={onOpenSettings} className="gap-2 focus:bg-white/10 focus:text-white cursor-pointer py-3">
              <Settings size={18} />
              <span>Pengaturan</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIotModalOpen(true)} className="gap-2 focus:bg-white/10 focus:text-orange-400 cursor-pointer py-3">
              <Bluetooth size={18} />
              <span>Koneksi IoT Piring Pintar</span>
            </DropdownMenuItem>
            {onOpenRekomendasi && (
              <DropdownMenuItem onClick={onOpenRekomendasi} className="gap-2 focus:bg-white/10 focus:text-yellow-400 cursor-pointer py-3 border-t border-white/5">
                <Sparkles size={18} />
                <span>Rekomendasi Menu</span>
              </DropdownMenuItem>
            )}
            {onOpenEdukasi && (
              <DropdownMenuItem onClick={onOpenEdukasi} className="gap-2 focus:bg-white/10 focus:text-blue-400 cursor-pointer py-3 border-t border-white/5">
                <BookOpen size={18} />
                <span>Pusat Pembelajaran (E-Learning)</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={iotModalOpen} onOpenChange={setIotModalOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white w-[90vw] max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Koneksi Piring Pintar</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6 gap-6">
            <AnimatePresence mode="wait">
              {iotState === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                    <Bluetooth size={40} className="text-orange-500" />
                  </div>
                  <Button 
                    onClick={handleConnectIoT}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-12 text-base font-semibold"
                  >
                    Hubungkan ke Alat (Bluetooth)
                  </Button>
                </motion.div>
              )}

              {iotState === "connecting" && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 rounded-full border-4 border-orange-500/20 border-t-orange-500 flex items-center justify-center"
                  >
                    <Bluetooth size={32} className="text-orange-500" />
                  </motion.div>
                  <p className="text-orange-400 font-medium">Mencari perangkat...</p>
                </motion.div>
              )}

              {iotState === "connected" && (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-400"
                  >
                    <CheckCircle2 size={40} className="text-emerald-400" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-white font-semibold mb-1">Perangkat Tersambung</p>
                    <p className="text-emerald-400 text-sm">silahkan ambil data makanan</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setIotModalOpen(false);
                      setIotState("idle");
                    }}
                    variant="outline"
                    className="w-full border-white/20 hover:bg-white/10 text-white rounded-xl h-12"
                  >
                    Tutup
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
