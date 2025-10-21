import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ title: "", load: "", reps: "" });
  const [editing, setEditing] = useState(null);

  // Fetch workouts from the backend
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
    <div className="min-h-screen flex flex-col items-center py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Workout Tracker 🏋🏽‍♂️
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 mb-6"
        >
          <input
            type="text"
            name="title"
            placeholder="Workout title"
            value={form.title}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            name="load"
            placeholder="Load (kg)"
            value={form.load}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            name="reps"
            placeholder="Reps"
            value={form.reps}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            {editing ? "Update Workout" : "Add Workout"}
          </button>
        </form>

        {/* Workout List */}
        <div className="space-y-3">
          {workouts.length > 0 ? (
            workouts.map((w) => (
              <div
                key={w._id}
                className="p-4 bg-gray-50 rounded-xl shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{w.title}</p>
                  <p className="text-sm text-gray-600">
                    {w.reps} reps • {w.load} kg
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(w)}
                    className="text-sm px-2 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="text-sm px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No workouts yet... start by adding one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;


