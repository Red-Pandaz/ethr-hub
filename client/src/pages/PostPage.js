import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import axios from 'axios';
import ButtonDisplay from '../components/ActionButtons'; // Adjust the import path as needed
import CommentForm from '../components/CommentForm'; // A new component for the comment form
import CommentActionButton from '../components/CommentActionButton'
import CommentList from '../components/CommentListComponent'; // Adjust the import path as needed
import Post from '../components/PostComponent'; // Adjust the import path as needed

const PostPage = () => {
    const [activeComment, setActiveComment] = useState(null); // Tracks which comment is being replied to
    const [isAddingComment, setIsAddingComment] = useState(false); // Tracks top-level comment form visibility
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { postId, channelId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Access the logged-in userAddress from context
    const { userAddress, authToken, isConnected, loading: contextLoading } = useAuth();
    console.log('auth token ', authToken)

    useEffect(() => {
        axios.get(`http://localhost:5000/api/posts/${postId}`) 
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [postId]);

    // Wait until both loading states are done
    if (contextLoading || loading) return <p>Loading...</p>;

    // If there's no data or user is not logged in, show appropriate message
    if (!data) return <p>No data found</p>;
    if (!isConnected) return <p>Please log in to interact with the post.</p>;

    return (
        <div>
            <h1>Post Page</h1>
            <p>Welcome, your address is: {userAddress}</p>
            <Post data={data} />

            <div>
                {/* Example buttons to interact with the post */}
                <ButtonDisplay 
                    type={'upvotePost'} 
                    extraParam={{ userId: userAddress, itemId: postId }} 
                />
                <ButtonDisplay 
                    type={'downvotePost'} 
                    extraParam={{ userId: userAddress, itemId: postId }} 
                />
          {/* Comment Action Button */}
          <CommentActionButton
            extraParam={{ postId, parentId: null }} // Fixed parentId to comment._id
            userAddress={userAddress}
            authToken={authToken}
          />


          {/* Reply Form */}
          {activeComment === postId && (
            <CommentForm
              onSubmit={(text) => {
                // Handle reply submission
                console.log("Replying with:", { text, parentId: postId });
                setActiveComment(null); // Close the form
              }}
              onCancel={() => setActiveComment(null)} // Close the form on cancel
            />
          )}
            </div>

            {/* Render comments if available */}
            {data.comments && <CommentList comments={data.comments} />}
        </div>
    );
};

export default PostPage;
