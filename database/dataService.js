
const { retryApiCall, accessSecret } = require('../utils/apiutils.js');

const dbName = 'EthrHub'
const { getClient, closeConnection } = require('./db');


async function getPosts(){
    try {
        const db = await getClient();
        const postCollection = db.collection('Posts');
        const postDocuments = await postCollection.find({}).toArray();
        return postDocuments
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function getChannels(){
    try {
        const db = await getClient();
        const channelCollection = db.collection('Channels');
        const channelDocuments = await channelCollection.find({}).toArray();
        return channelDocuments
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}

async function getUsers(){
    try {
        const db = await getClient();
        const userCollection = db.collection('Users');
        const userDocuments = await userCollection.find({}).toArray();
        return userDocuments
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function getComments(){
    try {
        const db = await getClient();
        const commentCollection = db.collection('Comments');
        const commentDocuments = await commentCollection.find({}).toArray();
        return commentDocuments
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function getVotes(){
    try {
        const db = await getClient();
        const voteCollection = db.collection('Votes');
        const voteDocuments = await voteCollection.find({}).toArray();
        return voteDocuments
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}



async function savePost(userId, postId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}

async function unsavePost(userId, postId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
    
}

async function saveChannel(userId, channelId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function unsaveChannel(userId, channelId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}



async function editPost(userId, postId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}
async function deletePost(userId, postId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function upvotePost(userId, postId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function downvotePost(){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function upvoteComment(){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function downvoteComment(){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}



async function editReply(userId, commentId){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function deleteReply(){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}




async function createUser(newUser){
    try {
        const db = await getClient();
        const userCollection = db.collection('Users');
        await userCollection.insertOne(newUser)
        console.log('user added')
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}

async function createChannel(newChannel){
    try {
        const db = await getClient();
        const channelCollection = db.collection('Channels');
        await channelCollection.insertOne(newChannel)
        console.log('channgel added')
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}

async function createComment(newComment){
        const db = await getClient();
        const commentCollection = db.collection('Comments');
        await commentCollection.insertOne(newComment)
        console.log('comment added')
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}

async function createPost(newPost){
    try {
        const db = await getClient();
        const postCollection = db.collection('Posts');
        await postCollection.insertOne(newPost)
        console.log('post added')
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
}

async function createPostVote(newPostVote){
    try {
        const db = await getClient();
        const postVoteCollection = db.collection('Post Votes');
        await postVoteCollection.insertOne(newPostVote)
        console.log('vote added')
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
    
}

async function createCommentVote(newCommentVote){
    try {
        const db = await getClient();
        const commentVoteCollection = db.collection('Comment Votes');
        await commentVoteCollection.insertOne(newCommentVote)
        console.log('vote added')
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
    
}

module.exports = { 
    getPosts, 
    getChannels, 
    getUsers, 
    getComments, 
    getVotes, 
    createComment, 
    createPost, 
    createChannel, 
    createUser, 
    createPostVote,
    createCommentVote
}