const { fetchArticles, fetchSpecificArticle, fetchArticleComments, addArticleComment, articlePatcher, fetchComments, removeComment } = require('../models/articles.models')
const { checkUsername } = require('../models/users.models')

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

exports.postArticleComment = (req, res, next) => {
    const articleNumber = req.params.article_id
    const comment = req.body
    const commentBody = req.body.body
    const username = req.body.username

    if (!commentBody || !username) {
        res.status(400).send({ msg: 'Please make sure you include a comment and a username' })
    }
    fetchSpecificArticle(articleNumber)
        .then((result) => {
            if (result) return addArticleComment(comment, articleNumber)
        }).then((result) => {
            res.status(201).send({ comment: result })
        }).catch((err) => {
            next(err);
        })

}

exports.patchArticle = (req, res, next) => {
    const article = req.params.article_id
    const voteIncrease = req.body.inc_votes

    fetchSpecificArticle(article).then((result) => {
        if (result) {
            return articlePatcher(result, voteIncrease)

        }
    }).then((result) => res.status(200).send({ article: result }))
        .catch((err) => {
            next(err)
        })
}

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id;

    return removeComment(commentId)
        .then(() => {
            res.sendStatus(204)
        })
        .catch((err) => {
            next(err)
        })
}