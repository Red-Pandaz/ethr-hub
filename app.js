const { getPosts, getChannels, getComments, getUsers } = require('./database/dataService.js');
const { getClient, closeConnection } = require('./database/db.js')
const { retryApiCall, accessSecret } = require('./utils/apiutils.js');

async function main(){
    const posts = await getPosts()
    const channels = await getChannels()
    const comments = await getComments()
    const users = await getUsers()

    console.log("Posts: ", JSON.stringify(posts, null, 2));
    console.log("Users: ", JSON.stringify(users, null, 2));
    console.log("Channels: ", JSON.stringify(channels, null, 2));
    console.log("Comments: ", JSON.stringify(comments, null, 2));
    
    await closeConnection()

}

main()