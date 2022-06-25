const request = require('supertest');
const express = require('express');
const db = require('../data/dbConfig');
const server = require('./server');

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

const expected_dad_jokes = [
  {
    "id": "0189hNRf2g",
    "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
  },
  {
    "id": "08EQZ8EQukb",
    "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."
  },
  {
    "id": "08xHQCdx5Ed",
    "joke": "Why didn’t the skeleton cross the road? Because he had no guts."
  },
];

describe('Student tests', () => {

  describe('Registration [/api/auth/register]', () => {
    test('Registration endpoint returns 400 if username but not password is provided', async () => {
      const response = await request(server).post('/api/auth/register').send({ username: 'Mack' });
      expect(response.status).toEqual(400);
    });

    test('Registration endpoint responds with status 422 if user tries to register with username that is already taken', async () => {
      const valid_user = await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      const response = await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      expect(response.status).toEqual(422);
    });

  });

  describe('Login [/api/auth/login]', () => {
    test('Attempting to log in with the wrong password raises a 401 [invalid credentials] response', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });

      const response = await request(server).post('/api/auth/login').send({ username: 'Mack', password: 'aAAA' });

      expect(response.status).toEqual(401);
    });


    test('Logging in with the correct password nets us a superficially valid jwt', async () => {

      await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      const response = await request(server).post('/api/auth/login').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      expect(response.body.token.split('.').length).toEqual(3);

    });

  });

  describe('Secret jokes [/api/jokes/]', () => {

    test('Attempting to access the secret dad jokes while not logged in returns us a 403 forbidden', async () => {
      const response = await request(server).get('/api/jokes');
      expect(response.status).toEqual(403);

    }); 

    test('Attempting to access the secret dad jokes while logged in as a valid user returns us the proper list of dad jokes', async () => {
      await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      const token_haver = await request(server).post('/api/auth/login').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });

      const token = token_haver.body.token;

      const response = await request(server).get('/api/jokes').set('Authorization', token);
      expect(response.body).toEqual(expected_dad_jokes);
   
    });
    
  });

});
