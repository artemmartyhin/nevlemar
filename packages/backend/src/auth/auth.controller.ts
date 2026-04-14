import { Controller, Get, UseGuards, Req, Res, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3002';

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

  // TEMPORARY: mock login without Google — logs in as admin Artem
  // Remove or gate behind NODE_ENV check before exposing publicly
  @Get('dev-login')
  devLogin(@Req() req, @Res() res) {
    req.session.user = {
      email: 'artemmartyhin@gmail.com',
      firstName: 'Artem',
      lastName: 'Martiukhin',
      picture: 'https://ui-avatars.com/api/?name=Artem+M&background=00172d&color=f7dba7',
      role: 'admin',
    };
    return res.json({ ok: true, user: req.session.user });
  }

  @Get('logout')
  logout(@Req() req, @Res() res) {
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ ok: true });
    });
  }
}
