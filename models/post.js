const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const utils = require('../lib/utils');

const addFields = {
    $addFields: {
        status: { $arrayElemAt: [{ $objectToArray: '$status' }, 1] },
        format: { $arrayElemAt: [{ $objectToArray: '$format' }, 1] },
        media: { $arrayElemAt: [{ $objectToArray: '$media' }, 1] },
        tags: {
            $map: {
                input: {
                    $map: {
                        input: '$tags',
                        in: {
                            $arrayElemAt: [{ $objectToArray: '$$this' }, 1]
                        }
                    }
                },
                in: '$$this.v'
            }
        },
        categories: {
            $map: {
                input: {
                    $map: {
                        input: '$categories',
                        in: {
                            $arrayElemAt: [{ $objectToArray: '$$this' }, 1]
                        }
                    }
                },
                in: '$$this.v'
            }
        },
        degaUsers: {
            $map: {
                input: {
                    $map: {
                        input: '$degaUsers',
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

const statusLookup = {
    $lookup: {
        from: 'status',
        let: { status: '$status'},
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$status'] } } },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class:'$_class',
                    name: 1,
                    slug: 1,
                    clientId: "$client_id",
                    isDefault: "$is_default",
                    createdDate: "$created_date",
                    lastUpdatedDate: "$last_updated_date"
                }
            },
        ],
        as: 'status'
    }
};

const formatLookup = {
    $lookup: {
        from: 'format',
        let: { format: '$format'},
        pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$format"] } } },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class:'$_class',
                    name: 1,
                    slug: 1,
                    clientId: "$client_id",
                    isDefault: "$is_default",
                    createdDate: "$created_date",
                    lastUpdatedDate: "$last_updated_date"
                }
            },
        ],
        as: 'format'
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

const tagAggregation = utils.tagPipeline;
//build match object using tag GUID and attach  it to pipeline
const tagMatch = {
    $match: { $expr: { $in: ['$_id', { $ifNull: ['$$tags', []] }] } }
};
tagAggregation.push(tagMatch);
const tagLookup = {
    $lookup: {
        from: 'tag',
        let: { tags: '$tags' },
        pipeline: tagAggregation,
        as: 'tags'
    }
};

const categoryAggregation = utils.categoryPipeline;
// build match object using category GUID and attach it to pipeline
const categoryMatch = {
    $match: {
        $expr: { $in: ['$_id', { $ifNull: ['$$categories', []] }] }
    }
};
categoryAggregation.push(categoryMatch);
const categoryLookup = {
    $lookup: {
        from: 'category',
        let: { categories: '$categories' },
        pipeline: categoryAggregation,
        as: 'categories'
    }
};

const degaUserLookup = {
    $lookup: {
        from: 'dega_user',
        let: { degaUsers: '$degaUsers' },
        pipeline: [
            {
                $match: { $expr: { $in: ['$_id', { $ifNull: ['$$degaUsers', []] }] } }
            },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    firstName: '$first_name',
                    lastName: '$last_name',
                    displayName: '$display_Name',
                    website: 1,
                    facebookURL: { $ifNull: ['$facebookURL', null] }, // These fields don't exist on the record's, let's make sure they are projected into the result even so. This can be replaced with the proper values when they are available
                    twitterURL: { $ifNull: ['$twitterURL', null] },
                    instagramURL: { $ifNull: ['$instagramURL', null] },
                    linkedinURL: { $ifNull: ['$linkedinURL', null] },
                    githubURL: { $ifNull: ['$githubURL', null] },
                    profilePicture: { $ifNull: ['$profile_picture', null] },
                    description: 1,
                    slug: 1,
                    enabled: 1,
                    emailVerified: '$email_verified',
                    email: 1,
                    createdDate: '$created_date',
                    media: { $arrayElemAt: [{ $objectToArray: '$media' }, 1] }
                }
            },
            { $addFields: { media: '$media.v' } },
            {
                $lookup: {
                    from: 'media',
                    let: { media: '$media' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$media'] } } },
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
            },
            { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
        ],
        as: 'users'
    }
};

const postsProject = {
    $project: {
        id: "$_id",
        _id : 0,
        class: "$_class",
        title: 1,
        clientId: '$client_id',
        content: 1,
        excerpt: 1,
        publishedDate: '$published_date',
        lastUpdatedDate: '$last_updated_date',
        featured: 1,
        sticky: 1,
        updates: 1,
        slug: 1,
        subTitle: '$sub_title',
        createdDate: '$created_date',
        tags: 1,
        categories: 1,
        status: 1,
        format: 1,
        users: 1,
        media: 1
    }
};

class PostsModel extends MongoBase {
    /**
     * Creates a new PostsModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'post');
        this.logger = logger;
    }

    // MANDATORY sub documents: status, format and degaUsers
    // OPTIONAL: All other sub docs are optional
    getPosts(config, clientId, id, slug, categorySlug, tagSlug, authorSlug, sortBy, sortAsc, limit, next, previous) {
        // get query object
        const queryObj = this.getQueryObject(clientId, slug, categorySlug, tagSlug, authorSlug, id);
        const match = { $match: queryObj };

        const aggregations = [
            addFields,
            {
                $addFields: { status: '$status.v', format: '$format.v', media: '$media.v' }
            },
            statusLookup,
            { $unwind: '$status' },
            formatLookup,
            { $unwind: '$format' },
            // Another type of lookup where we provide it it's own aggregate pipline to mutate and filter the returned results
            mediaLookup,
            // Media is nullable, let's not filter out records that don't have the media option
            { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
            tagLookup,
            categoryLookup,
            degaUserLookup,
            postsProject,
            match,
        ];

        this.logger.info(`Query Object ${JSON.stringify(queryObj)}`);

        // get paging object
        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        const database = config.get('databaseConfig:databases:core');
        const pagingNew = {};
        // return Q(MongoPaging.find(this.collection(config.get('databaseConfig:databases:core')), pagingObj))
        return Q(MongoPaging.aggregate(this.collection(database), pagingObj))
            .then((aggResult) => {
                const results = aggResult.results;
                this.logger.info('Retrieved the posts');
                const posts = {};
                pagingNew.next = aggResult.next;
                pagingNew.hasNext = aggResult.hasNext;
                pagingNew.previous = aggResult.previous;
                pagingNew.hasPrevious = aggResult.hasPrevious;
                posts.data = results;
                posts.paging = pagingNew;
                return posts;
            });
    }
    getQueryObject(clientId, slug, categorySlug, tagSlug, authorSlug, id) {
        // always filter publish only posts
        const queryObj = {
            'status.name': 'Publish'
        };

        if (clientId) {
            queryObj.clientId = clientId;
        }

        if (authorSlug) {
            let authorSlugQuery = Array.isArray(authorSlug) ? { $in : authorSlug } : authorSlug
        
            queryObj.degaUsers = {
                $elemMatch: {slug: authorSlugQuery}
            };
            console.log(queryObj)
        }

        if (categorySlug) {
            let categorySlugQuery = Array.isArray(categorySlug) ? { $in : categorySlug } : categorySlug
        
            queryObj.categories = {
                $elemMatch: {slug: categorySlugQuery}
            };
        }

        if (tagSlug) {
            let tagSlugQuery = Array.isArray(tagSlug) ? { $in : tagSlug } : tagSlug
        
            queryObj.categories = {
                $elemMatch: {slug: tagSlugQuery}
            };
        }

        if (slug) {
            queryObj.slug = slug;
        }

        if (id) {
            if (Array.isArray(id)) {
                queryObj._id = { $in: [] };
                for (let element of id) {
                    queryObj._id.$in.push(new ObjectId(element));
                }
            }
            else {
                queryObj._id = new ObjectId(id);
            }
        }
        return queryObj;
    }
}

module.exports = PostsModel;
