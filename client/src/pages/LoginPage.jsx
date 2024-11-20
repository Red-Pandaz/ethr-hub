import React, { useEffect, useState } from "react";
import './LoginPage.css';
import Login from '../components/Login';

const LoginPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Apply the theme to the document when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem('theme', theme); // Save theme in localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <div className="header-container">
        <h1>Welcome to Ethr-Hub</h1>
        <div className="header-buttons">
        <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <Login />
    </>
  );
}

export default LoginPage;
