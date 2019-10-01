const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const ObjectId = require('mongodb').ObjectID;
const utils = require('../lib/utils');

const addFields = {
    $addFields: {
        claims: {
            $map: {
                input: {
                    $map: {
                        input: '$claims',
                        in: {
                            $arrayElemAt: [{ $objectToArray: '$$this' }, 1]
                        }
                    }
                },
                in: '$$this.v'
            }
        },
        status: { $arrayElemAt: [{ $objectToArray: '$status' }, 1] },
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

const claimsLookup = {
    $lookup: {
        from: 'claim',
        let: { claims: '$claims' },
        pipeline: [
            { $match: { $expr: { $in: ['$_id', { $ifNull: ['$$claims', []] }] } } },
            {
                $project: {
                    id: '$_id',
                    _id: 0,
                    class: '$_class',
                    claim: 1,
                    slug: 1,
                    clientId: '$client_id',
                    title: 1,
                    description: 1,
                    claimDate: '$claim_date',
                    claimSource: '$claim_source',
                    checkedDate: '$checked_date',
                    reviewSources: '$review_sources',
                    review: '$review',
                    reviewTagLine: '$review_tag_line',
                    createdDate: '$created_date',
                    lastUpdatedDate: '$last_updated_date',
                    rating: { $arrayElemAt: [{ $objectToArray: '$rating' }, 1] },
                    claimant: { $arrayElemAt: [{ $objectToArray: '$claimant' }, 1] }
                }
            },
            { $addFields: { rating: '$rating.v', claimant: '$claimant.v' } },
            {
                $lookup: {
                    from: 'rating',
                    let: { rating: '$rating' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$rating'] } } },
                        {
                            $project: {
                                id: '$_id',
                                _id: 0,
                                class: '$_class',
                                name: 1,
                                numericValue: '$numeric_value',
                                isDefault: '$is_default',
                                slug: 1,
                                clientId: '$client_id',
                                description: 1,
                                media: { $arrayElemAt: [{ $objectToArray: '$media' }, 1] },
                                createdDate: '$created_date',
                                lastUpdatedDate: '$last_updated_date'
                            }
                        },
                        { $addFields: { media: '$media.v' } },
                    ],
                    as: 'rating'
                }
            },
            { $unwind: { path: '$rating', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'claimant',
                    let: { claimant: '$claimant' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$claimant'] } } },
                        {
                            $project: {
                                id: '$_id',
                                _id: 0,
                                class: '$_class',
                                name: 1,
                                numericValue: '$numeric_value',
                                isDefault: '$is_default',
                                slug: 1,
                                clientId: '$client_id',
                                description: 1,
                                media: { $arrayElemAt: [{ $objectToArray: '$media' }, 1] },
                                createdDate: '$created_date',
                                lastUpdatedDate: '$last_updated_date'
                            }
                        },
                        { $addFields: { media: '$media.v' } },
                    ],
                    as: 'claimant'
                }
            },
            { $unwind: { path: '$claimant', preserveNullAndEmptyArrays: true } },
        ],
        as: 'claims'
    }
};

const factcheckLookup = {
    $project: {
        id: '$_id',
        _id: 0,
        class: '$_class',
        title: 1,
        clientId: '$client_id',
        content: 1,
        excerpt: 1,
        introduction: 1,
        summary: 1,
        publishedDate: '$published_date',
        featured: 1,
        sticky: 1,
        updates: 1,
        slug: 1,
        subTitle: '$sub_title',
        createdDate: '$created_date',
        lastUpdatedDate: '$last_updated_date',
        claims: 1,
        tags: 1,
        categories: 1,
        status: 1,
        format: 1,
        users: '$degaUsers',
        media: 1
    }
};


const userAddFields = {
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

const userMediaLookup = {
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

const userRoleMappingLookup = {
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

class FactcheckModel extends MongoBase {
    /**
     * Creates a new FactcheckModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'factcheck');
        this.logger = logger;
    }

    getFactcheck(config, clientId, id, slug, tagSlug, categorySlug, claimantSlug, authorSlug, sortBy, sortAsc, limit, next, previous) {

        let pagingNew = {};

        const factcheckDatabase = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
        // get query object
        return this.getQueryObject(config, clientId, id, slug, tagSlug, categorySlug, claimantSlug, authorSlug)
            .then((queryObj) => {

                const match = { $match: queryObj };

                const aggregations = [
                    addFields,
                    {
                        $addFields: { status: '$status.v' }
                    },
                    claimsLookup,
                    factcheckLookup,
                    match,
                ];

                this.logger.info(`Query Object ${JSON.stringify(queryObj)}`);

                // get paging object
                const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);

                return Q(MongoPaging.aggregate(this.collection(factcheckDatabase), pagingObj));
            })
            .then((aggResult) => {
                this.logger.info('Retrieved the factchecks');
                pagingNew.next = aggResult.next;
                pagingNew.hasNext = aggResult.hasNext;
                pagingNew.previous = aggResult.previous;
                pagingNew.hasPrevious = aggResult.hasPrevious;

                return aggResult.results;
            })
            .then( factchecks => {
                const mediaAggregation = utils.mediaPipeline;
                let mediaIds = [];
                //Collecting media ID from all factchecks
                mediaIds = factchecks.filter(factcheck => factcheck.media).map( factcheck => factcheck.media.oid );

                //If none of factchecks has media then directly return factchecks
                if(mediaIds.length === 0) return factchecks;

                const match = {
                    $match: {
                        id : { $in : mediaIds }
                    }
                };

                mediaAggregation.push(match);

                //Retrieving all media in mediaIds
                return Q(this.collection(coreDatabase, 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        //Traveling through all the factchecks and replacing DBref media with full media object
                        return factchecks.map( factcheck => factcheck.media ? { ...factcheck, media: mediaObject[factcheck.media.oid]} : factcheck );
                    });
            })
            .then( factchecks => {
                //following same logic as media
                const statusAggregation = utils.statusPipeline;

                let statusIds = factchecks.filter(factcheck => factcheck.status).map( factcheck => factcheck.status.oid );

                const match = {
                    $match: {
                        id : { $in : statusIds }
                    }
                };

                statusAggregation.push(match);

                return Q(this.collection(coreDatabase, 'status')
                    .aggregate(statusAggregation).toArray())
                    .then((statuses) => {
                        const statusesObject = statuses.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        return factchecks.map( factcheck => factcheck.status ? { ...factcheck, status: statusesObject[factcheck.status.oid]} : factcheck );
                    });
            })
            .then ( factchecks => {
                
                let ratingMediaIds = [];
                for(let factcheck of factchecks){
                    if(factcheck.claims){
                        for(let claim of factcheck.claims){
                            ratingMediaIds = ratingMediaIds.concat(claim.rating.media);
                        }
                    }
                }

                if(ratingMediaIds.length === 0) return factchecks;


                const mediaRatingAggregation = [
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            class:'$_class',
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
                    {                    
                        $match: {
                            id : { $in : ratingMediaIds }
                        }
                    },
                ];

                //Retrieving all media in mediaIds
                return Q(this.collection(coreDatabase, 'media')
                    .aggregate(mediaRatingAggregation).toArray())
                    .then((media) => {
                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const ratingMediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        //Traveling through all the factchecks and replacing DBref media with full media object                        
                        return factchecks.map(factcheck => factcheck.claims && factcheck.claims.length > 0 ? { ...factcheck, claims: factcheck.claims.map(claim => claim.rating ? { ...claim, rating: {...claim.rating, media: ratingMediaObject[claim.rating.media]}} : claim) } : factcheck );
                    });
            })
            .then ( factchecks => {
                
                let claimntsMediaIds = [];
                for(let factcheck of factchecks){
                    if(factcheck.claims){
                        for(let claim of factcheck.claims){
                            claimntsMediaIds = claimntsMediaIds.concat(claim.claimant.media);
                        }
                    }
                }

                if(claimntsMediaIds.length === 0) return factchecks;


                const mediaClaimantAggregation = [
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            class:'$_class',
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
                    {                    
                        $match: {
                            id : { $in : claimntsMediaIds }
                        }
                    },
                ];

                //Retrieving all media in mediaIds
                return Q(this.collection(coreDatabase, 'media')
                    .aggregate(mediaClaimantAggregation).toArray())
                    .then((media) => {
                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const claimantMediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        //Traveling through all the factchecks and replacing DBref media with full media object
                        return factchecks.map(factcheck => factcheck.claims && factcheck.claims.length > 0 ? { ...factcheck, claims: factcheck.claims.map(claim => claim.claimant ? { ...claim, claimant: {...claim.claimant, media: claimantMediaObject[claim.claimant.media]}} : claim) } : factcheck );
                    });
            })
            .then( factchecks => {

                let categoryIds = [];

                //Collecting all category ID from all the factchecks into 1-D array
                for(let factcheck of factchecks){
                    if(factcheck.categories && factcheck.categories.length > 0)
                        categoryIds = categoryIds.concat(factcheck.categories);
                }

                //If none of factchecks has category then directly return factchecks
                if(categoryIds.length === 0) return factchecks;

                const match = {
                    $match: {
                        id : { $in : categoryIds }
                    }
                };

                const aggregations = [
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            class: '$_class',
                            name: 1,
                            description: 1,
                            slug: 1,
                            parent: 1,
                            clientId: '$client_id',
                            createdDate: '$created_date',
                            lastUpdatedDate: '$last_updated_date'
                        }
                    },
                    match,
                ];

                return Q(this.collection(coreDatabase, 'category')
                    .aggregate(aggregations).toArray())
                    .then( categories => {
                        //if nothing return from query then return factchecks
                        //case:- when all IDs in categoryIds are not available
                        if(categories.length < 1) return factchecks;

                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const categoriesObject = categories.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        //Traveling through all the factchecks categories array and replacing DBref category with full category object
                        return factchecks.map( factcheck => factcheck.categories && factcheck.categories.length > 0 ?  { ...factcheck, categories: factcheck.categories.map(category => categoriesObject[category] ? categoriesObject[category] : undefined ) } : factcheck );
                    });
            })
            .then( factchecks => {

                let tagIds = [];

                for(let factcheck of factchecks){
                    if(factcheck.tags && factcheck.tags.length > 0)
                        tagIds = tagIds.concat(factcheck.tags);
                }

                if(tagIds.length === 0) return factchecks;

                const match = {
                    $match: {
                        id : { $in : tagIds }
                    }
                };

                const aggregations = [
                    {
                        $project: {
                            id: '$_id',
                            _id: 0,
                            class: '$_class',
                            name: 1,
                            slug: 1,
                            description: 1,
                            clientId: '$client_id',
                            createdDate: '$created_date',
                            lastUpdatedDate: '$last_updated_date'
                        }
                    },
                    match,
                ];

                return Q(this.collection(coreDatabase, 'tag')
                    .aggregate(aggregations).toArray())
                    .then( tags => {
                        if(tags.length < 1) return factchecks;

                        const tagsObject = tags.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        return factchecks.map( factcheck => factcheck.tags && factcheck.tags.length > 0 ?  { ...factcheck, tags: factcheck.tags.map(tag => tagsObject[tag] ? tagsObject[tag] : undefined ) } : factcheck );
                    });
            })
            .then( factchecks => {

                let userIds = [];

                for(let factcheck of factchecks){
                    if(factcheck.users && factcheck.users.length > 0)
                        userIds = userIds.concat(factcheck.users);
                }

                if(userIds.length === 0) return factchecks;

                const match = {
                    $match: {
                        id : { $in : userIds }
                    }
                };

                const aggregations = [
                    userAddFields,
                    {
                        $addFields: {
                            media: '$media.v'
                        }
                    },
                    userMediaLookup,
                    { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
                    userRoleMappingLookup,
                    userProject,
                    match,
                ];

                return Q(this.collection(coreDatabase, 'dega_user')
                    .aggregate(aggregations).toArray())
                    .then( users => {
                        if(users.length < 0) return factchecks;

                        const usersObject = users.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});

                        return factchecks.map( factcheck => factcheck.users && factcheck.users.length > 0 ?  { ...factcheck, users: factcheck.users.map(user => usersObject[user] ? usersObject[user] : undefined ) } : factcheck );
                    });
            })
            .then( factchecks => {
                return {
                    data : factchecks,
                    paging: pagingNew
                };
            });
    }

    getQueryObject(config, clientId, id, slug, tagSlug, categorySlug, claimantSlug, authorSlug) {
        const coreDatabase = config.get('databaseConfig:databases:core');
        const query = {};

        return Q(this.collection(coreDatabase, 'status')
            .aggregate([
                {
                    $match: {
                        name: 'Publish'
                    }
                },
                {
                    $project: {
                        _id: 1
                    }
                },
            ]).toArray())
            .then(status => {
                query.status = new ObjectId(status[0]._id);
                return query;
            })
            .then( query => {
                if (clientId) {
                    query.clientId = clientId;
                }
                return query;
            })
            .then( query => {
                if (id) {
                    if(Array.isArray(id)){
                        query.id = { $in: [] };
                        for (let element of id) {
                            query.id.$in.push(new ObjectId(element));
                        }
                    }
                    else{
                        query.id = new ObjectId(id);
                    }
                }
                return query;
            })
            .then( query => {
                if (slug)
                    query.slug = Array.isArray(slug) ? { $in : slug } : slug;

                return query;
            })
            .then( query => {
                if (categorySlug) {
                    return Q(this.collection(coreDatabase, 'category')
                        .aggregate([
                            {
                                $match: {
                                    slug: Array.isArray(categorySlug) ? { $in : categorySlug } : categorySlug
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                        ]).toArray())
                        .then(categories => {
                            let categoryIds = [];
                            categoryIds = categories.map(category => new ObjectId(category._id));

                            query.categories = { $in : categoryIds };

                            return query;
                        });
                }

                return query;
            })
            .then( query => {
                if (tagSlug) {
                    return Q(this.collection(coreDatabase, 'tag')
                        .aggregate([
                            {
                                $match: {
                                    slug: Array.isArray(tagSlug) ? { $in : tagSlug } : tagSlug
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                        ]).toArray())
                        .then(tags => {
                            let tagIds = [];
                            tagIds = tags.map(tag => new ObjectId(tag._id));

                            query.tags = { $in : tagIds };

                            return query;
                        });
                }

                return query;
            })
            .then( query => {
                if (authorSlug) {
                    return Q(this.collection(coreDatabase, 'dega_user')
                        .aggregate([
                            {
                                $match: {
                                    slug: Array.isArray(authorSlug) ? { $in : authorSlug } : authorSlug
                                }
                            },
                            {
                                $project: {
                                    _id: 1
                                }
                            },
                        ]).toArray())
                        .then(users => {
                            let userIds = [];
                            userIds = users.map(user => new ObjectId(user._id));

                            query.users = { $in : userIds };

                            return query;
                        });
                }

                return query;
            })
            .then( query => {
                return query;
            });
    }
}

module.exports = FactcheckModel;
