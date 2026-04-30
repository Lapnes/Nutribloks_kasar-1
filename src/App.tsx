import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BottomNav } from "@/components/BottomNav";
import { BerandaScreen } from "@/screens/BerandaScreen";
import { ScanScreen } from "@/screens/ScanScreen";
import { NutriLabScreen } from "@/screens/NutriLabScreen";
import { RiwayatScreen } from "@/screens/RiwayatScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { RecommendationsScreen } from "@/screens/RecommendationsScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import type { ActiveTab, PlateItem, RiwayatEntry, UserProfile } from "@/types";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("nutrilab");
  const [scanItems, setScanItems] = useState<PlateItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriblocks-profile") || JSON.stringify({
        name: "Pengguna",
        age: 20,
        height: 170,
        weight: 65,
        dailyBudget: 15000,
        targetCalories: 2000,
      }));
    } catch {
      return {
        name: "Pengguna",
        age: 20,
        height: 170,
        weight: 65,
        dailyBudget: 15000,
        targetCalories: 2000,
      };
    }
  });
  const [history, setHistory] = useState<RiwayatEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriblocks-history") || "[]");
    } catch {
      return [];
    }
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem("nutriblocks-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("nutriblocks-profile", JSON.stringify(profile));
  }, [profile]);

  const handleSaveToHistory = (entry: RiwayatEntry) => {
    setHistory((prev) => [...prev, entry]);
  };

  const handleScanComplete = (items: PlateItem[]) => {
    setScanItems(items);
    setActiveTab("nutrilab");
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleProfileUpdate = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const screenVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -12 },
  };

  return (
    <div className="min-h-svh bg-muted/30 flex items-center justify-center">
      {/* Phone frame on desktop */}
      <div
        className="relative w-full bg-background flex flex-col overflow-hidden"
        style={{
          maxWidth: 400,
          height: "100svh",
          maxHeight: 900,
          boxShadow: "0 0 0 1px oklch(0.922 0 0), 0 24px 64px rgba(0,0,0,0.18)",
          borderRadius: "clamp(0px, 2vw, 40px)",
        }}
      >
        {/* Status bar simulation */}
        <div className="flex items-center justify-between px-5 py-2 shrink-0">
          <span className="text-xs font-semibold text-foreground">
            {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 rounded-sm border border-foreground/40 relative">
              <div className="absolute inset-0.5 bg-foreground/40 rounded-xs" style={{ width: "70%" }} />
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === "beranda" && (
              <motion.div
                key="beranda"
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
                <RiwayatScreen history={history} onClear={handleClearHistory} />
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
                <ProfileScreen initialProfile={profile} onProfileUpdate={handleProfileUpdate} />
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
                className="absolute inset-0 overflow-y-auto"
              >
                <RecommendationsScreen history={history} budget={profile.dailyBudget} />
              </motion.div>
            )}

            {activeTab === "pengaturan" && (
              <motion.div
                key="pengaturan"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute inset-0 overflow-y-auto"
              >
                <SettingsScreen
                  initialSettings={{
                    dailyBudget: profile.dailyBudget,
                    weeklyBudget: profile.dailyBudget * 7,
                    targetCalories: profile.targetCalories,
                    preferredMeals: 3,
                  }}
                  onSettingsSave={(settings) => {
                    handleProfileUpdate({
                      ...profile,
                      dailyBudget: settings.dailyBudget,
                      targetCalories: settings.targetCalories,
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <div className="shrink-0">
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}

export default App;
