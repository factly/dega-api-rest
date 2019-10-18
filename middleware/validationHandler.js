module.exports = () => {
    return (req, res, next) => {
        console.log("MIDDLEWARE-VALIDATE")
        if(!req.headers.client){
            res.status(422).json({ error: {
                message: 'Client ID is missing',
                code: '500-001',
                requestId: req.headers['x-request-id'] || null
            } });
        } else {
            next();
        }
    };
};
