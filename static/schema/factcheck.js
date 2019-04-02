
const schema = {
    '@context': 'http://schema.org',
    '@type': 'ClaimReview',
    datePublished: '2014-07-23',
    url: 'http://www.politifact.com/texas/statements/2014/jul/23/rick-perry/rick-perry-claim-about-3000-homicides-illegal-immi/',
    author: {
        '@type': 'Organization',
        url: 'http://factcheck.factly.in/',
        image: 'http://gateway.factly.in/core/dega-content/factly-telugu/2019/4/factly-logo.png'
    },
    claimReviewed: 'More than 3,000 homicides were committed by \'illegal aliens\' over the past six years.',
    reviewRating: {
        '@type': 'Rating',
        ratingValue: -1,
        bestRating: 5,
        worstRating: 1,
        image: 'http://static.politifact.com.s3.amazonaws.com/rulings/tom-pantsonfire.gif',
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
