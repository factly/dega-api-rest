const MongoBase = require('../lib/MongoBase');
const Q = require('q');

class SitemapModel extends MongoBase {
    /**
     * Creates a new CategoryModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'sitemap');
        this.logger = logger;
    }

    getAllSlug(config, clientId) {

        const factcheckDatabase = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
    
        const aggregations = [
            {
                $match: {
                    client_id : {
                        $in: [clientId, 'default']
                    }
                }
            },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    slug: 1,
                }
            },
        ]

        return Q.all([
            Q(this.collection(coreDatabase, 'category').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'dega_user').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'format').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'post').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'status').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'tag').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'claim').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'claimant').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'rating').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'factcheck').aggregate(aggregations).toArray()),
        ]).then( collections => {
            const collectionList = ['categories', 'users', 'formats', 'posts', 'statuses', 'tags', 'claims', 'claimants', 'ratings', 'factcheck']
            const allSlugs = {}
            collections.forEach((value, index) => {
                allSlugs[collectionList[index]] = value
            })
            return allSlugs
        })
    }
}

module.exports = SitemapModel;
