
const schema = {
    '@context': 'http://schema.org',
    '@type': 'ClaimReview',
    datePublished: '2014-07-23',
    url: 'http://www.politifact.com/texas/statements/2014/jul/23/rick-perry/rick-perry-claim-about-3000-homicides-illegal-immi/',
    author: {
        '@type': 'Organization',
        url: 'http://www.politifact.com/',
        image: 'http://static.politifact.com/mediapage/jpgs/politifact-logo-big.jpg',
        sameAs: 'https://twitter.com/politifact'
    },
    claimReviewed: 'More than 3,000 homicides were committed by \'illegal aliens\' over the past six years.',
    reviewRating: {
        '@type': 'Rating',
        ratingValue: 1,
        bestRating: 6,
        image: 'http://static.politifact.com.s3.amazonaws.com/rulings/tom-pantsonfire.gif',
        alternateName: 'True'
    },
    itemReviewed: {
        '@type': 'CreativeWork',
        author: {
            '@type': 'Person',
            name: 'Rich Perry',
            jobTitle: 'Former Governor of Texas',
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gov._Perry_CPAC_February_2015.jpg/440px-Gov._Perry_CPAC_February_2015.jpg',
            sameAs: [
                'https://en.wikipedia.org/wiki/Rick_Perry',
                'https://rickperry.org/'
            ]
        },
        datePublished: '2014-07-17',
        name: 'The St. Petersburg Times interview [...]'
    }
};

module.exports = schema;
