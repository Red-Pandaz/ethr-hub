const dataService = require('./dataService.js');

async function getDataForPostPage(pid){
    const results = {}
    results.post = await dataService.findOneDocumentByIndex(
        'Posts',
        {
            _id: pid
        }
    )

    results.comments = await dataService.findDocumentsByIndex(
        'Comments',
        {
            postId: pid
        }
    )

    results.postVotes = await dataService.findDocumentsByIndex(
        'Post Votes',
        {
            postId: pid
        }
    )
    results.commentVotes = await dataService.findDocumentsByIndex(
        'Comment Votes',
        {
            postId: pid
        }
    )

return results
}

async function getDataForUserFeed(uid){
    const user = await dataService.findOneDocumentByIndex(
        'Users',
        {
            _id: uid
        }
    )
    const userChannelIds = user.savedChannels
    console.log(userChannelIds)
    const userFeed = []
    for(let userChannel of userChannelIds){
        let postIds = await dataService.findOneDocumentByIndex(
            'Posts',
            {
                channel: userChannel
            }
        )
    userFeed.push(postIds)
    }

console.log(userFeed)
}

async function getDataForDefaultFeed(){

}

async function toggleVote(voteId, uid, itemId, voteType, itemType, userAction){
    if(!voteId){
        const newVoteObj = {};
        newVoteObj.userId = uid;
        if(voteType === 'Comment Votes'){
            newVoteObj.commentId = itemId;
            const comment = await dataService.findOneDocumentByIndex(
                'Comments',
                {
                    _id: itemId
                }
            )
            newVoteObj.postId = comment.postId
        } else if(voteType === 'Post Votes'){
            newVoteObj.postId = itemId
        }
        if(userAction === 'Upvote'){
            newVoteObj.hasUpvoted = true;
            newVoteObj.hasDownvoted = false;
            //change vote tally on item document
            await dataService.addToDocumentArray(itemType, itemId, votes.upvotes, uid)
        } else if(userAction === 'Downvote'){
            newVoteObj.hasUpvoted = false;
            newVoteObj.hasDownvoted = true
            //change vote tally on item document
            await dataService.addToDocumentArray(itemType, itemId, votes.downvotes, uid)
        }
        const newVote = await dataService.createDocument(voteType, newVoteObj);
        if(newVote.hasUpvoted){
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.upvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.addToDocumentArray('Users', uid, votes.comments.upvotes, newVote._id)
            }
        } else if (newVote.hasDownvoted){
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.downvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.addToDocumentArray('Users', uid, votes.comments.downvotes, newVote._id)
            }
        }

        return
    }

    const vote = await dataService.findOneDocumentByIndex(
        voteType,
        {
            _id: voteId
        }
    )
    const { hasUpvoted, hasDownvoted } = vote

    if(!hasUpvoted && !hasDownvoted){
        if(userAction === 'Upvote'){
            await dataService.updateDocumentById(
                voteType,
                voteId,
                {
                    hasUpvoted: true,
                }
            );
            await dataService.addToDocumentArray(itemType, itemId, votes.upvotes, uid)
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.upvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.addToDocumentArray('Users', uid, votes.comments.upvotes, newVote._id)
            }

            //logic for turning neutral to upvote

        else if (userAction === 'Downvote'){

            await dataService.updateDocumentById(
                voteType,
                voteId,
                {
                    hasDownvoted: true,
                }
            );
            await dataService.addToDocumentArray(itemType, itemId, votes.downvotes, uid)
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.downvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.addToDocumentArray('Users', uid, votes.comments.downvotes, newVote._id)
            }


        }

    } else if(hasUpvoted && !hasDownvoted){
        if(userAction === 'Upvote'){

            await dataService.updateDocumentById(
                voteType,
                voteId,
                {
                        hasUpvoted: false,
                }
            );
 
            await dataService.removeFromDocumentArray(itemType, itemId, votes.upvotes, uid)
            if(itemType === 'Posts'){
                await dataService.removeFromDocumentArray('Users', uid, votes.posts.upvotes, voteId)
            }else if(itemType === 'Comments'){
                await dataService.removeFromDocumentArray('Users', uid, votes.comments.upvotes, voteId)
            }
            

        } else if (userAction === 'Downvote'){

            await dataService.updateDocumentById(
                voteType,
                voteId,
                {
                    hasUpvoted: false,
                    hasDownvoted: true
                }
            );
            await dataService.addToDocumentArray(itemType, itemId, votes.downvotes, uid)
            await dataService.removeFromDocumentArray(itemType, itemId, votes.upvotes, uid)
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.downvotes, newVote._id)
                await dataService.removeFromDocumentArray('Users', uid, votes.posts.upvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.addToDocumentArray('Users', uid, votes.comments.downvotes, newVote._id)
                await dataService.removeFromDocumentArray('Users', uid, votes.comments.upvotes, newVote._id)
            }
        }

    } else if(!hasUpvoted && hasDownvoted){
        if(userAction === 'Upvote'){

            await dataService.updateDocumentById(
                voteType,
                voteId,
                {
                    hasUpvoted: true,
                    hasDownvoted: false
                }
            );
            await dataService.addToDocumentArray(itemType, itemId, votes.upvotes, uid)
            await dataService.removeFromDocumentArray(itemType, itemId, votes.downvotes, uid)
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.upvotes, newVote._id)
                await dataService.removeFromDocumentArray('Users', uid, votes.posts.downvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.addToDocumentArray('Users', uid, votes.comments.upvotes, newVote._id)
                await dataService.removeFromDocumentArray('Users', uid, votes.comments.downvotes, newVote._id)
            }
            //logic for turning downvote to upvote

        } else if (userAction === 'Downvote'){

            await dataService.updateDocumentById(
                voteType,
                voteId,
                {
                    hasDownvoted: false,
                }
            );
                
            await dataService.removeFromDocumentArray(itemType, itemId, votes.downvotes, uid)
            if(itemType === 'Posts'){
                await dataService.addToDocumentArray('Users', uid, votes.posts.downvotes, newVote._id)
            }else if(itemType === 'Comments'){
                await dataService.removeFromDocumentArray('Users', uid, votes.comments.upvotes, newVote._id)
            }
        }
    }
}
}

