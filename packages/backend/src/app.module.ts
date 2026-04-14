import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { mongooseConfig } from './config/mongoose.config';
import { DogService } from './dogs/dog.service';
import { DogController } from './dogs/dog.controller';
import { DogSchema } from './dogs/dog.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PuppiesSchema, PuppySchema } from './puppies/puppies.schema';
import { PuppiesService } from './puppies/puppies.service';
import { PuppiesController } from './puppies/puppies.controller';
import { BannerService } from './banner/banner.service';
import { BannerController } from './banner/banner.controller';
import { BannerSchema } from './banner/banner.schema';
import { BlogModule } from './blog/blog.module';
import { SiteModule } from './site/site.module';
import { I18nModule } from './i18n/i18n.module';
import { UploadsModule } from './uploads/uploads.module';
import { join } from 'path';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useFactory: mongooseConfig }),
    I18nModule,
    MongooseModule.forFeature([{ name: 'Dog', schema: DogSchema }]),
    MongooseModule.forFeature([{ name: 'Puppies', schema: PuppiesSchema }]),
    MongooseModule.forFeature([{ name: 'Puppy', schema: PuppySchema }]),
    MongooseModule.forFeature([{ name: 'Banner', schema: BannerSchema }]),
    AuthModule,
    UserModule,
    BlogModule,
    SiteModule,
    UploadsModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOADS_DIR || join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [DogController, PuppiesController, BannerController],
  providers: [DogService, PuppiesService, BannerService],
})
export class AppModule {}
