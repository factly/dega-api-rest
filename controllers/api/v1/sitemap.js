const utils = require('../../../lib/utils');
const CategoryModel = require('../../../models/category');
const FactcheckModel = require('../../../models/factcheck');
const PostsModel = require('../../../models/post');
const TagModel = require('../../../models/tag');
const UserModel = require('../../../models/user');
const OrganizationModel = require('../../../models/organization');

const Q = require('q');
function getSitemap(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'sitemap', 'getSitemap', req.headers.client, null);
    const clientId = req.headers.client;
    // TODO: Make the entities dynamic
    const factcheckModel = new FactcheckModel(logger);
    const categoryModel = new CategoryModel(logger);
    const postModel = new PostsModel(logger);
    const tagModel = new TagModel(logger);
    const userModel = new UserModel(logger);
    const organizationModel = new OrganizationModel(logger);
    return Q.all([
        organizationModel.getOrganization(req.app.kraken, clientId),
        categoryModel.getCategory(req.app.kraken, clientId),
        factcheckModel.getFactcheck(req.app.kraken, clientId),
        postModel.getPosts(req.app.kraken, clientId),
        tagModel.getTag(req.app.kraken, clientId),
        userModel.getUser(req.app.kraken, clientId),
    ]).then(result => {
        const slugs = [];
        const siteAddress = result[0][0]['site_address'];
        slugs.push(siteAddress);
        result.shift();
        for(const entities of result) {
            for(const element of entities) {
                if(element['_class'] && element['slug']) {
                    const entity = element['_class'].split('.').pop().toLowerCase();
                    slugs.push(siteAddress + '/' + entity + '/' + element['slug']);
                }
            }
        }
        if (slugs) {
            res.status(200).json(slugs);
            return;
        }
        res.sendStatus(404);
    }).catch(next);
}
module.exports = function routes(router) {
    router.get('/', getSitemap);
};
