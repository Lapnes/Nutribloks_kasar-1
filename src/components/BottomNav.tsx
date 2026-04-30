import { motion } from "framer-motion";
import { Home, Camera, FlaskConical, BarChart3, User, Lightbulb, Settings } from "lucide-react";
import type { ActiveTab } from "@/types";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const PRIMARY_TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "beranda", label: "Beranda", icon: Home },
  { id: "scan", label: "Scan", icon: Camera },
  { id: "nutrilab", label: "NutriLab", icon: FlaskConical },
  { id: "riwayat", label: "Riwayat", icon: BarChart3 },
];

const SECONDARY_TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "profil", label: "Profil", icon: User },
  { id: "rekomendasi", label: "Rekomendasi", icon: Lightbulb },
  { id: "pengaturan", label: "Pengaturan", icon: Settings },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const allTabs = [...PRIMARY_TABS, ...SECONDARY_TABS];

  return (
    <nav className="relative border-t bg-background/95 backdrop-blur-md">
      <div className="flex items-center">
        {allTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const isNutriLab = tab.id === "nutrilab";

          return (
            <motion.button
              key={tab.id}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center py-2 gap-0.5 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.92 }}
            >
              {/* NutriLab gets special highlight */}
              {isNutriLab && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #fca311, #ef233c)",
                    boxShadow: "0 4px 16px #fca31155",
                  }}
                >
                  <Icon
                    size={22}
                    className="text-white"
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
              )}

              {/* Regular tab icons */}
              {!isNutriLab && (
                <div className="relative">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: "#fca311" }}
                    />
                  )}
                </div>
              )}

              {/* Label */}
              <span
                className={cn(
                  "text-[9px] font-semibold leading-none",
                  isNutriLab && "mt-6"
                )}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
