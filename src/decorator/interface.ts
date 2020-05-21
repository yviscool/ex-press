import { Request, Response, NextFunction, Handler } from 'express';
export type ExpressMiddleware<T = any, R = any> = (req: T, res: R, next: Function) => void;
export type MiddlewareParamArray<T = any> = Array<string | Handler>;
