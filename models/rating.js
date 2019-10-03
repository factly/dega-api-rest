
const MongoBase = require('../lib/MongoBase');
const Q = require('q');
const ObjectId = require('mongodb').ObjectID;

const ratingProject = {
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
        media: 1,
        createdDate: '$created_date',
        lastUpdatedDate: '$last_updated_date'
    }
};

const mediaProject = {
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
};

class RatingModel extends MongoBase {
    /**
     * Creates a new RatingModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'rating');
        this.logger = logger;
    }

    getRating(config, clientId) {
        const query = {
            client_id: {
                $in: [clientId, 'default']
            }
        };


        const match = { $match: query };

        const aggregations = [
            match,
            ratingProject,
        ];

        return Q(this.collection(config.get('databaseConfig:databases:factcheck'))
            .aggregate(aggregations).toArray())
            .then((ratings) => {

                let mediaIds = ratings.filter(rating => rating.media).map( rating => rating.media.oid );
                
                const match = {
                    $match: {
                        _id : { $in : mediaIds }
                    }
                };
                
                const mediaAggregation = [
                    match,
                    mediaProject,
                ];
                
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        const mediaObject = media.reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {});
                        
                        return ratings.map( rating => rating.media ? { ...rating, media: mediaObject[rating.media.oid]} : rating );
                    });
            })
            .then((results) => {
                this.logger.info('Retrieved the results');
                return {
                    data: results
                };
            });
    }
    getRatingByKey(config, clientId, key){
        const query = {
            client_id: {
                $in: [clientId, 'default']
            }
        };

        if(ObjectId.isValid(key)){
            query._id = new ObjectId(key);
        } else {
            query.slug = key;
        }

        const match = { $match: query };

        const aggregations = [
            match,
            ratingProject,
        ];

        return Q(this.collection(config.get('databaseConfig:databases:factcheck'))
            .aggregate(aggregations).toArray())
            .then((ratings) => {
                
                if(ratings.length !== 1) return;
                
                this.logger.info('Retrieved the results');
                        
                let rating = ratings[0];

                if(!rating.media) return  { data: rating };

                const match = { $match: { _id : rating.media.oid }};
                
                const mediaAggregation = [
                    match,
                    mediaProject,
                ];
                
                return Q(this.collection(config.get('databaseConfig:databases:core'), 'media')
                    .aggregate(mediaAggregation).toArray())
                    .then((media) => {
                        return {
                            data: { ...rating, media: media[0]}
                        };
                    });
            });
    }
}

module.exports = RatingModel;
