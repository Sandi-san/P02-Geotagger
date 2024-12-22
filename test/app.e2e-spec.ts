import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService)
    await app.init();

    //reset testing database on start
    await prisma.$executeRaw`TRUNCATE "public"."guesses" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "public"."locations" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "public"."userActions" RESTART IDENTITY CASCADE;`;
    await prisma.$executeRaw`TRUNCATE "public"."users" RESTART IDENTITY CASCADE;`;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/hello-world (GET)', async () => {
    //call route /hello-world and expect status 200 and body 'It works!'
    const response = await request(app.getHttpServer())
      .get('/hello-world')
      .expect(200)
    expect(response.text).toEqual('It works!')
  })
});
