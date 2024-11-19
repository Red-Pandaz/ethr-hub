const dataService = require("./dataService.js");
const { ObjectId } = require("mongodb");
const { checkEnsName } = require("../utils/apiutils.js");

async function checkExistingVote(voteType, idType, uid, itemId) {
  console.log("Checking existing vote with:", {
    voteType,
    idType,
    uid,
    itemId,
  });
  const results = await dataService.findOneDocumentByIndex(voteType, {
    [idType]: itemId,
    userId: uid.toLowerCase(),
  });
  console.log("Found existing vote:", results);
  return results;
}
async function getDataForPostPage(pid) {
  const results = {};
  results.post = await dataService.findOneDocumentByIndex("Posts", {
    _id: new ObjectId(pid),
  });
  results.votes = await dataService.findDocumentsByIndex("Post Votes", {
    postId: pid,
  });

  results.comments = await dataService.findDocumentsByIndex("Comments", {
    postId: pid,
  });

  results.postVotes = await dataService.findDocumentsByIndex("Post Votes", {
    postId: pid,
  });
  results.commentVotes = await dataService.findDocumentsByIndex(
    "Comment Votes",
    {
      postId: pid,
    }
  );

  return results;
}

async function getDataForUserFeed(uid) {
  const user = await dataService.findOneDocumentByIndex("Users", {
    _id: uid,
  });
  const userChannelIds = user.savedChannels;
  console.log(userChannelIds);
  const userFeed = [];
  for (let userChannel of userChannelIds) {
    let postIds = await dataService.findDocumentsByIndex("Posts", {
      channel: userChannel,
    });
    userFeed.push(postIds);
  }

  return userFeed;
}

async function getDataForDefaultFeed() {
  const posts = await dataService.findDocumentsByIndex("Posts", {
    channel: "channelId1",
  });
  return posts;
}

async function getDataForChannelFeed(channelId) {
  const posts = await dataService.findDocumentsByIndex("Posts", {
    channel: channelId,
  });
  const channel = await dataService.findDocumentsByIndex("Channels", {
    _id: new ObjectId(channelId),
  });
  console.log("posts ", posts);
  console.log("channel ", channel);
  return {
    posts: posts,
    channel: channel,
  };
}

