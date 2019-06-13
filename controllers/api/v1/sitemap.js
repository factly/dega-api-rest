const SitemapModel = require('../../../models/sitemap');
const utils = require('../../../lib/utils');

function getSitemap(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'sitemap', 'getSitemap', req.query.client, null);
    const model = new SitemapModel(logger);
    const clientId = req.query.client;
    return model.getSitemap(req.app.kraken, clientId, logger).then((result) => {
        if (result) {
            res.status(200).json(result);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}

module.exports = function routes(router) {
    router.get('/', getSitemap);
};
