/// <reference types="mocha" />
import * as assert from 'power-assert'
import * as request from 'supertest';
import * as path from 'path';
import * as http from 'http';

import { Application, clearAllModule } from '../src';


describe('/test/app.test.ts', () => {

    afterEach(clearAllModule);

    process.env.EXPRESS_TYPESCRIPT = true as any;

    describe('load ts file', () => {
        let app: Application;

        before(async () => {
            app = new Application({ baseDir: path.join(__dirname, './fixtures', 'base-app') });
            await app.ready();
        })


        it('should load ts directory', (done) => {
            request(app.instance)
                .get('/user')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200, '<p>hey</p>', done);
        })
    })


})