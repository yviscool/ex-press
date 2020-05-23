'use strict';
import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, Inject, } from '../../../../../../src';
import { UserService } from '../service/user';

@Provide()
@Controller('/user')
export class UserController{

  @Inject('userService')
  userService: UserService

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

  @Get('/:id/service')
  async service(@Param() param, @Response() res) {
    const user = await this.userService.getUser(param);
    res.json(user);
  }


}
