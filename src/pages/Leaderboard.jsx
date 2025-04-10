import React, { memo, useMemo, useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PropTypes from "prop-types";

// Constants
const RANK_STYLES = {
  0: { color: "text-yellow-400", icon: "🥇", bg: "bg-yellow-400/10" },
  1: { color: "text-gray-300", icon: "🥈", bg: "bg-gray-300/10" },
  2: { color: "text-amber-600", icon: "🥉", bg: "bg-amber-600/10" },
  default: { color: "text-gray-100", icon: "", bg: "bg-transparent" },
};

// Utility Functions
const formatScore = (score) => score.toLocaleString("en-US");

// User Item Component
const UserItem = memo(({ user, index, isTopThree, isCurrentUser }) => {
  const rankStyle = isTopThree ? RANK_STYLES[index] : RANK_STYLES.default;

  return (
    <div
      className={`flex justify-between items-center py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${rankStyle.bg} ${rankStyle.color} ${
        isCurrentUser ? "border-2 border-teal-500" : ""
      }`}
      role="listitem"
      aria-label={`${user.name}, Rank ${index + 1}, Score ${user.score} points`}
    >
      <span className="flex items-center gap-3 truncate">
        <span className="w-8 text-right font-medium">
          {index + 1}
          {rankStyle.icon}
        </span>
        <span className="truncate max-w-[250px] font-semibold">
          {user.name}
        </span>
      </span>
      <span className="font-mono text-sm tabular-nums bg-zinc-900/50 px-2 py-1 rounded">
        {formatScore(user.score)} pts
      </span>
    </div>
  );
});

// Main Leaderboard Component
const Leaderboard = () => {
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [showTopOnly, setShowTopOnly] = useState(false);
  const currentUserId = "u4"; // Simulated current user ID

  const users = useMemo(
    () => [
      { id: "u1", name: "Avansh Yadav", score: 980 },
      { id: "u2", name: "Aryan Singh", score: 890 },
      { id: "u3", name: "Ishaan M", score: 840 },
      { id: "u4", name: "You", score: 750 }, // Simulated current user
      { id: "u5", name: "Priya Sharma", score: 620 },
      { id: "u6", name: "Rohan Gupta", score: 580 },
    ],
    []
  );

  const sortedUsers = useMemo(() => {
    const sorted = [...users].sort((a, b) =>
      sortOrder === "desc" ? b.score - a.score : a.score - b.score
    );
    return showTopOnly ? sorted.slice(0, 3) : sorted;
  }, [users, sortOrder, showTopOnly]);

  const renderUserItem = useCallback(
    (user, index) => (
      <UserItem
        key={user.id}
        user={user}
        index={index}
        isTopThree={index < 3}
        isCurrentUser={user.id === currentUserId}
      />
    ),
    [currentUserId]
  );

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  return (
    <section
      className="p-6 space-y-6 max-w-3xl mx-auto animate-fade-in"
      aria-labelledby="leaderboard-title"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2
          id="leaderboard-title"
          className="text-3xl font-extrabold text-gray-100 tracking-tight md:text-4xl bg-gradient-to-r from-gray-100 to-zinc-400 bg-clip-text text-transparent"
        >
          Leaderboard
        </h2>
        <div className="space-x-4">
          <button
            onClick={toggleSortOrder}
            className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
          >
            Sort: {sortOrder === "desc" ? "High to Low" : "Low to High"}
          </button>
          <button
            onClick={() => setShowTopOnly(!showTopOnly)}
            className="text-sm text-gray-300 hover:text-teal-400 transition-colors"
          >
            {showTopOnly ? "Show All" : "Top 3 Only"}
          </button>
        </div>
      </div>

      {/* Leaderboard Card */}
      <Card className="bg-zinc-800/95 border-zinc-700/50 shadow-xl backdrop-blur-sm">
        <CardContent
          className="p-6 space-y-2"
          role="list"
          aria-label="Leaderboard Rankings"
        >
          {sortedUsers.length > 0 ? (
            sortedUsers.map(renderUserItem)
          ) : (
            <p className="text-gray-400 text-center">No users to display.</p>
          )}
        </CardContent>
      </Card>

      {/* Current User Highlight (if not in top list when filtered) */}
      {showTopOnly && !sortedUsers.some((u) => u.id === currentUserId) && (
        <Card className="bg-zinc-800/95 border-zinc-700/50 shadow-xl backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-teal-400 mb-2">
              Your Rank
            </h3>
            {renderUserItem(
              users.find((u) => u.id === currentUserId),
              users.findIndex((u) => u.id === currentUserId)
            )}
          </CardContent>
        </Card>
      )}
    </section>
  );
};

// CSS Animation (reusing existing setup)
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

// PropTypes
UserItem.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isTopThree: PropTypes.bool.isRequired,
  isCurrentUser: PropTypes.bool.isRequired,
};

// Optimizations
UserItem.displayName = "UserItem";
Leaderboard.displayName = "Leaderboard";
export default memo(Leaderboard);