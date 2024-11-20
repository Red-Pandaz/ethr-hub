import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../utils/apiClient.jsx";
import "./ChannelListPage.css";
import { useAuth } from "../context/AuthContext";
import ButtonDisplay from "../components/ActionButtons.jsx"; // Import the ButtonDisplay component

const ChannelPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { userAddress, authToken } = useAuth();
  const { channelId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("channelId: " + channelId);

  useEffect(() => {
    apiClient
      .get(`http://localhost:5000/api/channels/`)
      .then((response) => {
        setData(response.data);
        console.log(response.data);
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
<p>You are signed in as {localStorage.getItem("ensName") == "null" ? userAddress: localStorage.getItem("ensName")}</p>
           <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "center",
        padding: "20px",
      }}
    >

      {data.map((channel) => (
        <div key={channel._id} class="channel-card">
          <h3 class="channel-title">
            <a
              href={`/channels/${channel._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {channel.name}
            </a>
          </h3>
          <p class="channel-description">{channel.description}</p>
        </div>
      ))}
    </div>
    </>

  );
};

export default ChannelPage;
