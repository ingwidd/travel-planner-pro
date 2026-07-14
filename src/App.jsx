import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
//import DiaryPage from "./pages/DiaryPage";
//import TodoPage from "./pages/TodoPage";
import Navbar from "./components/Navbar";
import { TripDataProvider } from "./contexts/TripDataContext";
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
    <TripDataProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </TripDataProvider>
    </AuthProvider>
  );
}