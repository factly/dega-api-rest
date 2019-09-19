const MongoPaging = require('mongo-cursor-pagination');
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectID;
const utils = require('../lib/utils');

const addFields = {
    $addFields: {
        claims: {
            $map: {
                input: {
                    $map: {
                        input: "$claims",
                        in: {
                        $arrayElemAt: [{ $objectToArray: "$$this" }, 1]
                        }
                    }
                },
                in: "$$this.v"
            }
        }
    }
};

const claimsLookup = {
    $lookup: {
        from: "claim",
        let: { claims: "$claims" },
        pipeline: [
            { $match: { $expr: { $in: ["$_id", { $ifNull: ["$$claims", []] }] } } },
            {
                $project: {
                    _id: 1,
                    _class:1,
                    claim: 1,
                    slug: 1,
                    clientId: "$client_id",
                    title: 1,
                    description: 1,
                    claimDate: "$claim_date",
                    claimSource: "$claim_source",
                    checkedDate: "$checked_date",
                    reviewSources: "$review_sources",
                    review: "$review",
                    reviewTagLine: "$review_tag_line",
                    createdDate: "$created_date",
                    lastUpdatedDate: "$last_updated_date",
                    rating: { $arrayElemAt: [{ $objectToArray: "$rating" }, 1] },
                    claimant: { $arrayElemAt: [{ $objectToArray: "$claimant" }, 1] }
                }
            },
            { $addFields: { rating: "$rating.v", claimant: "$claimant.v" } },
            {
                $lookup: {
                    from: "rating",
                    let: { rating: "$rating" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$rating"] } } },
                        {
                            $project: {
                                _id: 1,
                                _class:1,
                                name: 1,
                                numericValue: "$numeric_value",
                                isDefault: "$is_default",
                                slug: 1,
                                clientId: "$client_id",
                                description: 1,
                                media: 1,
                                createdDate: "$created_date",
                                lastUpdatedDate: "$last_updated_date"
                            }
                        }
                    ],
                    as: "rating"
                },
                $lookup: {
                    from: "claimant",
                    let: { claimant: "$claimant" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$claimant"] } } },
                        {
                            $project: {
                                _id: 1,
                                _class:1,
                                name: 1,
                                numericValue: "$numeric_value",
                                isDefault: "$is_default",
                                slug: 1,
                                clientId: "$client_id",
                                description: 1,
                                media: 1,
                                createdDate: "$created_date",
                                lastUpdatedDate: "$last_updated_date"
                            }
                        }
                    ],
                    as: "claimant"
                }
            },
            { $unwind: { path: "$claimant", preserveNullAndEmptyArrays: true } }
        ],
        as: "claims"
    }
};

const factcheckLookup = {
    $project: {
        _id: 1,
        _class:1,
        title: 1,
        clientId: "$client_id",
        content: 1,
        excerpt: 1,
        introduction: 1,
        summary: 1,
        publishedDate: "$published_date",
        featured: 1,
        sticky: 1,
        updates: 1,
        slug: 1,
        subTitle: "$sub_title",
        createdDate: "$created_date",
        lastUpdatedDate: "$last_updated_date",
        claims: 1,
        tags: 1,
        categories: 1,
        status: 1,
        format: 1,
        users: "$degaUsers",
        media: 1
    }
}


const userAddFields = {
    $addFields: {
      media: { $arrayElemAt: [{ $objectToArray: "$media" }, 1] },
      roleMappings: {
        $map: {
          input: {
            $map: {
              input: "$roleMappings",
              in: {
                $arrayElemAt: [{ $objectToArray: "$$this" }, 1]
              }
            }
          },
          in: "$$this.v"
        }
      }
    }
}

const userMediaLookup = {
    $lookup: {
        from: "media",
        let: { media: "$media" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
          {
            $project: {
                id: "$_id",
                _id: 0,
                class: "$_class",
                name: 1,
                type: 1,
                url: 1,
                fileSize: "$file_size",
                dimensions: 1,
                title: 1,
                caption: 1,
                altText: "$alt_text",
                description: 1,
                uploadedBy: "$uploaded_by",
                publishedDate: "$published_date",
                lastUpdatedDate: "$last_updated_date",
                slug: 1,
                clientId: "$client_id",
                createdDate: "$created_date",
                relativeURL: "$relative_url",
                sourceURL: "$source_url"
            }
          }
        ],
        as: "media"
    }
}

