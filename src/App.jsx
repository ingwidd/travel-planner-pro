import AuthPage from "./pages/AuthPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DiaryPage from "./pages/DiaryPage";
import TodoPage from "./pages/TodoPage";
import { TripDataProvider } from "./contexts/TripDataContext";
import { AuthProvider } from "./components/AuthProvider";
import Layout from "./components/Layout";

export default function App() {
  return (
    <AuthProvider>
      <TripDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<Layout><HomePage /></Layout>} />
            <Route path="/todo" element={<Layout><TodoPage /></Layout>} />
            <Route path="/diary" element={<Layout><DiaryPage /></Layout>} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="*" element={<AuthPage />} />
          </Routes>
        </BrowserRouter>
      </TripDataProvider>
    </AuthProvider>
  );
}