'use strict';
import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, Inject, Config, } from '../../../../../../src';
import { Response as Ctx } from 'express';

@Provide()
@Controller('/middleware', { middleware: ['apiMiddleware'] })
export class MiddlewareController {


    @Inject()
    ctx: Ctx;


    @Get('/')
    async index(@Request() req) {
        this.ctx.send(req.api);
    }

    @Get('/part', { middleware: ['homeMiddleware'] })
    async post(@Request() req) {
        this.ctx.send(req.api + req.home);
    }

}