async function toggleVote(voteId, uid, itemId, voteType, itemType, userAction) {
  console.log("Toggle Vote Params:", {
    voteId,
    uid,
    itemId,
    voteType,
    itemType,
    userAction,
  });

  if (!voteId) {
    const newVoteObj = {};
    newVoteObj.userId = uid;
    if (voteType === "Comment Votes") {
      newVoteObj.commentId = itemId;
      const comment = await dataService.findOneDocumentByIndex("Comments", {
        _id: itemId,
      });
      newVoteObj.postId = comment.postId;
    } else if (voteType === "Post Votes") {
      newVoteObj.postId = itemId;
    }
    if (userAction === "Upvote") {
      newVoteObj.hasUpvoted = true;
      newVoteObj.hasDownvoted = false;
    } else if (userAction === "Downvote") {
      newVoteObj.hasUpvoted = false;
      newVoteObj.hasDownvoted = true;
    }
    const newVote = await dataService.createDocument(voteType, newVoteObj);
    const newVoteId = newVote.insertedId.toString();
    if (newVoteObj.hasUpvoted) {
      const newUpvote = await dataService.addToDocumentArray(
        itemType,
        itemId,
        "votes.upvotes",
        newVoteId
      );
      console.log(newUpvote);
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.upvotes",
          newVoteId
        );
      } else if (itemType === "Comments") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.comments.upvotes",
          newVoteId
        );
      }
    } else if (newVoteObj.hasDownvoted) {
      const newDownvote = await dataService.addToDocumentArray(
        itemType,
        itemId,
        "votes.downvotes",
        newVoteId
      );
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.downvotes",
          newVoteId
        );
      } else if (itemType === "Comments") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.comments.downvotes",
          newVoteId
        );
      }
    }

    return;
  }
  const vote = await dataService.findOneDocumentByIndex(voteType, {
    _id: new ObjectId(voteId),
  });

  const { hasUpvoted, hasDownvoted } = vote;
  if (!hasDownvoted) {
  }

  if (!hasUpvoted && !hasDownvoted) {
    if (userAction === "Upvote") {
      await dataService.updateDocumentById(voteType, new ObjectId(voteId), {
        hasUpvoted: true,
      });
      await dataService.addToDocumentArray(
        itemType,
        itemId,
        "votes.upvotes",
        voteId
      );
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.upvotes",
          voteId
        );
      } else if (itemType === "Comments") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.comments.upvotes",
          voteId
        );
      }

      //logic for turning neutral to upvote
    } else if (userAction === "Downvote") {
      await dataService.updateDocumentById(voteType, new ObjectId(voteId), {
        hasDownvoted: true,
      });
      await dataService.addToDocumentArray(
        itemType,
        itemId,
        "votes.downvotes",
        voteId
      );
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.downvotes",
          voteId
        );
      } else if (itemType === "Comments") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.comments.downvotes",
          voteId
        );
      }
    }
  } else if (hasUpvoted && !hasDownvoted) {
    if (userAction === "Upvote") {
      const voteUpdate = await dataService.updateDocumentById(
        voteType,
        new ObjectId(voteId),
        {
          hasUpvoted: false,
        }
      );
      console.log(voteUpdate);
      await dataService.removeFromDocumentArray(
        itemType,
        itemId,
        "votes.upvotes",
        voteId
      );
      if (itemType === "Posts") {
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.posts.upvotes",
          voteId
        );
      } else if (itemType === "Comments") {
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.comments.upvotes",
          voteId
        );
      }
    } else if (userAction === "Downvote") {
      await dataService.updateDocumentById(voteType, new ObjectId(voteId), {
        hasUpvoted: false,
        hasDownvoted: true,
      });
      await dataService.addToDocumentArray(
        itemType,
        itemId,
        "votes.downvotes",
        uid
      );
      await dataService.removeFromDocumentArray(
        itemType,
        itemId,
        "votes.upvotes",
        uid
      );
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.downvotes",
          voteId
        );
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.posts.upvotes",
          voteId
        );
      } else if (itemType === "Comments") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.comments.downvotes",
          voteId
        );
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.comments.upvotes",
          voteId
        );
      }
    }
  } else if (!hasUpvoted && hasDownvoted) {
    if (userAction === "Upvote") {
      await dataService.updateDocumentById(voteType, new ObjectId(voteId), {
        hasUpvoted: true,
        hasDownvoted: false,
      });
      await dataService.addToDocumentArray(
        itemType,
        itemId,
        "votes.upvotes",
        voteId
      );
      await dataService.removeFromDocumentArray(
        itemType,
        itemId,
        "votes.downvotes",
        voteId
      );
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.upvotes",
          voteId
        );
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.posts.downvotes",
          voteId
        );
      } else if (itemType === "Comments") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.comments.upvotes",
          voteId
        );
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.comments.downvotes",
          voteId
        );
      }
      //logic for turning downvote to upvote
    } else if (userAction === "Downvote") {
      await dataService.updateDocumentById(voteType, new ObjectId(voteId), {
        hasDownvoted: false,
      });

      await dataService.removeFromDocumentArray(
        itemType,
        itemId,
        "votes.downvotes",
        voteId
      );
      if (itemType === "Posts") {
        await dataService.addToDocumentArray(
          "Users",
          uid,
          "votes.posts.downvotes",
          voteId
        );
      } else if (itemType === "Comments") {
        await dataService.removeFromDocumentArray(
          "Users",
          uid,
          "votes.comments.upvotes",
          voteId
        );
      }
    }
  }
}

async function toggleSave(uid, itemId, itemType) {
  try {
    const user = await dataService.findOneDocumentByIndex("Users", {
      _id: uid,
    });
    const saveArray = `saved${itemType}`;
    console.log("save array" + saveArray);
    const isSaved = user[saveArray].includes(itemId);
    console.log("is saved: " + isSaved);

    if (isSaved) {
      await dataService.removeFromDocumentArray(
        "Users",
        uid,
        saveArray,
        itemId
      );

      console.log(`${itemType} ${itemId} unsaved for user ${uid}`);
    } else {
      await dataService.addToDocumentArray("Users", uid, saveArray, itemId);
      console.log(`${itemType} ${itemId} saved for user ${uid}`);
    }

    return !isSaved;
  } catch (err) {
    console.error(
      `Error toggling save for ${itemType} ${itemId} and user ${uid}`,
      err
    );
    throw err;
  }
}

async function writeComment(commentText, uid, pid, replyToId, ensName) {
  const commentObj = {
    postId: pid,
    userId: uid,
    ensName: ensName,
    text: commentText,
    parentId: replyToId,
    createdAt: new Date(),
    modifiedAt: new Date(),
    votes: {
      upvotes: [uid],
      downvotes: [],
    },
  };
  const newComment = await dataService.createDocument("Comments", commentObj);
  const newCommentId = newComment.insertedId.toString();
  await dataService.addToDocumentArray("Users", uid, "comments", newCommentId);
  await dataService.addToDocumentArray("Posts", pid, "comments", newCommentId);
}

