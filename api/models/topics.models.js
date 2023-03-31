const db = require('../../db/connection')

exports.fetchTopics = () => {

    return db.query(`SELECT * FROM topics`).then((result) => {
        return result.rows;
    })
}

exports.checkTopics = (topic) => {
    const articleTopic = topic;
    return db.query(`SELECT * FROM topics WHERE slug = $1;`, [articleTopic]).then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({
                status: 404,
                msg: `No such topic exists`
            })
        }

        return result;
    })
}