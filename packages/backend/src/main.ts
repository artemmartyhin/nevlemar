import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: false, transform: true }),
  );

  const origins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://95.179.189.214',
    'http://95.179.189.214:3002',
    'https://nevlemar.dog',
    'https://www.nevlemar.dog',
    'https://nevlemar.com',
    'http://nevlemar.com',
  ];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || origins.includes(origin)) cb(null, true);
      else cb(null, true); // permissive in dev
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(
    session({
      secret: process.env.SECRET || 'nevlemar-dev-secret',
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' || !!process.env.COOKIE_SECURE,
        sameSite: 'lax',
        maxAge: 7 * 24 * 3600 * 1000,
      },
    }),
  );

  const port = Number(process.env.PORT || 3001);
  await app.listen(port);
  console.log(`[nevlemar backend] listening on :${port}`);
}
bootstrap();
