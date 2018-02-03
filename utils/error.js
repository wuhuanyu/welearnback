
/**
 * 
 * @param {Number} code 
 * @param {String} msg 
 */
module.exports = function (code, msg) {
    switch (code) {
        case 404:
            msg = 'No such resource'; break;
        case 500:
            msg = 'Internal error'; break;

        default: break;
    }
    let error = new Error(msg);
    error.code = code;
    return error;
};

const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};

module.exports.errMW=asyncMiddleware;