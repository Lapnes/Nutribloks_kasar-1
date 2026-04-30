import { useState } from "react";
import { motion } from "framer-motion";
import { User, Edit2, Save, X, Sparkles } from "lucide-react";
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
  onGoToRekomendasi?: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: "Pengguna",
  age: 20,
  height: 170,
  weight: 65,
  dailyBudget: 15000,
  targetCalories: 2000,
};

export function ProfileScreen({ onProfileUpdate, initialProfile, onGoToRekomendasi }: ProfileScreenProps) {
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
            className="rounded-full bg-zinc-900 border-white/10 text-white hover:bg-zinc-800"
            onClick={handleEdit}
          >
            <Edit2 size={16} />
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-4 mt-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/5 bg-zinc-900 p-6 shadow-lg relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full pointer-events-none" />

          {/* Avatar */}
          <div className="flex justify-center mb-4 relative z-10">
            <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <User size={40} className="text-orange-500" />
            </div>
          </div>

          {/* Name (editable) */}
          {isEditing ? (
            <Input
              value={tempProfile.name}
              onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
              className="text-center text-lg font-bold mb-4 rounded-xl bg-zinc-800 border-white/10 text-white"
              placeholder="Nama"
            />
          ) : (
            <h2 className="text-center text-2xl font-black text-white mb-4">
              {profile.name}
            </h2>
          )}

          {/* BMI Badge */}
          <div className="flex justify-center mb-2 relative z-10">
            <Badge
              variant="secondary"
              className={`px-3 py-1 font-bold ${
                bmiValue < 18.5
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : bmiValue < 25
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              BMI: {bmiValue}
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Body Metrics */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Data Fisik
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Umur", value: tempProfile.age, unit: "thn", key: "age" },
            { label: "Tinggi", value: tempProfile.height, unit: "cm", key: "height" },
            { label: "Berat", value: tempProfile.weight, unit: "kg", key: "weight" },
          ].map(({ label, value, unit, key }) => (
            <div
              key={key}
              className="rounded-2xl border border-white/5 bg-zinc-900 p-3 flex flex-col items-center gap-1 shadow-sm"
            >
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    const newVal = parseInt(e.target.value) || 0;
                    setTempProfile({ ...tempProfile, [key]: newVal });
                  }}
                  className="w-full text-center text-sm font-bold h-8 p-1 bg-zinc-800 border-white/10 text-white rounded-lg mt-1"
                />
              ) : (
                <p className="text-xl font-black text-white mt-0.5">{value}</p>
              )}
              <p className="text-[9px] text-muted-foreground font-medium">{unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition Targets */}
      <div className="px-4 mb-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Target Harian
        </p>

        <div className="flex flex-col gap-3">
          {/* Daily Budget */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900 p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Anggaran Harian</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={tempProfile.dailyBudget}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, dailyBudget: parseInt(e.target.value) || 0 })
                  }
                  className="w-32 text-base font-bold h-9 p-2 mt-2 bg-zinc-800 border-white/10 text-white rounded-lg"
                  inputMode="numeric"
                />
              ) : (
                <p className="text-xl font-black text-emerald-400 mt-1">
                  Rp {tempProfile.dailyBudget.toLocaleString("id-ID")}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-2xl">
              💰
            </div>
          </div>

          {/* Target Calories */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900 p-4 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Target Kalori</p>
              {isEditing ? (
                <Input
                  type="number"
                  value={tempProfile.targetCalories}
                  onChange={(e) =>
                    setTempProfile({ ...tempProfile, targetCalories: parseInt(e.target.value) || 0 })
                  }
                  className="w-32 text-base font-bold h-9 p-2 mt-2 bg-zinc-800 border-white/10 text-white rounded-lg"
                  inputMode="numeric"
                />
              ) : (
                <p className="text-xl font-black text-orange-400 mt-1">
                  {tempProfile.targetCalories} <span className="text-xs font-medium text-muted-foreground lowercase">kkal</span>
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-2xl">
              🔥
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="px-4 flex gap-3 mb-4">
          <Button
            variant="outline"
            className="flex-1 rounded-xl gap-1.5 h-12 bg-zinc-900 border-white/10 text-white hover:bg-zinc-800"
            onClick={handleCancel}
          >
            <X size={16} />
            Batal
          </Button>
          <Button
            className="flex-[2] rounded-xl gap-1.5 h-12 text-base font-bold"
            style={{ backgroundColor: "#f97316", color: "#fff" }}
            onClick={handleSave}
          >
            <Save size={16} />
            Simpan Perubahan
          </Button>
        </div>
      )}

      {/* Health Tips */}
      <div className="px-4 mt-2">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-2">
            <span>💡</span> Tips Kesehatan
          </p>
          <ul className="text-[10px] text-emerald-200/80 space-y-1.5 font-medium leading-relaxed">
            <li>✓ Makan 3x sehari dengan porsi seimbang</li>
            <li>✓ Penuhi kebutuhan sayur dan buah harian</li>
            <li>✓ Minum air putih minimal 8 gelas/hari</li>
            <li>✓ Hindari makanan terlalu manis dan berminyak</li>
          </ul>
        </div>
      </div>

      {/* Rekomendasi Action Button */}
      {onGoToRekomendasi && (
        <div className="px-4 mt-6 mb-8">
          <Button
            onClick={onGoToRekomendasi}
            className="w-full h-14 rounded-2xl text-base font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 gap-2"
          >
            <Sparkles size={20} />
            Lihat Rekomendasi Menu Harian
          </Button>
        </div>
      )}
    </div>
  );
}
