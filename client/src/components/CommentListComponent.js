import React from "react";
import ButtonDisplay from './ActionButtons'

const CommentList = ({ comments }) => {
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
        <p>{comment.text} </p><span>From {comment.createdBy} at {comment.createdAt}</span>
        <br></br>
        <span>{comment.votes.upvotes.length} Upvotes </span><span>{comment.votes.downvotes.length} Downvotes</span>
        <div>
            {/* Example buttons to change the type */}
            <ButtonDisplay type={'upvoteComment'} 
            extraParam = {{userId: 'userId5', itemId: comment._id}}
            />
            <ButtonDisplay type={'downvoteComment'} 
            extraParam = {{userId: 'userId5', itemId: comment._id}}
            />
        </div>

        {comment.replies.length > 0 && (
          <div>{renderComments(comment.replies)}</div>
        )}
      </div>
    ));
  };

  return <div>{renderComments(nestedComments)}</div>;
};

export default CommentList;
