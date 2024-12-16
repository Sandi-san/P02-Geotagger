import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { spec } from 'pactum';
import { AuthController } from 'src/modules/auth/auth.controller';
import { User } from '@prisma/client';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtStrategy } from 'src/modules/auth/jwt';
import { MailService } from 'src/library/MailService';
import { GoogleStrategy } from 'src/modules/auth/oauth/google.strategy';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let controller: AuthController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        AppModule,
      ],
      providers: [
        AuthService,
        {
          provide: MailService,
          useValue: {
            sendPasswordResetRequest: jest.fn() //mock method
          }
        },
        PrismaService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(), //mock signAsync method
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    controller = moduleFixture.get<AuthController>(AuthController)
    //prisma = await moduleFixture.get('PrismaService');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register new user', async () => {
    const newUser = {
      email: 'test@user.com',
      name: 'Test User',
      password: 'password',
    };

    const mockLoginResponse = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyeyey',
    };

    const mockRegisterResponse: User = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      password: 'password',

      createdAt: new Date(),
      updatedAt: new Date(),
      image: null,
      guessTokens: 10,
      resetToken: null,
      resetTokenExpiry: null,
      role: 'user'
    };

    // delete password from response
    delete mockRegisterResponse.password;

    // 💡 See here -> we mock registerUser function from users.controller.ts
    // to return mockRegisterResponse
    jest
      .spyOn(controller, 'register')
      .mockResolvedValue(mockLoginResponse);

    // 💡 See here -> we call registerUser method from users.controller.ts
    // with newUser as parameter
    const result = await controller.register(newUser);

    // 💡 See here -> we expect result to be mockRegisterResponse
    expect(result).toEqual(mockLoginResponse);
  });

  /*
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('It works!');
    });
  
    it('/auth/register (POST) should register new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'newUser', password: 'test123' })
        .expect(201);
    });
  
    it('/auth/register (POST) should return error because user already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({ username: 'newUser', password: 'test123' })
        .expect(400);
    });
  
    it('/auth/login (POST) should return access_token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'newUser', password: 'test123' })
        .expect(201)
        .then(res => {
          userToken = res.body.access_token;
        });
    });
  
    it('/auth/login (POST) should return error because of wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: 'newUser', password: 'test111' })
        .expect(400);
    });
  
    // it('Example how to include jwt in request', () => {
    //   return request(app.getHttpServer())
    //     .post('/something')
    //     .set('authorization', `Bearer ${userToken}`)
    //     .expect(200)
    //     .expect({ someData: true });
    // });
  
    afterAll(async () => {
      //await userRepository.query('DELETE FROM "user"');
      await prisma.user.deleteMany();
    });
    */
});
