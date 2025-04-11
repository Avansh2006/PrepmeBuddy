import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 6;

  const fetchChallenges = async () => {
    try {
      const snapshot = await getDocs(collection(db, "adminChallenges"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setChallenges([]);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const filteredChallenges = challenges
    .filter((c) =>
      categoryFilter === "all" ? true : c.category === categoryFilter
    )
    .filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.tags && c.tags.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const paginatedChallenges = filteredChallenges.slice(
    (currentPage - 1) * challengesPerPage,
    currentPage * challengesPerPage
  );

  const handleSolveChallenge = (leetCodeUrl) => {
    if (leetCodeUrl) {
      window.location.href = leetCodeUrl;
    } else {
      alert("No LeetCode problem available for this challenge.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold text-center text-teal-400">Explore Challenges</h1>

      <Input
        placeholder="Search Challenges"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mt-4 bg-gray-800 border-gray-700 text-white focus:ring-teal-500"
      />

      <Tabs defaultValue="all" onValueChange={setCategoryFilter}>
        <TabsList className="bg-gray-800">
          <TabsTrigger value="all" className="text-gray-300 hover:text-teal-400">
            All
          </TabsTrigger>
          {[...new Set(challenges.map((c) => c.category))].map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="text-gray-300 hover:text-teal-400"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-800 hover:shadow-lg transition-all border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{challenge.title}</CardTitle>
                <p className="text-sm text-gray-400">{challenge.category}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm text-gray-300">{challenge.description}</p>
                {challenge.tags && (
                  <p className="text-xs text-gray-500">
                    Tags: {challenge.tags}
                  </p>
                )}
                {challenge.hint && (
                  <p className="text-xs text-gray-500 mt-1">Hint: {challenge.hint}</p>
                )}
                <button
                  onClick={() => handleSolveChallenge(challenge.leetCodeUrl)}
                  className={`mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded transition-colors ${
                    !challenge.leetCodeUrl ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={!challenge.leetCodeUrl}
                >
                  Solve Challenge
                </button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Pagination
        totalPages={Math.ceil(filteredChallenges.length / challengesPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        className="text-white"
      />
    </div>
  );
}