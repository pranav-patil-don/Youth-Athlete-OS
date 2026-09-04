function getLevel(xp) {
  if (xp >= 1000) return "Elite Athlete";
  if (xp >= 500) return "Rising Star";
  if (xp >= 200) return "Developing Athlete";
  return "Novice Athlete";
}

export default function Dashboard({ data }) {
  const profile =
    data?.profile && typeof data.profile === "object"
      ? data.profile
      : {};

  const activities = Array.isArray(data?.activities)
    ? data.activities
    : [];

  const recovery = Array.isArray(data?.recovery)
    ? data.recovery
    : [];

  const nutrition = Array.isArray(data?.nutrition)
    ? data.nutrition
    : [];

  const strength = Array.isArray(data?.strengthWorkouts)
    ? data.strengthWorkouts
    : [];

  const xp = Number(profile.xp || 0);
  const bodyWeight = Number(profile.bodyWeight || 55);

  // Nutrition totals from ALL logs
  // Later we can make this daily/weekly analytics.
  const totalWater = nutrition.reduce(
    (total, item) => total + Number(item?.water || 0),
    0
  );

  const totalProtein = nutrition.reduce(
    (total, item) => total + Number(item?.protein || 0),
    0
  );

  const latestNutrition =
    nutrition.length > 0
      ? nutrition[nutrition.length - 1]
      : null;

  const latestRecovery =
    recovery.length > 0
      ? recovery[recovery.length - 1]
      : null;

  const waterTarget = bodyWeight * 0.035;
  const proteinTarget = bodyWeight * 1.6;

  const waterProgress = Math.min(
    100,
    Math.round((totalWater / waterTarget) * 100)
  );

  const proteinProgress = Math.min(
    100,
    Math.round((totalProtein / proteinTarget) * 100)
  );

  return (
    <div style={{ paddingBottom: "100px" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "24px" }}>
        <p style={eyebrowStyle}>YOUTHATHLETEOS</p>

        <h1 style={{ margin: "6px 0", fontSize: "28px" }}>
          Athlete Command Center
        </h1>

        <p style={{ color: "#777", margin: 0 }}>
          Track. Recover. Improve.
        </p>
      </div>

      {/* XP */}
      <section style={xpCard}>
        <span style={smallLabel}>ATHLETE LEVEL</span>

        <h2 style={{ color: "#39ff14", margin: "8px 0" }}>
          {getLevel(xp)}
        </h2>

        <strong style={{ fontSize: "25px" }}>
          {xp} XP
        </strong>
      </section>

      {/* QUICK STATS */}
      <div style={grid}>
        <Stat
          label="WORKOUTS"
          value={activities.length + strength.length}
        />

        <Stat
          label="FUEL SCORE"
          value={latestNutrition?.fuelScore || "--"}
          green
        />

        <Stat
          label="SLEEP"
          value={
            latestRecovery
              ? `${latestRecovery.hours}h`
              : "--"
          }
        />

        <Stat
          label="NUTRITION"
          value={nutrition.length}
        />
      </div>

      {/* TODAY FUEL */}
      <section style={card}>
        <p style={eyebrowStyle}>FUEL STATUS</p>

        <h2 style={{ marginTop: "8px" }}>
          Nutrition Progress
        </h2>

        <Progress
          label="Water"
          value={`${totalWater.toFixed(1)} / ${waterTarget.toFixed(1)} L`}
          percent={waterProgress}
        />

        <Progress
          label="Protein"
          value={`${totalProtein.toFixed(0)} / ${proteinTarget.toFixed(0)} g`}
          percent={proteinProgress}
        />

        {nutrition.length === 0 && (
          <p style={{ color: "#666" }}>
            No nutrition logged yet.
          </p>
        )}
      </section>

      {/* RECOVERY */}
      <section style={card}>
        <p style={eyebrowStyle}>RECOVERY</p>

        {latestRecovery ? (
          <>
            <h2>
              {Number(latestRecovery.hours) < 7
                ? "Recovery Deficit"
                : "Recovery On Track"}
            </h2>

            <p style={{ color: "#888" }}>
              Sleep {latestRecovery.hours}h · Quality{" "}
              {latestRecovery.quality}/5 · Readiness{" "}
              {latestRecovery.readiness}/5
            </p>
          </>
        ) : (
          <p style={{ color: "#666" }}>
            Log recovery data to see your status.
          </p>
        )}
      </section>

      {/* RECENT NUTRITION */}
      {nutrition.length > 0 && (
        <section style={card}>
          <p style={eyebrowStyle}>LATEST FUEL LOG</p>

          <h2 style={{ color: "#39ff14" }}>
            {Number(latestNutrition?.water || 0).toFixed(1)}L Water
          </h2>

          <p style={{ color: "#aaa" }}>
            Protein: {latestNutrition?.protein || 0}g
          </p>

          <p style={{ color: "#777" }}>
            Recovery Fuel Score:{" "}
            {latestNutrition?.fuelScore || 0}/100
          </p>
        </section>
      )}
    </div>
  );
}

function Stat({ label, value, green = false }) {
  return (
    <div style={statCard}>
      <p style={smallLabel}>{label}</p>

      <strong
        style={{
          fontSize: "24px",
          color: green ? "#39ff14" : "#fff",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function Progress({ label, value, percent }) {
  return (
    <div style={{ marginTop: "18px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "7px",
          fontSize: "13px",
        }}
      >
        <span style={{ color: "#aaa" }}>{label}</span>

        <strong style={{ color: "#39ff14" }}>
          {value}
        </strong>
      </div>

      <div
        style={{
          height: "8px",
          background: "#050505",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: "#39ff14",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

const card = {
  background: "#121212",
  border: "1px solid #292929",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "15px",
};

const xpCard = {
  ...card,
  border: "1px solid #39ff14",
  boxShadow: "0 0 20px rgba(57,255,20,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginBottom: "15px",
};

const statCard = {
  background: "#121212",
  border: "1px solid #292929",
  borderRadius: "15px",
  padding: "15px",
};

const eyebrowStyle = {
  color: "#39ff14",
  fontSize: "10px",
  fontWeight: "800",
  letterSpacing: "2px",
  margin: 0,
};

const smallLabel = {
  color: "#777",
  fontSize: "9px",
  fontWeight: "800",
  letterSpacing: "1.5px",
  margin: "0 0 8px",
};