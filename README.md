# Northcoders News API


Welcome to my first Portfolio Project! The website can be viewed here - https://news-portfolio-project.onrender.com/api

This project is essentially a reddit clone. It makes use of https://www.elephantsql.com/ to store the database and https://render.com/ to deploy the website.
On this website you are able to view and interact with articles and comments, posting, updating, deleting or upvoting/downvoting them.

If you would like to clone this repo simply copy the code link (green code button seen above), open your terminal and cd into the folder you would like to clone it to, and run git clone <link>.

Once you have it open in your code editor of choice, you should run npm install to make sure all dependancies are installed. 

To setup your databases you should create 2 files, .env-development and .env-test. These should be set to PGDATABASE=nc_news and PGDATABASE=nc_news_test respectively. This will allow you to run the test DB for testing and dev DB for production. 

Minimum versions - 
        Node.js - v20.8.0
        Postgres - v14.9
