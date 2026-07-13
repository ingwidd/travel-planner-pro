import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTripData } from "../contexts/TripDataContext";
import { ArrowLeftIcon, CameraIcon, TrashIcon } from "../components/Icons";

export default function DiaryPage() {
  const { diaryEntries, addDiaryEntry, deleteDiaryEntry } = useTripData();
  const [caption, setCaption] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addDiaryEntry({ caption, photoUrl });
    setCaption("");
    setPhotoUrl("");
    setShowForm(false);
  };

  return (
    <div className="min-vh-100 w-100" style={{ background: "var(--color-bg)" }}>
      <div className="container py-4" style={{ maxWidth: "960px" }}>
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-text-mid)", fontSize: "0.85rem" }}
        >
          <ArrowLeftIcon size={14} />
          Back to dashboard
        </Link>

        <div className="d-flex align-items-center justify-content-between mb-1 flex-wrap gap-2">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-hi)",
              fontWeight: 600,
              fontSize: "2rem",
            }}
          >
            Diary
          </h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="btn d-flex align-items-center gap-2 px-3"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-bg)",
              background: "var(--color-diary)",
              fontWeight: 600,
            }}
          >
            <CameraIcon size={15} />
            {showForm ? "Cancel" : "New entry"}
          </button>
        </div>
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-low)", fontSize: "0.9rem" }} className="mb-4">
          Photos and memories from Patagonia Traverse.
        </p>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="rounded-4 p-4 mb-4"
            style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}
          >
            <label
              className="d-block mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
            >
              PHOTO URL
            </label>
            <input
              type="text"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://…"
              className="form-control mb-3"
              style={{ fontFamily: "var(--font-body)", background: "var(--color-card-soft)", color: "var(--color-text-hi)", border: `1px solid var(--color-border)` }}
              required
            />
            <label
              className="d-block mb-1"
              style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem", letterSpacing: "0.06em" }}
            >
              CAPTION
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What happened here?"
              className="form-control mb-3"
              style={{ fontFamily: "var(--font-body)", background: "var(--color-card-soft)", color: "var(--color-text-hi)", border: `1px solid var(--color-border)` }}
              required
            />
            <button
              type="submit"
              className="btn px-3"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-bg)", background: "var(--color-diary)", fontWeight: 600 }}
            >
              Save entry
            </button>
          </form>
        )}

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {diaryEntries.map((d) => (
            <div key={d.id} className="col">
              <div
                className="rounded-4 overflow-hidden h-100 d-flex flex-column"
                style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}
              >
                <div style={{ aspectRatio: "4 / 3" }}>
                  <img
                    src={d.photoUrl}
                    alt={d.caption}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="p-3 d-flex flex-column flex-grow-1">
                  <p
                    className="mb-1 flex-grow-1"
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-text-hi)", fontSize: "0.9rem" }}
                  >
                    {d.caption}
                  </p>
                  <div className="d-flex align-items-center justify-content-between">
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", fontSize: "0.7rem" }}>
                      {d.dateCreated}
                    </span>
                    <button
                      onClick={() => deleteDiaryEntry(d.id)}
                      className="btn p-0 border-0"
                      aria-label="Delete entry"
                    >
                      <TrashIcon size={15} color={"var(--color-text-low)"} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {diaryEntries.length === 0 && (
            <div className="col-12">
              <div
                className="text-center py-5 rounded-4"
                style={{ background: "var(--color-card)", border: `1px dashed var(--color-border)`, color: "var(--color-text-low)", fontFamily: "var(--font-body)" }}
              >
                No diary entries yet — capture your first memory above.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}