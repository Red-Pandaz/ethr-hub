import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAuth } from "../context/AuthContext";
import apiClient from '../utils/apiClient';

const ChannelPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [posts, setPosts] = useState([]);
    const [channel, setChannel] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [postText, setPostText] = useState('');
    const { channelId } = useParams();
    const { userAddress, authToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigate hook

    useEffect(() => {
                // Validate the channelId format using regex
                const isValidObjectId = (id) => /^[a-fA-F0-9]{24}$/.test(id);
        
                if (!isValidObjectId(channelId)) {
                    // If channelId is invalid, redirect to error page
                    navigate('/error', { replace: true });
                    return;
                }
        // Fetch posts for the channel
        const fetchPosts = async () => {
            
            try {
                
                const response = await apiClient.get(`http://localhost:5000/api/channels/${channelId}`);
                console.log(response.data.channel)
                if (!response.data.channel || response.data.channel.length === 0) {
                    // If channel is empty, redirect to the error page
                    navigate('/error', { replace: true });
                    return;
                }
                setPosts(response.data.posts);
                setChannel(response.data.channel[0])
                setLoading(false);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [channelId]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPost = {
                postTitle,
                postText,
                userId: userAddress,
                channelId,
            };

            const response = await apiClient.post('http://localhost:5000/api/writePost', newPost, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            // Add the new post to the posts list and reset the form
            setPosts([response.data, ...posts]);
            setPostTitle('');
            setPostText('');
            setIsFormVisible(false);
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    if (loading) return <p>Loading...</p>;


    return (
        <div>
            <h1>Channel: {channel.name}</h1>
            <button onClick={() => setIsFormVisible(!isFormVisible)}>
                {isFormVisible ? 'Cancel' : 'Create Post'}
            </button>

            {isFormVisible && (
                <form onSubmit={handlePostSubmit} style={{ marginTop: '20px' }}>
                    <div>
                        <label>
                            Title:
                            <input
                                type="text"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Content:
                            <textarea
                                value={postText}
                                onChange={(e) => setPostText(e.target.value)}
                                rows="4"
                                required
                            ></textarea>
                        </label>
                    </div>
                    <button type="submit">Submit Post</button>
                </form>
            )}

            <ul style={{ marginTop: '20px' }}>
                {posts.map((post) => (
                    <li key={post._id}>
                        <h3>
                            <a href={`/posts/${post._id}`}>{post.title}</a>
                        </h3>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChannelPage;
