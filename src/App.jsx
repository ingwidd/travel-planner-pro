import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DiaryPage from "./pages/DiaryPage";
import TodoPage from "./pages/TodoPage";
import { TripDataProvider } from "./contexts/TripDataContext";
import { AuthProvider, AuthContext } from "./components/AuthProvider";
import Layout from "./components/Layout";
import TripsPage from "./pages/TripPage";
import { useContext } from 'react';
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  // While Firebase is checking if a user is logged in, show nothing (or a spinner)
  if (loading) return null; 

  // If there is no user, redirect to the login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If there is a user, render the actual page
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripDataProvider>
          <Routes>
            {/* Protected Routes: User MUST be logged in to see these */}
            <Route path="/home" element={
              <ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>
            } />
            <Route path="/trips" element={
              <ProtectedRoute><Layout><TripsPage /></Layout></ProtectedRoute>
            } />
            <Route path="/todo" element={
              <ProtectedRoute><Layout><TodoPage /></Layout></ProtectedRoute>
            } />
            <Route path="/diary" element={
              <ProtectedRoute><Layout><DiaryPage /></Layout></ProtectedRoute>
            } />

            {/* Public Routes: Anyone can see these */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<AuthPage />} />
            
            {/* Redirect any unknown route to Login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </TripDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}