const request = require('supertest');
const express = require('express');
const db = require('../data/dbConfig');
const server = require('./server');

beforeEach(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});



describe('Student tests', () => {

  describe('Registration [/api/auth/register]', () => {
    test('Registration endpoint returns 400 if username but not password is provided', async () => {
      const expected_status_code = 400;
      const response = await request(server).post('/api/auth/register').send({ username: 'Mack' });
      expect(response.status).toEqual(expected_status_code);
    });

    test('Registration endpoint responds with status 422 if user tries to register with username that is already taken', async () => {
      const valid_user = await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      const expected_status_code = 422;
      const response = await request(server).post('/api/auth/register').send({ username: 'Mack', password: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA' });
      expect(response.status).toEqual(expected_status_code);
    });

  });

/*
  describe('Login [/api/auth/login]', () => {
  });

  describe('Secret jokes [/api/jokes/]', () => {
    
  });

*/
});
