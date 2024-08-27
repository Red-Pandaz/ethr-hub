const dataSource = require('./database/dataService.js');
const { getClient, closeConnection } = require('./database/db.js')
const { retryApiCall, accessSecret } = require('./utils/apiutils.js');

async function main(){
    const posts = await dataSource.getPosts()
    const channels = await dataSource.getChannels()
    const comments = await dataSource.getComments()
    const users = await dataSource.getUsers()
    const votes = await dataSource.getVotes()

    console.log("Posts: ", JSON.stringify(posts, null, 2));
    console.log("Users: ", JSON.stringify(users, null, 2));
    console.log("Channels: ", JSON.stringify(channels, null, 2));
    console.log("Comments: ", JSON.stringify(comments, null, 2));
    console.log("Votes: ", JSON.stringify(votes, null, 2));

    await dataSource.createPostVote(
        {
            userId: "testUser123",
            postId: "testPost456",
            hasUpvoted: true,
            hasDownvoted: true
        }
    )

    await dataSource.createCommentVote(
        {
            userId: "testUser123",
            commentId: "testComment456",
            hasUpvoted: true,
            hasDownvoted: true
        }
    )

    await dataSource.createUser(
        {
            channels: [
              "609c1f76324b5e17b8c8e1a1",
              "609c1f76324b5e17b8c8e1a2"
            ],
            votes: {
              posts: {
                upvotes: [
                  "609c1f76324b5e17b8c8e1b1",
                  "609c1f76324b5e17b8c8e1b2"
                ],
                downvotes: [
                  "609c1f76324b5e17b8c8e1b3",
                  "609c1f76324b5e17b8c8e1b4"
                ]
              },
              comments: {
                upvotes: [
                  "709c1f76324b5e17b8c8e1b1",
                  "709c1f76324b5e17b8c8e1b2"
                ],
                downvotes: [
                  "709c1f76324b5e17b8c8e1b3",
                  "709c1f76324b5e17b8c8e1b4"
                ]
              }
            }
        }
    )


    await dataSource.createChannel(
        {
            userId: "testUser123",
            postId: "testPost456",
            hasUpvoted: true,
            hasDownvoted: true
        }
    
    )


    await dataSource.createComment(
        {
            postId: "postId1",
            userId: "userId3",
            text: "This is a reply to a reply.",
            parentId: "commentId2",
            createdAt: "2024-08-26T12:10:00.000Z",
            modifiedAt: "2024-08-26T12:15:00.000Z",
            votes: {
              upvotes: [
                "userId4",
                "userId5"
              ],
              downvotes: [
                "userId6"
              ]
            }
          }
    )


    await dataSource.createUser(
        {
            userId: "testUser123",
            postId: "testPost456",
            hasUpvoted: true,
            hasDownvoted: true
        }
    
    )







    
    await closeConnection()

}

main()