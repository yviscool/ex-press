'use strict';
import { Controller, Get, Request, Provide, Inject, Session, } from '../../../../../../src';
import { Response as Ctx } from 'express';

@Provide()
@Controller('/session')
export class SessionController {

    @Inject()
    ctx: Ctx;

    @Get('/')
    async index(@Session() session) {
        session.count = session.count || 0;
        session.count++;
        this.ctx.send(session.count.toString())
    }

}
