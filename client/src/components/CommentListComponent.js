import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth to access the logged-in user's address
import ButtonDisplay from "./ActionButtons";
import CommentForm from "./CommentForm"; // A new component for the comment form
import apiClient from '../utils/apiClient';

const CommentList = ({ comments, postId }) => {
  const [ensName, setEnsName] = useState(null);
  const { userAddress, authToken } = useAuth(); // Get the logged-in userAddress and authToken from context
  const [activeComment, setActiveComment] = useState(null); // Tracks which comment is being replied to
  const [isAddingComment, setIsAddingComment] = useState(false); // Tracks top-level comment form visibility
  const [votes, setVotes] = useState({}); // State to track votes for each comment

  console.log(userAddress, authToken);

  const commentMap = {};
  const nestedComments = [];

  // Organize comments and replies
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

// Define the handleReplySubmit function here
const handleReplySubmit = async (text, parentId, postId, ensName) => {
  try {
    // Sending the reply to the backend
    console.log(text)
    const response = await apiClient.post("http://localhost:5000/api/writeComment", 
      {
        commentText: text,       // The text of the reply
        parentId,   // The parent comment ID
        postId,     // The post ID
        ensName,    // ENS name
        userId: userAddress, // The ID of the user replying
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include the auth token
        },
      }
  );

    // Assuming the backend returns the newly created reply
    const newReply = response.data;

    // Optionally, update the state to include the new reply (for instant UI update)
    const updatedComments = [...comments];
    const parentComment = updatedComments.find(comment => comment._id === parentId);
    parentComment.replies.push(newReply);

    // Update the UI with the new comment
    setActiveComment(null); // Close the form
  } catch (error) {
    console.error("Error submitting reply:", error);
    // Optionally handle the error with a message
  }
};


  useEffect(() => {
    const fetchEnsName = async () => {
      try {
        const response = await apiClient.get(`http://localhost:5000/api/ensname/${userAddress}`);
        setEnsName(response.data.ensName); // Store the ENS name in state
      } catch (error) {
        console.error("Error fetching ENS name:", error);
      }
    };
    if (userAddress) {
      fetchEnsName(); // Fetch ENS name if userAddress is available
    }
    const fetchVotes = async () => {
      const voteData = {}; // Object to store votes by commentId
      try {
        // Fetch all votes
        const response = await apiClient.get("http://localhost:5000/api/commentvotes"); // Adjust the URL as needed
        const allVotes = response.data;
  
        // Group votes by commentId
        allVotes.forEach(vote => {
          if (!voteData[vote.commentId]) {
            voteData[vote.commentId] = [];
          }
          voteData[vote.commentId].push(vote);
        });
  
        setVotes(voteData); // Store grouped votes by commentId
        console.log('Grouped vote data:', voteData);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };
  
    fetchVotes();
  }, [comments]); // Re-fetch votes if comments change

  const renderComments = (comments) => {
    return comments.map((comment) => {
      const isCreator =
        comment.userId.toLowerCase() === userAddress.toLowerCase(); // Check if the logged-in user is the creator
  
      // Get the votes for the current commentId (defaults to an empty array if no votes found)
      const commentVotes = votes[comment._id] || [];
  
      console.log('Votes for commentId:', comment._id, commentVotes);
  
      // Count upvotes and downvotes for this comment
      const upvotes = commentVotes.filter(vote => vote.hasUpvoted).length;
      const downvotes = commentVotes.filter(vote => vote.hasDownvoted).length;
  
      console.log('Upvotes:', upvotes, 'Downvotes:', downvotes);
  
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
          <div>
            {/* Voting Buttons */}
            <ButtonDisplay
              type="upvoteComment"
              extraParam={{ userId: userAddress, itemId: comment._id, }}
            />
            <ButtonDisplay
              type="downvoteComment"
              extraParam={{ userId: userAddress, itemId: comment._id, }}
            />
  
            {/* Reply Form */}
            {activeComment === comment._id && (
            <CommentForm
            onSubmit={(text) => {
              console.log(text)
              console.log(ensName)
              handleReplySubmit(text, comment._id, comment.postId, ensName); // Pass relevant data to submit
            }}
            onCancel={() => setActiveComment(null)} // Close the form on cancel
          />
            )}
            {/* Reply Button */}
            {!activeComment && (
              <button onClick={() => setActiveComment(comment._id)}>
                Reply
              </button>
            )}
          </div>
  
          {/* Render Nested Replies */}
          {comment.replies.length > 0 && (
            <div>{renderComments(comment.replies)}</div>
          )}
        </div>
      );
    });
  };
  
  return (
    <div>
      {/* Top-Level Comment Form */}
      {isAddingComment && (
        <CommentForm
          onSubmit={(text) => {
            // Handle top-level comment submission
            console.log("Adding top-level comment:", { text, parentId: null });
            setIsAddingComment(false); // Close the form
          }}
          onCancel={() => setIsAddingComment(false)} // Close the form on cancel
        />
      )}

      {/* Render Comments */}
      {renderComments(nestedComments)}
    </div>
  );
};

export default CommentList;