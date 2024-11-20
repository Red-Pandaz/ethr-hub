import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../utils/apiClient";
import ButtonDisplay from "./ActionButtons"; // Assuming this component is used for upvoting/downvoting
import CommentForm from "./CommentForm"; // Assuming this is your reply form

const Post = () => {
  const [ensName, setEnsName] = useState(null);
  const { postId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userAddress, authToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // For editing mode
  const [editedText, setEditedText] = useState(""); // For storing edited text
  const [activeComment, setActiveComment] = useState(null); // For managing active comment form
  const navigate = useNavigate(); // To navigate after delete

  const navigateBack = () => {
    navigate(-1); // Go back to the previous page
  };

  useEffect(() => {
    const fetchEnsName = async () => {
      try {
        const response = await apiClient.get(
          `http://localhost:5000/api/ensname/${userAddress}`
        );
        setEnsName(response.data.ensName);
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }
    };

    if (userAddress) {
      fetchEnsName();
    }

    // Fetch post data
    apiClient
      .get(`http://localhost:5000/api/posts/${postId}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post data:", error);
        setLoading(false);
      });
  }, [postId, userAddress]);

 
  const handleEditSubmit = async () => {
    try {
      const response = await apiClient.put(
        `http://localhost:5000/api/editPost`,
        {
          newPostText: editedText,
          userId: userAddress,
          postId: postId,  // Send postId in the body instead
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setData({ ...data, post: response.data });
      setIsEditing(false);
      setEditedText("");
    } catch (error) {
      console.error("Error editing post:", error);
    }
};

const handleDelete = async () => {
    try {
      await apiClient.delete(`http://localhost:5000/api/deletePost`, {
        data: { userId: userAddress, postId: postId },  // Send postId in the body instead
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      navigate(`/channels/${data.post.channelId}`); 
    } catch (error) {
      console.error("Error deleting post:", error);
    }
};

  const handleReplySubmit = async (text) => {
    try {
      const response = await apiClient.post(
        "http://localhost:5000/api/writeComment",
        {
          commentText: text,
          parentId: null,
          postId,
          ensName,
          userId: userAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const newComment = response.data;

      // Update comments in post data
      setData((prevData) => ({
        ...prevData,
        comments: [...prevData.comments, newComment],
        
      }));
      window.location.reload()
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No post found</p>;

  return (
    <div>
      <div key={postId}>
        <h2>{data.post.title}</h2>
        <span><strong>Created by {data.post.ensName || data.post.createdBy}</strong></span>
        <p>
          {isEditing ? (
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows="4"
              cols="50"
            />
          ) : (
            data.post.text
          )}
        </p>
        <span>{data.votes.filter((vote) => vote.hasUpvoted).length} Upvotes</span>{" "}
        <span>{data.votes.filter((vote) => vote.hasDownvoted).length} Downvotes</span>

        <div>
          <ButtonDisplay
            type={"upvotePost"}
            extraParam={{ userId: userAddress, itemId: postId }}
          />
          <ButtonDisplay
            type={"downvotePost"}
            extraParam={{ userId: userAddress, itemId: postId }}
          />

          {data.post.createdBy === userAddress && (
            <div>
              {isEditing ? (
                <>
                  <button onClick={handleEditSubmit}>Save</button>
                  <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Reply Button */}
        <button
          onClick={() =>
            setActiveComment(activeComment === postId ? null : postId)
          }
        >
          Reply
        </button>

        {/* Reply Form */}
        {activeComment === postId && (
          <CommentForm
            onSubmit={(text) => handleReplySubmit(text)}
            onCancel={() => setActiveComment(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Post;