const userRoleMappingLookup = {
    $lookup: {
      from: "role_mapping",
      let: { roleMappings: "$roleMappings" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", { $ifNull: ["$$roleMappings", []] }] } } },
        {
          $project: {
            id: "$_id",
            _id: 0,
            class: "$_class",
            name: 1
          }
        }
      ],
      as: "roleMappings"
    }
}

const userProject = {
    $project: {
        id: "$_id",
        _id: 0,
        class: "$_class",
        firstName: "$first_name",
        lastName: "$last_name",
        displayName: "$display_name",
        website: 1,
        facebookURL: "$facebook_url",
        twitterURL: "$twitter_url",
        instagramURL: "$instagram_url",
        linkedinURL: "$linkedin_url",
        githubURL: "$github_url",
        profilePicture: "$profile_picture",
        description: 1,
        slug: 1,
        email: 1,
        createdDate: "$created_date",
        media: 1,
        roleMappings: 1
    }
}

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

    getFactcheck(config, clientId, id, slug, tagSlug, categorySlug, claimantSlug, authorSlug, statusSlug, sortBy, sortAsc, limit, next, previous) {

        // get query object
        const queryObj = this.getQueryObject(clientId, slug, id);
        const factcheckDatabase = config.get('databaseConfig:databases:factcheck');
        const coreDatabase = config.get('databaseConfig:databases:core');
        
        const match = { $match: queryObj };

        const aggregations = [
            addFields,
            claimsLookup,
            factcheckLookup,
            match
        ];

        this.logger.info(`Query Object ${JSON.stringify(queryObj)}`);

        // get paging object
        const pagingObj = utils.getPagingObject(aggregations, sortBy, sortAsc, limit, next, previous, true);
        
        let pagingNew = {};
        return Q(MongoPaging.aggregate(this.collection(factcheckDatabase), pagingObj))
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
                let mediaIds = []
                //Collecting media ID from all factchecks
                mediaIds = factchecks.filter(factcheck => factcheck.media).map( factcheck => factcheck.media.oid )
                
                //If none of factchecks has media then directly return factchecks
                if(mediaIds.length === 0) return factchecks

                const match = {
                    $match: {
                        id : { $in : mediaIds }
                    }
                };
                
                mediaAggregation.push(match);
                
                //Retrieving all media in mediaIds
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
                        
                        //Traveling through all the factchecks and replacing DBref media with full media object  
                        return factchecks.map( factcheck => factcheck.media ? { ...factcheck, media: mediaObject[factcheck.media.oid]} : factcheck )
                    });
            })
            .then( factchecks => {
                //following same logic as media
                const statusAggregation = utils.statusPipeline;

                let statusIds = factchecks.filter(factcheck => factcheck.status).map( factcheck => factcheck.status.oid )
                
                const match = {
                    $match: {
                        id : { $in : statusIds }
                    }
                };
                
                statusAggregation.push(match);
                
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'status')
                    .aggregate(statusAggregation).toArray())
                    .then((statuses) => {
                        const statusesObject = statuses.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
                        
                        return factchecks.map( factcheck => factcheck.status ? { ...factcheck, status: statusesObject[factcheck.status.oid]} : factcheck )
                    });
            })
            .then( factchecks => {

                let categoryIds = []
                
                //Collecting all category ID from all the factchecks into 1-D array
                for(let factcheck of factchecks){
                    if(factcheck.categories && factcheck.categories.length > 0)
                        categoryIds = categoryIds.concat(factcheck.categories.map(category => category.oid))
                }

                //If none of factchecks has category then directly return factchecks 
                if(categoryIds.length === 0) return factchecks

                const match = {
                    $match: {
                        id : { $in : categoryIds }
                    }
                };
                
                const aggregations = [
                    {
                        $project: {
                            id: "$_id",
                            _id: 0,
                            class: "$_class",
                            name: 1,
                            description: 1,
                            slug: 1,
                            parent: 1,
                            clientId: '$client_id',
                            createdDate: '$created_date',
                            lastUpdatedDate: '$last_updated_date'
                        }
                    },
                    match
                ];

                return Q(this.collection(config.get('databaseConfig:databases:core'), 'category')
                    .aggregate(aggregations).toArray())
                    .then( categories => {
                        //if nothing return from query then return factchecks
                        //case:- when all IDs in categoryIds are not available
                        if(categories.length < 1) return factchecks

                        //Converting "Array of Object" into "Object of Object" where sub object key is sub object mongodb ObjectId which is used in DRref 
                        const categoriesObject = categories.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
                        
                        //Traveling through all the factchecks categories array and replacing DBref category with full category object  
                        return factchecks.map( factcheck => factcheck.categories && factcheck.categories.length > 0 ?  { ...factcheck, categories: factcheck.categories.map(category => categoriesObject[category.oid] ? categoriesObject[category.oid] : undefined ) } : factcheck )
                    });
            })
            .then( factchecks => {

                let tagIds = []
                
                for(let factcheck of factchecks){
                    if(factcheck.tags && factcheck.tags.length > 0)
                        tagIds = tagIds.concat(factcheck.tags.map(tag => tag.oid))
                }

                if(tagIds.length === 0) return factchecks

                const match = {
                    $match: {
                        id : { $in : tagIds }
                    }
                };
                
                const aggregations = [
                    {
                        $project: {
                            id: "$_id",
                            _id: 0,
                            class: "$_class",
                            name: 1,
                            slug: 1,
                            description: 1,
                            clientId: '$client_id',
                            createdDate: '$created_date',
                            lastUpdatedDate: '$last_updated_date'
                        }
                    },
                    match
                ];

                return Q(this.collection(config.get('databaseConfig:databases:core'), 'tag')
                    .aggregate(aggregations).toArray())
                    .then( tags => {
                        if(tags.length < 1) return factchecks

                        const tagsObject = tags.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
                        
                        return factchecks.map( factcheck => factcheck.tags && factcheck.tags.length > 0 ?  { ...factcheck, tags: factcheck.tags.map(tag => tagsObject[tag.oid]) } : factcheck )
                    });
            })
            .then( factchecks => {

                let userIds = []
                
                for(let factcheck of factchecks){
                    if(factcheck.users && factcheck.users.length > 0)
                        userIds = userIds.concat(factcheck.users.map(tag => tag.oid))
                }

                if(userIds.length === 0) return factchecks

                const match = {
                    $match: {
                        id : { $in : userIds }
                    }
                };
                
                const aggregations = [
                    userAddFields,
                    {
                        $addFields: {
                            media: "$media.v"
                        }
                    },
                    userMediaLookup,
                    { $unwind: { path: "$media", preserveNullAndEmptyArrays: true } },
                    userRoleMappingLookup,
                    userProject,
                    match
                ];

                return Q(this.collection(config.get('databaseConfig:databases:core'), 'dega_user')
                    .aggregate(aggregations).toArray())
                    .then( users => {
                        if(users.length < 0) return factchecks

                        const usersObject = users.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
                        
                        return factchecks.map( factcheck => factcheck.users && factcheck.users.length > 0 ?  { ...factcheck, users: factcheck.users.map(user => usersObject[user.oid]) } : factcheck )
                    });
            })
            .then( factchecks => {
                return {
                    data : factchecks,
                    paging: pagingNew
                }
            })
    }


    getQueryObject(clientId, slug, id) {
        const queryObj = {};
        if (clientId) {
            queryObj.client_id = clientId;
        }

        if (slug) {
            queryObj.slug = slug;
        }

        if (id) {
            if(Array.isArray(id)){
                queryObj._id = { $in: [] };
                for (let element of id) {
                    queryObj._id.$in.push(new ObjectId(element));
                }
            }
            else{
                queryObj._id = new ObjectId(id);
            }          
        }

        //TODO: Get all the ids of of different filter(tag, user, category, ...) by running DB query then apply filter over here 
        return queryObj;
    }
}

module.exports = FactcheckModel;
