import { motion } from "framer-motion";
import { Flame, Target, Award, Droplets, Dumbbell, Cookie } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { useNutriContext } from "@/context/NutriContext";

interface BerandaScreenProps {
  history: any[];
  onGoToNutriLab: () => void;
}

export function BerandaScreen({ history, onGoToNutriLab }: BerandaScreenProps) {
  const { profile, todayIntake } = useNutriContext();
  
  const todayDate = new Date();
  const todayString = todayDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  
  const hour = todayDate.getHours();
  let greeting = "Selamat Malam";
  if (hour < 11) greeting = "Selamat Pagi";
  else if (hour < 15) greeting = "Selamat Siang";
  else if (hour < 18) greeting = "Selamat Sore";

  const todayEntries = history.filter((e) => {
    const d = new Date(e.date);
    return d.toDateString() === todayDate.toDateString();
  });
  
  const streak = Math.min(history.filter((e) => e.isBalanced).length, 7);
  
  // Calculate Progress Percentages based on rough daily targets
  const carbTarget = 250; // grams
  const proteinTarget = profile.weight * 1.5; // grams (rough estimate)
  const fatTarget = 60; // grams
  
  const calPct = Math.min(100, Math.round((todayIntake.calories / profile.targetCalories) * 100)) || 0;
  const carbPct = Math.min(100, Math.round((todayIntake.carbs / carbTarget) * 100)) || 0;
  const proteinPct = Math.min(100, Math.round((todayIntake.protein / proteinTarget) * 100)) || 0;
  const fatPct = Math.min(100, Math.round((todayIntake.fat / fatTarget) * 100)) || 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground capitalize">{todayString}</p>
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
              {greeting}, {profile.name}! 👋
            </h1>
            <p className="text-sm text-orange-400 font-medium mt-1">
              Apakah hari ini makanan tercukupi?
            </p>
          </div>
        </div>
      </div>

      {/* Calories Progress */}
      <div className="px-4 mb-5 mt-2">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-5 shadow-lg">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Kalori Hari Ini</p>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-white">{todayIntake.calories}</span>
                <span className="text-sm text-muted-foreground font-medium">/ {profile.targetCalories} kkal</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Flame className="text-orange-500" size={20} />
            </div>
          </div>
          <Progress value={calPct} className="h-3 bg-zinc-800" indicatorClassName="bg-orange-500" />
        </div>
      </div>

      {/* Macros Progress Bars */}
      <div className="px-4 mb-6">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Asupan Makronutrien
        </p>
        <div className="grid grid-cols-3 gap-3">
          {/* Karbo */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Cookie size={16} className="text-yellow-500" />
              <span className="text-[10px] font-bold text-yellow-500">{carbPct}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Karbo</p>
              <p className="text-[10px] text-muted-foreground">{todayIntake.carbs}g</p>
            </div>
            <Progress value={carbPct} className="h-1.5 bg-zinc-800" indicatorClassName="bg-yellow-500" />
          </div>

          {/* Protein */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Dumbbell size={16} className="text-red-500" />
              <span className="text-[10px] font-bold text-red-500">{proteinPct}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Protein</p>
              <p className="text-[10px] text-muted-foreground">{todayIntake.protein}g</p>
            </div>
            <Progress value={proteinPct} className="h-1.5 bg-zinc-800" indicatorClassName="bg-red-500" />
          </div>

          {/* Lemak */}
          <div className="bg-zinc-900 border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <Droplets size={16} className="text-orange-300" />
              <span className="text-[10px] font-bold text-orange-300">{fatPct}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Lemak</p>
              <p className="text-[10px] text-muted-foreground">{todayIntake.fat}g</p>
            </div>
            <Progress value={fatPct} className="h-1.5 bg-zinc-800" indicatorClassName="bg-orange-300" />
          </div>
        </div>
      </div>

      {/* Hero CTA */}
      <div className="px-4 mb-4">
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={onGoToNutriLab}
          className="relative overflow-hidden rounded-3xl cursor-pointer border border-orange-500/20"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
          }}
        >
          <div className="p-5 relative z-10">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">
              NutriLab
            </p>
            <h2 className="text-white text-xl font-extrabold mt-1 leading-tight">
              Rakit Menu Sehatmu Sekarang
            </h2>
            <p className="text-white/80 text-sm mt-1">
              Simulasikan piring ideal dengan anggaran pas
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors rounded-full px-4 py-2">
              <span className="text-white text-sm font-bold">Mulai Rakit →</span>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 text-8xl opacity-20 select-none z-0">🍽️</div>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: Target, label: "Sesi Makan Hari Ini", value: `${todayEntries.length}`, unit: "sesi", color: "#f97316" },
          { icon: Award, label: "Streak Sehat", value: `${streak}`, unit: "hari", color: "#10b981" },
        ].map(({ icon: Icon, label, value, unit, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/5 bg-zinc-900 p-4 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}20` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">{label}</p>
              <p className="text-xl font-extrabold text-white leading-none">
                {value} <span className="text-xs font-medium text-muted-foreground normal-case">{unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
