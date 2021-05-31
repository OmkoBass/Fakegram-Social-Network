# Fakegram Social Network

### Disclaimer:
### This was my first fullstack project so keep in mind that this code can use ALOT of refacotring and smarter ways of implementing stuff.
### I started this project in mid 2020 and finished it a couple of months later. Now, a year later I realized how much I have grown as a software engineer and a programmer that I could improve this codebase substantially.  

### https://fakegramm.netlify.app/

This is my software engineering project that i created using MERN stack.
Fakegram is a social network insipired by already existing social network Instagram.

Preview: https://omkobass.netlify.app/static/media/fakegram.81a839c3.mp4

It has:
- Creating a profile
- Email verification
- JWT authentication
- Hashing passwords on the backend

The users can:
- Create posts with images
- Like other posts
- Comment on other posts
- Follow/Unfollow other users
- Send messages to other users
- Recieve (no socket) notifications

# How to run it

1. Clone this repo
2. Do an npm install in the Frontend dir
3. Do an npm install in the Backend dir
4. In the backend you need to connect it to your own mongoDB database locally (You'll need to install mongoDB) or with a cluster
5. Create .env file and replace the .env variables in the backend code with your own. When it's in production i use AWS server and MongoDB Cluster, when you want to run it locally you can store everything on your own computer
6. Run npm start in the Frontend dir (It's localhost:3000)
7. Run node server.js in the Backend dir (It's localhost:5000)
8. Done

# Future improvements
- Improvements can be done by paginating messages, likes, comments and posts for profiles
- Using socket.io for responsive notifications and messaging.
