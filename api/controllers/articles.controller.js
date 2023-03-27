const { fetchArticles } = require('../models/articles.models')

exports.getArticles = (req, res, next) => {
    const id = req.params.article_id;
    fetchArticles(id).then((result) => {
        res.status(200).send(result);
    })
        .catch((err) => {
            next(err)
        })
}