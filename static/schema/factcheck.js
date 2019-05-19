
const schema = {
    '@context': 'http://schema.org',
    '@type': 'ClaimReview',
    datePublished: '2014-07-23',
    url: 'http://factcheck.factly.in/factcheck/-fact-checking-government-claims-on-direct-benefit-transfer-0',
    author: {
        name: 'Factly',
        '@type': 'Organization',
        url: 'http://factcheck.factly.in/',
        image: 'http://gateway.factly.in/core/dega-content/factly-telugu/2019/4/factly-logo.png'
    },
    claimReviewed: '',
    reviewRating: {
        '@type': 'Rating',
        ratingValue: -1,
        bestRating: 5,
        worstRating: 1,
        image: '',
        alternateName: 'True'
    },
    itemReviewed: {
        '@type': 'CreativeWork',
        author: {
            '@type': 'Person',
            name: '',
            image: ''
        },
        datePublished: '2014-07-17',
        name: ''
    }
};

module.exports = schema;
