import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.jsx'
import { useParams } from 'react-router-dom'
import { useAuth } from "../context/AuthContext";
import ButtonDisplay from "../components/ActionButtons"; // Adjust the import path as needed
import CommentForm from "../components/CommentForm"; // A new component for the comment form
import CommentActionButton from "../components/CommentActionButton";

const Post = () => {
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

    useEffect(() => {
        apiClient.get(`http://localhost:5000/api/posts/${postId}`) 
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [postId]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;
    return (
        <div>
            <h1>Just Testing</h1>
          
            {/* Render your data here */}
                <div key={postId}>
                    <h4>{data.post.title}</h4> <span>Created By {data.post.createdBy}</span>
                    <p>{data.post.text}</p>
                    <span>{data.votes.filter(vote => vote.hasUpvoted).length} Upvotes</span> <span>{data.votes.filter(vote => vote.hasDownvoted).length} Downvotes</span>
                    <div>
        <ButtonDisplay
          type={"upvotePost"}
          extraParam={{ userId: userAddress, itemId: postId }}
        />
        <ButtonDisplay
          type={"downvotePost"}
          extraParam={{ userId: userAddress, itemId: postId }}
        />
        {/* Comment Action Button */}
        {/* <CommentActionButton
            extraParam={{ postId, parentId: null }} // Fixed parentId to comment._id
            userAddress={userAddress}
            authToken={authToken}
          /> */}
        <ButtonDisplay
          type="reply"
          extraParam={{
            postId,
            parentId: null
          }}
          userAddress={userAddress}
          authToken={authToken}
        />

  
        {activeComment === postId && (
          <CommentForm
            onSubmit={(text) => {
              // Handle reply submission
              console.log("Replying with:", { text, parentId: postId });
              setActiveComment(null); 
            }}
            onCancel={() => setActiveComment(null)}
          />
        )}
      </div>
                </div>
        </div>
    );
};

export default Post;