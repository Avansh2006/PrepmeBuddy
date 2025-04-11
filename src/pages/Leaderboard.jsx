import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const sortedUsers = [...users].sort((a, b) => {
    const pointsA = a.points || 0;
    const pointsB = b.points || 0;
    return sortOrder === "desc" ? pointsB - pointsA : pointsA - pointsB;
  });

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center text-teal-400">Leaderboard</h1>
      <button
        onClick={toggleSortOrder}
        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
      >
        Toggle Sort Order ({sortOrder === "desc" ? "Descending" : "Ascending"})
      </button>
      <ul className="space-y-4">
        {sortedUsers.map((user, index) => (
          <li
            key={user.id}
            className="p-4 bg-gray-800 text-white rounded-md shadow-md flex justify-between items-center"
          >
            <span>
              {index + 1}. {user.name || "Anonymous"}
            </span>
            <span>{user.points || 0} Points</span>
          </li>
        ))}
      </ul>
    </div>
  );
}