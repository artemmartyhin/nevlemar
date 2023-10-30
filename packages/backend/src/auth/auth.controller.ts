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
  @Redirect('http://localhost:3000/', 302)  // Redirect to your frontend application
  googleAuthRedirect(@Req() req) {
    // handles the Google OAuth2 callback
    const user = req.user
    return {url: `http://localhost:3000/?user=${JSON.stringify(user)}`};  // You might want to handle user data in a different way
  }
}
