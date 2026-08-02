import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useThemeStore } from "./store/themeStore";
import { useEffect } from "react";
import Favourites from "./pages/Favourites";
import { useAuthStore } from "./store/authStore";

function AppContent() {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка приложения...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {isAuthenticated && <Header />}
      <main className="main-content">
        <Routes>
          {!isAuthenticated ? (
            // ✅ Неавторизованные: доступны только login и register
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            // ✅ Авторизованные: доступны все страницы
            <>
              <Route
                path="/"
                element={
                  <Home
                    featuredMovies={featuredMovies}
                    setFeaturedMovies={setFeaturedMovies}
                  />
                }
              />
              <Route
                path="/movies"
                element={
                  <Movies
                    featuredMovies={featuredMovies}
                    setFeaturedMovies={setFeaturedMovies}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/favorites" element={<Favourites />} />
            </>
          )}
        </Routes>
      </main>
      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
