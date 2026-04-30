import { useState } from "react";
import { Save, RotateCcw, DollarSign, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface BudgetSettings {
  dailyBudget: number;
  weeklyBudget: number;
  targetCalories: number;
  preferredMeals: number;
}

interface SettingsScreenProps {
  onSettingsSave: (settings: BudgetSettings) => void;
  initialSettings?: BudgetSettings;
}

const DEFAULT_SETTINGS: BudgetSettings = {
  dailyBudget: 15000,
  weeklyBudget: 105000,
  targetCalories: 2000,
  preferredMeals: 3,
};

export function SettingsScreen({ onSettingsSave, initialSettings }: SettingsScreenProps) {
  const [settings, setSettings] = useState<BudgetSettings>(
    initialSettings || DEFAULT_SETTINGS
  );
  const [hasChanged, setHasChanged] = useState(false);

  const handleDailyBudgetChange = (value: number) => {
    setSettings({ ...settings, dailyBudget: value, weeklyBudget: value * 7 });
    setHasChanged(true);
  };

  const handleCaloriesChange = (value: number) => {
    setSettings({ ...settings, targetCalories: value });
    setHasChanged(true);
  };

  const handleMealsChange = (value: number) => {
    setSettings({ ...settings, preferredMeals: value });
    setHasChanged(true);
  };

  const handleSave = () => {
    onSettingsSave(settings);
    setHasChanged(false);
  };

  const handleReset = () => {
    setSettings(initialSettings || DEFAULT_SETTINGS);
    setHasChanged(false);
  };

  const perMealBudget = Math.floor(settings.dailyBudget / settings.preferredMeals);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-extrabold text-foreground tracking-tight">Pengaturan</h1>
        <p className="text-xs text-muted-foreground">Atur anggaran dan target nutrisi harian</p>
      </div>

      {/* Daily Budget */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#fca311]/20 flex items-center justify-center">
                <DollarSign size={16} className="text-[#fca311]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Anggaran Harian</p>
                <p className="text-sm font-bold text-foreground">
                  Rp {settings.dailyBudget.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>
          <Slider
            value={[settings.dailyBudget]}
            onValueChange={(v) => handleDailyBudgetChange(v[0])}
            min={5000}
            max={50000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-2">
            <span>Rp 5.000</span>
            <span>Rp 50.000</span>
          </div>
        </div>
      </div>

      {/* Weekly Budget Info */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
              Anggaran Mingguan
            </p>
          </div>
          <p className="text-lg font-bold text-amber-900 dark:text-amber-100">
            Rp {settings.weeklyBudget.toLocaleString("id-ID")}
          </p>
          <p className="text-[9px] text-amber-600 dark:text-amber-400 mt-1">
            {settings.dailyBudget.toLocaleString("id-ID")} × 7 hari
          </p>
        </div>
      </div>

      {/* Meals Per Day */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-xs text-muted-foreground font-medium mb-3">Jumlah Makan per Hari</p>
          <div className="flex gap-2 mb-3">
            {[2, 3, 4, 5].map((n) => (
              <Button
                key={n}
                variant={settings.preferredMeals === n ? "default" : "outline"}
                size="sm"
                className="flex-1 rounded-lg"
                onClick={() => handleMealsChange(n)}
                style={
                  settings.preferredMeals === n
                    ? { backgroundColor: "#fca311", color: "#fff" }
                    : {}
                }
              >
                {n}x
              </Button>
            ))}
          </div>
          <div className="bg-muted/50 rounded-lg p-2">
            <p className="text-xs text-muted-foreground">Anggaran per porsi</p>
            <p className="text-sm font-bold text-foreground">
              Rp {perMealBudget.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Target Calories */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#ef233c]/20 flex items-center justify-center">
                <Target size={16} className="text-[#ef233c]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Target Kalori Harian</p>
                <p className="text-sm font-bold text-foreground">{settings.targetCalories} kkal</p>
              </div>
            </div>
          </div>
          <Slider
            value={[settings.targetCalories]}
            onValueChange={(v) => handleCaloriesChange(v[0])}
            min={1200}
            max={3000}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-[9px] text-muted-foreground mt-2">
            <span>1.200 kkal</span>
            <span>3.000 kkal</span>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl border bg-blue-50 dark:bg-blue-950/20 p-4">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
            Rekomendasi
          </p>
          <p className="text-[9px] text-blue-600 dark:text-blue-300 leading-relaxed">
            Dengan anggaran Rp {settings.dailyBudget.toLocaleString("id-ID")} per hari untuk{" "}
            {settings.preferredMeals} kali makan, Anda bisa memilih makanan sehat dengan harga
            terjangkau. Pastikan setiap porsi memenuhi target {settings.targetCalories} kkal.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex gap-2 mt-auto">
        <Button
          variant="outline"
          className="flex-1 rounded-xl gap-1.5"
          onClick={handleReset}
        >
          <RotateCcw size={14} />
          Reset
        </Button>
        <Button
          className="flex-1 rounded-xl gap-1.5"
          style={{ backgroundColor: "#fca311", color: "#fff" }}
          onClick={handleSave}
          disabled={!hasChanged}
        >
          <Save size={14} />
          Simpan
        </Button>
      </div>
    </div>
  );
}
