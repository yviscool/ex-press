import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, Inject, Config, WebMiddleware } from '../../../../../../src';

@Provide()
export class HomeMiddleware implements WebMiddleware {

    resolve(): any {
        return (req, res, next) => {
            req.home = "ixl";
            next();
        };
    }

}