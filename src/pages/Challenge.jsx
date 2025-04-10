// Public-Facing Challenges Page

import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
// import Link from "next/link";

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
// import Link from "next/link";
import { Link } from "react-router-dom";


export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const challengesPerPage = 6;

  const fetchChallenges = async () => {
    const snapshot = await getDocs(collection(db, "adminChallenges"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChallenges(data);
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
      c.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const paginatedChallenges = filteredChallenges.slice(
    (currentPage - 1) * challengesPerPage,
    currentPage * challengesPerPage
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Explore Challenges</h1>

      <Input
        placeholder="Search Challenges"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mt-4"
      />

      <Tabs defaultValue="all" onValueChange={setCategoryFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {[...new Set(challenges.map((c) => c.category))].map((cat) => (
            <TabsTrigger key={cat} value={cat}>
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
            <Card className="bg-grey hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>{challenge.title}</CardTitle>
                <p className="text-sm text-gray-500">{challenge.category}</p>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-sm">{challenge.description}</p>
                {challenge.tags && (
                  <p className="text-xs text-gray-600">
                    Tags: {challenge.tags}
                  </p>
                )}
                <Link href={`/coding/${challenge.id}`}>
                  <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded">
                    Solve Challenge
                  </button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Pagination
        totalPages={Math.ceil(filteredChallenges.length / challengesPerPage)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
