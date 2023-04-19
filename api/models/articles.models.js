const db = require('../../db/connection')

exports.fetchSpecificArticle = (id) => {

    const articleId = id;
    return db.query(`SELECT articles.*, CAST(COALESCE(COUNT(comments.article_id), 0) AS INT) AS 
    comment_count FROM
    articles 
    LEFT JOIN comments on articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [articleId]).then((result) => {
        if (!result.rows.length) {

            return Promise.reject({
                status: 404,
                msg: `No article found for article ${id}`
            })
        }
        return result.rows;
    })
}

exports.fetchArticles = (sortBy = "created_at", order = "desc", topic) => {

    if (
        sortBy &&
        sortBy !== "article_id" &&
        sortBy !== "title" &&
        sortBy !== "topic" &&
        sortBy !== "author" &&
        sortBy !== "body" &&
        sortBy !== "created_at" &&
        sortBy !== "votes" &&
        sortBy !== "comment_count"
    ) {
        return Promise.reject({ status: 400, msg: "Invalid sort query" });
    }
    if (order &&
        order !== 'desc' &&
        order !== 'DESC' &&
        order !== 'asc' &&
        order !== 'ASC'
    ) {
        return Promise.reject({ status: 400, msg: "Invalid order query" });
    }

    let fetchArticlesQueryString =
        `SELECT articles.*, CAST(COALESCE(COUNT(comments.article_id), 0) AS INT) AS 
    comment_count FROM
    articles 
    LEFT JOIN comments on articles.article_id = comments.article_id`

    if (topic) {
        fetchArticlesQueryString += ` WHERE topic = '${topic}'`
    }

    fetchArticlesQueryString += ` GROUP BY articles.article_id`;



    fetchArticlesQueryString += ` ORDER BY ${sortBy} ${order};`;

    return db
        .query(fetchArticlesQueryString
        )
        .then((result) => {
            if (result.rows.length === 0) return "No articles for requested topic"
            return result.rows
        });
}

exports.fetchComments = (commentId) => {
    return db.query(`
SELECT * FROM comments WHERE comment_id = $1; `, [commentId]).then((result) => {
        if (!result.rows.length) {
            return Promise.reject({
                status: 400,
                msg: `This comment does not exist`
            })
        }
        return result.rows
    })
}

exports.fetchArticleComments = (article_id) => {

    const articleeId = article_id
    return db
        .query(
            `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC; `,
            [articleeId]
        )
        .then((result) => {
            return result.rows;
        });
};

exports.addArticleComment = (comment, articleNumber) => {
    const { body, username } = comment
    const values = [body, username, articleNumber]
    return db.query(`
    INSERT INTO comments(body, author, article_id)
VALUES($1, $2, $3)
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
RETURNING *; `, information).then((result) => {
        return result.rows[0]
    })
}

exports.removeComment = (commentId) => {

    return db.query(`
    DELETE FROM comments WHERE comment_id = $1; `, [commentId]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({
                status: 400,
                msg: `This comment does not exist`
            })
        }
        return result.rows
    })
}