const STORAGE_KEY = "youth-athlete-os-v2";

export const defaultAthleteData = {
  profile: {
    name: "Athlete",
    age: 15,
    bodyWeight: 55,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
  },

  activities: [],
  strengthLogs: [],
  recovery: [],

  nutrition: {
    water: 0,
    protein: 0,
    calories: "",
    updatedAt: null,
  },

  planner: [],
  achievements: [],
};

// Create a fresh copy of default data.
// JSON parse/stringify is used to avoid shared object references.
export function createDefaultAthleteData() {
  return JSON.parse(JSON.stringify(defaultAthleteData));
}

export function loadAthleteData() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return createDefaultAthleteData();
    }

    const parsedData = JSON.parse(savedData);
    const defaults = createDefaultAthleteData();

    return {
      ...defaults,
      ...parsedData,

      profile: {
        ...defaults.profile,
        ...(parsedData.profile || {}),
      },

      nutrition: {
        ...defaults.nutrition,
        ...(parsedData.nutrition || {}),
      },

      activities: Array.isArray(parsedData.activities)
        ? parsedData.activities
        : [],

      strengthLogs: Array.isArray(parsedData.strengthLogs)
        ? parsedData.strengthLogs
        : [],

      recovery: Array.isArray(parsedData.recovery)
        ? parsedData.recovery
        : [],

      planner: Array.isArray(parsedData.planner)
        ? parsedData.planner
        : [],

      achievements: Array.isArray(parsedData.achievements)
        ? parsedData.achievements
        : [],
    };
  } catch (error) {
    console.error("Could not load athlete data:", error);
    return createDefaultAthleteData();
  }
}

export function saveAthleteData(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Could not save athlete data:", error);
  }
}

export function clearAthleteData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Could not clear athlete data:", error);
  }
}