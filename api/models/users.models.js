const db = require('../../db/connection')

exports.checkUsername = (username) => {
    //console.log(username);


    return db.query(`SELECT * FROM users WHERE username = $1;`, [username]).then((result) => {
        if (!result.rows.length) {

            return Promise.reject({
                status: 404,
                msg: `Username not found`
            })
        }
        return result.rows;
    })
}