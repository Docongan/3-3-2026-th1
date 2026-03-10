import { useState, useEffect, useReducer } from "react";

// ─── Reducer (Redux-style) ─────────────────────────────────────────────────
const init = () => ({
  target: Math.floor(Math.random() * 100) + 1,
  guesses: [],
  attemptsLeft: 10,
  status: "playing",
});

function reducer(state, action) {
  switch (action.type) {
    case "GUESS": {
      const val = parseInt(action.payload, 10);
      if (isNaN(val) || val < 1 || val > 100) return state;
      const feedback = val < state.target ? "low" : val > state.target ? "high" : "correct";
      const guesses = [...state.guesses, { val, feedback }];
      const attemptsLeft = state.attemptsLeft - 1;
      const status = feedback === "correct" ? "won" : attemptsLeft === 0 ? "lost" : "playing";
      return { ...state, guesses, attemptsLeft, status };
    }
    case "RESTART":
      return init();
    default:
      return state;
  }
}

const LS_KEY = "guess_scores_v2";
const loadScores = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } };
const saveScores = (s) => localStorage.setItem(LS_KEY, JSON.stringify(s));

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, init);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [scores, setScores] = useState(loadScores);

  useEffect(() => {
    if (state.status === "won") {
      const entry = { attempts: state.guesses.length, date: new Date().toLocaleDateString("vi-VN") };
      const updated = [...scores, entry].sort((a, b) => a.attempts - b.attempts).slice(0, 5);
      setScores(updated);
      saveScores(updated);
    }
  }, [state.status]);

  const handleGuess = () => {
    const val = parseInt(input, 10);
    if (!input || isNaN(val)) return setError("Vui lòng nhập một số!");
    if (val < 1 || val > 100) return setError("Số phải từ 1 đến 100!");
    setError("");
    setInput("");
    dispatch({ type: "GUESS", payload: input });
  };

  const lastGuess = state.guesses[state.guesses.length - 1];
  const fb = lastGuess?.feedback === "low"
    ? { text: "Bạn đoán quá thấp! 📉", color: "#3b82f6" }
    : lastGuess?.feedback === "high"
    ? { text: "Bạn đoán quá cao! 📈", color: "#ef4444" }
    : null;

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f0f4f8; font-family: 'Segoe UI', sans-serif; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "32px 28px", width: "100%", maxWidth: "420px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "32px", marginBottom: "6px" }}>🎯</div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1e293b" }}>Đoán Số Bí Mật</h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginTop: "4px" }}>Một số từ 1 đến 100</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "12px", flexWrap: "wrap" }}>
            {Array.from({ length: 10 }).map((_, i) => {
              const used = 10 - state.attemptsLeft;
              return (
                <div key={i} style={{
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: i < used ? "#fca5a5" : "#86efac",
                  border: `2px solid ${i < used ? "#ef4444" : "#22c55e"}`,
                }} />
              );
            })}
          </div>

          <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
            Còn <strong style={{ color: state.attemptsLeft <= 3 ? "#ef4444" : "#1e293b" }}>{state.attemptsLeft}</strong> lượt đoán
          </p>

          {state.status === "playing" && (
            <>
              {fb && (
                <div style={{
                  background: fb.color + "15", border: `1px solid ${fb.color}44`,
                  borderRadius: "10px", padding: "10px 14px",
                  color: fb.color, fontWeight: 600, fontSize: "14px",
                  textAlign: "center", marginBottom: "16px"
                }}>
                  {fb.text}
                </div>
              )}

              <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <input
                  type="number" min={1} max={100}
                  value={input}
                  onChange={e => { setInput(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleGuess()}
                  placeholder="Nhập số..."
                  autoFocus
                  style={{
                    flex: 1, padding: "12px 14px", borderRadius: "10px",
                    border: `2px solid ${error ? "#ef4444" : "#e2e8f0"}`,
                    fontSize: "16px", outline: "none", color: "#1e293b",
                  }}
                />
                <button onClick={handleGuess} style={{
                  padding: "12px 20px", borderRadius: "10px", border: "none",
                  background: "#3b82f6", color: "#fff", fontWeight: 700,
                  fontSize: "15px", cursor: "pointer"
                }}>
                  Đoán
                </button>
              </div>

              {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>⚠ {error}</p>}
            </>
          )}

          {state.status === "won" && (
            <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎉</div>
              <h2 style={{ color: "#22c55e", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Chúc Mừng!</h2>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Bạn đoán đúng số <strong style={{ color: "#1e293b" }}>{state.target}</strong> trong <strong>{state.guesses.length}</strong> lượt!
              </p>
            </div>
          )}

          {state.status === "lost" && (
            <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>😢</div>
              <h2 style={{ color: "#ef4444", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Hết Lượt!</h2>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                Số đúng là <strong style={{ color: "#ef4444", fontSize: "18px" }}>{state.target}</strong>
              </p>
            </div>
          )}

          {state.status !== "playing" && (
            <button onClick={() => dispatch({ type: "RESTART" })} style={{
              width: "100%", padding: "12px", borderRadius: "10px", border: "none",
              background: "#1e293b", color: "#fff", fontWeight: 700,
              fontSize: "15px", cursor: "pointer", marginBottom: "16px"
            }}>
              Chơi Lại
            </button>
          )}

          {state.guesses.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Lịch sử đoán
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {state.guesses.map((g, i) => (
                  <span key={i} style={{
                    padding: "4px 10px", borderRadius: "20px", fontSize: "13px", fontWeight: 600,
                    background: g.feedback === "correct" ? "#dcfce7" : g.feedback === "low" ? "#dbeafe" : "#fee2e2",
                    color: g.feedback === "correct" ? "#16a34a" : g.feedback === "low" ? "#2563eb" : "#dc2626",
                  }}>
                    {g.val} {g.feedback === "correct" ? "✓" : g.feedback === "low" ? "↑" : "↓"}
                  </span>
                ))}
              </div>
            </div>
          )}

          {scores.length > 0 && (
            <div style={{ marginTop: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
              <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                🏆 Bảng xếp hạng
              </p>
              {scores.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "4px 0", color: "#64748b" }}>
                  <span>{["🥇","🥈","🥉","4.","5."][i]} {s.date}</span>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>{s.attempts} lượt</span>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}