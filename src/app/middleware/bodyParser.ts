import * as bodyParser from 'body-parser';
export default () => {
    const parserMiddleware = {
        jsonParser: bodyParser.json(),
        urlencodedParser: bodyParser.urlencoded({ extended: true }),
    };

    return parserMiddleware;
};
