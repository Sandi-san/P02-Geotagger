import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import * as path from 'path'
import * as fs from 'fs'

describe('UserController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  //save access_token for authorization
  let access_token
  //save new filename when uploading file so it can be deleted after the test
  let filename

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService)
    await app.init();
  });

  afterAll(async () => {
    //delete old file
    if (filename) {
      const imagesFolderPath = path.join(process.cwd(), 'files');
      const fullImagePath = path.join(imagesFolderPath, filename);

      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath); // Delete the file
        //console.log(`Deleted test image: ${fullImagePath}`);
      }
    }
    await app.close();
  });

  it('/user (GET) should respond with user data', async () => {
    //login user and save access_token locally for authentication
    const userData = {
      firstName: "test",
      lastName: "user",
      email: "test1@gmail.com",
      password: "test123"
    }

    const user = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    access_token = user.body.access_token

    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //console.log(response.body)
    expect(response.body.email).toBe('test1@gmail.com');
  })


  it('/user/update (PATCH) should update user data', async () => {
    const user = {
      firstName: 'New name',
      lastName: 'New last name',
      email: 'tset@gmail.com',
      image: 'not applicable'
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update')
      .send(user)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //console.log(response.body)
    expect(response.body.firstName).toBe('New name');
    expect(response.body.lastName).toBe('New last name');
    expect(response.body.email).toBe('tset@gmail.com');
    expect(response.body.image).toBe('not applicable');
  })

  it('/user/update (PATCH) should fail because email already exists', async () => {
    const user = {
      firstName: 'New name',
      lastName: 'New last name',
      email: 'test@gmail.com',
      image: 'not applicable'
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update')
      .send(user)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(403);

    //console.log(response.body)
    expect(response.body.message).toBe('Email already taken!');
  })


  it('/user/update-password (PATCH) should update user password', async () => {
    const user = {
      old_password: 'test123',
      password: 'test12345',
      confirm_password: 'test12345'
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update-password')
      .send(user)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(response.body.response).toBe('Password changed successfully!');
  })

  it('/user/update-password (PATCH) should fail because old password is incorrect', async () => {
    const user = {
      old_password: 'test123',
      password: 'test12345',
      confirm_password: 'test12345'
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update-password')
      .send(user)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(response.body.message).toBe('Old password is incorrect!');
  })

  it('/user/update-password (PATCH) should fail because passwords do not match', async () => {
    const user = {
      old_password: 'test12345',
      password: 'test111',
      confirm_password: 'test123'
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update-password')
      .send(user)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(response.body.message).toBe('Password and confirm password do not match!');
  })

  it('/user/update-password (PATCH) should fail because new password is same as old', async () => {
    const user = {
      old_password: 'test12345',
      password: 'test12345',
      confirm_password: 'test12345'
    };

    const response = await request(app.getHttpServer())
      .patch('/user/update-password')
      .send(user)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(response.body.message).toBe('New password cannot be same as old password!');
  })


  it('/user/update-image (POST) should update user image', async () => {
    const testImagePath = path.resolve(__dirname, 'test-image.jpg')

    const response = await request(app.getHttpServer())
      .post('/user/update-image')
      .attach('image', testImagePath)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //console.log(response.body)
    expect(response.body).toHaveProperty('image');
    expect(response.body.image).not.toBe('not applicable');
    filename = response.body.image
  })

  it('/user/locations (GET) should return locations but array is empty since none have been added', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/locations')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveLength(0)
    expect(response.body).toHaveProperty('meta')
    expect(response.body.meta).toHaveProperty('page')
    expect(response.body.meta.page).toEqual(1)
  })

  it('/user/locations (GET) should return guesses but array is empty since none have been added', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/guesses')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toHaveLength(0)
    expect(response.body).toHaveProperty('meta')
    expect(response.body.meta).toHaveProperty('page')
    expect(response.body.meta.page).toEqual(1)
  })

  it('/user/actions (POST) should save an array of actions', async () => {
    const data = {
      'actions': [
        {
          'action': 'click',
          'type': 'Button',
          'newValue': null,
          'url': 'http://localhost:3000/home'
        },
        {
          'action': 'changed value',
          'type': 'Textbox',
          'newValue': 42,
          'url': 'http://localhost:3000/profile'
        }
      ]
    }

    const response = await request(app.getHttpServer())
      .post('/user/actions')
      .send(data)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(201);

    expect(response.body).toHaveProperty('response')
    expect(response.body.response).toContain(`Saved 2 actions of user with id:`)
  })


  it('/user/actions (GET) should return an array of actions', async () => {
    const response = await request(app.getHttpServer())
      .get('/user/actions')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //expect response.body to be an array
    expect(Array.isArray(response.body)).toBe(true)
    //expect body to have two entries
    expect(response.body).toHaveLength(2)
    //check array structure
    expect(response.body[0]).toMatchObject({
      action: expect.any(String),
      type: expect.any(String),
      newValue: expect.any(Number || null),
      url: expect.any(String),
    })
  })
});
