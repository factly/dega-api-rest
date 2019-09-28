const CategoryModel = require('../../../models/category');
const utils = require('../../../lib/utils');

function getCategory(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'categories', 'getCategory', req.query.client, null);
    const model = new CategoryModel(logger);
    return model.getCategory(
        req.app.kraken,
        req.query.client,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function getCategoryBySlug(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'categories', 'getCategoryBySlug', req.query.client, null);
    const model = new CategoryModel(logger);
    return model.getCategoryByParam(
        req.app.kraken,
        req.query.client,
        req.params.slug,
        'slug'
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

function getCategoryById(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'categories', 'getCategoryById', req.query.client, null);
    const model = new CategoryModel(logger);
    return model.getCategoryByParam(
        req.app.kraken,
        req.query.client,
        req.params.id,
        'id'
    ).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getCategory);
    router.get('/:id', getCategoryById);
    router.get('/slug/:slug', getCategoryBySlug);
};
