import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
import * as path from 'path'
import * as fs from 'fs'

describe('LocationController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  //save access_token for authorization
  let access_token
  //save id of location to execute under
  let locationId
  //save filename of location to later delete after tests are over
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

  it('/location (POST) should create location under user', async () => {
    //register user and save access_token locally for authentication
    const userData = {
      firstName: "test",
      lastName: "location",
      email: "test2@gmail.com",
      password: "test123"
    }

    const user = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    access_token = user.body.access_token

    const location = {
      image: "none",
      lat: 40.73153,
      lon: -73.939582,
      address: "test"
    }

    const response = await request(app.getHttpServer())
      .post('/location')
      .send(location)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(201);

    //console.log(response.body)
    expect(response.body).toHaveProperty('image');
    expect(response.body).toHaveProperty('lat');
    expect(response.body).toHaveProperty('lon');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('id')
    locationId = response.body.id
  })


  it('/location/:id (GET) should respond with data of one location', async () => {
    const response = await request(app.getHttpServer())
      .get(`/location/${locationId}`)
      .expect(200);

    //console.log(response.body)
    expect(response.body).toHaveProperty('image');
    expect(response.body).toHaveProperty('lat');
    expect(response.body).toHaveProperty('lon');
    expect(response.body).toHaveProperty('address');
    expect(response.body).toHaveProperty('id')
  })

  it('/location/:id (GET) should throw error because location doesn\'t exist', async () => {
    const response = await request(app.getHttpServer())
      .get(`/location/0`)
      .expect(404);

    expect(response.body.message).toEqual('Location of id: 0 was not found!')
  })


  it('/location (GET) should respond array of at least one location', async () => {
    const response = await request(app.getHttpServer())
      .get(`/location`)
      .expect(200);

    //console.log(response.body)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data[0]).toMatchObject({
      image: expect.any(String),
      lat: expect.any(Number),
      lon: expect.any(Number),
      address: expect.any(String),
    })
    expect(response.body).toHaveProperty('meta')
    expect(response.body.meta).toHaveProperty('page')
    expect(response.body.meta.page).toEqual(1)
  })


  it('/location/:id (PATCH) should update location data', async () => {
    const location = {
      image: "none",
      lat: 40.1,
      lon: -73.2,
      address: "testUpdate"
    }

    const response = await request(app.getHttpServer())
      .patch(`/location/${locationId}`)
      .send(location)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //console.log(response.body)
    expect(response.body).toHaveProperty('image');
    expect(response.body.lat).toEqual(40.1);
    expect(response.body.lon).toEqual(-73.2)
    expect(response.body.address).toEqual('testUpdate')
  })


  it('/location/:id/update-image (POST) should update location image', async () => {
    const testImagePath = path.resolve(__dirname, 'test-image.jpg')

    const response = await request(app.getHttpServer())
      .post(`/location/${locationId}/update-image`)
      .attach('image', testImagePath)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //console.log(response.body)
    expect(response.body).toHaveProperty('image');
    expect(response.body.image).not.toBe('none');
    filename = response.body.image
  })


  it('/location/:id/guess (POST) create a guess under location with id', async () => {
    const guess = {
      lat: 40.73061,
      lon: -73.935242
    }

    const response = await request(app.getHttpServer())
      .post(`/location/${locationId}/guess`)
      .send(guess)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(201);

    expect(response.body).toHaveProperty('lat')
    expect(response.body).toHaveProperty('lon')
    expect(response.body).toHaveProperty('errorDistance')
  })


  it('/location/:id/guesses (GET) should return an array of guesses of location', async () => {
    const response = await request(app.getHttpServer())
      .get(`/location/${locationId}/guesses`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    //expect response.body to be an array
    expect(Array.isArray(response.body)).toBe(true)
    //expect body to have one entry
    expect(response.body).toHaveLength(1)
    //check array structure
    expect(response.body[0]).toMatchObject({
      lat: expect.any(Number),
      lon: expect.any(Number),
      errorDistance: expect.any(Number),
    })
  })


  it('/location/:id (DELETE) should delete location with id', async () => {
    const response = await request(app.getHttpServer())
      .del(`/location/${locationId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);

    expect(response.body).toHaveProperty('response')
    expect(response.body.response).toEqual('Location deleted successfully')
  })

  it('/location/:id (DELETE) should fail because location doesn\'t exist', async () => {
    const response = await request(app.getHttpServer())
      .del(`/location/${locationId}`)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(400);

    expect(response.body.message).toEqual(`Id ${locationId} is invalid!`)
  })
});
