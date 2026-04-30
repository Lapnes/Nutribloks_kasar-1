import { useState } from "react";
import { motion } from "framer-motion";
import { User, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  dailyBudget: number;
  targetCalories: number;
}

interface ProfileScreenProps {
  onProfileUpdate: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Pengguna",
  age: 20,
  height: 170,
  weight: 65,
  dailyBudget: 15000,
  targetCalories: 2000,
};

export function ProfileScreen({ onProfileUpdate, initialProfile }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(initialProfile || DEFAULT_PROFILE);
  const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    onProfileUpdate(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const bmiValue = parseFloat((tempProfile.weight / ((tempProfile.height / 100) ** 2)).toFixed(1));

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground tracking-tight">Profil Saya</h1>
          <p className="text-xs text-muted-foreground">Kelola data pribadi dan target nutrisi</p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleEdit}
          >
            <Edit2 size={16} />
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6"
        >
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-[#0077b6]/20 flex items-center justify-center">
              <User size={40} className="text-[#0077b6]" />
            </div>
          </div>

          {/* Name (editable) */}
          {isEditing ? (
            <Input
              value={tempProfile.name}
              onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
              className="text-center text-lg font-bold mb-4 rounded-lg"
              placeholder="Nama"
            />
          ) : (
            <h2 className="text-center text-xl font-bold text-foreground mb-4">
              {profile.name}
            </h2>
          )}

          {/* BMI Badge */}
          <div className="flex justify-center mb-4">
            <Badge
              variant="secondary"
              className={`${
                bmiValue < 18.5
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50"
                  : bmiValue < 25
                    ? "bg-green-100 text-green-700 dark:bg-green-900/50"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/50"
              }`}
            >
              BMI: {bmiValue}
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Body Metrics */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Data Fisik
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Umur", value: tempProfile.age, unit: "thn", key: "age" },
            { label: "Tinggi", value: tempProfile.height, unit: "cm", key: "height" },
            { label: "Berat", value: tempProfile.weight, unit: "kg", key: "weight" },
          ].map(({ label, value, unit, key }) => (
            <div
              key={key}
              className="rounded-xl border bg-card p-3 flex flex-col items-center gap-1"
            >
              <p className="text-[9px] text-muted-foreground font-medium">{label}</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value) || 0;
                    setTempProfile({ ...tempProfile, [key]: newVal });
                  }}
                  className="w-full text-center text-sm font-bold h-7 p-1"
                />
              ) : (
                <p className="text-lg font-bold text-foreground">{value}</p>
              )}
              <p className="text-[8px] text-muted-foreground">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Targets */}
      <div className="px-4 mb-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Target Harian
        </p>

        {/* Daily Budget */}
        <div className="rounded-2xl border bg-card p-4 mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Anggaran Harian</p>
            {isEditing ? (
              <Input
                type="number"
                value={tempProfile.dailyBudget}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, dailyBudget: parseInt(e.target.value) || 0 })
                }
                className="w-32 text-lg font-bold h-8 p-1 mt-1"
                inputMode="numeric"
              />
            ) : (
              <p className="text-lg font-bold text-foreground mt-1">
                Rp {tempProfile.dailyBudget.toLocaleString("id-ID")}
              </p>
            )}
          </div>
          <div className="text-3xl">💰</div>
        </div>

        {/* Target Calories */}
        <div className="rounded-2xl border bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Target Kalori</p>
            {isEditing ? (
              <Input
                type="number"
                value={tempProfile.targetCalories}
                onChange={(e) =>
                  setTempProfile({ ...tempProfile, targetCalories: parseInt(e.target.value) || 0 })
                }
                className="w-32 text-lg font-bold h-8 p-1 mt-1"
                inputMode="numeric"
              />
            ) : (
              <p className="text-lg font-bold text-foreground mt-1">
                {tempProfile.targetCalories} kkal
              </p>
            )}
          </div>
          <div className="text-3xl">🔥</div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="px-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-xl gap-1.5"
            onClick={handleCancel}
          >
            <X size={14} />
            Batal
          </Button>
          <Button
            className="flex-1 rounded-xl gap-1.5"
            style={{ backgroundColor: "#fca311", color: "#fff" }}
            onClick={handleSave}
          >
            <Save size={14} />
            Simpan
          </Button>
        </div>
      )}

      {/* Health Tips */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl border bg-green-50 dark:bg-green-950/20 p-4">
          <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
            Tips Kesehatan
          </p>
          <ul className="text-[9px] text-green-600 dark:text-green-300 space-y-1 leading-relaxed">
            <li>✓ Makan 3x sehari dengan porsi seimbang</li>
            <li>✓ Penuhi kebutuhan sayur dan buah harian</li>
            <li>✓ Minum air putih minimal 8 gelas/hari</li>
            <li>✓ Hindari makanan terlalu manis dan berminyak</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
