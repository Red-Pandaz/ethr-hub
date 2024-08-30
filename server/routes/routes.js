const express = require('express');
const router = express.Router();
const advData = require('../database/advDataFuncs.js');

router.post('/toggleSave', async (req, res) => {
    try {
        const { userId, itemId, itemType } = req.body;
        const result = await advData.toggleSave(userId, itemId, itemType);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error toggling save:', err);
        res.status(500).json({ error: 'An error occurred while toggling the save.' });
    }
});

router.post('/toggleVote', async (req, res) => {
    try {
        const { voteId, userId, itemId, voteType, itemType, userAction } = req.body;
        const result = await advData.toggleVote(voteId, userId, itemId, voteType, itemType, userAction);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error toggling vote:', err);
        res.status(500).json({ error: 'An error occurred while toggling the vote.' });
    }
});

router.post('/writePost', async (req, res) => {
    try {
        const { postText, postTitle, userId, channelId } = req.body;
        const result = await advData.writePost(postText, postTitle, userId, channelId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error writing post:', err);
        res.status(500).json({ error: 'An error occurred while writing the post.' });
    }
});

router.post('/editPost', async (req, res) => {
    try {
        const { newPostText, postId } = req.body;
        const result = await advData.editPost(newPostText, postId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error editing post:', err);
        res.status(500).json({ error: 'An error occurred while editing the post.' });
    }
});

router.post('/deletePost', async (req, res) => {
    try {
        const { channelId, userId, postId } = req.body;
        const result = await advData.deletePost(channelId, userId, postId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
    }
});


router.post('/writeComment', async (req, res) => {
    try {
        const { commentText, userId, postId } = req.body;
        const result = await advData.writeComment(commentText, userId, postId)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error writing post:', err);
        res.status(500).json({ error: 'An error occurred while writing the post.' });
    }
});

router.post('/editComment', async (req, res) => {
    try {
        const { newCommentText, commentId } = req.body;
        const result = await advData.editComment(newCommentText, commentId )
        res.status(200).json(result);
    } catch (err) {
        console.error('Error editing comment:', err);
        res.status(500).json({ error: 'An error occurred while editing the comment.' });
    }
});

router.post('/deleteComment', async (req, res) => {
    try {
        const { commentId, userId, postId } = req.body;
        const result = await advData.deleteComment(commentId, userId, postId)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error deleting comment:', err);
        res.status(500).json({ error: 'An error occurred while deleting the comment.' });
    }
});


router.post('/createChannel', async (req, res) => {
    try {
        const { channelName, channelDescription, userId } = req.body;
        const result = await advData.createChannel(channelName, channelDescription, userId)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error creating channel:', err);
        res.status(500).json({ error: 'An error occurred while creating the channel.' });
    }
});


router.post('/createUser', async (req, res) => {
    try {
        const { ethAddress } = req.body;
        const result = await advData.createUser(ethAddress)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});


router.get('/getDataForPostPage', async (req, res) => {
    try {
        const { postId } = req.query;
        const result = await advData.getDataForPostPage(postId)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting post:', err);
        res.status(500).json({ error: 'An error occurred while getting the post.' });
    }
});

router.get('/getDataForUserFeed', async (req, res) => {
    try {
        const { userId } = req.query;
        const result = await advData.getDataForUserFeed(userId)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting user feed:', err);
        res.status(500).json({ error: 'An error occurred while getting the user feed.' });
    }
});

router.get('/getDataForDefaultFeed', async (req, res) => {
    try {
        const result = await advData.getDataForDefaultFeed()
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting default feed:', err);
        res.status(500).json({ error: 'An error occurred while getting the default feed.' });
    }
});

module.exports = router