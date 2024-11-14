import React, { useState } from 'react';

const CreatePostForm = ({ extraParam, onSubmit }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postText, setPostText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add post content to extraParam
    extraParam.postTitle = postTitle;
    extraParam.postText = postText;

    // Call onSubmit with the necessary parameters
    onSubmit(extraParam);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Post Title" 
        value={postTitle} 
        onChange={(e) => setPostTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Post Content" 
        value={postText} 
        onChange={(e) => setPostText(e.target.value)} 
      />
      <button type="submit">Submit Post</button>
    </form>
  );
};


const CreatePostButton = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCreatePostClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handlePostSubmit = (postContent) => {
    console.log('Post submitted:', postContent);

    setIsFormVisible(false);
  };

  return (
    <div>
      <button onClick={handleCreatePostClick} style={{ padding: '10px 20px' }}>
        Create Post
      </button>

      {isFormVisible && <CreatePostForm onSubmit={handlePostSubmit} />}
    </div>
  );
};

export { CreatePostButton, CreatePostForm };
