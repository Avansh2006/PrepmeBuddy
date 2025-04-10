// Enhanced Admin Challenge Dashboard

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";

export default function AdminPanel() {
  const [challenges, setChallenges] = useState([]);
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    tags: "",
    hint: "",
  });
  const [editId, setEditId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const challengesPerPage = 5;

  const fetchChallenges = async () => {
    const snapshot = await getDocs(collection(db, "adminChallenges"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setChallenges(data);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.description) return;

    if (editId) {
      await updateDoc(doc(db, "adminChallenges", editId), form);
      setEditId(null);
    } else {
      await addDoc(collection(db, "adminChallenges"), form);
    }

    setForm({ title: "", category: "", description: "", tags: "", hint: "" });
    fetchChallenges();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "adminChallenges", id));
    fetchChallenges();
  };

  const handleEdit = (challenge) => {
    setForm({
      title: challenge.title,
      category: challenge.category,
      description: challenge.description,
      tags: challenge.tags || "",
      hint: challenge.hint || "",
    });
    setEditId(challenge.id);
  };

  const handlePageChange = (page) => setCurrentPage(page);

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
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editId ? "Edit Challenge" : "Add New Challenge"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
            <Input
              placeholder="Hint"
              value={form.hint}
              onChange={(e) => setForm({ ...form, hint: e.target.value })}
            />
            <Button type="submit">{editId ? "Update" : "Add"}</Button>
          </form>
        </CardContent>
      </Card>

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

      <div className="space-y-4">
        {paginatedChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-100">
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <h4 className="text-lg font-bold">{challenge.title}</h4>
                  <p className="text-sm text-gray-500">{challenge.category}</p>
                  <p>{challenge.description}</p>
                  {challenge.tags && (
                    <p className="text-xs text-gray-700 mt-1">Tags: {challenge.tags}</p>
                  )}
                  {challenge.hint && (
                    <p className="text-xs text-blue-600 mt-1">Hint: {challenge.hint}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(challenge)}>Edit</Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(challenge.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Pagination
        totalPages={Math.ceil(filteredChallenges.length / challengesPerPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
