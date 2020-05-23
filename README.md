# ex-press

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![coverage][coverage-image]][coverage-url]

[npm-image]: https://img.shields.io/npm/v/ex-press.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ex-press
[travis-image]: https://travis-ci.org/yviscool/ex-press.svg?branch=master
[travis-url]: https://travis-ci.org/yviscool/ex-press
[coverage-url]: https://coveralls.io/github/yviscool/ex-press
[coverage-image]: https://coveralls.io/repos/github/yviscool/ex-press/badge.svg

ex-press is Node.js Web framework written by typescript, which uses IoC injection mechanism.

## QuickStart

<!-- add docs here for user -->

see [ex-press docs][express] for more detail.

```ts
import { Controller, Get, Post, Request, Body, Param, Del, Response, Provide, Inject, } from 'ex-press';
import { UserService } from './service/user';
import { Response as Ctx } from 'express';

@Provide()
@Controller('/user')
export class UserController {


  @Inject()
  ctx: Ctx

  @Config('hello')
  hello:string;

  @Inject('userService')
  userService: UserService

  @Get('/')
  async index(@Request() req) {
    this.ctx.json(req.ip);
  }

  @Post('/')
  async post(@Body() body, @Res() res) {
    res.json(body);
  }

  @Get('/:id')
  async getParam(@Param('id') id) {
    this.ctx.send(`get user ${id}`);
  }

  @Get('/service')
  async service(@Param() param) {
    const user = await this.userService.getUser();
    this.ctx.json(user);
  }


}
```

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```



[express]: https://expressjs.com
