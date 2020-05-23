'use strict';
import { Controller, Get, Post, Request, Body, Param, Del, Response as Res, Provide, Inject, } from '../../../../../../src';
import { UserService } from '../service/user';
import { Response } from 'express';

@Provide()
@Controller('/user')
export class UserController {

  @Inject('userService')
  userService: UserService

  @Inject()
  ctx: Response

  @Get('/')
  async index(@Request() req) {
    this.ctx.json([{ name: "zjl", age: 35 }]);
  }

  @Post('/')
  async post(@Body() body, @Res() res) {
    res.json(body);
  }

  @Del('/:id')
  async delete(@Param('id') id) {
    this.ctx.send(`delete user ${id}`);
  }

  @Get('/:id')
  async getParam(@Param('id') id) {
    this.ctx.send(`get user ${id}`);
  }

  @Get('/:id/service')
  async service(@Param() param) {
    const user = await this.userService.getUser(param);
    this.ctx.json(user);
  }


}
