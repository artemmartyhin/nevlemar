import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { DogService } from './dogs/dog.service';
import { DogController } from './dogs/dog.controller';
import { DogSchema } from './dogs/dog.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: mongooseConfig,
    }),
    MongooseModule.forFeature([{ name: 'Dog', schema: DogSchema }]),
  ],
  controllers: [DogController],
  providers: [DogService],
})
export class AppModule {}