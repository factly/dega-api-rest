const MongoBase = require('../lib/MongoBase');
const Q = require('q');

const addFields = {
    $addFields: {
        mediaLogo: { $arrayElemAt: [{ $objectToArray: '$mediaLogo' }, 1] },
        mediaMobileLogo: { $arrayElemAt: [{ $objectToArray: '$mediaMobileLogo' }, 1] },
        mediaFavicon: { $arrayElemAt: [{ $objectToArray: '$mediaFavicon' }, 1] },
        mediaMobileIcon: { $arrayElemAt: [{ $objectToArray: '$mediaMobileIcon' }, 1] }
    }
};

const logoLookup = {
    $lookup: {
        from: 'media',
        let: { media: '$mediaLogo' },
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$media'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id : 0, 
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
        as: 'mediaLogo'
    }
};

const mobileLogoLookup = {
    $lookup: {
        from: 'media',
        let: { media: '$mediaMobileLogo' },
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$media'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id : 0, 
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
        as: 'mediaMobileLogo'
    }
};

const faviconLookup = {
    $lookup: {
        from: 'media',
        let: { media: '$mediaFavicon' },
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$media'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id : 0, 
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
        as: 'mediaFavicon'
    }
};

const mobileIconLookup = {
    $lookup: {
        from: 'media',
        let: { media: '$mediaMobileIcon' },
        pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$media'] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
            {
                $project: {
                    id: '$_id',
                    _id : 0, 
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
        as: 'mediaMobileIcon'
    }
};

const orgProject = {
    $project: {
        id: '$_id',
        _id : 0, 
        class: '$_class',
        name: 1,
        phone: 1,
        siteTitle: '$site_title',
        tagLine: '$tag_line',
        description: 1,
        baiduVerificationCode: '$baidu_verification_code',
        bingVerificationCode: '$bing_verification_code',
        googleVerificationCode: '$google_verification_code',
        yandexVerificationCode: '$yandex_verification_code',
        facebookURL: '$facebook_url',
        twitterURL: '$twitter_url',
        instagramURL: '$instagram_url',
        linkedInURL: '$linked_in_url',
        pinterestURL: '$pinterest_url',
        youTubeURL: '$youTube_url',
        googlePlusURL: '$google_plus_url',
        githubURL: '$github_url',
        facebookPageAccessToken: '$facebook_page_access_token',
        gaTrackingCode: '$ga_tracking_code',
        siteLanguage: '$site_language',
        timeZone: '$time_zone',
        clientId: '$client_id',
        slug: 1,
        email: 1,
        createdDate: '$created_date',
        lastUpdatedDate: '$last_updated_date',
        siteAddress: '$site_address',
        mediaLogo: 1,
        mediaMobileLogo: 1,
        mediaFavicon: 1,
        mediaMobileIcon: 1
    }
};

class OrganizationModel extends MongoBase {
    /**
     * Creates a new OrganizationModel.
     * @param logger The logger to use.
     * @param errorCode The errorCode to use when generating errors.
     */
    constructor(logger) {
        super(logger, 'organization');
        this.logger = logger;
    }

    getOrganization(config, clientId) {
        const query = {};

        if (clientId) {
            query.slug = clientId;
        }

        const match = { $match: query };

        const aggregations = [
            addFields,
            {
                $addFields: {
                    mediaLogo: '$mediaLogo.v',
                    mediaMobileLogo: '$mediaMobileLogo.v',
                    mediaFavicon: '$mediaFavicon.v',
                    mediaMobileIcon: '$mediaMobileIcon.v'
                }
            },
            logoLookup,
            { $unwind: { path: '$mediaLogo', preserveNullAndEmptyArrays: true } },
            mobileLogoLookup,
            { $unwind: { path: '$mediaMobileLogo', preserveNullAndEmptyArrays: true } },
            faviconLookup,
            { $unwind: { path: '$mediaFavicon', preserveNullAndEmptyArrays: true } },
            mobileIconLookup,
            { $unwind: { path: '$mediaMobileIcon', preserveNullAndEmptyArrays: true } },
            orgProject,
            match,
        ];

        return Q(this.collection(config.get('databaseConfig:databases:core'))
            .aggregate(aggregations).toArray())
            .then((results) => {
                this.logger.info('Retrieved the results');
                return results;
            });
    }
}

module.exports = OrganizationModel;
