import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { DogService } from './dogs/dog.service';
import { DogController } from './dogs/dog.controller';
import { DogSchema } from './dogs/dog.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  
  imports: [
    MongooseModule.forRootAsync({
      useFactory: mongooseConfig,
    }),
    MongooseModule.forFeature([{ name: 'Dog', schema: DogSchema }]),
    AuthModule,
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'uploads'),
      serveRoot: '/uploads',

    })
  ],
  controllers: [DogController],
  providers: [DogService],
})


export class AppModule {}
