
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




async function createUser(userArray, userId){
    const newUserObj = {
        "_id": userId,
        "channels": [],
        "votes": {
            "posts": {
                "upvotes": [],
                "downvotes": []
            },
            "comments": {
                "upvotes": [],
                "downvotes": []
                }
            }
    }
    userArray.push(newUserObj)
    

}

async function createChannel(channelArray, userId, newChannelObj){

}

async function createReply(postId, newCommentObj){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }

}

async function createPost(userId, channelId, newPost){
    try {
        const db = await getClient();
        const collection = db.collection('posts');
        // Fetch and return posts
    } catch (err) {
        console.error("Error retrieving posts", err);
    }
    
}

module.exports = { getPosts, getChannels, getUsers, getComments, createReply, createPost, createChannel, createUser }