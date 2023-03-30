const db = require('../../db/connection')

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

exports.addArticleComment = (comment, articleNumber) => {
    const { body, username } = comment
    const values = [body, username, articleNumber]
    return db.query(`
    INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3)
    RETURNING *;
    `, values).then((result) => {

        return result.rows[0]
    })
}

exports.articlePatcher = (article, voteIncrease) => {
    const votes = article[0].votes += voteIncrease;
    const articleId = article[0].article_id;
    const information = [articleId, votes]
    return db.query(`
    UPDATE articles
SET votes = $2
WHERE article_id = $1
RETURNING *;`, information).then((result) => {
        return result.rows[0]
    })
}