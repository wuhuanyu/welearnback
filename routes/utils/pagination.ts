import { Request, Response, NextFunction } from "_@types_express@4.11.0@@types/express";

export const pagination = (req: Request, res: Response, next: NextFunction) => {
    let start = req.query.start || 0, count = req.query.count || 5;
    next();
};
