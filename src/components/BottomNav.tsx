import { motion } from "framer-motion";
import { Home, Camera, Grid, BarChart3, User } from "lucide-react";
import type { ActiveTab } from "@/types";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "scan", label: "Scan Visual", icon: Camera },
  { id: "nutrilab", label: "NutriLab", icon: Grid },
  { id: "riwayat", label: "Riwayat", icon: BarChart3 },
  { id: "profil", label: "Profil", icon: User },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="relative border-t border-white/5 bg-zinc-950/95 backdrop-blur-md pb-safe">
      <div className="flex items-center px-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const isNutriLab = tab.id === "nutrilab";

          return (
            <motion.button
              key={tab.id}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center py-3 gap-1 transition-colors",
                isActive ? "text-orange-500" : "text-muted-foreground hover:text-white/80"
              )}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.92 }}
            >
              {/* NutriLab gets special highlight */}
              {isNutriLab && (
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-orange-500 border-2 border-zinc-950"
                  style={{
                    boxShadow: "0 4px 16px rgba(249, 115, 22, 0.4)",
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
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"
                    />
                  )}
                </div>
              )}

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] font-semibold leading-none",
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
