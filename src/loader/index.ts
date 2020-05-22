import { join } from 'path';
import * as fs from 'fs';
import * as is from 'is-type-of';
import * as extend from 'extend2';
import * as camelcase from 'camelcase';
import { resolveModule, requireFile, loadFile } from './utils';
import { Application } from '../app';

const originalPrototypes = {
    request: require('express').request,
    response: require('express').response,
    application: require('express').application,
};

const EXPRESS_PATH = Symbol.for('epxress#appPath');

export class FileLoader {

    options;
    app: Application;
    appInfo;
    config;
    plugins;
    appPath: string[];
    serverEnv: string;

    constructor(options) {
        this.options = options;
        this.app = options.app;
        this.options = options;
        this.appInfo = {
            name: 'express',
            baseDir: this.options.baseDir,
        };

        this.appPath = this.getAppPath();
        this.serverEnv = this.getServerEnv();
    }

    load() {
        // this.loadPlugin();
        this.loadConfig();

        this.loadApplicationExtend();
        this.loadRequestExtend();
        this.loadResponseExtend();
        this.loadHelperExtend();

        this.loadMiddleware();
        this.loadRouter(); // Dependent on controllers
    }

    protected loadApplicationExtend() {
        this.loadExtend('application', this.app.application);
    }

    protected loadRequestExtend() {
        this.loadExtend('request', this.app.request);
    }

    protected loadResponseExtend() {
        this.loadExtend('response', this.app.response);
    }

    protected loadHelperExtend() {
        this.loadExtend('helper', this.app.Helper);
    }

    protected loadExtend(name: string, proto) {
        const filePaths = this.getExtendFilePaths(name);

        for (let filepath of filePaths) {
            filepath = resolveModule(filepath);
            if (!filepath) {
                continue;
            }
            const ext = requireFile(filepath);

            const properties = Object.getOwnPropertyNames(ext)
                .concat(Object.getOwnPropertySymbols(ext) as any);

            for (const property of properties) {
                let descriptor = Object.getOwnPropertyDescriptor(ext, property);
                let originalDescriptor = Object.getOwnPropertyDescriptor(proto, property);

                if (!originalDescriptor) {
                    // try to get descriptor from originalPrototypes
                    const originalProto = originalPrototypes[name];

                    if (originalProto) {
                        originalDescriptor = Object.getOwnPropertyDescriptor(originalProto, property);
                    }
                }

                if (originalDescriptor) {
                    // don't override descriptor
                    descriptor = Object.assign({}, descriptor);
                    if (!descriptor.set && originalDescriptor.set) {
                        descriptor.set = originalDescriptor.set;
                    }
                    if (!descriptor.get && originalDescriptor.get) {
                        descriptor.get = originalDescriptor.get;
                    }
                }
                Object.defineProperty(proto, property, descriptor);
            }
        }
    }

    protected loadConfig() {
        const names = [
            'config',
            `config.${this.serverEnv}`,
        ];
        const target = {};

        for (const name of names) {

            const filePaths = this.getExtendFilePaths(name, 'config');

            for (let filepath of filePaths) {

                filepath = resolveModule(filepath);
                if (!filepath) continue;

                const config = loadFile(filepath, this.appInfo);

                if (!config) continue;

                extend(true, target, config);

            }

        }

        this.config = target;

    }

    protected loadPlugin() {

        const filePaths = this.getExtendFilePaths('plugin', 'plugin');

        const plugins = {};

        for (let filepath of filePaths) {

            filepath = resolveModule(filepath);
            if (!filepath) continue;

            const plugin = requireFile(filepath);

            if (!plugin) continue;

            extend(true, plugins, plugin);
        }

        this.plugins = plugins;

    }

    protected loadRouter() {
        const filePath = resolveModule(join(this.options.baseDir, 'app/router'));

        requireFile(filePath)(this.app);
    }

    protected loadMiddleware() {
        const app = this.app;

        const target = app.middlewares = {};
        const filePaths = this.getExtendFilePaths(null, 'middleware');

        for (const filepath of filePaths) {
            for (const file of fs.readdirSync(filepath)) {
                // new.js => new
                let properName = file.replace(/(\.js|\.ts)/, '');

                properName = camelcase(properName);

                target[properName] = requireFile(join(filepath, file));
            }
        }

        for (const name in app.middlewares) {
            Object.defineProperty(app.middleware, name, {
                get() {
                    return app.middleware[name];
                },
                enumerable: false,
                configurable: false,
            });
        }

        const middlewareNames = this.config.coreMiddleware.concat(this.config.appMiddleware || []);

        const middlewaresMap = new Map<string, boolean>();

        for (const name of middlewareNames) {

            if (!app.middlewares[name]) {
                throw new TypeError(`Middleware ${name} not found`);
            }

            if (middlewaresMap.has(name)) {
                throw new TypeError(`Middleware ${name} redefined`);
            }

            middlewaresMap.set(name, true);

            const options = this.config[name] || {};
            const mw = app.middlewares[name](options, app);

            if (is.object(mw)) {
                Object.keys(mw).filter(parser => !app.isMiddlewareApplied(parser)).forEach(parserKey => app.use(mw[parserKey]));
            } else {
                app.use(mw);
            }
        }

    }

    getExtendFilePaths(name: string, type = 'extend'): string[] {

        const allPath = [ this.options.baseDir, ...this.appPath ];

        switch (type) {
            case 'extend':
                return allPath.map(path => join(path, 'app/extend', name));
            case 'middleware':
                return allPath.map(path => join(path, 'app/middleware'));
            default:
                return allPath.map(path => join(path, 'config', name));
        }
    }

    getAppPath() {
        const proto = this.app;
        const appPath = [];
        const realpath = fs.realpathSync(proto[EXPRESS_PATH]);

        appPath.unshift(realpath);
        return appPath;
    }
    getServerEnv() {
        let serverEnv = this.options.env;

        if (!serverEnv) {
            serverEnv = process.env.EXPRESS_SERVER_ENV;
        }
        if (!serverEnv) {
            if (process.env.NODE_ENV === 'test') {
                serverEnv = 'unittest';
            } else if (process.env.NODE_ENV === 'production') {
                serverEnv = 'prod';
            } else {
                serverEnv = 'local';
            }
        } else {
            serverEnv = serverEnv.trim();
        }
        return serverEnv;
    }

}
