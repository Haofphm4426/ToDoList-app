import { WHITELIST_DOMAINS } from '*/utilities/constants';
import { env } from './environtment';

export const corsOptions = {
    origin: function (origin, callback) {
        // Hỗ trợ việc gọi API bằng POSTMAN trên môi trường dev
        console.log(origin)
        if (env.BUILD_MODE === 'dev') {
            return callback(null, true);
        }
        if (WHITELIST_DOMAINS.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`${origin} not allowed by CORS.`));
    },
    optionsSuccessStatus: 200,
    credentials: true, // CORS sẽ cho phép nhận cookies
};
