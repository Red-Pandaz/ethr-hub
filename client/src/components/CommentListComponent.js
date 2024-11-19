import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from '../utils/apiClient';
import ButtonDisplay from "./ActionButtons";
import CommentForm from "./CommentForm"; // Assuming you have this for adding/editing comments

const CommentList = ({ comments, postId }) => {
  const [ensName, setEnsName] = useState(null);
  const { userAddress, authToken } = useAuth();
  const [activeComment, setActiveComment] = useState(null);
  const [isEditing, setIsEditing] = useState(null); // Tracks which comment is being edited
  const [editedText, setEditedText] = useState(""); // Store edited text
  const [votes, setVotes] = useState({});

  const commentMap = {};
  const nestedComments = [];

  comments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment._id] = comment;
  });

  comments.forEach((comment) => {
    if (comment.parentId === null) {
      nestedComments.push(comment);
    } else {
      const parentComment = commentMap[comment.parentId];
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    }
  });

  useEffect(() => {
    const fetchEnsName = async () => {
      try {
        const response = await apiClient.get(`http://localhost:5000/api/ensname/${userAddress}`);
        setEnsName(response.data.ensName);
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }
    };
    if (userAddress) {
      fetchEnsName();
    }

    const fetchVotes = async () => {
      const voteData = {};
      try {
        const response = await apiClient.get("http://localhost:5000/api/commentvotes");
        const allVotes = response.data;

        allVotes.forEach(vote => {
          if (!voteData[vote.commentId]) {
            voteData[vote.commentId] = [];
          }
          voteData[vote.commentId].push(vote);
        });

        setVotes(voteData);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, [comments]);

  const handleCommentReplySubmit = async (text, parentId, postId, ensName) => {
    try {
      const response = await apiClient.post("http://localhost:5000/api/writeComment", 
        {
          commentText: text,
          parentId,
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

      const newReply = response.data;
      const updatedComments = [...comments];
      const parentComment = updatedComments.find(comment => comment._id === parentId);
      parentComment.replies.push(newReply);

      setActiveComment(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleCommentEditSubmit = async (commentId) => {
    try {
      console.log('edited text ', editedText)
      const response = await apiClient.put(
        `http://localhost:5000/api/editComment/`,
        {
          commentId,
          newCommentText: editedText,
          userId: userAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const updatedComment = response.data;
      // Update comment in the comments array
      const updatedComments = comments.map(comment =>
        comment._id === commentId ? updatedComment : comment
      );
      setIsEditing(null);
      setEditedText("");
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await apiClient.delete(
        "http://localhost:5000/api/deleteComment", 
        {
          data: {
            commentId,
            userId: userAddress,
            postId
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Remove deleted comment from the state
      const updatedComments = comments.filter(comment => comment._id !== commentId);
      setIsEditing(null); // Close the edit form if any
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const renderComments = (comments) => {
    return comments.map((comment) => {
      const isCreator = comment.userId.toLowerCase() === userAddress.toLowerCase();
      const commentVotes = votes[comment._id] || [];
      const upvotes = commentVotes.filter(vote => vote.hasUpvoted).length;
      const downvotes = commentVotes.filter(vote => vote.hasDownvoted).length;

      return (
        <div
          key={comment._id}
          style={{
            marginLeft: comment.parentId ? "20px" : "0px",
            fontSize: "25px",
            border: "2px solid black",
            margin: "20px",
            paddingLeft: "10px",
          }}
        >
          <p>{comment.text}</p>
          <span>
            From {comment.ensName || comment.userId} at {comment.createdAt}
          </span>
          <br />
          <span>{upvotes} Upvotes</span> <span>{downvotes} Downvotes</span>

          {/* Edit and Delete Buttons */}
          {isCreator && (
            <div>
              {!isEditing && (
                <button onClick={() => { setIsEditing(comment._id); setEditedText(comment.text); }}>
                  Edit
                </button>
              )}
              <button onClick={() => handleCommentDelete(comment._id)}>
                Delete
              </button>
            </div>
          )}

          {/* Edit Form */}
          {isEditing === comment._id && (
            <div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows="4"
                cols="50"
              />
              <button onClick={() => handleCommentEditSubmit(comment._id)}>Save</button>
              <button onClick={() => setIsEditing(null)}>Cancel</button>
            </div>
          )}

          {/* Reply Form */}
          {activeComment === comment._id && (
            <CommentForm
              onSubmit={(text) => handleCommentReplySubmit(text, comment._id, postId, ensName)}
              onCancel={() => setActiveComment(null)}
            />
          )}
          {/* Reply Button */}
          {!activeComment && (
            <button onClick={() => setActiveComment(comment._id)}>
              Reply
            </button>
          )}

          {/* Render Nested Replies */}
          {comment.replies.length > 0 && (
            <div>{renderComments(comment.replies)}</div>
          )}
        </div>
      );
    });
  };

  return <div>{renderComments(nestedComments)}</div>;
};

export default CommentList;
