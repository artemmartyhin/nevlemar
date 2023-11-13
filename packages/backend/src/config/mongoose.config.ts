import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig = (): MongooseModuleOptions => {
  return {
    uri: `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/nevlemar`,
  };
};
