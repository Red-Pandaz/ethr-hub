import React, { useState } from "react";
import { useAuth } from '../context/AuthContext'; // Import useAuth to access the logged-in user's address
import ButtonDisplay from './ActionButtons';
import CommentForm from './CommentForm'; // A new component for the comment form
import CommentActionButton from './CommentActionButton'

const CommentList = ({ comments, postId }) => {
  const { userAddress, authToken } = useAuth(); // Get the logged-in userAddress and authToken from context
  const [activeComment, setActiveComment] = useState(null); // Tracks which comment is being replied to
  const [isAddingComment, setIsAddingComment] = useState(false); // Tracks top-level comment form visibility
  console.log(userAddress, authToken)
  const commentMap = {};
  const nestedComments = [];

  // Organize comments and replies
  comments.forEach((comment) => {
    comment.replies = [];
    commentMap[comment._id] = comment;
  });

  comments.forEach((comment) => {
    console.log(comment.postId)
    console.log(comment._id)
    if (comment.parentId === null) {
      nestedComments.push(comment);
    } else {
      const parentComment = commentMap[comment.parentId];
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    }
  });

  const renderComments = (comments) => {
    return comments.map((comment) => (
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
        <span>From {comment.userId} at {comment.createdAt}</span>
        <br />
        <span>{comment.votes.upvotes.length} Upvotes </span>
        <span>{comment.votes.downvotes.length} Downvotes</span>
        <div>
          {/* Voting Buttons */}
          <ButtonDisplay 
            type="upvoteComment" 
            extraParam={{ userId: userAddress, itemId: comment._id }} 
          />
          <ButtonDisplay 
            type="downvoteComment" 
            extraParam={{ userId: userAddress, itemId: comment._id }} 
          />
          
          {/* Comment Action Button */}
          <CommentActionButton
            extraParam={{ postId: comment.postId, parentId: comment._id }} // Fixed parentId to comment._id
            userAddress={userAddress}
            authToken={authToken}
          />


          {/* Reply Form */}
          {activeComment === comment._id && (
            <CommentForm
              onSubmit={(text) => {
                // Handle reply submission
                console.log("Replying with:", { text, parentId: comment._id });
                setActiveComment(null); // Close the form
              }}
              onCancel={() => setActiveComment(null)} // Close the form on cancel
            />
          )}
        </div>

        {/* Render Nested Replies */}
        {comment.replies.length > 0 && (
          <div>{renderComments(comment.replies)}</div>
        )}
      </div>
    ));
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
