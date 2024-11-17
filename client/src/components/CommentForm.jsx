import React, { useState } from "react";

const CommentForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText(""); // Clear the form after submission
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment here..."
        rows="4"
        cols="50"
        style={{ marginBottom: "10px" }}
      ></textarea>
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
        Cancel
      </button>
    </form>
  );
};

export default CommentForm;
