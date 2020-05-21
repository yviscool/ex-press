import { join } from 'path';
import * as fs from 'fs';
import * as extend from 'extend2';
import * as is from 'is-type-of';
import { resolveModule, requireFile } from './utils';

const EXPRESS_PATH = Symbol.for('epxress#appPath');

const originalPrototypes = {
    request: require('express').request,
    response: require('express').response,
    application: require('express').application,
};

export class FileLoader {


    options;
    app;
    appInfo;
    config;
    appPath: string[];
    serverEnv: string;


    constructor(options) {
        this.options = options;
        this.app = options.app;
        this.options = options;
        this.appInfo = {
            name: 'ex-press',
            baseDir: this.options.baseDir,
        }

        this.appPath = this.getAppPath();
        this.serverEnv = this.getServerEnv();
    }

    load() {

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
        if (this.app && this.app.Helper) {
            this.loadExtend('helper', this.app.Helper.prototype);
        }
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
            `config.${this.serverEnv}`
        ]
        const config = {};
        for (let name of names) {

            let filePaths = this.getExtendFilePaths(name, 'config');

            for (let filepath of filePaths) {
                filepath = resolveModule(filepath);
                if (!filepath) {
                    continue;
                }
                let tempConfig = requireFile(filepath);
                if (!tempConfig) {
                    continue;
                }

                extend(true, config, tempConfig);

            }

        }

        this.config = config;

    }

    protected loadRouter() {
        const filePath = resolveModule(join(this.options.baseDir, 'app/router'));
        requireFile(filePath)(this.app);
    }

    protected loadMiddleware() {
        const app = this.app;
        const target = app['middlewares'] = {};
        const filePaths = this.getExtendFilePaths(null, 'middleware');

        for (let filepath of filePaths) {
            for (const file of fs.readdirSync(filepath)) {
                // new.js => new
                const properName = file.replace(/(\.js|\.ts)/, '');
                target[properName] = requireFile(join(filepath, file));
            }
            for (const name in target) {
                const options = this.config[name] || {};
                const mw = app.middlewares[name](options, app);
                if (is.object(mw)) {
                    Object.keys(mw)
                        .filter(parser => !this.app.isMiddlewareApplied(parser))
                        .forEach(parserKey => (this as any).use(mw[parserKey]));
                } else {
                    if (this.config.cors.enable === false) {
                        continue;
                    }
                    app.use(mw);
                }
            }
        }
    }

    getExtendFilePaths(name: string, type = 'extend'): string[] {
        const allPath = [this.options.baseDir, ...this.appPath];
        if (type === 'extend') {
            return allPath.map(path => join(path, 'app/extend', name))
        } else if (type === 'config') {
            return allPath.map(path => join(path, 'config', name))
        } else if (type === 'middleware') {
            return allPath.map(path => join(path, 'app/middleware'))
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

    get [EXPRESS_PATH]() {
        return join(__dirname, '..');
    }

}