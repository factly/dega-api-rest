const FactcheckModel = require('../../../models/factcheck');
const utils = require('../../../lib/utils');
const schemaTemplate = require('../../../static/schema/factcheck');

function getFactcheck(req, res, next) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'factchecks', 'getFactcheck', req.query.client, null);
    const model = new FactcheckModel(logger);

    const clientId = req.query.client;
    const conf = req.app.kraken;
    return model.getFactcheck(
        conf,
        clientId,
        req.query.slug,
        req.query.tag,
        req.query.category,
        req.query.claimant,
        req.query.user,
        req.query.status)
        .then((factchecks) => {

            const factchecksWithSchemas = (factchecks || []).map((factcheck) => {
                // add claim review schema here for every claim
                const claimSchemas = (factcheck.claims || []).map((c) => {

                    // our schema from claim evolves here
                    const currentSchema = {
                        reviewRating: {},
                        itemReviewed: {
                            '@type': 'CreativeWork',
                            author: {}
                        },
                        claimReviewed: c.claim
                        // author: {}
                    };

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
            // return model.getOrganization(conf, clientId).then((org) => {
            //
            // });
            return factchecksWithSchemas;
        })
        .then((factchecksWithSchemas) => {
            if (factchecksWithSchemas) {
                res.status(200).json(factchecksWithSchemas);
                return;
            }
            res.sendStatus(404);
        })
        .catch(next);
}

module.exports = function routes(router) {
    router.get('/', getFactcheck);
};
