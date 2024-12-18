import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { spec } from 'pactum';
import * as request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/library/MailService';

describe('AppController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  //to mock sending mail in MailService
  let mockMailService: Partial<MailService>
  const USER_EMAIL = 'test@gmail.com'

  beforeAll(async () => {
    //mock sendPasswordResetRequest method so that it accepts sending the mail
    //otherwise the method would fail because the mail needs to exist to send to it
    mockMailService = {
      sendPasswordResetRequest: jest.fn().mockResolvedValue({
        accepted: [`${USER_EMAIL}`],
      })
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    //replace MailServace with mock version within the test
      .overrideProvider(MailService)
      .useValue(mockMailService)
      .compile();

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
    //call route /hello-world and expect status 200 and body 'It works!'
    await spec()
      .get('/hello-world')
      .expectStatus(200)
      .expectBody('It works!')
  })


  it('/auth/register (POST) should create a new user', async () => {
    //post data
    const user = {
      firstName: "name",
      lastName: "last name",
      email: "test@gmail.com",
      password: "test123"
    };

    //call route with user and expect 201 (CREATE) response
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201);

    //validate JWT response structure (alternate definition)
    expect(response.body).toHaveProperty('access_token')
    expect(typeof response.body.access_token).toBe('string')
    expect(response.body.access_token).not.toBeNull()
  });


  it('/auth/register (POST) should fail because user email already exists', async () => {
    const user = {
      firstName: 'existing user',
      lastName: 'some name',
      email: 'test@gmail.com',
      password: 'test123'
    };

    //call route with user and expect 400 because user email already exists
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: expect.any(String),
      error: "Bad Request"
    })
  });

  it('/auth/login (POST) should login a user', async () => {
    const user = {
      email: 'test@gmail.com',
      password: 'test123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(200);

    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  it('/auth/login (POST) should fail because of incorrect password', async () => {
    const user = {
      email: 'test@gmail.com',
      password: '12345678',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(400);

    expect(response.body).toEqual({
      statusCode: 400,
      message: expect.any(String),
      error: "Bad Request"
    })
  });

  it('/auth/login (POST) should fail because user email is not found', async () => {
    const user = {
      email: 'wronguser@gmail.com',
      password: 'test123',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(user)
      .expect(404);

    expect(response.body).toEqual({
      statusCode: 404,
      message: `User with email '${user.email}' not found!`,
      error: 'Not Found',
    })
  });


  it('/auth/forgotten-password (POST) should send reset token to user email', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/forgotten-password')
      .send({ email: USER_EMAIL })
      .expect(200);

    expect(response.body).toEqual({
      response: `Reset token has been sent to: ${USER_EMAIL}`
    });

    //validate mail service call
    expect(mockMailService.sendPasswordResetRequest).toHaveBeenCalledWith(USER_EMAIL, expect.any(String));

    //validate database updates
    const user = await prisma.user.findFirst({ where: { email: USER_EMAIL } });
    expect(user.resetToken).toBeDefined();
    expect(user.resetTokenExpiry).toBeDefined();

  });
});
