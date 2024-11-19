import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import apiClient from "../utils/apiClient";

const ChannelPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [posts, setPosts] = useState([]);
  const [channel, setChannel] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [ensName, setEnsName] = useState(null);
  const [loading, setLoading] = useState(true);

  const { channelId } = useParams();
  const { userAddress, authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!/^[a-fA-F0-9]{24}$/.test(channelId)) {
          navigate("/error", { replace: true });
          return;
        }

        const response = await apiClient.get(
          `http://localhost:5000/api/channels/${channelId}`
        );
        if (!response.data.channel || response.data.channel.length === 0) {
          navigate("/error", { replace: true });
          return;
        }

        setPosts(response.data.posts);
        setChannel(response.data.channel[0]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [channelId]);

  useEffect(() => {
    const fetchEnsName = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:5000/api/ensname/${userAddress}`
        );

        setEnsName(response.data.ensName);
        console.log("ENS Name fetched:", ensName); // Log fetched value
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }
    };

    if (userAddress) fetchEnsName();
  }, [userAddress]);

  useEffect(() => {
    console.log("ENS Name updated in state:", ensName);
  }, [ensName]); // Runs whenever ensName changes

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPost = {
        postTitle,
        postText,
        ensName,
        userId: userAddress,
        channelId,
      };
      console.log(newPost);
      const response = await apiClient.post(
        "http://localhost:5000/api/writePost",
        newPost,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setPosts([response.data, ...posts]);
      setPostTitle("");
      setPostText("");
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Channel: {channel.name}</h1>
      <p>You are signed in as {localStorage.getItem("ensName") || userAddress}</p>
      <button onClick={() => setIsFormVisible(!isFormVisible)}>
        {isFormVisible ? "Cancel" : "Create Post"}
      </button>

      {isFormVisible && (
        <form onSubmit={handlePostSubmit} style={{ marginTop: "20px" }}>
          <div>
            <label>
              Title:
              <input
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Content:
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows="4"
                required
              ></textarea>
            </label>
          </div>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Post"}
          </button>
        </form>
      )}

      <ul style={{ marginTop: "20px" }}>
        {posts.map((post) => (
          <li key={post._id}>
            <h3>
              <a href={`/posts/${post._id}`}>{post.title || "Untitled Post"}</a>
            </h3>
            <p>{post.content || "No content available."}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelPage;
