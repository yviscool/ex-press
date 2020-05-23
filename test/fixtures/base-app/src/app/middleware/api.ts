import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, Inject, Config, WebMiddleware } from '../../../../../../src';

@Provide()
export class ApiMiddleware implements WebMiddleware {

    @Config('foo')
    foo;

    resolve(): any {
        return (req, res, next) => {
            req.api = this.foo;
            next();
        };
    }

}