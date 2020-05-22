// 这里是你自定义的中间件
export default () => {
    return async (req, res, next: () => void) => {
        await next();
    };
};

