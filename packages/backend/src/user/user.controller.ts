// src/user/user.controller.ts

import { Controller, Get, Req } from '@nestjs/common';


@Controller('user')
export class UserController {

  @Get('profile')
  async getProfile(@Req() req) {
    return req.session.user; // Return user data from session
  }

}
