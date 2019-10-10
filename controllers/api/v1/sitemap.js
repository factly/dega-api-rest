const utils = require('../../../lib/utils');
const SitemapModel = require('../../../models/sitemap');

function getSitemap(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'sitemap', 'getSitemap', req.headers.client, null);
    const model = new SitemapModel(logger);
    return model.getAllSlug(
        req.app.kraken,
        req.headers.client
    ).then((result) => {
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
