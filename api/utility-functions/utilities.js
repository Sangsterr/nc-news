const db = require('../../db/connection')

exports.commentCount = (articleId) => {
    //console.log(articleId);
    return db.query(`SELECT COUNT(*) FROM comments WHERE article_id = $1;`, [articleId]).then((count) => { return count.rows[0].count })
}

