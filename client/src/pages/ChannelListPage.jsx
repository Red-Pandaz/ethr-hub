import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/apiClient.jsx";
import { useAuth } from "../context/AuthContext";
import './ChannelListPage.css';

const ChannelListPage = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const { userAddress, authToken } = useAuth();
  const { channelId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply the theme to the document when it changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem('theme', theme); // Save theme in localStorage
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    apiClient
      .get(`http://localhost:5000/api/channels/`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [channelId]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data found</p>;

  return (
    <>
      <div className="header-container">
        <h1>Welcome to Ethr-Hub</h1>
        <p className="user-info">
          You are signed in as{" "}
          {localStorage.getItem("ensName") === "null"
            ? userAddress
            : localStorage.getItem("ensName")}
        </p>

        {/* Dark Mode Toggle Button */}
        <div className="header-buttons">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <div className="channel-list">
        {data.map((channel) => (
          <div key={channel._id} className="channel-card">
            <h3 className="channel-title">
              <a href={`/channels/${channel._id}`} className="channel-link">
                {channel.name}
              </a>
            </h3>
            <p className="channel-description">{channel.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ChannelListPage;
