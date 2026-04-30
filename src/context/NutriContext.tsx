import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserProfile, RiwayatEntry, DailyIntake } from "@/types";

interface NutriContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  history: RiwayatEntry[];
  addToHistory: (entry: RiwayatEntry) => void;
  clearHistory: () => void;
  todayIntake: DailyIntake;
  addIntake: (intake: DailyIntake) => void;
  remainingBudget: number;
}

const defaultProfile: UserProfile = {
  name: "Pengguna",
  age: 20,
  height: 170,
  weight: 65,
  dailyBudget: 25000,
  targetCalories: 2000,
};

const defaultIntake: DailyIntake = {
  carbs: 0,
  protein: 0,
  fat: 0,
  calories: 0,
};

const NutriContext = createContext<NutriContextType | undefined>(undefined);

export const NutriProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriblocks-profile") || "null") || defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [history, setHistoryState] = useState<RiwayatEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("nutriblocks-history") || "[]");
    } catch {
      return [];
    }
  });

  const [todayIntake, setTodayIntake] = useState<DailyIntake>(() => {
    try {
      const storedDate = localStorage.getItem("nutriblocks-date");
      const today = new Date().toISOString().split("T")[0];
      if (storedDate === today) {
        return JSON.parse(localStorage.getItem("nutriblocks-intake") || "null") || defaultIntake;
      }
      return defaultIntake;
    } catch {
      return defaultIntake;
    }
  });

  useEffect(() => {
    localStorage.setItem("nutriblocks-profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("nutriblocks-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("nutriblocks-date", today);
    localStorage.setItem("nutriblocks-intake", JSON.stringify(todayIntake));
  }, [todayIntake]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
  };

  const addToHistory = (entry: RiwayatEntry) => {
    setHistoryState((prev) => [...prev, entry]);
  };

  const clearHistory = () => {
    setHistoryState([]);
  };

  const addIntake = (intake: DailyIntake) => {
    setTodayIntake((prev) => ({
      carbs: prev.carbs + intake.carbs,
      protein: prev.protein + intake.protein,
      fat: prev.fat + intake.fat,
      calories: prev.calories + intake.calories,
    }));
  };

  // Calculate spent budget today
  const today = new Date().toISOString().split("T")[0];
  const spentToday = history
    .filter((entry) => entry.date.startsWith(today))
    .reduce((sum, entry) => sum + entry.totalPrice, 0);

  const remainingBudget = profile.dailyBudget - spentToday;

  return (
    <NutriContext.Provider
      value={{
        profile,
        setProfile,
        history,
        addToHistory,
        clearHistory,
        todayIntake,
        addIntake,
        remainingBudget,
      }}
    >
      {children}
    </NutriContext.Provider>
  );
};

export const useNutriContext = () => {
  const context = useContext(NutriContext);
  if (context === undefined) {
    throw new Error("useNutriContext must be used within a NutriProvider");
  }
  return context;
};
