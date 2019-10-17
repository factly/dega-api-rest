const FactcheckModel = require('../../../models/factcheck');
const OrganizationModel = require('../../../models/organization');
const utils = require('../../../lib/utils');
const schemaTemplate = require('../../../static/schema/factcheck');
const Q = require('q');
const ObjectId = require('mongodb').ObjectID;

function getFactchecks(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'factchecks', 'getFactchecks', req.headers.client, null);
    const model = new FactcheckModel(logger);
    const orgModel = new OrganizationModel(logger);
    const clientId = req.headers.client;
    const config = req.app.kraken;
    let paging = {};
    return model.getFactcheck(
        config,
        clientId,
        req.query.id,
        req.query.slug,
        req.query.tag,
        req.query.category,
        req.query.claimant,
        req.query.user,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous)
        .then((result) => {
            paging = result.paging;
            const factchecks = result.data;
            const factchecksWithOrg = (factchecks || []).map((factcheck) => {
                const clientId = factcheck.clientId;
                return orgModel.getOrganization(config, clientId)
                    .then((org) => {
                        if (org && org.data) {
                            factcheck.currentOrganization = org.data;
                        }
                        return factcheck;
                    });
            });
            return Q.all(factchecksWithOrg);
        })
        .then((factchecks) => {

            const factchecksWithSchemas = (factchecks || []).map((factcheck) => {
                // add claim review schema here for every claim
                const claimSchemas = (factcheck.claims || []).map((c) => {

                    // our schema from claim evolves here
                    const currentSchema = {
                        reviewRating: {
                            '@type': 'Rating'
                        },
                        itemReviewed: {
                            '@type': 'CreativeWork',
                            author: {
                                '@type': 'Organization'
                            }
                        },
                        claimReviewed: c.claim,
                        author: {
                            '@type': 'Organization'
                        }
                    };

                    if (factcheck.currentOrganization) {
                        currentSchema.url = `${factcheck.currentOrganization.siteAddress}/factcheck/${factcheck.slug}`;
                        currentSchema.author.url = factcheck.currentOrganization.siteAddress;
                        currentSchema.author.image = factcheck.currentOrganization.mediaLogo ? factcheck.currentOrganization.mediaLogo.sourceURL : undefined;
                        currentSchema.author.name = factcheck.currentOrganization.name;
                    }

                    // date
                    currentSchema.datePublished = factcheck.publishedDate;

                    if (c.rating && c.rating.numericValue) {
                        currentSchema.reviewRating.ratingValue = c.rating.numericValue;
                    }

                    currentSchema.reviewRating.bestRating = 5;
                    currentSchema.reviewRating.worstRating = 1;

                    if (c.rating) {
                        currentSchema.reviewRating.alternateName = c.rating.name;
                        currentSchema.reviewRating.image = c.rating.media ? c.rating.media.sourceURL : undefined;
                    }

                    if (c.claimant) {
                        currentSchema.itemReviewed.author.name = c.claimant.name;
                        currentSchema.itemReviewed.author.image = c.claimant.media ? c.claimant.media.sourceURL : undefined;
                    }
                    currentSchema.itemReviewed.datePublished = c.claimDate;
                    currentSchema.itemReviewed.name = c.claim;

                    const mergedObject = Object.assign(schemaTemplate, currentSchema);
                    return mergedObject;
                });

                factcheck.schemas = claimSchemas;
                delete factcheck.currentOrganization;
                return factcheck;
            });
            return factchecksWithSchemas;
        })
        .then((factchecksWithSchemas) => {
            const result = {};
            result.data = factchecksWithSchemas;
            result.paging = paging;
            if (factchecksWithSchemas) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

function getFactcheckByKey(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'factchecks', 'getFactcheckByKey', req.headers.client, null);
    const model = new FactcheckModel(logger);
    const orgModel = new OrganizationModel(logger);
    const clientId = req.headers.client;
    const config = req.app.kraken;
    let currentOrganization = null;
    return model.getFactcheck(
        config,
        clientId,
        ObjectId.isValid(req.params.key) ? req.params.key : undefined,
        !ObjectId.isValid(req.params.key) ? req.params.key : undefined)
        .then(({ data }) => {
            const factcheck = data[0];
            const clientId = factcheck.clientId;
            return orgModel.getOrganization(config, clientId)
                .then((org) => {
                    if (org && org.data) {
                        currentOrganization = org.data;
                    }
                    return factcheck;
                }); 
        })
        .then((factcheck) => {

            // add claim review schema here for every claim
            const claimSchemas = (factcheck.claims || []).map((c) => {

                // our schema from claim evolves here
                const currentSchema = {
                    reviewRating: {
                        '@type': 'Rating'
                    },
                    itemReviewed: {
                        '@type': 'CreativeWork',
                        author: {
                            '@type': 'Organization'
                        }
                    },
                    claimReviewed: c.claim,
                    author: {
                        '@type': 'Organization'

                    }
                };

                if (currentOrganization) {
                    currentSchema.url = `${currentOrganization.siteAddress}/factcheck/${factcheck.slug}`;
                    currentSchema.author.url = currentOrganization.siteAddress;
                    currentSchema.author.image = currentOrganization.mediaLogo ? currentOrganization.mediaLogo.sourceURL : undefined;
                    currentSchema.author.name = currentOrganization.name;
                }

                // date
                currentSchema.datePublished = factcheck.publishedDate;

                if (c.rating && c.rating.numericValue) {
                    currentSchema.reviewRating.ratingValue = c.rating.numericValue;
                }

                currentSchema.reviewRating.bestRating = 5;
                currentSchema.reviewRating.worstRating = 1;

                if (c.rating) {
                    currentSchema.reviewRating.alternateName = c.rating.name;
                    currentSchema.reviewRating.image = c.rating.media ? c.rating.media.sourceURL : undefined;
                }

                if (c.claimant) {
                    currentSchema.itemReviewed.author.name = c.claimant.name;
                    currentSchema.itemReviewed.author.image = c.claimant.media ? c.claimant.media.sourceURL : undefined;
                }
                currentSchema.itemReviewed.datePublished = c.claimDate;
                currentSchema.itemReviewed.name = c.claim;

                const mergedObject = Object.assign(schemaTemplate, currentSchema);
                return mergedObject;
            });

            factcheck.schemas = claimSchemas;
            return factcheck;
        })
        .then((factcheckWithSchemas) => {
            const result = {};
            result.data = factcheckWithSchemas;
            if (factcheckWithSchemas) {
                res.status(200).json(result);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

module.exports = function routes(router) {
    router.get('/', getFactchecks);
    router.get('/:key', getFactcheckByKey);
};
