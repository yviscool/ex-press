import * as express from 'express';
import * as mkdirp from 'mkdirp';
import * as is from 'is-type-of';

export default (options, app) => {

    let dirs = options.dir;

    if (!is.array(dirs)) dirs = [ dirs ];

    const staticApp = express();

    for (const dir of dirs) {
        if (is.string(dir)) {
            mkdirp.sync(options.dir);
            staticApp.use(options.prefix, express.static(dir, options));
        }
    }

    return staticApp;
};
