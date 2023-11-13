import { Controller, Get, UseGuards, Req, Res, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @Redirect('http://localhost:3000/', 302)
  googleAuthRedirect(@Req() req) {
    const user = req.user;
    req.session.user = user; // Store user data in session
    return {url: `http://localhost:3000/`};
  }
  
}
