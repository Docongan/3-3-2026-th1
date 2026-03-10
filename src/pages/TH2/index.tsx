import { useEffect, useState } from "react";

interface Session {
  id: number;
  date: string;
  duration: number;
  content: string;
  note: string;
}

interface Subject {
  id: number;
  name: string;
  sessions: Session[];
  goal: number;
}

const defaultSubjects: Subject[] = [
  { id: 1, name: "Toán", sessions: [], goal: 0 },
  { id: 2, name: "Văn", sessions: [], goal: 0 },
  { id: 3, name: "Anh", sessions: [], goal: 0 },
];

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const [session, setSession] = useState<Omit<Session, "id">>({
    date: "",
    duration: 0,
    content: "",
    note: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("subjects");
    if (data) setSubjects(JSON.parse(data));
    else setSubjects(defaultSubjects);
  }, []);

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!newSubject.trim()) return;

    setSubjects([
      ...subjects,
      { id: Date.now(), name: newSubject, sessions: [], goal: 0 },
    ]);
    setNewSubject("");
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const addSession = () => {
    if (!selectedSubject) return;

    const newSession: Session = { ...session, id: Date.now() };

    const updated = subjects.map((s) =>
      s.id === selectedSubject.id
        ? { ...s, sessions: [...s.sessions, newSession] }
        : s
    );

    setSubjects(updated);
    setSession({ date: "", duration: 0, content: "", note: "" });
  };

  const setGoal = (id: number, goal: number) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, goal } : s))
    );
  };

  const calculateTotal = (subject: Subject) =>
    subject.sessions.reduce((t, s) => t + s.duration, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#4a47a3" }}>
          📚 Quản Lý Tiến Độ Học Tập
        </h1>

        {/* Add Subject */}
        <div style={{ marginBottom: "30px", textAlign: "center" }}>
          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Tên môn học"
            style={{
              padding: "10px",
              width: "60%",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button
            onClick={addSubject}
            style={{
              padding: "10px 20px",
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Thêm
          </button>
        </div>

        {/* Subject List */}
        {subjects.map((subject) => {
          const total = calculateTotal(subject);
          const completed = subject.goal > 0 && total >= subject.goal;

          return (
            <div
              key={subject.id}
              style={{
                background: "#f4f6ff",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "20px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ color: "#333" }}>{subject.name}</h3>

              <p>
                Tổng giờ học:{" "}
                <strong style={{ color: "#4a47a3" }}>{total}</strong>
              </p>

              <input
                type="number"
                placeholder="Mục tiêu tháng (giờ)"
                onChange={(e) =>
                  setGoal(subject.id, Number(e.target.value))
                }
                style={{
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              />

              <p
                style={{
                  color: completed ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {subject.goal > 0
                  ? completed
                    ? "✅ Hoàn thành mục tiêu"
                    : "❌ Chưa đạt mục tiêu"
                  : "Chưa đặt mục tiêu"}
              </p>

              <button
                onClick={() => setSelectedSubject(subject)}
                style={{
                  marginRight: "10px",
                  padding: "8px 15px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Thêm buổi học
              </button>

              <button
                onClick={() => deleteSubject(subject.id)}
                style={{
                  padding: "8px 15px",
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Xóa môn
              </button>

              <ul style={{ marginTop: "15px" }}>
                {subject.sessions.map((s) => (
                  <li key={s.id}>
                    📅 {s.date} | ⏱ {s.duration}h | 📖 {s.content}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* Add Session */}
        {selectedSubject && (
          <div
            style={{
              background: "#eef1ff",
              padding: "20px",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            <h2>Thêm Buổi Học - {selectedSubject.name}</h2>

            <input
              type="date"
              value={session.date}
              onChange={(e) =>
                setSession({ ...session, date: e.target.value })
              }
            />
            <br />
            <br />

            <input
              type="number"
              placeholder="Số giờ"
              value={session.duration}
              onChange={(e) =>
                setSession({
                  ...session,
                  duration: Number(e.target.value),
                })
              }
            />
            <br />
            <br />

            <input
              placeholder="Nội dung"
              value={session.content}
              onChange={(e) =>
                setSession({ ...session, content: e.target.value })
              }
            />
            <br />
            <br />

            <input
              placeholder="Ghi chú"
              value={session.note}
              onChange={(e) =>
                setSession({ ...session, note: e.target.value })
              }
            />
            <br />
            <br />

            <button
              onClick={addSession}
              style={{
                padding: "10px 20px",
                background: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Lưu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;