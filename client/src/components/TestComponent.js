import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostList = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/getDataForDefaultFeed') // URL for your backend endpoint
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div>
            {/* Render your data here */}
            {data.map(item => (
                <div key={item._id}>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                
                </div>
            ))}
        </div>
    );
};

export default PostList;