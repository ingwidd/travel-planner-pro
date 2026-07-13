import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTripData } from "../contexts/TripDataContext";
import CurrencyConverter from "../components/CurrencyConverter";
import {
  HomeIcon,
  BookIcon,
  ListIcon,
  LogoutIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  CircleIcon,
  CheckCircleIcon,
  PlaneIcon,
} from "../components/Icons";

const DASHBOARD_PHOTO = './assets/dashboard_photo.png';

const NAV_ITEMS = [
  { label: "Home", icon: HomeIcon, to: "/" },
  { label: "Diary", icon: BookIcon, to: "/diary" },
  { label: "To Do", icon: ListIcon, to: "/todo" },
];

function TicketDivider() {
  return (
    <div className="position-relative d-flex align-items-center my-3">
      <div
        className="position-absolute rounded-circle"
        style={{ left: "-21px", width: "16px", height: "16px", background: "var(--color-bg)", border: `1px solid var(--color-border)` }}
      />
      <div className="flex-grow-1" style={{ borderTop: `1px dashed var(--color-border)` }} />
      <div
        className="position-absolute rounded-circle"
        style={{ right: "-21px", width: "16px", height: "16px", background: "var(--color-bg)", border: `1px solid var(--color-border)` }}
      />
    </div>
  );
}

