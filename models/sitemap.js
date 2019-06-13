const MongoBase = require('../lib/MongoBase');
const CategoryModel = require('./category');
const FactcheckModel = require('./factcheck');
const PostsModel = require('./post');
const TagModel = require('./tag');
const UserModel = require('./user');
const OrganizationModel = require('./organization');

const Q = require('q');

class SitemapModel extends MongoBase {
    /**
     * Creates a new SitemapModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'sitemap');
        this.logger = logger;
    }

    getSitemap(config, clientId, logger) {
        const query = {};
        if (clientId) {
            query.client_id = clientId;
        }
        // TODO: Make the entities dynamic
        let factcheckModel = new FactcheckModel(logger);
        let categoryModel = new CategoryModel(logger);
        let postModel = new PostsModel(logger);
        let tagModel = new TagModel(logger);
        let userModel = new UserModel(logger);
        let organizationModel = new OrganizationModel(logger);
        return Q.all([
            organizationModel.getOrganization(config, clientId),
            categoryModel.getCategory(config, clientId),
            factcheckModel.getFactcheck(config, clientId),
            postModel.getPosts(config, clientId),
            tagModel.getTag(config, clientId),
            userModel.getUser(config, clientId),
        ]).then(result => {
            const slugs = [];
            let siteAddress = result[0][0]['site_address'];
            slugs.push(siteAddress);
            result.shift();
            for(let entities of result) {
                for(let element of entities) {
                    if(element['_class'] && element['slug']) {
                        let entity = element['_class'].split('.').pop().toLowerCase();
                        slugs.push(siteAddress + '/' + entity + '/' + element['slug']);
                    }
                }
            }
            return slugs;
        });
    }
}

module.exports = SitemapModel;
