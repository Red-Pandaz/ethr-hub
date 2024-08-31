import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'

const Post = () => {
    const { id } = useParams(); 
    console.log(id)
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getDataForPostPage?postId=${id}`) 
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div>
            {/* Render your data here */}
            {data.map(item => (
                <div key={item._id}>
                    <h4>{item.post.title}</h4>
                    <p>{item.post.text}</p>
                    <p>{item.comments}</p>
                
                </div>
            ))}
        </div>
    );
};

export default Post;