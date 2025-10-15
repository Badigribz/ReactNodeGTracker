// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ title: "", load: "", reps: "" });
  const [editing, setEditing] = useState(null); // track if updating a workout

  // Fetch all workouts
  const fetchWorkouts = async () => {
    try {
      const res = await API.get("/");
      setWorkouts(res.data);
    } catch (err) {
      console.error("Error fetching workouts:", err.message);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or Update workout
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.patch(`/${editing}`, form);
        setEditing(null);
      } else {
        await API.post("/", form);
      }
      setForm({ title: "", load: "", reps: "" });
      fetchWorkouts();
    } catch (err) {
      console.error("Error saving workout:", err.message);
    }
  };

  // Delete workout
  const handleDelete = async (id) => {
    try {
      await API.delete(`/${id}`);
      fetchWorkouts();
    } catch (err) {
      console.error("Error deleting workout:", err.message);
    }
  };

  // Start editing
  const handleEdit = (workout) => {
    setForm({
      title: workout.title,
      load: workout.load,
      reps: workout.reps,
    });
    setEditing(workout._id);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Workout Tracker 🏋🏽‍♂️</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          maxWidth: "300px",
        }}
      >
        <input
          type="text"
          name="title"
          placeholder="Workout title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="load"
          placeholder="Load (kg)"
          value={form.load}
          onChange={handleChange}
        />
        <input
          type="number"
          name="reps"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
        />
        <button type="submit">
          {editing ? "Update Workout" : "Add Workout"}
        </button>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      {/* Workout list */}
      {workouts.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {workouts.map((w) => (
            <li
              key={w._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                borderBottom: "1px solid #ddd",
              }}
            >
              <div>
                <strong>{w.title}</strong> — {w.reps} reps, {w.load} kg
              </div>
              <div>
                <button onClick={() => handleEdit(w)}>Edit</button>{" "}
                <button onClick={() => handleDelete(w._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No workouts yet...</p>
      )}
    </div>
  );
}

export default App;

