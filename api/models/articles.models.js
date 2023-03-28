const db = require('../../db/connection')
const { commentCount } = require('../utility-functions/utilities')

exports.fetchSpecificArticle = (id) => {
    const articleId = id;
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId]).then((result) => {
        if (!result.rows.length) {

            return Promise.reject({
                status: 404,
                msg: `No article found for article ${id}`
            })
        }
        return result.rows;
    }
    ).catch((err) => {
        if (err.code === '22P02') {
            return Promise.reject({
                status: 400,
                msg: "Wrong data type, please use number"
            })
        }
        console.log('hello');
        return Promise.reject(err)
    })
}

exports.fetchArticles = () => {

    return db.query(`SELECT * FROM articles ORDER BY created_at DESC`).then((result) => {
        const eachArticle = result.rows;
        const commentAmount = eachArticle.map((article) => {
            return commentCount(article.article_id).then((currentCount) => {
                article.comment_count = currentCount
                return article
            })
        })
        return Promise.all(commentAmount)
            .then((result) => {
                return result
            })
    })
}