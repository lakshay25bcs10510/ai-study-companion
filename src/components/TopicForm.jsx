import { useState, useContext } from "react";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function TopicForm() {
  const { user } = useContext(AuthContext);

  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [deadline, setDeadline] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const handleSubmit = async () => {
    await addDoc(collection(db, "topics"), {
      userId: user.uid,
      topic,
      subject,
      deadline,
      difficulty,
      completed: false,
    });

    setTopic("");
  };

  return (
  <div className="bg-white p-4 rounded-xl shadow">
    <h2 className="text-lg font-semibold mb-3">Add Topic</h2>

    <input
      className="w-full border p-2 rounded mb-2"
      placeholder="Topic"
      value={topic}
      onChange={(e) => setTopic(e.target.value)}
    />

    <input
      className="w-full border p-2 rounded mb-2"
      placeholder="Subject"
      value={subject}
      onChange={(e) => setSubject(e.target.value)}
    />

    <input
      type="date"
      className="w-full border p-2 rounded mb-2"
      onChange={(e) => setDeadline(e.target.value)}
    />

    <select
      className="w-full border p-2 rounded mb-3"
      onChange={(e) => setDifficulty(e.target.value)}
    >
      <option>Easy</option>
      <option>Medium</option>
      <option>Hard</option>
    </select>

    <button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
      onClick={handleSubmit}
    >
      Add Topic
    </button>
  </div>
);
}