import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SiteService } from './site.service';
import { AdminGuard } from 'src/auth/auth.admin';

@Controller('site-content')
export class SiteController {
  constructor(private readonly svc: SiteService) {}

  @Get()
  get(@Query('locale') locale?: string) {
    return this.svc.get(locale);
  }

  @Put()
  @UseGuards(AdminGuard)
  update(@Body() body: any) {
    return this.svc.update(body);
  }

  @Post('reset')
  @UseGuards(AdminGuard)
  reset() {
    return this.svc.reset();
  }

  @Post('retranslate')
  @UseGuards(AdminGuard)
  async retranslate() {
    await this.svc.retranslate();
    return { ok: true };
  }
}
