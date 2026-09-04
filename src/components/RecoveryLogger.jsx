import { useState } from "react";

export default function RecoveryLogger({ data, addRecovery }) {
  const [hours, setHours] = useState("");
  const [quality, setQuality] = useState(3);
  const [readiness, setReadiness] = useState(3);
  const [message, setMessage] = useState("");

  function calculateRecoveryScore() {
    const sleepScore = Math.min(
      100,
      (Number(hours || 0) / 9) * 100
    );

    const qualityScore = (Number(quality) / 5) * 100;
    const readinessScore = (Number(readiness) / 5) * 100;

    return Math.round(
      sleepScore * 0.4 +
      qualityScore * 0.3 +
      readinessScore * 0.3
    );
  }

  function getRecoveryStatus(score) {
    if (score >= 85) {
      return {
        label: "Excellent Recovery",
        color: "#39ff14",
        advice: "You appear well recovered. Normal training is appropriate.",
      };
    }

    if (score >= 70) {
      return {
        label: "Good Recovery",
        color: "#8cff70",
        advice: "You can train normally, but continue monitoring fatigue.",
      };
    }

    if (score >= 50) {
      return {
        label: "Moderate Recovery",
        color: "#ffb84d",
        advice: "Consider reducing intensity and focusing on technique.",
      };
    }

    return {
      label: "Recovery Deficit",
      color: "#ff5555",
      advice:
        "Consider lighter training, recovery work, hydration and adequate sleep.",
    };
  }

  function handleSubmit(event) {
    event.preventDefault();

    const sleepHours = Number(hours);

    if (sleepHours <= 0 || sleepHours > 24) {
      setMessage({
        text: "Please enter valid sleep hours.",
        color: "#ff5555",
      });
      return;
    }

    const score = calculateRecoveryScore();

    const recoveryEntry = {
      id: Date.now(),
      hours: sleepHours,
      quality: Number(quality),
      readiness: Number(readiness),
      score,
      date: new Date().toISOString(),
    };

    addRecovery(recoveryEntry);

    const hasDeficit =
      sleepHours < 7 || Number(quality) < 3;

    if (sleepHours >= 8) {
      setMessage({
        text: hasDeficit
          ? "Recovery logged. +20 XP awarded for 8+ hours of sleep."
          : "Excellent! +20 XP awarded for sleeping 8+ hours.",
        color: "#39ff14",
      });
    } else {
      setMessage({
        text: hasDeficit
          ? "Recovery logged. Recovery Deficit detected — consider lighter training."
          : "Recovery logged successfully.",
        color: "#ffb84d",
      });
    }

    setHours("");
    setQuality(3);
    setReadiness(3);
  }

  const previewScore = hours
    ? calculateRecoveryScore()
    : null;

  const previewStatus =
    previewScore !== null
      ? getRecoveryStatus(previewScore)
      : null;

  const recentRecovery = [...(data.recovery || [])]
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
          RECOVERY SYSTEM
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "30px",
          }}
        >
          Sleep & Recovery
        </h1>

        <p style={{ color: "#777", margin: 0 }}>
          Track sleep and readiness to guide smarter training.
        </p>
      </section>

      {/* LOGGER */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#121212",
          border: "1px solid #292929",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <label style={labelStyle}>
          Sleep Duration (hours)
        </label>

        <input
          type="number"
          step="0.1"
          min="0"
          max="24"
          placeholder="Example: 8.5"
          value={hours}
          onChange={(event) => setHours(event.target.value)}
          style={inputStyle}
        />

        <label style={labelStyle}>
          Sleep Quality
        </label>

        <div style={ratingGrid}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setQuality(value)}
              style={ratingButton(quality === value)}
            >
              {value}
            </button>
          ))}
        </div>

        <div style={ratingLabels}>
          <span>Poor</span>
          <span>Excellent</span>
        </div>

        <label style={labelStyle}>
          Morning Readiness
        </label>

        <div style={ratingGrid}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setReadiness(value)}
              style={ratingButton(readiness === value)}
            >
              {value}
            </button>
          ))}
        </div>

        <div style={ratingLabels}>
          <span>Exhausted</span>
          <span>Ready</span>
        </div>

        {/* LIVE RECOVERY PREVIEW */}
        {previewScore !== null && (
          <div
            style={{
              marginTop: "22px",
              padding: "18px",
              borderRadius: "14px",
              background: "#080808",
              border: `1px solid ${previewStatus.color}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#777",
                letterSpacing: "2px",
              }}
            >
              RECOVERY SCORE
            </p>

            <div
              style={{
                fontSize: "42px",
                fontWeight: "900",
                color: previewStatus.color,
                margin: "6px 0",
              }}
            >
              {previewScore}
              <span
                style={{
                  fontSize: "16px",
                  color: "#777",
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
                color: "#999",
                fontSize: "13px",
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
            marginTop: "22px",
            padding: "15px",
            border: "none",
            borderRadius: "12px",
            background: "#39ff14",
            color: "#000",
            fontWeight: "900",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          LOG RECOVERY
        </button>

        {message && (
          <div
            style={{
              marginTop: "16px",
              padding: "13px",
              borderRadius: "10px",
              background: "rgba(57,255,20,0.06)",
              border: `1px solid ${message.color}`,
              color: message.color,
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            {message.text}
          </div>
        )}
      </form>

      {/* SAFETY CARD */}
      <section
        style={{
          marginTop: "20px",
          padding: "18px",
          borderRadius: "18px",
          background: "rgba(57,255,20,0.04)",
          border: "1px solid rgba(57,255,20,0.2)",
        }}
      >
        <strong style={{ color: "#39ff14" }}>
          Recovery Rule
        </strong>

        <p
          style={{
            color: "#999",
            fontSize: "13px",
            lineHeight: "1.6",
            marginBottom: 0,
          }}
        >
          If sleep is below 7 hours or sleep quality is below
          3/5, YouthAthleteOS flags a Recovery Deficit and
          recommends reducing training intensity.
        </p>
      </section>

      {/* HISTORY */}
      <section style={{ marginTop: "28px" }}>
        <h2>Recovery History</h2>

        {recentRecovery.length === 0 ? (
          <div
            style={{
              padding: "30px 15px",
              textAlign: "center",
              color: "#666",
              border: "1px dashed #333",
              borderRadius: "16px",
            }}
          >
            No recovery logs yet.
          </div>
        ) : (
          recentRecovery.map((entry) => {
            const status = getRecoveryStatus(
              Number(entry.score || 0)
            );

            return (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "#121212",
                  border: "1px solid #252525",
                  borderRadius: "14px",
                  padding: "15px",
                  marginBottom: "10px",
                }}
              >
                <div>
                  <strong>
                    {Number(entry.hours).toFixed(1)} hours
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#777",
                      fontSize: "12px",
                    }}
                  >
                    Quality {entry.quality}/5 · Readiness{" "}
                    {entry.readiness}/5
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong
                    style={{
                      display: "block",
                      color: status.color,
                      fontSize: "22px",
                    }}
                  >
                    {entry.score}
                  </strong>

                  <span
                    style={{
                      color: "#777",
                      fontSize: "10px",
                    }}
                  >
                    RECOVERY
                  </span>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginTop: "18px",
  marginBottom: "8px",
  fontSize: "12px",
  color: "#aaa",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "#080808",
  color: "#fff",
  border: "1px solid #303030",
  borderRadius: "10px",
  padding: "13px",
  outline: "none",
};

const ratingGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: "8px",
};

const ratingLabels = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "7px",
  color: "#666",
  fontSize: "10px",
};

function ratingButton(active) {
  return {
    padding: "13px 5px",
    borderRadius: "10px",
    border: active
      ? "1px solid #39ff14"
      : "1px solid #303030",
    background: active
      ? "rgba(57,255,20,0.12)"
      : "#080808",
    color: active ? "#39ff14" : "#777",
    cursor: "pointer",
    fontWeight: "700",
  };
}