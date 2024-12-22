const allowedMethods = {
    '/auth/register': ['POST'],
    '/auth/login': ['POST'],
    '/auth/user': ['GET'],
};

module.exports = allowedMethods;