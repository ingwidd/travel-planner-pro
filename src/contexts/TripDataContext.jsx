import React, { createContext, useContext, useState } from "react";

// This context stands in for your Firestore collections:
//   users/{uid}/trips/{tripId}/todos
//   users/{uid}/trips/{tripId}/diaryEntries
// Swap the useState initializers for onSnapshot listeners when you wire up
// Firestore, and swap the action functions below for addDoc/updateDoc/deleteDoc.

const TripDataContext = createContext(null);

const INITIAL_TODOS = [
  { id: "t1", taskDescription: "Book airport transfer", isCompleted: false },
  { id: "t2", taskDescription: "Print travel insurance docs", isCompleted: false },
  { id: "t3", taskDescription: "Exchange currency", isCompleted: true },
  { id: "t4", taskDescription: "Pack hiking boots", isCompleted: false },
  { id: "t5", taskDescription: "Confirm hostel booking", isCompleted: false },
];

const INITIAL_DIARY = [
  {
    id: "d1",
    caption: "Sunrise over the ridgeline",
    photoUrl:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    dateCreated: "2026-09-15",
  },
  {
    id: "d2",
    caption: "Lunch at the lakeside village",
    photoUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    dateCreated: "2026-09-16",
  },
  {
    id: "d3",
    caption: "Last light before the trailhead",
    photoUrl:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80",
    dateCreated: "2026-09-17",
  },
];

export function TripDataProvider({ children }) {
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [diaryEntries, setDiaryEntries] = useState(INITIAL_DIARY);

  const addTodo = (taskDescription) => {
    if (!taskDescription.trim()) return;
    setTodos((prev) => [
      ...prev,
      { id: `t${Date.now()}`, taskDescription, isCompleted: false },
    ]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const addDiaryEntry = ({ caption, photoUrl }) => {
    if (!caption.trim() || !photoUrl.trim()) return;
    setDiaryEntries((prev) => [
      {
        id: `d${Date.now()}`,
        caption,
        photoUrl,
        dateCreated: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
  };

  const deleteDiaryEntry = (id) => {
    setDiaryEntries((prev) => prev.filter((d) => d.id !== id));
  };

  const value = {
    todos,
    diaryEntries,
    addTodo,
    toggleTodo,
    deleteTodo,
    addDiaryEntry,
    deleteDiaryEntry,
  };

  return (
    <TripDataContext.Provider value={value}>{children}</TripDataContext.Provider>
  );
}

export function useTripData() {
  const ctx = useContext(TripDataContext);
  if (!ctx) {
    throw new Error("useTripData must be used within a TripDataProvider");
  }
  return ctx;
}