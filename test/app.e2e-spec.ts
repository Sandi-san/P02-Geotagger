import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { spec } from 'pactum';
import * as request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
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
    await prisma.$disconnect()
  });

  it('/hello-world (GET)', async () => {
    await spec()
      .get('/hello-world')
      .expectStatus(200)
      .expectBody('It works!')
  })

  it('/auth/register (POST) should create a user', async () => {
    const user = {
      email: 'newuser@e2e.test',
      name: 'New User',
      password: '12345678',
    };
  
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);
  
    expect(response.body).toEqual({
      id: expect.any(Number),
      email: user.email,
      name: user.name,
    });
  });

  it('/auth/login (POST) should login a user', async () => {
    const user = {
      email: 'newuser@e2e.test',
      password: '12345678',
    };
  
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
  
      .expect(201);
  
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
  
  it('/auth/login (POST) should return User not found', async () => {
    const user = {
      email: 'wronguser@e2e.test',
      password: '12345678',
    };
  
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
  
      .expect(404);
  
    expect(response.body.message).toEqual('User not found');
    expect(response.body.status).toEqual(404);
  });
});
