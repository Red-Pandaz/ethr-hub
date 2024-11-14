import React, { useState } from 'react';
import Button from './Button'; // Import the Button component
import axios from 'axios'; // Import axios for making API calls

const ButtonDisplay = ({ type, extraParam, onClick }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
  const handleClick = async () => {
    try {
      let response;

      switch (type) {
        case 'upvotePost':{

            const doesVoteExist = await axios.get(`http://localhost:5000/api/checkExistingVote?voteType=Post%20Votes&idType=postId&uid=${extraParam.userId}&itemId=${extraParam.itemId}`);

            const existingVote = doesVoteExist.data
            let vid
            if(existingVote){
                
                vid = existingVote._id
            } else{
                vid = null
            }

            response = await axios.post('http://localhost:5000/api/toggleVote', {
                voteId: vid,
                userId: extraParam.userId,
                itemId: extraParam.itemId,
                voteType: 'Post Votes',
                itemType: 'Posts',
                userAction: 'Upvote'
              });
            }
              break;
    
        case 'downvotePost':{
            const doesVoteExist= await axios.get(`http://localhost:5000/api/checkExistingVote?voteType=Post%20Votes&idType=postId&uid=${extraParam.userId}&itemId=${extraParam.itemId}`);
            console.log(JSON.stringify(doesVoteExist, null, 2));    
            const existingVote = doesVoteExist.data;
                let vid
                if(existingVote){
                    vid = existingVote._id
                } else{
                    vid = null
                }

                response = await axios.post('http://localhost:5000/api/toggleVote', {
                    voteId: vid,
                    userId: extraParam.userId,
                    itemId: extraParam.itemId,
                    voteType: 'Post Votes',
                    itemType: 'Posts',
                    userAction: 'Downvote'
                });
            }
            break;
    
        case 'upvoteComment':{
            const doesVoteExist= await axios.get(`http://localhost:5000/api/checkExistingVote?voteType=Comment%20Votes&idType=commentId&uid=${extraParam.userId}&itemId=${extraParam.itemId}`);
            const existingVote = doesVoteExist.data;
            console.log(JSON.stringify(doesVoteExist, null, 2));    
            let vid
            if(existingVote){
                vid = existingVote._id.toString()
            } else{
                vid = null
            }

            response = await axios.post('http://localhost:5000/api/toggleVote', {
                voteId: vid,
                userId: extraParam.userId,
                itemId: extraParam.itemId,
                voteType: 'Comment Votes',
                itemType: 'Comments',
                userAction: 'Upvote'
            });
        }
        break;
        case 'downvoteComment':{
            const doesVoteExist= await axios.get(`http://localhost:5000/api/checkExistingVote?voteType=Comment%20Votes&idType=commentId&uid=${extraParam.userId}&itemId=${extraParam.itemId}`);
            const existingVote = doesVoteExist.data;
            console.log(JSON.stringify(doesVoteExist, null, 2));   
            let vid
            if(existingVote){
                vid = existingVote._id.toString()
            } else{
                vid = null
            }
            
            response = await axios.post('http://localhost:5000/api/toggleVote', {
                voteId: vid,
                userId: extraParam.userId,
                itemId: extraParam.itemId,
                voteType: 'Comment Votes',
                itemType: 'Comments',
                userAction: 'Downvote'
            });
        }
            break;

        case 'replyToPost':
            // response = await axios.post(`http://localhost:5000/api/create`)
        case 'replyToComment':
          response = await axios.post('/reply', {
            userId: extraParam.userId,
            itemId: extraParam.itemId,
            replyContent: extraParam.replyContent
          });
          break;


        case 'createPost': {
            onClick()
            break;
        }

        case 'submitPost':
          response = await axios.post('https://localhost:5000/api/writePost', {
            postTitle: extraParam.postTitle,
            postText: extraParam.postText,
            userId: extraParam.userId,
            channelId: extraParam.channelId
          });
          break;

        case 'editPost':
        case 'submitEditPost':
        case 'deletePost':
        case 'confirmDeletePost':
        case 'editComment':
          response = await axios.put('/editItem', {
            itemId: extraParam.itemId,
            newContent: extraParam.newContent,
            itemType: type.includes('Post') ? 'post' : 'comment'
          });
          break;
        case 'submitEditComment':
        

        default:
          console.error('Unsupported action type');
          return;
      }

      if (onClick) {
        onClick(response.data); // Pass the response data to the onClick handler
      }

    } catch (error) {
      console.error('Error performing action:', error.response ? error.response.data : error.message);
    }
  };

  const renderButton = () => {
    switch (type) {
      case 'upvotePost':
        return <Button onClick={handleClick} className="button upvote">Upvote Post</Button>;
      case 'downvotePost':
        return <Button onClick={handleClick} className="button downvote">Downvote Post</Button>;
      case 'upvoteComment':
        return <Button onClick={handleClick} className="button upvote">Upvote Comment</Button>;
      case 'downvoteComment':
        return <Button onClick={handleClick} className="button downvote">Downvote Comment</Button>;
      case 'replyToPost':
        return <Button onClick={handleClick} className="button reply">Reply to Post</Button>;
      case 'replyToComment':
        return <Button onClick={handleClick} className="button reply">Reply to Comment</Button>;
      case 'createPost':
        return <Button onClick={handleClick} className="button create">Create Post</Button>;
      case 'submitPost':
        return <Button onClick={handleClick} className="button submit">Submit Post</Button>;
      case 'editPost':
        return <Button onClick={handleClick} className="button edit">Edit Post</Button>;
      case 'editComment':
        return <Button onClick={handleClick} className="button edit">Edit Comment</Button>;
      default:
        return null;
    }
  };

  return (
    <div>
      {renderButton()}
    </div>
  );
};

export default ButtonDisplay;
