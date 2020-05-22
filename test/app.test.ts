/// <reference types="mocha" />
import * as assert from 'power-assert'
import * as request from 'supertest';
import * as path from 'path';
import * as http from 'http';

import { Application, clearAllModule } from '../src';


describe('/test/app.test.ts', () => {

    afterEach(clearAllModule);

    process.env.EXPRESS_TYPESCRIPT = true as any;

    describe('user router map', () => {
        let app: Application;

        before(async () => {
            app = new Application({ baseDir: path.join(__dirname, './fixtures', 'base-app') });
            await app.ready();
        })


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
    })


})