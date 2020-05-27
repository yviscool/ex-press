import express = require('express');
import mkdirp = require('mkdirp');
import is = require('is-type-of');

export default (options, app) => {

    let dirs = options.dir;

    if (!is.array(dirs)) dirs = [ dirs ];

    const staticRouter = express.Router(options);

    for (const dir of dirs) {
        if (is.string(dir)) {
            mkdirp.sync(options.dir);
            staticRouter.use(options.prefix, express.static(dir, options));
        }
    }

    return staticRouter;
};
