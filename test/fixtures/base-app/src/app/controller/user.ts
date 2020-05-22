'use strict';
import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, } from '../../../../../../src';

@Provide()
@Controller('/user')
export class BaseApi {

  @Get('/')
  async index(@Request() req, @Response() res) {
    res.json([{ name: "zjl", age: 35 }]);
  }

  @Post('/')
  async post(@Body() body, @Response() res) {
    res.json(body);
  }

  @Del('/:id')
  async delete(@Param('id') id, @Response() res) {
    res.send(`delete user ${id}`);
  }

  @Get('/:id')
  async getParam(@Param('id') id, @Response() res) {
    res.send(`get user ${id}`);
  }

}
