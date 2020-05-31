'use strict';
import { Controller, Get, Request, Provide, Inject, } from '../../../../../../src';
import { Response as Ctx } from 'express';

@Provide()
@Controller('/return')
export class ReturnController {


    @Get('/')
    async index(@Request() req) {
        return "zjl";
    }


}
