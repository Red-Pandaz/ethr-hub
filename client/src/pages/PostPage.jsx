import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ButtonDisplay from "../components/ActionButtons";
import CommentForm from "../components/CommentForm";
import CommentActionButton from "../components/CommentActionButton";
import CommentList from "../components/CommentListComponent";
import Post from "../components/PostComponent";
const PostPage = () => {
  const [activeComment, setActiveComment] = useState(null); 
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { postId, channelId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  const {
    userAddress,
    authToken,
    isConnected,
    loading: contextLoading,
  } = useAuth();
  console.log("auth token ", authToken);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/posts/${postId}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [postId]);

  if (contextLoading || loading) return <p>Loading...</p>;

  if (!data) return <p>No data found</p>;
  if (data) {
    console.log(data);
  }
  if (!isConnected) return <p>Please log in to interact with the post.</p>;

  return (
    <div>
<p>You are signed in as {localStorage.getItem("ensName") == "null" ? userAddress: localStorage.getItem("ensName")}</p>
      <Post data={data} />
      {data.comments && (
        <CommentList comments={data.comments} postId={postId} />
      )}
    </div>
  );
};

export default PostPage;
