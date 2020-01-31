const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig');

const Users = require('../auth/auth-model');

describe(server, function() {
    it('runs the tests', function() {
        expect(true).toBe(true)
    })

    describe('GET /', function() {
        it('should return 200 OK', function() {
            return request(server).get('/api/jokes')
            .set('authorization', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU4MDQ4NjMyNiwiZXhwIjoxNTgwNTcyNzI2fQ.hfZvf2jwh2BNeIOyjTkKN3s9zAn3aDPQPIfKtk2enc0`)
            .then(res => {
                expect(res.status).toBe(200)
            })
        })

        it('should return a JSON', function() {
            return request(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.type).toMatch(/json/i)
            })
        })
    })

    describe('POST /register', function() {
        beforeEach(async () => {
            await db('users').truncate();
        })
        it('should register new user', async function() {
            await request(server)
            .post('/api/auth/register')
            .send({
                username: 'backend2',
                password: 'sprint'
            })
            .then(res => {
                expect(res.status).toBe(201)
            })
        })
        it('should return text/string', function() {
            return request(server)
            .get('/api/auth/register')
            .then(res => {
                expect(res.type).toMatch(/text/i)
            })
        })
    })

    describe('POST /login', function() {
        it('should return 500 with no credentials', function() {
            return request(server)
            .post('/api/auth/login')
            .then(res => {
                expect(res.status).toBe(500);
            })
        })

        it('should return a token', function() {
            return request(server)
            .post('/api/auth/login')
            .then(res => {
                expect(res.type).toMatch(/json/i)
            })
        })
    })

})

