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
        return Promise.reject(err)
    })
}

exports.fetchArticles = () => {
    return db
        .query(
            `
      SELECT articles.*, COUNT(articles.article_id) AS comment_count FROM
      articles
      LEFT JOIN comments on articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
        )
        .then((res) => { return res.rows });
}



