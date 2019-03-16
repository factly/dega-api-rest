const FactcheckModel = require('../../../models/factcheck');
const utils = require('../../../lib/utils');
const cleamReviewSchema = require('../../../claim-review-schema/ldschema');

function getFactcheck(req, res) {
    const logger = req.logger;
    utils.setLogTokens(logger, 'factchecks', 'getFactcheck', req.query.client, null);
    const model = new FactcheckModel(logger);

    return model.getFactcheck(req.app.kraken,
        req.query.client,
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
                    const claimSchema = {
                        reviewRating: {}
                    };
                    claimSchema.datePublished = factcheck.published_date;
                    claimSchema.reviewRating.ratingValue = c.rating.numeric_value;
                    claimSchema.reviewRating.bestRating = 5;

                    const mergedObject = Object.assign(cleamReviewSchema, claimSchema);
                    return mergedObject;
                });

                factcheck.schemas = claimSchemas;
                return factcheck;
            });

            if (factchecksWithSchemas) {
                res.status(200).json(factchecksWithSchemas);
                return;
            }
            res.sendStatus(404);
        })
        .catch((err) => {
            const msg = (err) ? err.stack: err;
            logger.error(msg);
            res.sendStatus(500).json(msg);
        });
}

module.exports = function routes(router) {
    router.get('/', getFactcheck);
};
