import { useMemo, useState } from "react";

function formatPace(minutesPerKm) {
  if (!Number.isFinite(minutesPerKm) || minutesPerKm <= 0) {
    return "--";
  }

  const minutes = Math.floor(minutesPerKm);
  const seconds = Math.round((minutesPerKm - minutes) * 60);

  return `${minutes}:${String(seconds).padStart(2, "0")} min/km`;
}

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export default function ActivityLogger({ data, addActivity }) {
  const [sport, setSport] = useState("Running");
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [message, setMessage] = useState("");

  const activities = Array.isArray(data?.activities)
    ? data.activities
    : [];

  const calculation = useMemo(() => {
    const distanceKm = Number(distance);

    const totalSeconds =
      Number(hours || 0) * 3600 +
      Number(minutes || 0) * 60 +
      Number(seconds || 0);

    if (
      !Number.isFinite(distanceKm) ||
      distanceKm <= 0 ||
      totalSeconds <= 0
    ) {
      return null;
    }

    const totalHours = totalSeconds / 3600;

    const speed = distanceKm / totalHours;

    const paceMinutesPerKm =
      (totalSeconds / 60) / distanceKm;

    return {
      distanceKm,
      totalSeconds,
      speed,
      paceMinutesPerKm,
    };
  }, [distance, hours, minutes, seconds]);

  function getPreviousActivity() {
    const sameSport = activities.filter(
      (activity) =>
        activity?.sport === sport &&
        Number(activity?.speed) > 0
    );

    if (sameSport.length === 0) return null;

    return sameSport[sameSport.length - 1];
  }

  function getPersonalBest(currentSpeed) {
    const sameSport = activities.filter(
      (activity) => activity?.sport === sport
    );

    if (sameSport.length === 0) {
      return true;
    }

    const bestPreviousSpeed = Math.max(
      ...sameSport.map((activity) =>
        Number(activity?.speed || 0)
      )
    );

    return currentSpeed > bestPreviousSpeed;
  }

  function calculateTrainingLoad() {
    if (!calculation) return 0;

    // Simple youth-friendly estimate.
    // Duration is the primary load factor.
    const durationMinutes =
      calculation.totalSeconds / 60;

    let sportMultiplier = 1;

    if (sport === "Cycling") sportMultiplier = 0.9;
    if (sport === "Swimming") sportMultiplier = 1.1;
    if (sport === "Running") sportMultiplier = 1.2;

    return Math.round(
      durationMinutes * sportMultiplier
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    if (!calculation) {
      setMessage(
        "Please enter a valid distance and workout time."
      );
      return;
    }

    // Safety check
    if (
      sport === "Running" &&
      calculation.speed > 40
    ) {
      setMessage(
        "⚠️ Speed seems too high for running. Check your distance and time."
      );
      return;
    }

    const previous = getPreviousActivity();

    let improvement = null;

    if (previous && Number(previous.speed) > 0) {
      improvement =
        ((calculation.speed -
          Number(previous.speed)) /
          Number(previous.speed)) *
        100;
    }

    const isPersonalBest = getPersonalBest(
      calculation.speed
    );

    const activity = {
      id: Date.now(),

      sport,

      distance: calculation.distanceKm,

      totalSeconds: calculation.totalSeconds,

      time: formatTime(
        calculation.totalSeconds
      ),

      speed: calculation.speed,

      pace: calculation.paceMinutesPerKm,

      formattedPace: formatPace(
        calculation.paceMinutesPerKm
      ),

      improvement,

      personalBest: isPersonalBest,

      trainingLoad: calculateTrainingLoad(),

      date: new Date().toISOString(),
    };

    addActivity(activity);

    let successMessage = "Workout logged! +50 XP";

    if (isPersonalBest) {
      successMessage += " 🏆 NEW PERSONAL BEST!";
    }

    if (
      improvement !== null &&
      improvement > 0
    ) {
      successMessage += ` 📈 +${improvement.toFixed(
        1
      )}% faster than your previous session.`;
    }

    setMessage(successMessage);

    setDistance("");
    setHours("");
    setMinutes("");
    setSeconds("");
  }

  const previous = getPreviousActivity();

  return (
    <div className="page-container">
      <div className="page-header">
        <p className="eyebrow">ACTIVITY INTELLIGENCE</p>

        <h1>Log Training</h1>

        <p>
          Track your cardio performance and
          automatically measure progress.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* SPORT SELECTOR */}
        <section className="card">
          <p className="section-label">
            SELECT SPORT
          </p>

          <div className="sport-grid">
            {["Running", "Cycling", "Swimming"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={`sport-button ${
                    sport === item ? "active" : ""
                  }`}
                  onClick={() => setSport(item)}
                >
                  <span className="sport-icon">
                    {item === "Running"
                      ? "🏃"
                      : item === "Cycling"
                      ? "🚴"
                      : "🏊"}
                  </span>

                  {item}
                </button>
              )
            )}
          </div>
        </section>

        {/* DISTANCE */}
        <section className="card">
          <p className="section-label">
            DISTANCE
          </p>

          <div className="input-with-unit">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={distance}
              onChange={(event) =>
                setDistance(event.target.value)
              }
            />

            <span>KM</span>
          </div>
        </section>

        {/* TIME */}
        <section className="card">
          <p className="section-label">
            WORKOUT TIME
          </p>

          <div className="time-grid">
            <div>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                placeholder="00"
                value={hours}
                onChange={(event) =>
                  setHours(event.target.value)
                }
              />

              <span>HOURS</span>
            </div>

            <div>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="59"
                placeholder="00"
                value={minutes}
                onChange={(event) =>
                  setMinutes(event.target.value)
                }
              />

              <span>MIN</span>
            </div>

            <div>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="59"
                placeholder="00"
                value={seconds}
                onChange={(event) =>
                  setSeconds(event.target.value)
                }
              />

              <span>SEC</span>
            </div>
          </div>
        </section>

        {/* LIVE CALCULATIONS */}
        {calculation && (
          <section className="card highlight-card">
            <p className="section-label">
              LIVE PERFORMANCE
            </p>

            <div className="performance-grid">
              <div>
                <span>SPEED</span>

                <strong>
                  {calculation.speed.toFixed(2)}
                </strong>

                <small>km/h</small>
              </div>

              <div>
                <span>PACE</span>

                <strong>
                  {formatPace(
                    calculation.paceMinutesPerKm
                  ).split(" ")[0]}
                </strong>

                <small>min/km</small>
              </div>

              <div>
                <span>LOAD</span>

                <strong>
                  {calculateTrainingLoad()}
                </strong>

                <small>points</small>
              </div>
            </div>

            {previous && (
              <div className="comparison-box">
                <span>
                  Previous {sport} Speed
                </span>

                <strong>
                  {Number(previous.speed).toFixed(
                    2
                  )}{" "}
                  km/h
                </strong>

                {Number(previous.speed) > 0 && (
                  <p
                    className={
                      calculation.speed >=
                      Number(previous.speed)
                        ? "positive"
                        : "negative"
                    }
                  >
                    {calculation.speed >=
                    Number(previous.speed)
                      ? "↑"
                      : "↓"}{" "}
                    {Math.abs(
                      ((calculation.speed -
                        Number(previous.speed)) /
                        Number(previous.speed)) *
                        100
                    ).toFixed(1)}
                    % vs previous session
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        {/* MESSAGE */}
        {message && (
          <div
            className={
              message.includes("⚠️")
                ? "warning-message"
                : "success-message"
            }
          >
            {message}
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="primary-button"
        >
          LOG WORKOUT +50 XP
        </button>
      </form>

      {/* RECENT ACTIVITIES */}
      <section className="recent-section">
        <p className="section-label">
          RECENT SESSIONS
        </p>

        {activities.length === 0 ? (
          <div className="empty-card">
            <p>No workouts logged yet.</p>
            <span>
              Your performance history will appear
              here.
            </span>
          </div>
        ) : (
          activities
            .slice(-5)
            .reverse()
            .map((activity) => (
              <div
                className="activity-history-card"
                key={activity.id}
              >
                <div>
                  <strong>
                    {activity.sport}
                  </strong>

                  <p>
                    {Number(
                      activity.distance
                    ).toFixed(2)}{" "}
                    km · {activity.time}
                  </p>
                </div>

                <div className="history-stats">
                  <strong>
                    {Number(
                      activity.speed
                    ).toFixed(1)}
                  </strong>

                  <span>km/h</span>

                  {activity.personalBest && (
                    <small>🏆 PB</small>
                  )}
                </div>
              </div>
            ))
        )}
      </section>
    </div>
  );
}