const express = require('express');
const { getTopics } = require('../db/controllers/topics.controller')

const app = express();

app.use(express.json())

app.get("/api/topics", getTopics)


app.use('/*', (req, res, next) => {
    res.status(404).send({ msg: 'Invalid URL' });
})

app.use((err, req, res, next) => {
    console.log(err);
})

module.exports = app;