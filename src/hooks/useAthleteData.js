import { useEffect, useState } from "react";
import {
  createDefaultAthleteData,
  loadAthleteData,
  saveAthleteData,
} from "../utils/storage.js";

export function useAthleteData() {
  const [data, setData] = useState(() => {
    const saved = loadAthleteData();
    return saved || createDefaultAthleteData();
  });

  // Save whenever athlete data changes
  useEffect(() => {
    saveAthleteData(data);
  }, [data]);

  function addActivity(activity) {
    setData((prev) => ({
      ...prev,
      activities: [
        ...(Array.isArray(prev.activities) ? prev.activities : []),
        activity,
      ],
      profile: {
        ...(prev.profile || {}),
        xp: Number(prev.profile?.xp || 0) + 50,
      },
    }));
  }

  function addRecovery(entry) {
    setData((prev) => ({
      ...prev,
      recovery: [
        ...(Array.isArray(prev.recovery) ? prev.recovery : []),
        entry,
      ],
      profile: {
        ...(prev.profile || {}),
        xp:
          Number(prev.profile?.xp || 0) +
          (Number(entry.hours || 0) >= 8 ? 20 : 0),
      },
    }));
  }

  function addStrengthWorkout(workout) {
    setData((prev) => ({
      ...prev,
      strengthWorkouts: [
        ...(Array.isArray(prev.strengthWorkouts)
          ? prev.strengthWorkouts
          : []),
        workout,
      ],
      profile: {
        ...(prev.profile || {}),
        xp: Number(prev.profile?.xp || 0) + 40,
      },
    }));
  }

  // IMPORTANT: Nutrition update
  function addNutritionLog(entry) {
    const today =
      entry.day || new Date().toISOString().slice(0, 10);

    let earnedProteinXP = false;

    setData((prev) => {
      const nutrition = Array.isArray(prev.nutrition)
        ? prev.nutrition
        : [];

      const proteinXpDays = Array.isArray(prev.proteinXpDays)
        ? prev.proteinXpDays
        : [];

      const profile =
        prev.profile && typeof prev.profile === "object"
          ? prev.profile
          : {};

      const bodyWeight = Number(profile.bodyWeight || 55);
      const proteinGoal = bodyWeight * 1.6;

      const hitsProteinGoal =
        Number(entry.protein || 0) >= proteinGoal;

      earnedProteinXP =
        hitsProteinGoal && !proteinXpDays.includes(today);

      const newEntry = {
        ...entry,
        id: entry.id || Date.now(),
        day: today,
        date: entry.date || new Date().toISOString(),
      };

      return {
        ...prev,

        // THIS CREATES A NEW ARRAY → React re-renders Dashboard
        nutrition: [...nutrition, newEntry],

        proteinXpDays: earnedProteinXP
          ? [...proteinXpDays, today]
          : proteinXpDays,

        profile: {
          ...profile,
          xp:
            Number(profile.xp || 0) +
            (earnedProteinXP ? 30 : 0),
        },
      };
    });

    return { earnedProteinXP };
  }

  function updateData(updates) {
    setData((prev) => ({
      ...prev,
      ...updates,
    }));
  }

  function resetData() {
    const freshData = createDefaultAthleteData();
    setData(freshData);
  }

  return {
    data,
    setData,
    addActivity,
    addRecovery,
    addStrengthWorkout,
    addNutritionLog,
    updateData,
    resetData,
  };
}