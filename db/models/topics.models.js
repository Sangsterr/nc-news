const db = require('../connection')

exports.fetchTopics = () => {

    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}