# Ethr Hub

## Project Description
This repository was created to fulfill the requirements of the Per Scholas capstone project. It is a watered-down reddit clone that uses Ethereum for user authentication. This project is currently deployed to [ethrhub.xyz](https://ethrhub.xyz)

## How to Use
An unauthenticated user will be prompted to sign in using Metamask. Previously authenticated accounts have a database document while newly authenticated accounts have a database document created for them upon initial login. Creating a new user prompts the program to search ENS for an names that resolve to the authenticated address. ENS names are displayed in place of their resolved address every place applicable on the website.

Once logged in, the client is issued a JWT which allows browsing and posting access for one hour. /channels provides a list of channels to browse while /channels/:channelId lists all the posts associated with a specific channel in descending order by timestamp. It also provides a form to create new posts within that channel. 

/posts/:postId displays the title and content of a given post as well as all associated comments. On this page if the creator of a post is authenticated they can edit or delete the post. Creators of comments are also able to edit or delete their comments here. Deleting a comment will automatically remove all child comments from the display.

## Technologies Used
MongoDB
Express
ReactJS
Node.js
Ethers.js
Ethereum Name Service
Google Cloud Secrets


