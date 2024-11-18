import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.jsx';

import ButtonDisplay from '../components/ActionButtons'; // Import the ButtonDisplay component

const ChannelPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { channelId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log('channelId: ' + channelId);

    useEffect(() => {
        apiClient.get(`http://localhost:5000/api/channels/${channelId}`)
            .then(response => {
                setData(response.data); // Store the response data in state
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [channelId]);

    const handlePostSubmit = async (extraParam) => {
        try {
            await apiClient.post('https://localhost:5000/api/writePost', {
                postTitle: extraParam.postTitle,
                postText: extraParam.postText,
                userId: extraParam.userId,
                channelId: extraParam.channelId
            });

            setIsFormVisible(false); // Hide the form after submission
            // Fetch the updated posts after submission
            apiClient.get(`http://localhost:5000/api/channels/${channelId}`)
                .then(response => {
                    setData(response.data);
                });
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div>
            <ButtonDisplay 
                type="createPost" 
                extraParam={{ userId: 'userId5', channelId: channelId, postTitle: '', postText: '' }} 
                onClick={() => setIsFormVisible(true)} 
            />

            {/* Render the posts */}
            <ul>
            {data.map((post, index) => (
    <h3 key={index}>
        <a href={`/posts/${post._id}`}>{post.title}</a>
    </h3>
))}
            </ul>
        </div>
    );
};

export default ChannelPage;
