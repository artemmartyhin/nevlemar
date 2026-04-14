import { Controller, Get, UseGuards, Req, Res, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const FRONTEND = process.env.FRONTEND_URL || 'https://nevlemar.dog';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res) {
    req.session.user = req.user;
    return res.redirect(`${FRONTEND}/`);
  }

  @Get('me')
  me(@Req() req) {
    const user = req.session?.user || null;
    return { user, isAdmin: user?.role === 'admin' };
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  }
}
