import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'

const Post = () => {
    const { postId } = useParams(); 
    console.log(postId)
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;
    console.log(data.comments)
    console.log(data.comments.length)
    return (
        <div>
            <h1>Just Testing</h1>
          
            {/* Render your data here */}
                <div key={postId}>
                    <h4>{data.post.title}</h4>
                    <p>{data.post.text}</p>

                </div>
                <div>
                {data.comments.map(comment => (
                    <p>
                        {comment.text}
                    </p>
                ))} 
                </div>
        </div>
    );
};

export default Post;