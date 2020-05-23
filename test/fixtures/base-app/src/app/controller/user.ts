'use strict';
import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, Inject, Config, } from '../../../../../../src';
import { UserService } from '../service/user';
import { Response as Ctx } from 'express';

@Provide()
@Controller('/user')
export class UserController {


  @Inject()
  ctx: Ctx;

  @Config('foo')
  fooConfig: string;

  @Config()
  foo: string;

  @Inject('userService')
  userService: UserService;


  @Get('/')
  async index(@Request() req) {
    this.ctx.json([{ name: "zjl", age: 35 }]);
  }

  @Post('/')
  async post(@Body() body, @Response() res) {
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

  @Get('/foo/config')
  async getFooConfig() {
    this.ctx.send(this.fooConfig)
  }

  @Get('/config/foo')
  async getConfig() {
    this.ctx.send(this.foo)
  }

}
