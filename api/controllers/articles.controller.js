const { fetchArticles, fetchSpecificArticle, fetchArticleComments } = require('../models/articles.models')

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
    fetchArticles().then((result) => {

        res.status(200).send({ articles: result });
    })
}

exports.getArticleComments = (req, res, next) => {
    const articleId = req.params.article_id;
    fetchSpecificArticle(articleId).then((result) => {
        if (result) return fetchArticleComments(articleId)
        else Promise.reject({ status: 404, msg: "Article doesnt exist" })
    })
        .then((result) => {
            if (result.length > 0) {
                res.status(200).send({ comments: result })
            } else
                res.status(200).send({ msg: result })
        })
        .catch((err) => {
            next(err)
        })
}