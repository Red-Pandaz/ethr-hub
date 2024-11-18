import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient.jsx';
import { useParams } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import ButtonDisplay from "../components/ActionButtons"; // Adjust the import path as needed
import CommentForm from "../components/CommentForm"; // Component for the comment form

const Post = () => {
    const [activeComment, setActiveComment] = useState(null); // Tracks active reply form
    const [ensName, setEnsName] = useState(null);
    const { postId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userAddress, authToken } = useAuth();

    // Fetch post data
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
        
      console.log('test user ', ensName)
        apiClient
            .get(`http://localhost:5000/api/posts/${postId}`)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [postId]);

    const handleReplySubmit = async (text, parentId) => {
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

            // Update comments (assumes data has a comments array; adjust if necessary)
            setData((prevData) => ({
                ...prevData,
                comments: [...prevData.comments, newComment],
            }));

            setActiveComment(null); // Close the reply form
        } catch (error) {
            console.error("Error submitting reply:", error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div>
            <h1>Post Details</h1>

            {/* Post content */}
            <div key={postId}>
                <h4>{data.post.title}</h4> <span>Created By {data.post.ensName || data.post.createdBy}</span>
                <p>{data.post.text}</p>
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
                    {/* Reply Button */}
                    <button
                        onClick={() =>
                            setActiveComment(activeComment === postId ? null : postId)
                        }
                    >
                        Reply
                    </button>
                </div>

                {/* Reply Form */}
                {activeComment === postId && (
                    <CommentForm
                        onSubmit={(text) => handleReplySubmit(text, null)} // parentId is `null` for top-level comments
                        onCancel={() => setActiveComment(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Post;
