'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.pagination = (req, res, next) => {
    let start = req.query.start || 0, count = req.query.count || 5;
    next();
};
