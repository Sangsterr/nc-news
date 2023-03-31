const { fetchUsers } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    fetchUsers().then((result) => {
        res.status(200).send({ users: result });
    }).catch((err) => {
        next(err)
    })
}