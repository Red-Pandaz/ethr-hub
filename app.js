const dataService = require('./database/dataService.js');
const advData = require('./database/advDataFuncs.js')
const { getClient, closeConnection } = require('./database/db.js')
const { retryApiCall, accessSecret } = require('./utils/apiutils.js');

async function main(){

    // await advData.createChannel('Main4', 'A test channel', 'userId1')
    // await advData.createUser('userId14')
    // await advData.writeComment('This is a test comment', 'userId12', 'postId1')
    // await advData.toggleVote()
    await advData.toggleSave('userId14', 'postId1', 'Posts')
    // const id = 'userId1'
    // const results = await advData.getDataForUserFeed(id)
    // console.log(results)

    // let channels = await dataService.findDocumentsByIndex(
    //     'Channels',
    //     {
    //         _id: 'channelId1',
  
    //     }
    // )
    // console.log(channels)








    // const posts = await dataSource.getCollection('Posts')
    // const channels = await dataSource.getCollection('Channels')
    // const comments = await dataSource.getCollection('Comments')
    // const users = await dataSource.getCollection('Users')
    // const postVotes = await dataSource.getCollection('Post Votes')
    // const commentVotes = await dataSource.getCollection('Comment Votes')

    // console.log("Posts: ", JSON.stringify(posts, null, 2));
    // console.log("Users: ", JSON.stringify(users, null, 2));
    // console.log("Channels: ", JSON.stringify(channels, null, 2));
    // console.log("Comments: ", JSON.stringify(comments, null, 2));
    // console.log("Post Votes: ", JSON.stringify(postVotes, null, 2));
    // console.log("Comment Votes: ", JSON.stringify(commentVotes, null, 2));

    // await dataSource.createEntry(
    //     'Post Votes',
    //     {
    //         userId: "testUser123",
    //         postId: "testPost456",
    //         hasUpvoted: true,
    //         hasDownvoted: true
    //     }
    // )

    // await dataSource.createEntry(
    //     'Comment Votes',
    //     {
    //         userId: "testUser123",
    //         commentId: "testComment456",
    //         hasUpvoted: true,
    //         hasDownvoted: true
    //     }
    // )

    // await dataSource.createEntry(
    //     'Users',
    //     {
    //         channels: [
    //           "609c1f76324b5e17b8c8e1a1",
    //           "609c1f76324b5e17b8c8e1a2"
    //         ],
    //         votes: {
    //           posts: {
    //             upvotes: [
    //               "609c1f76324b5e17b8c8e1b1",
    //               "609c1f76324b5e17b8c8e1b2"
    //             ],
    //             downvotes: [
    //               "609c1f76324b5e17b8c8e1b3",
    //               "609c1f76324b5e17b8c8e1b4"
    //             ]
    //           },
    //           comments: {
    //             upvotes: [
    //               "709c1f76324b5e17b8c8e1b1",
    //               "709c1f76324b5e17b8c8e1b2"
    //             ],
    //             downvotes: [
    //               "709c1f76324b5e17b8c8e1b3",
    //               "709c1f76324b5e17b8c8e1b4"
    //             ]
    //           }
    //         }
    //     }

    // )
 

    // await dataSource.createEntry(
    //     'Channels',
    //     {
    //         userId: "testUser123",
    //         postId: "testPost456",
    //         hasUpvoted: true,
    //         hasDownvoted: true
    //     }
    
    // )


    // await dataSource.createEntry(
    //     'Comments',
    //     {
    //         postId: "postId1",
    //         userId: "userId3",
    //         text: "This is a reply to a reply.",
    //         parentId: "commentId2",
    //         createdAt: "2024-08-26T12:10:00.000Z",
    //         modifiedAt: "2024-08-26T12:15:00.000Z",
    //         votes: {
    //           upvotes: [
    //             "userId4",
    //             "userId5"
    //           ],
    //           downvotes: [
    //             "userId6"
    //           ]
    //         }
    //       }
    // )


    // await dataSource.createEntry(
    //     'Users',
    //     {
    //         channels: [
    //           "609c1f76324b5e17b8c8e1a1",
    //           "609c1f76324b5e17b8c8e1a2"
    //         ],
    //         votes: {
    //           posts: {
    //             upvotes: [
    //               "609c1f76324b5e17b8c8e1b1",
    //               "609c1f76324b5e17b8c8e1b2"
    //             ],
    //             downvotes: [
    //               "609c1f76324b5e17b8c8e1b3",
    //               "609c1f76324b5e17b8c8e1b4"
    //             ]
    //           },
    //           comments: {
    //             "upvotes": [
    //               "709c1f76324b5e17b8c8e1b1",
    //               "709c1f76324b5e17b8c8e1b2"
    //             ],
    //             downvotes: [
    //               "709c1f76324b5e17b8c8e1b3",
    //               "709c1f76324b5e17b8c8e1b4"
    //             ]
    //           }
    //         },
    //         posts: [
    //           "609c1f76324b5e17b8c8e1c1",
    //           "609c1f76324b5e17b8c8e1c2"
    //         ],
    //         savedPosts: [
    //           "809c1f76324b5e17b8c8e1d1",
    //           "809c1f76324b5e17b8c8e1d2"
    //         ],
    //         createdAt: "2024-08-26T12:00:00.000Z",
    //         lastLogin: "2024-08-26T12:00:00.000Z",
    //         "ensName": "example.eth"
    //       },
    
    // )


    
    await closeConnection()

}

main()