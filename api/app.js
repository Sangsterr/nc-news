const express = require("express");
const { getTopics } = require("./controllers/topics.controller")
const { getSpecificArticle, getArticles, getArticleComments, postArticleComment, patchArticle } = require("./controllers/articles.controller")

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getSpecificArticle)

app.get("/api/articles/:article_id/comments", getArticleComments)

app.post("/api/articles/:article_id/comments", postArticleComment)

app.patch('/api/articles/:article_id', patchArticle)

app.use("*", (req, res, next) => {
    res.status(404).send({ msg: "Invalid URL" });
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Wrong data type, please use number" });
    } else if (err.code === "23503") {
        res.status(404).send({ msg: "Username not found" })
    }
})

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: err.msg })
    } else if (err.status === 400) {
        res.status(400).send({ msg: err.msg })
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Server Error" });
});

module.exports = app;