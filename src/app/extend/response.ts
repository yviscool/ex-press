'use strict';
const rc = Symbol('Context#RequestContext');

import { MidwayRequestContainer } from 'midway-core';

export default {
    get requestContext() {
        if (!this[rc]) {
            this[rc] = new MidwayRequestContainer(this.app.applicationContext, this);
            this[rc].ready();
        }
        return this[rc];
    },
};
