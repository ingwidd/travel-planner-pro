import React from "react";
import { Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

// Mock data — swap for a `getTrips(userId)` call (see api.js) once wired to the backend.
const TRIPS = [
  {
    id: "trip-south-korea",
    name: "Trip Name",
    destination: "South Korea",
    startDate: "2026-11-23",
    endDate: "2026-11-28",
  },
  {
    id: "trip-vietnam",
    name: "Trip Name",
    destination: "Vietnam",
    startDate: "2026-05-26",
    endDate: "2026-06-02",
  },
];

function formatDate(isoDate) {
  const d = new Date(isoDate);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getFullYear()
  ).slice(2)}`;
}

function daysLeft(isoStartDate) {
  const start = new Date(isoStartDate);
  const today = new Date();
  const diff = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function TripCard({ trip }) {
  const remaining = daysLeft(trip.startDate);
  const isUpcoming = remaining > 0;
  const accent = isUpcoming ? "primary" : "secondary";

  return (
    <div className={`card border-${accent} mb-3`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <div className={`text-${accent}`}>
          <h5 className={`card-title mb-1 ${isUpcoming ? "fw-bold" : ""}`}>{trip.name}</h5>
          <p className="mb-1">{trip.destination}</p>
          <p className="mb-1">
            {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </p>
          <p className="mb-0 fw-bold">Days left: {remaining}</p>
        </div>

        <div className="d-flex gap-2">
          <Link
            to={`/diary?tripId=${trip.id}`}
            className={`btn btn-outline-${accent}`}
            aria-label="View diary"
          >
            <i className="bi bi-journal-bookmark-fill"></i>
          </Link>
          <Link
            to={`/todo?tripId=${trip.id}`}
            className={`btn btn-outline-${accent}`}
            aria-label="View to-dos"
          >
            <i className="bi bi-list-check"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TripsPage() {
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <h1 className="mb-4">Trips</h1>

          {TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}

          <div className="d-flex justify-content-end mt-4">
            <Button
                variant="outline-primary"
                className="position-fixed bottom-0 end-0 m-4 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                style={{ width: '60px', height: '60px', fontSize: '24px' }}
            >
                ✚
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}