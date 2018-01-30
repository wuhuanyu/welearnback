import * as express from 'express';
const applyErrorMW = require('../utils/async_middleware');
const router = express.Router();


router.get(/^\/([0-9]+)$/, applyErrorMW(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let course_id=req.url_params['course_id'];
}));

module.exports=router;