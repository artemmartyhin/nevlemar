import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { DogService } from './dogs/dog.service';
import { DogController } from './dogs/dog.controller';
import { DogSchema } from './dogs/dog.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PuppiesSchema } from './puppies/puppies.schema';
import { PuppySchema } from './puppies/puppies.schema';
import { PuppiesService } from './puppies/puppies.service';
import { PuppiesController } from './puppies/puppies.controller';

@Module({
  
  imports: [
    MongooseModule.forRootAsync({
      useFactory: mongooseConfig,
    }),
    MongooseModule.forFeature([{ name: 'Dog', schema: DogSchema }]),
    MongooseModule.forFeature([{ name: 'Puppies', schema: PuppiesSchema }]),
    MongooseModule.forFeature([{ name: 'Puppy', schema: PuppySchema }]),
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath:  '/data/uploads',
      serveRoot: '/uploads',

    })
  ],
  controllers: [DogController, PuppiesController],
  providers: [DogService, PuppiesService],
})


export class AppModule {}
