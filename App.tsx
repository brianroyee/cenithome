import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { VisionMission } from "./components/VisionMission";
import { Team } from "./components/Team";
import { TeamPage } from "./components/TeamPage";
import { CareersPage } from "./components/CareersPage";
import { AdminPage } from "./components/AdminPage";
import { Footer } from "./components/Footer";
import { Cursor } from "./components/ui/Cursor";
import { AnimatedBackground } from "./components/ui/AnimatedBackground";

// Home page component
const HomePage = () => (
  <>
    {/* Hero sits in the background (via sticky inside component) */}
    <Hero />

    {/* Main content sits above Hero */}
    <main className="relative z-10 w-full">
      {/* Margin top matches viewport height to start scrolling AFTER hero */}
      <div className="-mt-[100vh]">
        {/* Invisible spacer to push content down if needed, or handle in components */}
      </div>

      {/* Components handle their own backgrounds/stacking */}
      <VisionMission />

      {/* Last section needs to cover everything before Footer */}
      <div className="bg-white relative z-20">
        <Team />
      </div>
    </main>
    <Footer />
  </>
);

// Layout wrapper with keyboard shortcuts
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Reset scroll on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Secret keyboard shortcut to access admin (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        navigate("/admin");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <div className="min-h-screen text-neutral-900 selection:bg-cenit-blue selection:text-white cursor-none isolate relative">
      <AnimatedBackground />
      <Cursor />
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/team"
          element={
            <AppLayout>
              <TeamPage />
            </AppLayout>
          }
        />
        <Route
          path="/careers"
          element={
            <AppLayout>
              <CareersPage />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout>
              <AdminPage />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
