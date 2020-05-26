
export default {

    //   extend session

    set sessionStore(store) {
        if (!store) {
            this.config.session.store = undefined;
            return;
        }
        this.config.session.store = store;
    },

    get sessionStore() {
        return this.config.session.store;
    },

    //   extend session  end
};
