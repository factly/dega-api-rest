const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const MongoPaging = require('mongo-cursor-pagination');
const utils = require('../lib/utils');

const addFields = {
    $addFields: {
        media: { $arrayElemAt: [{ $objectToArray: '$media' }, 1] },
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
};

const mediaLookup = {
    $lookup: {
        from: 'media',
        let: { media: '$media' }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$media'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    name: 1,
                    type: 1,
                    url: 1,
                    fileSize: '$file_size',
                    dimensions: 1,
                    title: 1,
                    caption: 1,
                    altText: '$alt_text',
                    description: 1,
                    uploadedBy: '$uploaded_by',
                    publishedDate: '$published_date',
                    lastUpdatedDate: '$last_updated_date',
                    slug: 1,
                    clientId: '$client_id',
                    createdDate: '$created_date',
                    relativeURL: '$relative_url',
                    sourceURL: '$source_url'
                }
            },
        ],
        as: 'media'
    }
};

const roleMappingLookup = {
    $lookup: {
        from: 'role_mapping',
        let: { roleMappings: '$roleMappings' },
        pipeline: [
            { $match: { $expr: { $in: ['$_id', { $ifNull: ['$$roleMappings', []] }] } } },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    name: 1
                }
            },
        ],
        as: 'roleMappings'
    }
};

const userProject = {
    $project: {
        id: '$_id',
        _id: 0,
        class: '$_class',
        firstName: '$first_name',
        lastName: '$last_name',
        displayName: '$display_name',
        website: 1,
        facebookURL: '$facebook_url',
        twitterURL: '$twitter_url',
        instagramURL: '$instagram_url',
        linkedinURL: '$linkedin_url',
        githubURL: '$github_url',
        profilePicture: '$profile_picture',
        description: 1,
        slug: 1,
        email: 1,
        createdDate: '$created_date',
        media: 1,
        roleMappings: 1
    }
};

class UserModel extends MongoBase {
    /**
     * Creates a new UserModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'dega_user');
        this.logger = logger;
    }

    getUser(config, clientId, sortBy, sortAsc, limit, next, previous) {
        const query = {};

        if (clientId) {
            query.client_id = clientId;
        }

        const match = { $match: query };

        const aggregations = [
            addFields,
            {
                $addFields: {
                    media: '$media.v'
                }
            },
            mediaLookup,
            { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
            roleMappingLookup,
            userProject,
            match,
        ];

        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        // get database from env config
        const database = config.get('databaseConfig:databases:core');
        const pagingNew = {};
        // get all users
        return Q(MongoPaging.aggregate(this.collection(database), pagingObj))
            .then((aggResult) => {
                const results = aggResult.results;
                this.logger.info('Retrieved the results');
                let users = {};
                pagingNew.next = aggResult.next;
                pagingNew.hasNext = aggResult.hasNext;
                pagingNew.previous = aggResult.previous;
                pagingNew.hasPrevious = aggResult.hasPrevious;
                users.data = results; 
                users.paging = pagingNew;
                return users;
            });
    }
}

module.exports = UserModel;
