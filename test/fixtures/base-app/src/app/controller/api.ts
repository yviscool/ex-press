'use strict';
import { provide } from 'injection';
import { Controller, Get, Request, Response} from '../../../../../../src';
import req = require('express/lib/request');

@provide()
@Controller('/api')
export class BaseApi {

  @Get('/')
  async index(@Request() req, @Response() res) {
      res.json("zjl")
  }
}
