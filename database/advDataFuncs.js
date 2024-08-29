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

return results
}

async function getDataForUserFeed(uid){
    const user = await dataService.findOneDocumentByIndex(
        'Users',
        {
            _id: uid
        }
    )
    const userChannelIds = user.channels
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

async function toggleVote(voteId, uid, itemId, voteType, itemType, userAction){
    if(!voteId){
        const newVoteObj = {};
        newVoteObj.userId = uid;
        if(voteType === 'Comment Votes'){
            newVoteObj.commentId = itemId;

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
        const userVoteType = itemType.toLowerCase()
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
    await dataService.addToDocumentArray('Users', uid, 'savedPosts', cid)
    return
}

async function unsaveChannel(uid,cid){
    await dataService.removeFromDocumentArray('Users', uid, 'savedPosts', cid)
    return

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
    await dataService.createDocument(
        'Comments',
        commentObj
    )
}

async function editComment(newCommentText, uid, pid){

}

async function deleteComment(){

}

module.exports = { 
    getDataForPostPage,
    getDataForUserFeed,
    toggleVote,
    saveChannel,
    unsaveChannel,
    writeComment,
    editComment,
    deleteComment,
}
 