import { ValidationPipe, INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';

const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Guess the location')
    .setDescription('Guess the location API')
    .setVersion('1.0')
    .addTag('Guess Location')
    //.addBearerAuth()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
};

const initValidation = (app: INestApplication) =>
  //for class-validation 
  //(use whitelist: true to remove unexpected vars in dto)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

const initCors = (app: INestApplication) =>
  //allow requests from other domains
  app.enableCors({
    //react = port 3000
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initCors(app)
  initSwagger(app);
  initValidation(app);

  //TODO: REMOVE WHEN SAVING FILES REMOTE
  //Setup to display files (saving images to root)
  app.use('/files', express.static('files'));

  //open port for backend  
  const PORT = process.env.PORT || 8080
  await app.listen(PORT)
}

bootstrap();
