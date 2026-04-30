import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { TopAppBar } from "@/components/TopAppBar";
import { BerandaScreen } from "@/screens/BerandaScreen";
import { ScanScreen } from "@/screens/ScanScreen";
import { NutriLabScreen } from "@/screens/NutriLabScreen";
import { RiwayatScreen } from "@/screens/RiwayatScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { RekomendasiScreen } from "@/screens/RekomendasiScreen";
import type { ActiveTab, PlateItem } from "@/types";
import { useNutriContext } from "@/context/NutriContext";

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.log("Service Worker registration failed: ", err);
    });
  });
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [scanItems, setScanItems] = useState<PlateItem[]>([]);
  
  const { history, clearHistory, profile, setProfile, addToHistory } = useNutriContext();

  const handleScanComplete = (items: PlateItem[]) => {
    setScanItems(items);
    setActiveTab("nutrilab");
  };

  const handleProfileUpdate = (newProfile: typeof profile) => {
    setProfile(newProfile);
  };

  const handleSaveToHistory = (entry: any) => {
    addToHistory(entry);
  };

  const screenVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
  };

  return (
    <div className="min-h-svh bg-zinc-900 flex items-center justify-center p-0 sm:p-4">
      {/* Phone frame on desktop */}
      <div
        className="relative w-full bg-zinc-950 flex flex-col overflow-hidden sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-zinc-800"
        style={{
          maxWidth: 400,
          height: "100svh",
          maxHeight: 850,
        }}
      >
        <TopAppBar 
          onOpenSettings={() => setActiveTab("profil")} 
          onOpenRekomendasi={() => setActiveTab("rekomendasi")} 
        />

        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative bg-zinc-950">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto"
              >
                <BerandaScreen
                  history={history}
                  onGoToNutriLab={() => setActiveTab("nutrilab")}
                />
              </motion.div>
            )}

            {activeTab === "scan" && (
              <motion.div
                key="scan"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto"
              >
                <ScanScreen onScanComplete={handleScanComplete} />
              </motion.div>
            )}

            {activeTab === "nutrilab" && (
              <motion.div
                key="nutrilab"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto"
              >
                <NutriLabScreen
                  key={scanItems.length > 0 ? scanItems[0]?.instanceId : "empty"}
                  preloadedItems={scanItems}
                  onSaveToHistory={handleSaveToHistory}
                />
              </motion.div>
            )}

            {activeTab === "riwayat" && (
              <motion.div
                key="riwayat"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto"
              >
                <RiwayatScreen history={history} onClear={clearHistory} />
              </motion.div>
            )}

            {activeTab === "profil" && (
              <motion.div
                key="profil"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto"
              >
                <ProfileScreen 
                  initialProfile={profile} 
                  onProfileUpdate={handleProfileUpdate} 
                  onGoToRekomendasi={() => setActiveTab("rekomendasi")}
                />
              </motion.div>
            )}

            {activeTab === "rekomendasi" && (
              <motion.div
                key="rekomendasi"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto bg-zinc-950"
              >
                <RekomendasiScreen onBack={() => setActiveTab("dashboard")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="shrink-0 z-50">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

export default App;
