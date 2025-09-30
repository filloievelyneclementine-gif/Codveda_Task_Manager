import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  // Add new task
  const addTask = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
      })
      .catch((err) => console.error("Add task error:", err));
  };

  // Mark as done
  const markDone = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
      })
      .catch((err) => console.error("Mark done error:", err));
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, { method: "DELETE" })
      .then(() => setTasks(tasks.filter((t) => t.id !== id)))
      .catch((err) => console.error("Delete task error:", err));
  };

  return (
    <div style={{ fontFamily: "Arial", margin: "20px", maxWidth: "600px" }}>
      <h1 style={{ color: "#2b7a78" }}>✅ Task Manager</h1>
      <form onSubmit={addTask} style={{ marginBottom: "20px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          style={{ marginRight: "10px", padding: "5px", width: "40%" }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          style={{ marginRight: "10px", padding: "5px", width: "40%" }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 12px",
            background: "#2b7a78",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Task
        </button>
      </form>
      {tasks.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "10px",
            marginBottom: "10px",
            background: t.status === "done" ? "#6dd184ff" : "#fff",
          }}
        >
          <h3>{t.title}</h3>
          <p>{t.description}</p>
          <p>
            Status: <b>{t.status}</b>
          </p>
          {t.status === "pending" && (
            <button
              onClick={() => markDone(t.id)}
              style={{
                padding: "5px 10px",
                marginRight: "10px",
                background: "#17a2b8",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Mark Done
            </button>
          )}
          <button
            onClick={() => deleteTask(t.id)}
            style={{
              padding: "5px 10px",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;