import React, { useState } from 'react'
import axios from 'axios'
export default function CommentActionButton({ extraParam, userAddress, authToken }) {
    const [showForm, setShowForm] = useState(false);
    const [formContent, setFormContent] = useState('');
  
    async function submitComment(e) {
      e.preventDefault();
      console.log(authToken)
      try {
        const response = await axios.post(
          'http://localhost:5000/api/writeComment',
          {
            commentText: formContent,
            postId: extraParam.postId,
            userId: userAddress, // Ensure this matches the authenticated user
            parentId: extraParam.parentId || null,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        console.log('Comment successfully submitted:', response.data);
        setShowForm(false); // Close the form
        setFormContent(''); // Clear the text area
      } catch (error) {
        console.error('Error submitting comment:', error);
      }
    }
  
    return (
      <>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Write a Comment'}
        </button>
        {showForm && (
          <form onSubmit={submitComment}>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              placeholder="Write your comment here..."
            />
            <button type="submit">Submit</button>
          </form>
        )}
      </>
    );
  }
  