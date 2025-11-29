declare const _default: (() => {
    deepl: {
        apiKey: string | undefined;
    };
    mongodb: {
        uri: string;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    deepl: {
        apiKey: string | undefined;
    };
    mongodb: {
        uri: string;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
}>;
export default _default;
