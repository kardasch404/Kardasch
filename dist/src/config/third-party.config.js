"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('thirdParty', () => ({
    deepl: {
        apiKey: process.env.DEEPL_API_KEY,
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kardasch',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'secret',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
}));
//# sourceMappingURL=third-party.config.js.map