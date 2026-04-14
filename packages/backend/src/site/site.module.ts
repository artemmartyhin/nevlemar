import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteService } from './site.service';
import { SiteController } from './site.controller';
import { SiteContentSchema } from './site.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'SiteContent', schema: SiteContentSchema }])],
  providers: [SiteService],
  controllers: [SiteController],
})
export class SiteModule {}
