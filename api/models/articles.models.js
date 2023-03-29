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
    })
}

exports.fetchArticles = () => {
    return db
        .query(
            `
      SELECT articles.*, CAST(COALESCE(COUNT(comments.article_id), 0) AS INT) AS comment_count FROM
      articles
      LEFT JOIN comments on articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `
        )
        .then((res) => { return res.rows });
}



exports.fetchArticleComments = (article_id) => {

    const articleeId = article_id
    return db
        .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
            [articleeId]
        )
        .then((data) => {
            return data.rows;
        });
};
