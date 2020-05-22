'use strict';
import { Controller, Get, Request, Response, Provide } from '../../../../../../src';

@Provide()
@Controller('/user')
export class BaseApi {

  @Get('/')
  async index(@Request() req, @Response() res) {
    res.send('<p>hey</p>');
  }
}
