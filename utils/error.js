
/**
 * 
 * @param {Number} code 
 * @param {String} msg 
 */
module.exports = function (code, msg) {
	let error = new Error(msg||'Unknown Error');
	error.code = code;
	return error;
};

const asyncMiddleware = fn => (req, res, next) => {
	Promise.resolve(fn(req, res, next))
		.catch(next);
};

module.exports.errMW=asyncMiddleware;