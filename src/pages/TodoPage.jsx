import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTripData } from "../contexts/TripDataContext";
import {
  ArrowLeftIcon,
  PlusIcon,
  CircleIcon,
  CheckCircleIcon,
  TrashIcon,
} from "../components/Icons";

export default function TodoPage() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTripData();
  const [draft, setDraft] = useState("");

  const openCount = todos.filter((t) => !t.isCompleted).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(draft);
    setDraft("");
  };

  return (
    <div className="min-vh-100 w-100" style={{ background: "var(--color-bg)" }}>
      <div className="container py-4" style={{ maxWidth: "720px" }}>
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-mid)", fontSize: "0.85rem" }}
        >
          <ArrowLeftIcon size={14} />
          Back to dashboard
        </Link>

        <div className="d-flex align-items-center justify-content-between mb-1">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-hi)",
              fontWeight: 600,
              fontSize: "2rem",
            }}
          >
            To-Dos
          </h1>
          <span
            className="rounded-pill px-3 py-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              background: `var(--color-todo-tint-bg)`,
              color: "var(--color-todo)",
              border: `1px solid var(--color-todo-tint-border)`,
            }}
          >
            {openCount} open
          </span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-low)", fontSize: "0.9rem" }} className="mb-4">
          Everything you need to sort out before Patagonia Traverse.
        </p>

        <form onSubmit={handleSubmit} className="d-flex gap-2 mb-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a new task…"
            className="form-control"
            style={{
              fontFamily: "var(--font-body)",
              background: "var(--color-card)",
              color: "var(--color-text-hi)",
              border: `1px solid var(--color-border)`,
            }}
          />
          <button
            type="submit"
            className="btn d-flex align-items-center gap-2 px-3"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-bg)",
              background: "var(--color-todo)",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <PlusIcon size={15} />
            Add
          </button>
        </form>

        <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
          {todos.map((t) => (
            <li
              key={t.id}
              className="d-flex align-items-center gap-3 rounded-3 px-3 py-3"
              style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}
            >
              <button
                onClick={() => toggleTodo(t.id)}
                className="btn p-0 border-0"
                aria-label="Toggle complete"
              >
                {t.isCompleted ? (
                  <CheckCircleIcon size={20} color={"var(--color-diary)"} />
                ) : (
                  <CircleIcon size={20} color={"var(--color-text-low)"} />
                )}
              </button>
              <span
                className="flex-grow-1"
                style={{
                  fontFamily: "var(--font-body)",
                  color: t.isCompleted ? "var(--color-text-low)" : "var(--color-text-hi)",
                  textDecoration: t.isCompleted ? "line-through" : "none",
                  fontSize: "0.95rem",
                }}
              >
                {t.taskDescription}
              </span>
              <button
                onClick={() => deleteTodo(t.id)}
                className="btn p-0 border-0"
                aria-label="Delete task"
              >
                <TrashIcon size={16} color={"var(--color-text-low)"} />
              </button>
            </li>
          ))}
          {todos.length === 0 && (
            <li
              className="text-center py-5 rounded-3"
              style={{ background: "var(--color-card)", border: `1px dashed var(--color-border)`, color: "var(--color-text-low)", fontFamily: "var(--font-body)" }}
            >
              No tasks yet — add your first one above.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}