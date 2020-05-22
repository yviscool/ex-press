'use strict';
import { Controller, Get, Request, Response, provide} from '../../../../../../src';
import req = require('express/lib/request');

@provide()
@Controller('/api')
export class BaseApi {

  @Get('/')
  async index(@Request() req, @Response() res) {
      res.json("zjl")
  }
}
