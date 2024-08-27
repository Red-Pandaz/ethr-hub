
const { retryApiCall, accessSecret } = require('../utils/apiutils.js');

const dbName = 'EthrHub'
const { getClient, closeConnection } = require('./db');

async function getCollection(collectionName){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        return documents
    } catch (err) {
        console.error(`Error retrieving ${collectionName}`, err);
    }
}

async function createEntry(collectionName, entry){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        await collection.insertOne(entry)
        console.log(`New ${collectionName} entry added`)
    } catch (err) {
        console.error(`Error adding new ${collectionName} entry`, err);
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
    try{
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

async function findOneByIndex(collectionName, params){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const document = await collection.findOne(params)
        console.log('document found: ' + document)
    } catch (err) {
        console.error("Error retrieving document", err);
    }
    
}

async function findByIndex(collectionName, params){
    try {
        const db = await getClient();
        const collection = db.collection(collectionName);
        const documents = await collection.find(params)
        console.log('documents found: ' + documents)
    } catch (err) {
        console.error("Error retrieving documents", err);
    }
    

}

module.exports = { 
    findByIndex,
    findOneByIndex,
    getCollection,
    createEntry,
}