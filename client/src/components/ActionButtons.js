import React, { useState } from "react";
import Button from "./Button"; // Import the Button component
import axios from "axios"; // Import axios for making API calls
import { useAuth } from "../context/AuthContext";

const ButtonDisplay = ({ type, extraParam, onClick }) => {
  const { userAddress } = useAuth(); // Access userAddress from AuthContext
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleClick = async () => {
    // Retrieve the authToken from localStorage
    const authToken = localStorage.getItem("authToken");
    try {
      if (!userAddress) {
        console.error("User is not logged in.");
        return;
      }

      let response;

      switch (type) {
        case "upvotePost":
          {
            console.log("Raw extraParam:", extraParam); // Debug raw extraParam

            // Extract necessary values
            const { itemId } = extraParam;
            const voteType = "Post Votes"; // Fixed value for posts
            const idType = "postId"; // Fixed value for post identifier

            if (!userAddress || !itemId) {
              console.error("Missing required parameters:", {
                userAddress,
                itemId,
              });
              return;
            }

            console.log("Checking existing vote with:", {
              voteType,
              idType,
              uid: userAddress,
              itemId,
            });

            try {
              // Check if a vote exists
              const doesVoteExist = await axios.get(
                `http://localhost:5000/api/checkExistingVote`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                  params: {
                    voteType,
                    idType,
                    uid: userAddress.toLowerCase(), // Match backend expectation
                    itemId,
                  },
                }
              );

              const existingVote = doesVoteExist.data;
              console.log("Existing vote:", existingVote);

              let vid = existingVote ? existingVote._id : null;

              // Toggle the vote
              const response = await axios.post(
                "http://localhost:5000/api/toggleVote",
                {
                  voteId: vid,
                  userId: userAddress.toLowerCase(),
                  itemId,
                  voteType,
                  itemType: "Posts",
                  userAction: "Upvote",
                },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

              console.log("Vote toggled successfully:", response.data);
            } catch (error) {
              console.error("Error toggling vote:", error.message);
            }
          }
          break;

        case "downvotePost":
          {
            console.log("Raw extraParam:", extraParam); // Debug raw extraParam

            // Extract necessary values
            const { itemId } = extraParam;
            const voteType = "Post Votes"; // Fixed value for posts
            const idType = "postId"; // Fixed value for post identifier

            if (!userAddress || !itemId) {
              console.error("Missing required parameters:", {
                userAddress,
                itemId,
              });
              return;
            }

            console.log("Checking existing vote with:", {
              voteType,
              idType,
              uid: userAddress,
              itemId,
            });

            try {
              // Check if a vote exists
              const doesVoteExist = await axios.get(
                `http://localhost:5000/api/checkExistingVote`,
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                  params: {
                    voteType,
                    idType,
                    uid: userAddress.toLowerCase(), // Match backend expectation
                    itemId,
                  },
                }
              );

              const existingVote = doesVoteExist.data;
              console.log("Existing vote:", existingVote);

              let vid = existingVote ? existingVote._id : null;

              // Toggle the vote
              const response = await axios.post(
                "http://localhost:5000/api/toggleVote",
                {
                  voteId: vid,
                  userId: userAddress.toLowerCase(),
                  itemId,
                  voteType,
                  itemType: "Posts",
                  userAction: "Downvote",
                },
                {
                  headers: {
                    Authorization: `Bearer ${authToken}`,
                  },
                }
              );

              console.log("Vote toggled successfully:", response.data);
            } catch (error) {
              console.error("Error toggling vote:", error.message);
            }
          }
          break;

        case "upvoteComment":
          {
            const doesVoteExist = await axios.get(
              `http://localhost:5000/api/checkExistingVote?voteType=Comment%20Votes&idType=commentId&uid=${userAddress}&itemId=${extraParam.itemId}`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            const existingVote = doesVoteExist.data;
            console.log(JSON.stringify(doesVoteExist, null, 2));
            let vid;
            if (existingVote) {
              vid = existingVote._id.toString();
            } else {
              vid = null;
            }

            response = await axios.post(
              "http://localhost:5000/api/toggleVote",
              {
                voteId: vid,
                userId: userAddress.toLowerCase(),
                itemId: extraParam.itemId,
                voteType: "Comment Votes",
                itemType: "Comments",
                userAction: "Upvote",
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
          }
          break;

        case "downvoteComment":
          {
            const doesVoteExist = await axios.get(
              `http://localhost:5000/api/checkExistingVote?voteType=Comment%20Votes&idType=commentId&uid=${userAddress}&itemId=${extraParam.itemId}`,
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            const existingVote = doesVoteExist.data;
            console.log(JSON.stringify(doesVoteExist, null, 2));
            let vid;
            if (existingVote) {
              vid = existingVote._id.toString();
            } else {
              vid = null;
            }

            response = await axios.post(
              "http://localhost:5000/api/toggleVote",
              {
                voteId: vid,
                userId: userAddress,
                itemId: extraParam.itemId,
                voteType: "Comment Votes",
                itemType: "Comments",
                userAction: "Downvote",
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
          }
          break;

        case "replyToPost": {
          try {
            response = await axios.post(
              "http://localhost:5000/api/writeComment",
              {
                commentText: extraParam.commentText, // Text of the comment
                postId: extraParam.postId, // The ID of the post
                parentId: null, // No parent for post-level comments
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            console.log("Post-level comment created:", response.data);
          } catch (error) {
            console.error("Error creating post-level comment:", error);
          }
          break;
        }
        case "replyToComment": {
          try {
            response = await axios.post(
              "http://localhost:5000/api/writeComment",
              {
                commentText: extraParam.commentText, // Text of the reply
                postId: extraParam.postId, // The ID of the post the comment belongs to
                parentId: extraParam.parentId, // Parent comment's ID
              },
              {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              }
            );
            console.log("Comment reply created:", response.data);
          } catch (error) {
            console.error("Error creating comment reply:", error);
          }
          break;
        }

        case "createPost": {
          onClick();
          break;
        }

        case "submitPost":
          response = await axios.post("https://localhost:5000/api/writePost", {
            postTitle: extraParam.postTitle,
            postText: extraParam.postText,
            userId: userAddress,
            channelId: extraParam.channelId,
          });
          break;

        case "editPost":
        case "submitEditPost":
        case "deletePost":
        case "confirmDeletePost":
        case "editComment":
          response = await axios.put("/editItem", {
            itemId: extraParam.itemId,
            newContent: extraParam.newContent,
            userId: userAddress,
            itemType: type.includes("Post") ? "post" : "comment",
          });
          break;
        case "submitEditComment":

        default:
          console.error("Unsupported action type");
          return;
      }

      if (onClick) {
        onClick(response.data); // Pass the response data to the onClick handler
      }
    } catch (error) {
      console.error(
        "Error performing action:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const renderButton = () => {
    switch (type) {
      case "upvotePost":
        return (
          <Button onClick={handleClick} className="button upvote">
            Upvote Post
          </Button>
        );
      case "downvotePost":
        return (
          <Button onClick={handleClick} className="button downvote">
            Downvote Post
          </Button>
        );
      case "upvoteComment":
        return (
          <Button onClick={handleClick} className="button upvote">
            Upvote Comment
          </Button>
        );
      case "downvoteComment":
        return (
          <Button onClick={handleClick} className="button downvote">
            Downvote Comment
          </Button>
        );
      case "replyToPost":
        return (
          <Button onClick={handleClick} className="button reply">
            Reply to Post
          </Button>
        );
      case "replyToComment":
        return (
          <Button onClick={handleClick} className="button reply">
            Reply to Comment
          </Button>
        );
      case "createPost":
        return (
          <Button onClick={handleClick} className="button create">
            Create Post
          </Button>
        );
      case "submitPost":
        return (
          <Button onClick={handleClick} className="button submit">
            Submit Post
          </Button>
        );
      case "editPost":
        return (
          <Button onClick={handleClick} className="button edit">
            Edit Post
          </Button>
        );
      case "editComment":
        return (
          <Button onClick={handleClick} className="button edit">
            Edit Comment
          </Button>
        );
      default:
        return null;
    }
  };

  return <div>{renderButton()}</div>;
};

export default ButtonDisplay;
