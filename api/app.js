const express = require('express');
const { getTopics } = require('./controllers/topics.controller')
const { getArticles } = require('./controllers/articles.controller')

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticles)

app.use('*', (req, res, next) => {
    res.status(404).send({ msg: 'Invalid URL' });
})

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: err.msg })
    } else if (err.status === 400) {
        res.status(400).send({ msg: err.msg })
    }
})


module.exports = app;