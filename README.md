Welcome to my news API!

This API is a news website, containing plenty of topics and articles to comment, delete and vote on! 

Here is a link to the hosted version: https://james-news.onrender.com/api/articles

Minimum versions
node.js:  v19.5.0
Postgres: ^8.10.0

To clone this repository, make sure to fork a copy of the following URL:

https://github.com/Sangsterr/nc-news


To install dependencies, you will need the following:

Husky: npm i -D husky,
Jest: npm i -D jest,
Jest Sorted: npm i -D jest-sorted
Postgres: npm i -D pg
Supertest: npm i -D supertest


This api has several different requests you can use, they are as follows:

get - /api/topics

    - This provides the client with an array of topics which all have two values, slug (the topic type) & description (explanation of the topic)

get - /api/articles

    -   This provides the client with an array of articles, which all have 9 values, article_id (the id of the article), title (the title of the article), author (the author of the article), body (the context of the article), created_at (the timestamp of the article), votes (how many votes the article has), article_img_url (the image linked to the article), comment_count (how many comments the article has)

get - /api/articles/:article_id

    - This provides the client with a specific article, the same information provided for one article as mentioned in the last get request, if provided a wrong id, you will receive a correct error code

get - /api/articles/:article_id/comments

    - This provides the client with the comments of a specific article, which contain a body, the votes, the author, the article id and when it was created, if provided a wrong id, you will receive a correct error code

get - /api/users

    - This provides the client with an array of objects of the users of the database, each contains a username, a name and their avatar url

post - /api/articles/:article_id/comments

    - This allows the client to add a comment to the selected article, it should consist of an object with two properties inside an object, a username with a valid string, and a body, also with a valid string, if provided a wrong id, you will receive a correct error code

patch - /api/articles/:article_id

    - This allows the client to vote on a specific article, this would be in the form of an object with a property of inc_votes and an amount they would like to vote by, this can be a positive or negative number & will return with the updated article, if provided a wrong id, you will receive a correct error code

delete - /api/comments/:comment_id'

    - This allows the client to delete a comment, depending on which comment they have selected, this returns a status of 204 and no content, if provided a wrong id, you will receive a correct error code