// src/user/user.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('google')) // Replace 'google' with your actual passport strategy name if different
  @Get('profile')
  async getProfile(@Req() req) {
    return req.user;
  }
}
