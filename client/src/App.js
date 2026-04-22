import React, { useState } from "react";
import "./App.css";

function App() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("Medium");
  const [interests, setInterests] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("https://group10comp380lab4.onrender.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination,
          days,
          budget,
          interests,
        }),
      });

      const data = await response.json();
      setResult(data.result || data.error);
    } catch (error) {
      setResult("Error connecting to server.");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Travel Itinerary Planner</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          required
        />

        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <textarea
          placeholder="Interests (e.g. food, museums, beaches)"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          required
        />

        <button type="submit">Generate Itinerary</button>
      </form>

      {loading && <p>Thinking...</p>}

      {result && (
        <div className="output">
          <h2>Your Itinerary</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}

export default App;