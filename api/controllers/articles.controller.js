const { fetchArticles, fetchSpecificArticle } = require('../models/articles.models')

exports.getSpecificArticle = (req, res, next) => {
    const id = req.params.article_id;
    fetchSpecificArticle(id).then((result) => {
        res.status(200).send(result);
    })
        .catch((err) => {
            next(err)
        })
}

exports.getArticles = (req, res, next) => {
    console.log(req.params);
    fetchArticles().then((result) => {
        console.log(result);
    })
}