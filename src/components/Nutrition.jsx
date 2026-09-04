import { useMemo, useState } from "react";

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export default function Nutrition({ data, addNutritionLog }) {
  const [water, setWater] = useState("");
  const [protein, setProtein] = useState("");
  const [calories, setCalories] = useState("");
  const [message, setMessage] = useState(null);

  // Safe handling for old/incomplete localStorage data
  const profile =
    data?.profile && typeof data.profile === "object"
      ? data.profile
      : {};

  const nutritionLogs = Array.isArray(data?.nutrition)
    ? data.nutrition
    : [];

  const recoveryLogs = Array.isArray(data?.recovery)
    ? data.recovery
    : [];

  const bodyWeight = Number(profile.bodyWeight || 55);

  // Hydration target: Bodyweight × 0.035 liters
  const waterTarget = bodyWeight * 0.035;

  // Active athlete protein target range
  const proteinMin = bodyWeight * 1.6;
  const proteinMax = bodyWeight * 2.0;

  const latestRecovery = useMemo(() => {
    if (recoveryLogs.length === 0) {
      return null;
    }

    return recoveryLogs[recoveryLogs.length - 1];
  }, [recoveryLogs]);

  // Recovery Fuel Score calculation
  function calculateFuelScore(waterValue, proteinValue) {
    const hydrationScore =
      waterTarget > 0
        ? Math.min(40, (waterValue / waterTarget) * 40)
        : 0;

    const proteinScore =
      proteinMin > 0
        ? Math.min(40, (proteinValue / proteinMin) * 40)
        : 0;

    let sleepScore = 10;

    if (latestRecovery) {
      sleepScore = Math.min(
        20,
        (Number(latestRecovery.hours || 0) / 8) * 20
      );
    }

    const total =
      hydrationScore + proteinScore + sleepScore;

    return Math.min(100, Math.round(total));
  }

  function getFuelStatus(score) {
    if (score >= 85) {
      return {
        label: "Excellent Fueling",
        color: "#39ff14",
        advice:
          "Strong recovery support. Keep hydration and balanced meals consistent.",
      };
    }

    if (score >= 65) {
      return {
        label: "Good Fueling",
        color: "#8cff70",
        advice:
          "Good foundation. Continue working toward consistent hydration and protein intake.",
      };
    }

    if (score >= 40) {
      return {
        label: "Needs Attention",
        color: "#ffb84d",
        advice:
          "Focus on regular hydration and balanced meals to support training recovery.",
      };
    }

    return {
      label: "Low Recovery Fuel",
      color: "#ff5555",
      advice:
        "Your logged intake is currently low. Focus on regular balanced meals and hydration.",
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const waterValue = Number(water || 0);
    const proteinValue = Number(protein || 0);
    const caloriesValue = Number(calories || 0);

    if (
      waterValue < 0 ||
      proteinValue < 0 ||
      caloriesValue < 0
    ) {
      setMessage({
        text: "Please enter valid positive values.",
        color: "#ff5555",
      });
      return;
    }

    if (waterValue === 0 && proteinValue === 0) {
      setMessage({
        text: "Enter at least water or protein intake.",
        color: "#ff5555",
      });
      return;
    }

    const fuelScore = calculateFuelScore(
      waterValue,
      proteinValue
    );

    const nutritionEntry = {
      id: Date.now(),
      date: new Date().toISOString(),
      day: getTodayKey(),
      water: waterValue,
      protein: proteinValue,
      calories: caloriesValue,
      fuelScore,
    };

    const result = addNutritionLog(nutritionEntry);

    if (result?.earnedProteinXP) {
      setMessage({
        text: `Nutrition logged! Protein goal reached: +30 XP. Fuel Score: ${fuelScore}/100`,
        color: "#39ff14",
      });
    } else if (proteinValue >= proteinMin) {
      setMessage({
        text: `Protein goal reached. XP was already awarded today. Fuel Score: ${fuelScore}/100`,
        color: "#8cff70",
      });
    } else {
      setMessage({
        text: `Nutrition logged! Fuel Score: ${fuelScore}/100`,
        color: "#ffb84d",
      });
    }

    setWater("");
    setProtein("");
    setCalories("");
  }

  const previewWater = Number(water || 0);
  const previewProtein = Number(protein || 0);

  const hasPreview =
    previewWater > 0 || previewProtein > 0;

  const previewScore = hasPreview
    ? calculateFuelScore(
        previewWater,
        previewProtein
      )
    : 0;

  const previewStatus = getFuelStatus(previewScore);

  // Safe copy before reverse
  const recentLogs = [...nutritionLogs]
    .reverse()
    .slice(0, 7);

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* HEADER */}
      <section style={{ marginBottom: "22px" }}>
        <p
          style={{
            color: "#39ff14",
            fontSize: "11px",
            fontWeight: "bold",
            letterSpacing: "3px",
            margin: 0,
          }}
        >
          FUEL SYSTEM
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "30px",
          }}
        >
          Nutrition & Hydration
        </h1>

        <p
          style={{
            color: "#777",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Fuel your training. Support your recovery.
        </p>
      </section>

      {/* DAILY TARGETS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div style={targetCardStyle}>
          <p style={targetLabelStyle}>
            WATER TARGET
          </p>

          <strong
            style={{
              fontSize: "24px",
              color: "#39ff14",
            }}
          >
            {waterTarget.toFixed(1)} L
          </strong>

          <p style={targetDescriptionStyle}>
            Based on {bodyWeight} kg
          </p>
        </div>

        <div style={targetCardStyle}>
          <p style={targetLabelStyle}>
            PROTEIN TARGET
          </p>

          <strong
            style={{
              fontSize: "18px",
              color: "#39ff14",
            }}
          >
            {proteinMin.toFixed(0)}–{proteinMax.toFixed(0)}g
          </strong>

          <p style={targetDescriptionStyle}>
            Daily athlete range
          </p>
        </div>
      </section>

      {/* LOG FORM */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#121212",
          border: "1px solid #292929",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          Log Today's Fuel
        </h2>

        <label style={labelStyle}>
          Water Intake (Liters)
        </label>

        <input
          type="number"
          min="0"
          step="0.1"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          placeholder="Example: 2.0"
          style={inputStyle}
        />

        <label style={labelStyle}>
          Protein Intake (grams)
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          placeholder={`Goal starts around ${proteinMin.toFixed(0)}g`}
          style={inputStyle}
        />

        <label style={labelStyle}>
          Calories (Optional)
        </label>

        <input
          type="number"
          min="0"
          step="1"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Optional"
          style={inputStyle}
        />

        {/* LIVE SCORE */}
        {hasPreview && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "14px",
              background: "#080808",
              border: `1px solid ${previewStatus.color}`,
            }}
          >
            <p
              style={{
                color: "#777",
                fontSize: "10px",
                letterSpacing: "2px",
                margin: 0,
              }}
            >
              RECOVERY FUEL SCORE
            </p>

            <div
              style={{
                color: previewStatus.color,
                fontSize: "40px",
                fontWeight: "900",
                marginTop: "5px",
              }}
            >
              {previewScore}
              <span
                style={{
                  color: "#777",
                  fontSize: "15px",
                }}
              >
                /100
              </span>
            </div>

            <strong style={{ color: previewStatus.color }}>
              {previewStatus.label}
            </strong>

            <p
              style={{
                color: "#888",
                fontSize: "12px",
                lineHeight: "1.5",
                marginBottom: 0,
              }}
            >
              {previewStatus.advice}
            </p>
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#39ff14",
            color: "#000",
            fontWeight: "900",
            cursor: "pointer",
          }}
        >
          LOG NUTRITION
        </button>

        {message && (
          <div
            style={{
              marginTop: "15px",
              padding: "13px",
              borderRadius: "12px",
              color: message.color,
              border: `1px solid ${message.color}`,
              background: "#080808",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            {message.text}
          </div>
        )}
      </form>

      {/* YOUTH ATHLETE INFO */}
      <section
        style={{
          marginTop: "20px",
          padding: "18px",
          background: "rgba(57,255,20,0.04)",
          border: "1px solid rgba(57,255,20,0.2)",
          borderRadius: "18px",
        }}
      >
        <strong style={{ color: "#39ff14" }}>
          YOUTH ATHLETE NOTE
        </strong>

        <p
          style={{
            color: "#999",
            fontSize: "12px",
            lineHeight: "1.6",
            marginBottom: 0,
          }}
        >
          These targets are estimates for general training support.
          Prioritize balanced meals, carbohydrates for activity,
          protein-rich foods, fruits, vegetables and regular hydration.
          Calorie tracking is optional.
        </p>
      </section>

      {/* HISTORY */}
      <section style={{ marginTop: "28px" }}>
        <h2>Recent Logs</h2>

        {recentLogs.length === 0 ? (
          <div
            style={{
              padding: "28px",
              textAlign: "center",
              color: "#666",
              border: "1px dashed #333",
              borderRadius: "16px",
            }}
          >
            No nutrition logs yet.
          </div>
        ) : (
          recentLogs.map((log, index) => (
            <div
              key={log?.id || index}
              style={{
                background: "#121212",
                border: "1px solid #292929",
                borderRadius: "14px",
                padding: "15px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>
                  {Number(log?.water || 0).toFixed(1)} L Water
                </strong>

                <p
                  style={{
                    margin: "5px 0 0",
                    color: "#777",
                    fontSize: "12px",
                  }}
                >
                  {Number(log?.protein || 0).toFixed(0)}g Protein
                  {Number(log?.calories || 0) > 0
                    ? ` · ${Number(log.calories).toFixed(0)} kcal`
                    : ""}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <strong
                  style={{
                    color: "#39ff14",
                    fontSize: "20px",
                  }}
                >
                  {Number(log?.fuelScore || 0)}
                </strong>

                <p
                  style={{
                    margin: "4px 0 0",
                    color: "#666",
                    fontSize: "9px",
                    letterSpacing: "1px",
                  }}
                >
                  FUEL SCORE
                </p>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "18px",
  marginBottom: "8px",
  color: "#aaa",
  fontSize: "12px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #303030",
  background: "#080808",
  color: "#fff",
  outline: "none",
};

const targetCardStyle = {
  background: "#121212",
  border: "1px solid #292929",
  borderRadius: "16px",
  padding: "16px",
};

const targetLabelStyle = {
  color: "#777",
  fontSize: "9px",
  fontWeight: "bold",
  letterSpacing: "1.5px",
  margin: "0 0 8px",
};

const targetDescriptionStyle = {
  color: "#666",
  fontSize: "10px",
  margin: "7px 0 0",
};