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
                    createdDate: '$created_date',
                    lastUpdatedDate: '$last_updated_date'
                }
            },
        ];

        const userAggregations = [
            {
                $addFields: {
                    roleMappings: {
                        $map: {
                            input: {
                                $map: {
                                    input: '$roleMappings',
                                    in: {
                                        $arrayElemAt: [{ $objectToArray: '$$this' }, 1]
                                    }
                                }
                            },
                            in: '$$this.v'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'role_mapping',
                    let: { roleMappings: '$roleMappings' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$_id', { $ifNull: ['$$roleMappings', []] }] } } },
                        {
                            $project: {
                                organization: { $arrayElemAt: [{ $objectToArray: '$organization' }, 1] }
                            }
                        },
                        { $addFields: { organization: '$organization.v' } },
                        {
                            $lookup: {
                                from: 'organization',
                                let: { organization: '$organization' },
                                pipeline: [
                                    { $match: { $expr: { $eq: ['$_id', '$$organization'] } } },
                                    {
                                        $project: {
                                            slug: 1
                                        }
                                    },
                                ],
                                as: 'organization'
                            }
                        },
                        { $unwind: { path: '$organization', preserveNullAndEmptyArrays: true } },
                    ],
                    as: 'roleMappings'
                }
            },
            {
                $match: {
                    'roleMappings.organization.slug' : clientId
                }
            },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    slug: 1,
                    createdDate: '$created_date',
                }
            },
        ];

        return Q.all([
            Q(this.collection(coreDatabase, 'category').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'dega_user').aggregate(userAggregations).toArray()),
            Q(this.collection(coreDatabase, 'format').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'post').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'status').aggregate(aggregations).toArray()),
            Q(this.collection(coreDatabase, 'tag').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'claim').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'claimant').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'rating').aggregate(aggregations).toArray()),
            Q(this.collection(factcheckDatabase, 'factcheck').aggregate(aggregations).toArray()),
        ]).then( collections => {
            const collectionList = ['categories', 'users', 'formats', 'posts', 'statuses', 'tags', 'claims', 'claimants', 'ratings', 'factchecks'];
            const allSlugs = {};
            collections.forEach((value, index) => {
                allSlugs[collectionList[index]] = value;
            });
            return { data: allSlugs };
        });
    }
}

module.exports = SitemapModel;
