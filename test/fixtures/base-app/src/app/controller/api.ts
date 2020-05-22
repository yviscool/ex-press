'use strict';
import { Controller, Get, Request, Response, Provide } from '../../../../../../src';

@Provide()
@Controller('/api')
export class BaseApi {

  @Get('/')
  async index(@Request() req, @Response() res) {
    res.json("zjl")
  }
}
