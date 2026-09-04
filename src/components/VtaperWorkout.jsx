import { useMemo, useState } from "react";
import { exercises } from "../data/exercises.js";

const categories = ["All", "Lats", "Shoulders", "Core & Stability"];

export default function VtaperWorkout({
  data,
  addStrengthWorkout,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [rpe, setRpe] = useState(7);

  const [sessionSets, setSessionSets] = useState([]);
  const [message, setMessage] = useState("");

  const bodyWeight = Number(
    data.profile?.bodyWeight || 55
  );

  const filteredExercises = useMemo(() => {
    if (selectedCategory === "All") {
      return exercises;
    }

    return exercises.filter(
      (exercise) =>
        exercise.category === selectedCategory
    );
  }, [selectedCategory]);

  function selectExercise(exercise) {
    setSelectedExercise(exercise);
    setReps("");
    setWeight("");
    setRpe(7);
    setMessage("");
  }

  function getExerciseSetCount(exerciseId) {
    return sessionSets.filter(
      (set) => set.exerciseId === exerciseId
    ).length;
  }

  function handleLogSet() {
    if (!selectedExercise) return;

    const repsValue = Number(reps);
    const weightValue = Number(weight || 0);
    const rpeValue = Number(rpe);

    if (
      selectedExercise.reps.includes("sec")
        ? repsValue <= 0
        : repsValue <= 0
    ) {
      setMessage({
        text: "Please enter a valid number.",
        color: "#ff5555",
      });
      return;
    }

    // Youth safety: maximum 4 sets per exercise
    const existingSets = getExerciseSetCount(
      selectedExercise.id
    );

    if (existingSets >= 4) {
      setMessage({
        text: "Safety limit reached: maximum 4 sets per exercise.",
        color: "#ffb84d",
      });
      return;
    }

    // Youth safety warning for isolation exercises
    const isolationExercises = [
      "lateral-raises",
      "ytw-raises",
      "band-pullaparts",
      "straight-arm-pulldown",
    ];

    if (
      isolationExercises.includes(selectedExercise.id) &&
      weightValue > bodyWeight * 0.7
    ) {
      setMessage({
        text: "Safety flag: this load is unusually high for an isolation exercise. Reduce weight and prioritize controlled technique.",
        color: "#ff5555",
      });
      return;
    }

    // High RPE safety warning
    if (rpeValue >= 9) {
      setMessage({
        text: "High RPE detected. Avoid repeated near-maximal effort. Consider reducing load or difficulty.",
        color: "#ff5555",
      });
    } else if (rpeValue <= 7) {
      setMessage({
        text: "Good controlled effort logged. Track consistency before progressing.",
        color: "#39ff14",
      });
    } else {
      setMessage({
        text: "Set logged successfully.",
        color: "#ffb84d",
      });
    }

    const newSet = {
      id: Date.now(),
      exerciseId: selectedExercise.id,
      exerciseName: selectedExercise.name,
      category: selectedExercise.category,
      reps: repsValue,
      weight: weightValue,
      rpe: rpeValue,
    };

    setSessionSets((previous) => [
      ...previous,
      newSet,
    ]);

    setReps("");
    setWeight("");
  }

  function removeSet(id) {
    setSessionSets((previous) =>
      previous.filter((set) => set.id !== id)
    );
  }

  function getProgressionAdvice() {
    if (sessionSets.length === 0) {
      return {
        title: "Ready to Train",
        text: "Focus on controlled repetitions and good technique.",
        color: "#777",
      };
    }

    const averageRpe =
      sessionSets.reduce(
        (total, set) => total + Number(set.rpe),
        0
      ) / sessionSets.length;

    if (averageRpe >= 9) {
      return {
        title: "Deload Suggested",
        text: "Your session intensity is very high. Consider reducing load, reps, or difficulty next session.",
        color: "#ff5555",
      };
    }

    if (averageRpe <= 7) {
      return {
        title: "Controlled Training",
        text: "If this effort stays at RPE 7 or below for two sessions, consider adding +1 rep or progressing slightly.",
        color: "#39ff14",
      };
    }

    return {
      title: "Maintain Current Load",
      text: "Stay focused on form and consistent training.",
      color: "#ffb84d",
    };
  }

  function finishWorkout() {
    if (sessionSets.length === 0) {
      setMessage({
        text: "Log at least one set before finishing.",
        color: "#ff5555",
      });
      return;
    }

    const averageRpe =
      sessionSets.reduce(
        (total, set) => total + Number(set.rpe),
        0
      ) / sessionSets.length;

    const workout = {
      id: Date.now(),
      date: new Date().toISOString(),
      sets: sessionSets,
      totalSets: sessionSets.length,
      averageRpe: Number(averageRpe.toFixed(1)),
    };

    addStrengthWorkout(workout);

    setSessionSets([]);
    setSelectedExercise(null);

    setMessage({
      text: "Strength session completed! +40 XP awarded.",
      color: "#39ff14",
    });
  }

  const progression = getProgressionAdvice();

  const groupedSets = sessionSets.reduce(
    (groups, set) => {
      if (!groups[set.exerciseName]) {
        groups[set.exerciseName] = [];
      }

      groups[set.exerciseName].push(set);
      return groups;
    },
    {}
  );

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
          YOUTH STRENGTH SYSTEM
        </p>

        <h1
          style={{
            margin: "8px 0",
            fontSize: "30px",
          }}
        >
          V-Taper Hub
        </h1>

        <p
          style={{
            color: "#777",
            margin: 0,
            lineHeight: "1.5",
          }}
        >
          Shoulders, lats and stability training with
          age-appropriate volume and effort controls.
        </p>
      </section>

      {/* SAFETY RULES */}
      <section
        style={{
          background: "rgba(57,255,20,0.05)",
          border: "1px solid rgba(57,255,20,0.25)",
          borderRadius: "18px",
          padding: "18px",
          marginBottom: "22px",
        }}
      >
        <strong
          style={{
            color: "#39ff14",
            display: "block",
            marginBottom: "10px",
          }}
        >
          AGE-APPROPRIATE TRAINING RULES
        </strong>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            fontSize: "12px",
            color: "#aaa",
          }}
        >
          <div>✓ Focus on technique</div>
          <div>✓ Controlled movement</div>
          <div>✓ Usually 10–15 reps</div>
          <div>✓ Maximum 3–4 sets</div>
          <div>✓ Track RPE</div>
          <div>✕ No max lifting</div>
        </div>

        <p
          style={{
            color: "#777",
            fontSize: "11px",
            lineHeight: "1.5",
            marginBottom: 0,
          }}
        >
          Progress gradually. Stop if movement causes pain,
          dizziness, or unusual discomfort. Supervision and
          qualified coaching are recommended when learning
          resistance exercises.
        </p>
      </section>

      {/* CATEGORY FILTER */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "18px",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              setSelectedCategory(category)
            }
            style={{
              whiteSpace: "nowrap",
              padding: "10px 14px",
              borderRadius: "20px",
              border:
                selectedCategory === category
                  ? "1px solid #39ff14"
                  : "1px solid #333",
              background:
                selectedCategory === category
                  ? "rgba(57,255,20,0.12)"
                  : "#121212",
              color:
                selectedCategory === category
                  ? "#39ff14"
                  : "#888",
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* EXERCISE LIBRARY */}
      <section>
        <h2 style={{ fontSize: "18px" }}>
          Exercise Library
        </h2>

        {filteredExercises.map((exercise) => {
          const setCount = getExerciseSetCount(
            exercise.id
          );

          return (
            <button
              key={exercise.id}
              type="button"
              onClick={() => selectExercise(exercise)}
              style={{
                width: "100%",
                textAlign: "left",
                background:
                  selectedExercise?.id === exercise.id
                    ? "rgba(57,255,20,0.07)"
                    : "#121212",
                border:
                  selectedExercise?.id === exercise.id
                    ? "1px solid #39ff14"
                    : "1px solid #282828",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "10px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>{exercise.name}</strong>

                  <p
                    style={{
                      color: "#777",
                      fontSize: "11px",
                      margin: "5px 0",
                    }}
                  >
                    {exercise.category} · {exercise.type}
                  </p>
                </div>

                <span
                  style={{
                    color: "#39ff14",
                    fontSize: "11px",
                  }}
                >
                  {setCount}/4 SETS
                </span>
              </div>

              <p
                style={{
                  color: "#aaa",
                  fontSize: "12px",
                  marginBottom: 0,
                  lineHeight: "1.5",
                }}
              >
                💡 {exercise.cue}
              </p>
            </button>
          );
        })}
      </section>

      {/* SET LOGGER */}
      {selectedExercise && (
        <section
          style={{
            marginTop: "22px",
            background: "#121212",
            border: "1px solid #39ff14",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <p
            style={{
              color: "#39ff14",
              fontSize: "10px",
              letterSpacing: "2px",
              margin: 0,
            }}
          >
            SELECTED EXERCISE
          </p>

          <h2
            style={{
              marginTop: "8px",
              fontSize: "21px",
            }}
          >
            {selectedExercise.name}
          </h2>

          <p
            style={{
              color: "#777",
              fontSize: "12px",
            }}
          >
            Target: {selectedExercise.target} · Suggested:{" "}
            {selectedExercise.reps}
          </p>

          <label style={labelStyle}>
            Reps / Seconds
          </label>

          <input
            type="number"
            min="1"
            placeholder="Enter reps"
            value={reps}
            onChange={(event) =>
              setReps(event.target.value)
            }
            style={inputStyle}
          />

          <label style={labelStyle}>
            Weight (kg)
          </label>

          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="0 for bodyweight"
            value={weight}
            onChange={(event) =>
              setWeight(event.target.value)
            }
            style={inputStyle}
          />

          <label style={labelStyle}>
            Rate of Perceived Exertion (RPE)
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: "4px",
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
              (value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRpe(value)}
                  style={{
                    padding: "10px 2px",
                    borderRadius: "7px",
                    border:
                      rpe === value
                        ? "1px solid #39ff14"
                        : "1px solid #303030",
                    background:
                      rpe === value
                        ? "rgba(57,255,20,0.15)"
                        : "#080808",
                    color:
                      rpe === value
                        ? "#39ff14"
                        : "#777",
                    cursor: "pointer",
                    fontSize: "11px",
                  }}
                >
                  {value}
                </button>
              )
            )}
          </div>

          <p
            style={{
              color: "#777",
              fontSize: "11px",
            }}
          >
            RPE 6–8 = controlled effort · RPE 9–10 =
            very difficult
          </p>

          <button
            type="button"
            onClick={handleLogSet}
            style={{
              width: "100%",
              padding: "15px",
              marginTop: "12px",
              border: "none",
              borderRadius: "12px",
              background: "#39ff14",
              color: "#000",
              fontWeight: "900",
              cursor: "pointer",
            }}
          >
            LOG SET
          </button>
        </section>
      )}

      {/* SESSION SETS */}
      {sessionSets.length > 0 && (
        <section
          style={{
            marginTop: "24px",
          }}
        >
          <h2>Current Session</h2>

          {Object.entries(groupedSets).map(
            ([exerciseName, sets]) => (
              <div
                key={exerciseName}
                style={{
                  background: "#121212",
                  border: "1px solid #292929",
                  borderRadius: "16px",
                  padding: "15px",
                  marginBottom: "10px",
                }}
              >
                <strong>{exerciseName}</strong>

                {sets.map((set, index) => (
                  <div
                    key={set.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                      paddingTop: "10px",
                      borderTop:
                        "1px solid #252525",
                      color: "#999",
                      fontSize: "12px",
                    }}
                  >
                    <span>
                      Set {index + 1}: {set.reps} reps
                      {set.weight > 0
                        ? ` · ${set.weight}kg`
                        : " · Bodyweight"}{" "}
                      · RPE {set.rpe}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        removeSet(set.id)
                      }
                      style={{
                        background: "transparent",
                        color: "#ff5555",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )
          )}

          <div
            style={{
              padding: "16px",
              background: "#080808",
              border: `1px solid ${progression.color}`,
              borderRadius: "14px",
              marginTop: "16px",
            }}
          >
            <strong
              style={{
                color: progression.color,
              }}
            >
              {progression.title}
            </strong>

            <p
              style={{
                color: "#888",
                fontSize: "12px",
                lineHeight: "1.5",
                marginBottom: 0,
              }}
            >
              {progression.text}
            </p>
          </div>

          <button
            type="button"
            onClick={finishWorkout}
            style={{
              width: "100%",
              marginTop: "18px",
              padding: "16px",
              border: "1px solid #39ff14",
              borderRadius: "12px",
              background: "#39ff14",
              color: "#000",
              fontWeight: "900",
              cursor: "pointer",
            }}
          >
            FINISH STRENGTH SESSION +40 XP
          </button>
        </section>
      )}

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "14px",
            borderRadius: "12px",
            border: `1px solid ${message.color}`,
            background: "#121212",
            color: message.color,
            fontSize: "13px",
            lineHeight: "1.5",
          }}
        >
          {message.text}
        </div>
      )}

      {/* RECENT WORKOUTS */}
      <section style={{ marginTop: "30px" }}>
        <h2>Strength History</h2>

        {!data.strengthWorkouts ||
        data.strengthWorkouts.length === 0 ? (
          <div
            style={{
              padding: "28px",
              textAlign: "center",
              color: "#666",
              border: "1px dashed #333",
              borderRadius: "16px",
            }}
          >
            No strength sessions completed yet.
          </div>
        ) : (
          [...data.strengthWorkouts]
            .reverse()
            .slice(0, 5)
            .map((workout) => (
              <div
                key={workout.id}
                style={{
                  background: "#121212",
                  border: "1px solid #292929",
                  borderRadius: "14px",
                  padding: "15px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <strong>
                    Strength Session
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#777",
                      fontSize: "12px",
                    }}
                  >
                    {workout.totalSets} total sets
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <strong
                    style={{
                      color: "#39ff14",
                    }}
                  >
                    RPE {workout.averageRpe}
                  </strong>

                  <p
                    style={{
                      margin: "5px 0 0",
                      color: "#666",
                      fontSize: "10px",
                    }}
                  >
                    AVG RPE
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