function NavBar({ onLogout }) {
  return (
    <header
      className="sticky-top"
      style={{ background: "rgba(11,13,18,0.85)", borderBottom: `1px solid var(--color-border)`, backdropFilter: "blur(6px)" }}
    >
      <div className="container py-3 d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: "32px", height: "32px", background: "var(--color-trip)" }}
          >
            <PlaneIcon size={16} color={"var(--color-bg)"} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", color: "var(--color-text-hi)", fontWeight: 600, fontSize: "1.15rem" }}>
            Waypoint
          </span>
        </Link>

        <nav className="d-none d-sm-flex align-items-center gap-1">
          {NAV_ITEMS.map(({ label, icon: ItemIcon, to }) => (
            <Link
              key={label}
              to={to}
              className="btn btn-sm rounded-pill d-flex align-items-center gap-2 px-3 text-decoration-none"
              style={{
                fontFamily: "var(--font-body)",
                color: label === "Home" ? "var(--color-bg)" : "var(--color-text-mid)",
                background: label === "Home" ? "var(--color-trip)" : "transparent",
                fontWeight: label === "Home" ? 600 : 500,
                border: "none",
              }}
            >
              <ItemIcon size={15} />
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="btn btn-sm rounded-pill d-flex align-items-center gap-2 px-3"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-todo)", border: `1px solid var(--color-todo-tint-border)`, fontWeight: 500 }}
        >
          <LogoutIcon size={15} />
          Logout
        </button>
      </div>

      <nav className="d-flex d-sm-none justify-content-around pb-3">
        {NAV_ITEMS.map(({ label, icon: ItemIcon, to }) => (
          <Link
            key={label}
            to={to}
            className="btn btn-sm d-flex flex-column align-items-center gap-1 text-decoration-none"
            style={{ color: label === "Home" ? "var(--color-trip)" : "var(--color-text-low)", fontSize: "0.75rem", border: "none" }}
          >
            <ItemIcon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function DashboardHero() {
  return (
    <div className="position-relative w-100 rounded-4 overflow-hidden" style={{ border: `1px solid var(--color-border)`, minHeight: "340px" }}>
      <img
        src={DASHBOARD_PHOTO}
        alt="Current trip destination"
        className="position-absolute w-100 h-100"
        style={{ top: 0, left: 0, objectFit: "cover" }}
      />
      <div
        className="position-absolute w-100 h-100"
        style={{
          top: 0,
          left: 0,
          background: "linear-gradient(180deg, rgba(11,13,18,0.15) 0%, rgba(11,13,18,0.55) 55%, rgba(11,13,18,0.92) 100%)",
        }}
      />
      <div className="position-relative h-100 d-flex flex-column justify-content-end p-4 p-sm-5">
        <span
          className="d-inline-flex align-items-center gap-2 rounded-pill mb-3"
          style={{
            width: "fit-content",
            padding: "0.25rem 0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            background: `var(--color-trip-tint-bg)`,
            color: "var(--color-trip)",
            border: `1px solid var(--color-trip-tint-border)`,
            letterSpacing: "0.08em",
          }}
        >
          CURRENT TRIP
        </span>
        <h1 className="mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-text-hi)", fontWeight: 600, letterSpacing: "-0.01em", fontSize: "2.75rem" }}>
          Patagonia Traverse
        </h1>
        <div className="d-flex flex-wrap align-items-center gap-4" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-mid)", fontSize: "0.9rem" }}>
          <span className="d-flex align-items-center gap-2">
            <MapPinIcon size={14} color={"var(--color-trip)"} />
            El Chaltén, Argentina
          </span>
          <span className="d-flex align-items-center gap-2">
            <CalendarIcon size={14} color={"var(--color-trip)"} />
            Sep 14 – Sep 24
          </span>
          <span
            className="rounded-pill"
            style={{ padding: "0.15rem 0.75rem", fontFamily: "var(--font-mono)", background: "var(--color-card-soft)", color: "var(--color-text-hi)", border: `1px solid var(--color-border)` }}
          >
            65 days out
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon: ItemIcon }) {
  return (
    <div className="position-relative rounded-4 p-4 h-100 overflow-hidden" style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}>
      <div className="position-absolute top-0 start-0 end-0" style={{ height: "3px", background: color }} />
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="text-uppercase" style={{ fontFamily: "var(--font-mono)", color: "var(--color-text-low)", letterSpacing: "0.08em", fontSize: "0.7rem" }}>
          {label}
        </span>
        <ItemIcon size={16} color={color} />
      </div>
      <span style={{ fontFamily: "var(--font-display)", color: "var(--color-text-hi)", fontWeight: 600, fontSize: "1.9rem" }}>{value}</span>
    </div>
  );
}

function TodoPanel() {
  const { todos, toggleTodo } = useTripData();
  const upcoming = todos.filter((t) => !t.isCompleted).slice(0, 4);

  return (
    <div className="position-relative rounded-4 p-4 h-100" style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}>
      <div className="position-absolute top-0 start-0 end-0 rounded-top-4" style={{ height: "3px", background: "var(--color-todo)" }} />
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-hi)", fontWeight: 600, fontSize: "1.3rem" }}>Upcoming To-Dos</h2>
        <Link
          to="/todo"
          className="text-decoration-none"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-todo)", fontSize: "0.75rem", fontWeight: 600 }}
        >
          View all →
        </Link>
      </div>
      <TicketDivider />
      {upcoming.length > 0 ? (
        <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
          {upcoming.map((t) => (
            <li key={t.id} className="d-flex align-items-center gap-3">
              <button onClick={() => toggleTodo(t.id)} className="btn p-0 border-0" aria-label="Toggle complete">
                <CircleIcon size={17} color={"var(--color-text-low)"} />
              </button>
              <span style={{ fontFamily: "var(--font-body)", color: "var(--color-text-mid)", fontSize: "0.9rem" }}>{t.taskDescription}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-low)", fontSize: "0.85rem" }} className="mb-0">
          All caught up — nothing open right now.
        </p>
      )}
    </div>
  );
}

function DiaryPanel() {
  const { diaryEntries } = useTripData();
  const recent = diaryEntries.slice(0, 3);

  return (
    <div className="position-relative rounded-4 p-4 h-100" style={{ background: "var(--color-card)", border: `1px solid var(--color-border)` }}>
      <div className="position-absolute top-0 start-0 end-0 rounded-top-4" style={{ height: "3px", background: "var(--color-diary)" }} />
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h2 style={{ fontFamily: "var(--font-display)", color: "var(--color-text-hi)", fontWeight: 600, fontSize: "1.3rem" }}>Recent Diary Entries</h2>
        <Link
          to="/diary"
          className="text-decoration-none"
          style={{ fontFamily: "var(--font-body)", color: "var(--color-diary)", fontSize: "0.75rem", fontWeight: 600 }}
        >
          View all →
        </Link>
      </div>
      <TicketDivider />
      {recent.length > 0 ? (
        <div className="row row-cols-3 g-3">
          {recent.map((d) => (
            <div key={d.id} className="col">
              <div className="rounded-3 overflow-hidden mb-2" style={{ aspectRatio: "1 / 1" }}>
                <img src={d.photoUrl} alt={d.caption} className="w-100 h-100" style={{ objectFit: "cover" }} />
              </div>
              <p className="mb-0" style={{ fontFamily: "var(--font-body)", color: "var(--color-text-low)", fontSize: "0.75rem", lineHeight: 1.3 }}>
                {d.caption}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: "var(--font-body)", color: "var(--color-text-low)", fontSize: "0.85rem" }} className="mb-0">
          No entries yet — add your first memory.
        </p>
      )}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { todos, diaryEntries } = useTripData();

  const openTasks = todos.filter((t) => !t.isCompleted).length;
  const photoCount = diaryEntries.length;

  const handleLogout = () => {
    // Wire this up to your auth provider's sign-out call, e.g. Firebase's signOut(auth)
    navigate("/login");
  };

  return (
    <div className="min-vh-100 w-100" style={{ background: "var(--color-bg)" }}>
      <NavBar onLogout={handleLogout} />

      <main className="container py-4">
        <div className="mb-4">
          <DashboardHero />
        </div>

        <div className="row row-cols-2 row-cols-sm-4 g-3 mb-4">
          <div className="col">
            <StatCard label="Open Tasks" value={openTasks} color={"var(--color-todo)"} icon={ListIcon} />
          </div>
          <div className="col">
            <StatCard label="Diary Entries" value={diaryEntries.length} color={"var(--color-diary)"} icon={BookIcon} />
          </div>
          <div className="col">
            <StatCard label="Days Left" value="65" color={"var(--color-trip)"} icon={CalendarIcon} />
          </div>
          <div className="col">
            <StatCard label="Photos Saved" value={photoCount} color={"var(--color-diary)"} icon={CameraIcon} />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-lg-2 g-4 mb-4">
          <div className="col">
            <TodoPanel />
          </div>
          <div className="col">
            <DiaryPanel />
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-lg-6">
            <CurrencyConverter />
          </div>
        </div>
      </main>
    </div>
  );
}