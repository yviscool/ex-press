import path = require('path');
export default appInfo => {
    const config = {} as any;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1584499722749_5896';

    // add your egg config in here
    config.coreMiddleware = [
        'bodyParser',
        'cors',
        'static',
        'session',
    ];

    config.cors = {

    };

    config.session = {
        secret: 'EXPRESS_SESS',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 3600 * 1000, // ms
            httpOnly: true,
        },
    };

    config.static = {
        prefix: '/public',
        dir: path.join(appInfo.baseDir, 'app/public'),
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
    };
};
