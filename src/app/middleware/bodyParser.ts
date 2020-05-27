import bodyParser = require('body-parser');
export default () => {
    const parserMiddleware = {
        jsonParser: bodyParser.json(),
        urlencodedParser: bodyParser.urlencoded({ extended: true }),
    };

    return parserMiddleware;
};
