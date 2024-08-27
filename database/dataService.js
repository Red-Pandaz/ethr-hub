
const { retryApiCall, accessSecret } = require('../utils/apiutils.js');
const DB_URI = await retryApiCall(() => accessSecret('DB_URI'));
const dbName = 'Ethr-Hub'


async function getPosts(){
    

}

async function getChannels(){

}

async function getUsers(){

}

async function getComments(){

}

async function savePost(){

}

async function unsavePost(){
    
}

async function saveChannel(){

}

async function unsaveChannel(){

}

async function createPost(){
    
}

async function editPost()
{

}
async function deletePost(){

}

async function upvotePost(){

}

async function downvotePost(){

}

async function upvoteComment(){

}

async function downvoteComment(){

}

async function createReply(){

}

async function editReply(){

}

async function deleteReply(){

}