const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret: 'secret',
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/medications(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/healths(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAssistant) {
        done(null, true)
    }
    done();
}

module.exports = authJwt;