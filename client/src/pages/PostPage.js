import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Post from '../components/PostComponent';
import CommentList from '../components/CommentListComponent';
import { CreatePostForm } from '../components/CreatePostComponent';

import ButtonDisplay from '../components/ActionButtons';

const PostPage = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { postId, channelId } = useParams();
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

    return (
        <div>
            <Post />
            <div>
                {/* Example buttons to change the type */}
                <ButtonDisplay 
                    type={'upvotePost'} 
                    extraParam={{ userId: 'userId5', itemId: postId }} 
                />
                <ButtonDisplay 
                    type={'downvotePost'} 
                    extraParam={{ userId: 'userId5', itemId: postId }} 
                />
                <ButtonDisplay
                type="createComment"
                />

     
            </div>
            {data && data.comments && <CommentList comments={data.comments} />}
        </div>
    );
};

export default PostPage;
