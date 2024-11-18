const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const advData = require('../database/advDataFuncs.js');
const { verifySignature } = require ('../utils/apiutils.js')
const authenticateJWT = require('../middleware/authMiddleware.js');

const JWT_SECRET = 'thisIsJustATestToken'

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

router.get('/checkExistingVote', async (req, res) => {
    try {
        const { voteType, idType, uid, itemId } = req.query;
        const result = await advData.checkExistingVote(voteType, idType, uid, itemId );
        res.status(200).json(result);
    } catch (err) {
        console.error('Error toggling save:', err);
        res.status(500).json({ error: 'An error occurred while toggling the save.' });
    }
});
router.post('/toggleVote', authenticateJWT, async (req, res) => {
    const { voteId, itemId, voteType, itemType, userAction } = req.body;
    const userId = req.userId;

    if (userId.toLowerCase() !== req.body.userId.toLowerCase()) {
        console.log("user id", userId.toLowerCase())
        console.log(req.body.userId.toLowerCase())
        return res.status(403).json({ error: `You can only vote with your own address ${userId} ${req.body.userId}` });
    }

    try {
        const result = await advData.toggleVote(voteId, userId, itemId, voteType, itemType, userAction);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error toggling vote:', err);
        res.status(500).json({ error: 'An error occurred while toggling the vote.' });
    }
});

router.post('/writePost', authenticateJWT, async (req, res) => {
    const { postText, postTitle, userId, channelId } = req.body;
    const loggedInUserId = req.userId; // Extract authenticated user

    if (loggedInUserId.toLowerCase() !== userId.toLowerCase()) {
        return res.status(403).json({ error: `You can only write posts with your own address: ${loggedInUserId} !== ${userId}` });
    }

    try {
        const result = await advData.writePost(postText, postTitle, loggedInUserId, channelId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error writing post:', err);
        res.status(500).json({ error: 'An error occurred while writing the post.' });
    }
});

router.post('/editPost', authenticateJWT, async (req, res) => {
    const { newPostText, postId, userId } = req.body;
    const loggedInUserId = req.userId; // Extract authenticated user

    if (loggedInUserId.toLowerCase() !== userId.toLowerCase()) {
        return res.status(403).json({ error: `You can only edit your own posts: ${loggedInUserId} !== ${userId}` });
    }

    try {
        const result = await advData.editPost(newPostText, postId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error editing post:', err);
        res.status(500).json({ error: 'An error occurred while editing the post.' });
    }
});


router.post('/deletePost', authenticateJWT, async (req, res) => {
    const { channelId, userId, postId } = req.body;
    const loggedInUserId = req.userId; // Extract authenticated user

    if (loggedInUserId.toLowerCase() !== userId.toLowerCase()) {
        return res.status(403).json({ error: `You can only delete your own posts: ${loggedInUserId} !== ${userId}` });
    }

    try {
        const result = await advData.deletePost(channelId, loggedInUserId, postId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'An error occurred while deleting the post.' });
    }
});


router.post('/writeComment', authenticateJWT, async (req, res) => {
    const { commentText, postId, parentId, userId } = req.body; // Add parentId here
    const loggedInUserId = req.userId; // Extract authenticated user

    // Check if the user ID from the token matches the user ID in the request body
    if (loggedInUserId.toLowerCase() !== userId.toLowerCase()) {
        console.log("Authenticated user ID:", loggedInUserId.toLowerCase());
        console.log("Request body user ID:", userId.toLowerCase());
        return res.status(403).json({ error: `You can only write comments with your own address: ${loggedInUserId} !== ${userId}` });
    }

    console.log('Authenticated user ID from token:', loggedInUserId);  // Log the userId
    console.log('Received request body:', { commentText, postId, parentId });

    try {
        // Call writeComment with parentId (default null for post-level comments)
        const result = await advData.writeComment(commentText, loggedInUserId, postId, parentId || null);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error writing comment:', err);
        res.status(500).json({ error: `An error occurred while writing the comment: ${err.message}` });
    }
});

router.post('/editComment', authenticateJWT, async (req, res) => {
    const { newCommentText, commentId, userId } = req.body;
    const loggedInUserId = req.userId; 

    if (loggedInUserId.toLowerCase() !== userId.toLowerCase()) {
        return res.status(403).json({ error: `You can only edit your own comments: ${loggedInUserId} !== ${userId}` });
    }

    try {
        const result = await advData.editComment(newCommentText, commentId);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error editing comment:', err);
        res.status(500).json({ error: 'An error occurred while editing the comment.' });
    }
});


router.post('/deleteComment', authenticateJWT, async (req, res) => {
    const { commentId, userId, postId } = req.body;
    const loggedInUserId = req.userId; 

    if (loggedInUserId.toLowerCase() !== userId.toLowerCase()) {
        return res.status(403).json({ error: `You can only delete your own comments: ${loggedInUserId} !== ${userId}` });
    }

    try {
        const result = await advData.deleteComment(commentId, userId, postId);
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


router.get('/posts/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        const result = await advData.getDataForPostPage(postId)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting post:', err);
        res.status(500).json({ error: 'An error occurred while getting the post.' });
    }
});

router.get('/channels/:channelId', async (req, res) => {
    try {
        const { channelId } = req.params;
     
        const result = await advData.getDataForChannelFeed(channelId)
        console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting post:', err);
        res.status(500).json({ error: 'An error occurred while getting the post.' });
    }
});

router.get('/channels', async (req, res) => {
    try {
        const result = await advData.getChannels()
        console.log(result)
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
        console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.error('Error getting default feed:', err);
        res.status(500).json({ error: 'An error occurred while getting the default feed.' });
    }
});

router.get('/commentvotes', async (req, res) => {
    try {
        const result = await advData.getCommentVotes();
        if (result) {
            return res.status(200).json(result); // Send the result back to the client
        } else {
            return res.status(404).json({ message: 'Votes not found' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' }); // Handle errors
    }
});
router.post('/login', async (req, res) => {
    const { address, signature, message } = req.body;

    if (verifySignature(message, signature, address)) {
        // Check if user exists in the database
        const existingUser = await advData.getUserByAddress(address);
        
        // If user doesn't exist, create a new user
        if (!existingUser) {
            await advData.createUser(address);
        }

        const token = jwt.sign({ userId: address }, JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ error: 'Invalid signature' });
    }
});


router.post('/verify-token', (req, res) => {
    const { token } = req.body;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.status(200).json({ valid: true });
    } catch (err) {
      res.status(401).json({ valid: false });
    }
  });

module.exports = router