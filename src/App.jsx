import { useState } from "react";

import Dashboard from "./components/Dashboard.jsx";
import BottomNavigation from "./components/BottomNavigation.jsx";
import ActivityLogger from "./components/ActivityLogger.jsx";
import RecoveryLogger from "./components/RecoveryLogger.jsx";
import VtaperWorkout from "./components/VtaperWorkout.jsx";
import Nutrition from "./components/Nutrition.jsx";

import { useAthleteData } from "./hooks/useAthleteData.js";

export default function App() {
  const athlete = useAthleteData();

  const [activeTab, setActiveTab] = useState("dashboard");

  function renderScreen() {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard data={athlete.data} />;

      case "activity":
        return (
          <ActivityLogger
            data={athlete.data}
            addActivity={athlete.addActivity}
          />
        );

      case "strength":
        return (
          <VtaperWorkout
            data={athlete.data}
            addStrengthWorkout={athlete.addStrengthWorkout}
          />
        );

      case "recovery":
        return (
          <RecoveryLogger
            data={athlete.data}
            addRecovery={athlete.addRecovery}
          />
        );

      case "nutrition":
        return (
          <Nutrition
            data={athlete.data}
            addNutritionLog={athlete.addNutritionLog}
          />
        );

      default:
        return <Dashboard data={athlete.data} />;
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "Inter, Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "16px 16px 100px",
        }}
      >
        {renderScreen()}
      </div>

      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </main>
  );
}