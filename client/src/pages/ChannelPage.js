import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Post from '../components/PostComponent';
import { CreatePostForm } from '../components/CreatePostComponent'; // Import the CreatePostForm component

import ButtonDisplay from '../components/ActionButtons'; // Import the ButtonDisplay component

const ChannelPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { channelId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log('channelId: ' + channelId)

    useEffect(() => {
        axios.get(`http://localhost:5000/api/channels/${channelId}`) 
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [channelId]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;
    
    const handlePostSubmit = async (extraParam) => {
        try {
            await axios.post('https://localhost:5000/api/writePost', {
                postTitle: extraParam.postTitle,
                postText: extraParam.postText,
                userId: extraParam.userId,
                channelId: extraParam.channelId
            });
      
            setIsFormVisible(false); // Hide the form after submission
        } catch (error) {
            console.error('Error submitting post:', error);
        }
    };

    return (
            <div>
                <ButtonDisplay 
                    type="createPost" 
                    extraParam={{ userId: 'userId5', channelId: channelId, postTitle: '', postText: '' }} 
                    onClick={() => setIsFormVisible(true)} 
                />
            </div>
    );
};

export default ChannelPage;
