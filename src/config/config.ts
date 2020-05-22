export default appInfo => {
    const config = {} as any;

    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1584499722749_5896';

    // add your egg config in here
    config.coreMiddleware = [
        'bodyParser',
    ];

    config.cors = {
    };

    config.static = {
        dir: '/public',
    };

    // the return config will combines to EggAppConfig
    return {
        ...config,
    };
};
