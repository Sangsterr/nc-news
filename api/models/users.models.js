const db = require('../../db/connection')

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users;`).then((result) => {
        if (!result.rows.length) {

            return Promise.reject({
                status: 404,
                msg: `Username not found`
            })
        }
        return result.rows;
    })
}