const { fetchTopics } = require('../models/topics.models')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((result) => {
        res.status(200).send(result);
    })
        .catch(next)
}
