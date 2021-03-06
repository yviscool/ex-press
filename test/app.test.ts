/// <reference types="mocha" />
// import * as assert from 'power-assert'
import * as request from 'supertest';
import * as path from 'path';
import * as session from 'express-session';
// import * as http from 'http';

import { Application, clearAllModule } from '../src';


describe('/test/app.test.ts', () => {

    afterEach(clearAllModule);

    process.env.EXPRESS_TYPESCRIPT = true as any;

    let app: Application;

    before(async () => {
        app = new Application({ baseDir: path.join(__dirname, './fixtures', 'base-app') });
        await app.ready();
    })

    describe('user router map', () => {

        it('should respond with users', (done) => {
            request(app.instance)
                .get('/user')
                .expect([{ "name": 'zjl', "age": 35 }], done);
        })

        it('should get one user', (done) => {
            request(app.instance)
                .get('/user/12')
                .expect("get user 12", done);
        })

        it('should insert user', (done) => {
            request(app.instance)
                .post('/user')
                .set('Content-Type', 'application/json')
                .send('{"user":"tobi"}')
                .expect(200, '{"user":"tobi"}', done)
        })

        it('should delete user', (done) => {
            request(app.instance)
                .delete('/user/12')
                .expect("delete user 12", done)
        })

        it('should get one user by service', (done) => {
            request(app.instance)
                .get('/user/12/service')
                .expect({
                    "id": "12",
                    "username": "mockedName",
                    "phone": "12345678901",
                    "email": "xxx.xxx@xxx.com",
                }, done)
        })

        it('should get config.foo property', (done) => {
            request(app.instance)
                .get('/user/foo/config')
                .expect("zjl", done)
        })


        it('should get config.foo property1', (done) => {
            request(app.instance)
                .get('/user/config/foo')
                .expect("zjl", done)
        })
    })

    describe('load router.ts file', () => {

        it('should respond with zjl', (done) => {
            request(app.instance)
                .get('/router/test')
                .expect("zjl", done)
        })

    })

    describe('load static middlware', () => {

        it('should respond test.html', (done) => {
            request(app.instance)
                .get('/public/test.html')
                .expect('Content-Type', 'text/html; charset=UTF-8')
                .expect(200, '<h1>zjl</h1>', done);
        })

    })


    describe('middleware router map', () => {

        it('should get controller level middleware', (done) => {
            request(app.instance)
                .get('/middleware')
                .expect("zjl", done)
        })

        it('should get route level middlware', (done) => {
            request(app.instance)
                .get('/middleware/part')
                .expect("zjlixl", done)
        })

    })


    describe('middleware session map', () => {


        it('should respond session.count 1', (done) => {

            request(app.instance)
                .get('/session')
                .expect(200, '1', function (err, res) {
                    if (err) return done(err);
                    done()
                })
        })

    })

    describe('return controler map', () => {


        it('return value can work', (done) => {

            request(app.instance)
                .get('/return')
                .expect("zjl", done);
        })

    })
})