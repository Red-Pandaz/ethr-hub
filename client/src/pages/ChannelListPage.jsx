import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../utils/apiClient.jsx';

import ButtonDisplay from '../components/ActionButtons.jsx'; // Import the ButtonDisplay component

const ChannelPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { channelId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log('channelId: ' + channelId);

    useEffect(() => {
        apiClient.get(`http://localhost:5000/api/channels/`)
            .then(response => {
                setData(response.data); 
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [channelId]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div>
            {/* Render the posts */}
            <ul>
            {data.map((channel, index) => (
    <h3 key={index}>
        <a href={`/channels/${channel._id}`}>{channel.name}</a>
        <h4>{channel.description}</h4>
    </h3>
))}
            </ul>
        </div>
    );
};

export default ChannelPage;