async function saveChannel(uid, cid){
    await dataService.addToDocumentArray('Users', uid, 'savedChannels', cid)
    return
}

async function unsaveChannel(uid,cid){
    await dataService.removeFromDocumentArray('Users', uid, 'savedChannels', cid)
    return

}

async function savePost(uid, pid){
    await dataService.addToDocumentArray('Users', uid, 'savedPosts', pid)
    return
}

async function unsavePost(uid, pid){
    await dataService.removeFromDocumentArray('Users', uid, 'savedPosts', pid)
    return
}

async function toggleSave(uid, itemId, itemType){
    
    try {
        const user = await dataService.findOneDocumentByIndex(
            'Users',
            {
                _id: uid
            }
        ); 
        const saveArray = `saved${itemType}`
        console.log('save array' + saveArray)
        const isSaved = user[saveArray].includes(itemId);
        console.log('is saved: ' + isSaved)

        if (isSaved) {
            await dataService.removeFromDocumentArray('Users', uid, saveArray, itemId)
          
            console.log(`${itemType} ${itemId} unsaved for user ${uid}`);
        } else {

            await dataService.addToDocumentArray('Users', uid, saveArray, itemId)
            console.log(`${itemType} ${itemId} saved for user ${uid}`);
        }

        return !isSaved; 
    } catch (err) {
        console.error(`Error toggling save for ${itemType} ${itemId} and user ${uid}`, err);
        throw err;
    }

}

async function writeComment(commentText, uid, pid, replyToId){
    const commentObj = {
        postId: pid,
        userId: uid,
        text: commentText,
        parentId: replyToId,
        createdAt: new Date(),
        modifiedAt: new Date(),
        votes: {
          upvotes: [
            uid
          ],
          downvotes: []
        }
      }
    const newComment = await dataService.createDocument(
        'Comments',
        commentObj
    )
    // await dataService.
}


async function editComment(newCommentText, uid, pid){
    await dataService.updateDocumentById(
        'Comments',
        pid,
        {
            modifiedAt: new Date(),
            text: newCommentText

        }
    )

}

async function deleteComment(cid, uid, pid){
    await dataService.deleteDocumentById(
        'Comments',
        cid
    )

}

async function writePost(postText, postTitle, uid, cid){
    const newPostObj = 
    {
        channel: cid,
        url: null,
        title: postTitle,
        text: postText,
        votes: {
          upvotes: [],
          downvotes: []
        },
        comments: [],
        createdBy: uid,
        createdAt: new Date(),
        modifiedAt: new Date(),
      }
    const newPost = await dataService.createDocument(
        'Posts',
        newPostObj
    )
    await dataService.addToDocumentArray('Channels', cid, posts, newPost._id)
    await dataService.addToDocumentArray('Users', uid, posts, newPost._id)
}


async function editPost(newCommentText, uid, pid){
    await dataService.updateDocumentById(
        'Posts',
        pid,
        {
            modifiedAt: new Date(),
            text: newPostText

        }
    )

}

async function deletePost(cid, uid, pid){
    await dataService.deleteDocumentById(
        'Comments',
        cid
    )

}

async function createChannel(channelName, channelDescription, uid){
    const channelCheck = await dataService.findOneDocumentByIndex(
        'Channels', 
        {
            name: channelName
        }
    )
        if(channelCheck){
            console.log('Channel name already exists')
            return
        } else{
            const newChannelObj = {
                name: channelName,
                description: channelDescription,
                subscribers: [uid],
                posts: [],
                createdBy: uid,
                createdAt: new Date(),
                lastUpdated: new Date()
            }
        const newChannel = await dataService.createDocument('Channels', newChannelObj)
        const newChannelId = newChannel.insertedId.toString()
        console.log(newChannelId)
        await dataService.addToDocumentArray('Users', uid, 'savedChannels', newChannelId)
        }
}

async function createUser(ethAddress){
    console.log(ethAddress)
    const userCheck = await dataService.findOneDocumentByIndex(
        'Users',
        {
            _id: ethAddress

        }
    )
    console.log(userCheck)
    if(userCheck){
        console.log('User already exists')
        return
    } else{
        const newUserObj = {
            _id: ethAddress,
            savedChannels: ["channelId1"],
            savedPosts: [],
            savedComments: [],
            votes: {
              posts: {
                upvotes: [],
                downvotes: []
              },
              comments: {
                upvotes: [],
                downvotes: []
              }
            },
            posts: [],
            createdAt: new Date(),
            lastLogin: new Date(),
            ensName: null
          }
        
          await dataService.createDocument('Users', newUserObj)
    }

}


module.exports = { 
    getDataForPostPage,
    getDataForUserFeed,
    getDataForDefaultFeed,
    toggleVote,
    saveChannel,
    unsaveChannel,
    savePost,
    unsavePost,
    writeComment,
    editComment,
    deleteComment,
    writePost,
    editPost,
    deletePost,
    createChannel,
    createUser,
    toggleSave
}
 