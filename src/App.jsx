import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import "./App.css";
import Login from "./pages/Login";
import { AppProvider } from "./context";
import { useAuth } from './context/useAuth';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredMovies, setFeaturedMovies] = useState([]);

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
      {/* Скрываем Header для неавторизованных пользователей */}
      {isAuthenticated && (
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      <main className="main-content">
        <Routes>
          {/* Если не авторизован - показываем только Login страницу */}
          {!isAuthenticated ? (
            <Route path="*" element={<Login isAuthenticated={isAuthenticated} />} />
          ) : (
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
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    featuredMovies={featuredMovies}
                    setFeaturedMovies={setFeaturedMovies}
                  />
                }
              />
              {/* Перенаправление на главную для несуществующих маршрутов. path="*" - значение по умолчанию  */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </main>

      {/* Скрываем футер для не авторизованных пользователей */}
      {isAuthenticated && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  )
}

export default App;
