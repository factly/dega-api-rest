const FactcheckModel = require('../../../models/factcheck');
const OrganizationModel = require('../../../models/organization');
const utils = require('../../../lib/utils');
const schemaTemplate = require('../../../static/schema/factcheck');
const Q = require('q');

function getFactcheck(req, res, next) {
    const {logger} = req;
    utils.setLogTokens(logger, 'factchecks', 'getFactcheck', req.query.client, null);
    const model = new FactcheckModel(logger);
    const orgModel = new OrganizationModel(logger);
    const clientId = req.query.client;
    const conf = req.app.kraken;
    let paging = {};
    return model.getFactcheck(
        conf,
        clientId,
        req.query.id,
        req.query.slug,
        req.query.tag,
        req.query.category,
        req.query.claimant,
        req.query.user,
        req.query.status,
        req.query.sortBy,
        req.query.sortAsc,
        req.query.limit,
        req.query.next,
        req.query.previous)
        .then((result) => {
            paging = result.paging;
            const factchecks = result.data;
            const factchecksWithOrg = (factchecks || []).map((factcheck) => {
                const clientId = factcheck.client_id;
                return orgModel.getOrganization(conf, clientId)
                    .then((org) => {
                        if (org && org.length === 1) {
                            factcheck.currentOrganization = org[0];
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
                        currentSchema.url = `${factcheck.currentOrganization.site_address}/factcheck/${factcheck.slug}`;
                        currentSchema.author.url = factcheck.currentOrganization.site_address;
                        currentSchema.author.image = factcheck.currentOrganization.logo_url;
                        currentSchema.author.name = factcheck.currentOrganization.name;
                    }

                    // date
                    currentSchema.datePublished = factcheck.published_date;

                    if (c.rating && c.rating.numeric_value) {
                        currentSchema.reviewRating.ratingValue = c.rating.numeric_value;
                    }

                    currentSchema.reviewRating.bestRating = 5;
                    currentSchema.reviewRating.worstRating = 1;

                    if (c.rating) {
                        currentSchema.reviewRating.alternateName = c.rating.name;
                        currentSchema.reviewRating.image = c.rating.icon_url;
                    }

                    if (c.claimant) {
                        currentSchema.itemReviewed.author.name = c.claimant.name;
                        currentSchema.itemReviewed.author.image = c.claimant.image_url;
                    }
                    currentSchema.itemReviewed.datePublished = c.claim_date;
                    currentSchema.itemReviewed.name = c.claim;

                    const mergedObject = Object.assign(schemaTemplate, currentSchema);
                    return mergedObject;
                });

                factcheck.schemas = claimSchemas;
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

module.exports = function routes(router) {
    router.get('/', getFactcheck);
};