async function editComment(newCommentText, cid) {
  await dataService.updateDocumentById("Comments", cid, {
    modifiedAt: new Date(),
    text: newCommentText,
  });
}

async function deleteComment(cid, uid, pid) {
  console.log(cid, uid, pid);
  await dataService.deleteDocumentById("Comments", cid);
  await dataService.removeFromDocumentArray("Users", uid, "comments", cid);
  await dataService.removeFromDocumentArray("Posts", pid, "comments", cid);
}

async function writePost(postText, postTitle, ensName, uid, cid) {
  const newPostObj = {
    channel: cid,
    url: null,
    title: postTitle,
    text: postText,
    votes: {
      upvotes: [],
      downvotes: [],
    },
    comments: [],
    createdBy: uid,
    ensName: ensName,
    createdAt: new Date(),
    modifiedAt: new Date(),
  };
  console.log(newPostObj);
  const newPost = await dataService.createDocument("Posts", newPostObj);
  // await dataService.addToDocumentArray('Channels', cid, posts, newPost._id)
  // await dataService.addToDocumentArray('Users', uid, posts, newPost._id)
}

async function editPost(newPostText, pid) {
  await dataService.updateDocumentById("Posts", pid, {
    modifiedAt: new Date(),
    text: newPostText,
  });
}

//MAKE SURE TO ADD LOGIC FOR DELETING POSTID FROM USER AND CHANNEL
async function deletePost(cid, uid, pid) {
  const deletedPost = await dataService.deleteDocumentById("Posts", pid);
  await dataService.addToDocumentArray("Users", uid, "posts", pid);
  await dataService.addToDocumentArray("Channels", cid, "posts", pid);
  return deletedPost;
}

async function createChannel(channelName, channelDescription, uid) {
  const channelCheck = await dataService.findOneDocumentByIndex("Channels", {
    name: channelName,
  });
  if (channelCheck) {
    console.log("Channel name already exists");
    return;
  } else {
    const newChannelObj = {
      name: channelName,
      description: channelDescription,
      subscribers: [uid],
      posts: [],
      createdBy: uid,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    const newChannel = await dataService.createDocument(
      "Channels",
      newChannelObj
    );
    const newChannelId = newChannel.insertedId.toString();
    await dataService.addToDocumentArray(
      "Users",
      uid,
      "savedChannels",
      newChannelId
    );
    return newChannel;
  }
}

async function createUser(ethAddress) {
  const userCheck = await dataService.findOneDocumentByIndex("Users", {
    _id: ethAddress,
  });
  console.log(userCheck);
  if (userCheck) {
    console.log("User already exists");
    return;
  } else {
    const ensName = await checkEnsName(ethAddress);
    const newUserObj = {
      _id: ethAddress,
      savedChannels: ["channelId1"],
      savedPosts: [],
      savedComments: [],
      votes: {
        posts: {
          upvotes: [],
          downvotes: [],
        },
        comments: {
          upvotes: [],
          downvotes: [],
        },
      },
      posts: [],
      comments: [],
      createdAt: new Date(),
      lastLogin: new Date(),
      ensName: ensName,
    };

    const newUser = await dataService.createDocument("Users", newUserObj);
    return newUser;
  }
}
async function getUserByAddress(ethAddress) {
  try {
    const user = await dataService.findOneDocumentByIndex("Users", {
      _id: ethAddress,
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

async function getChannels() {
  try {
    const channels = await dataService.getCollection("Channels");
    if (!channels) {
      return null;
    }

    return channels;
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
}

async function getCommentVotes() {
  try {
    const commentVotes = await dataService.getCollection("Comment Votes");
    if (!commentVotes) {
      return null;
    }

    return commentVotes;
  } catch (error) {
    console.error("Error fetching Comment Votes:", error);
    throw error;
  }
}

module.exports = {
  getDataForPostPage,
  getDataForUserFeed,
  getDataForDefaultFeed,
  getChannels,
  toggleVote,
  writeComment,
  editComment,
  deleteComment,
  writePost,
  editPost,
  deletePost,
  createChannel,
  createUser,
  toggleSave,
  checkExistingVote,
  getDataForChannelFeed,
  getUserByAddress,
  getCommentVotes,
};
