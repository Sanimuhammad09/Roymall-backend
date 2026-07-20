declare const _default: () => {
    port: number;
    database: {
        url: string | undefined;
    };
    redis: {
        host: string;
        port: number;
    };
    jwt: {
        secret: string;
        refreshSecret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    stripe: {
        secretKey: string | undefined;
        webhookSecret: string | undefined;
    };
    cloudinary: {
        cloudName: string | undefined;
        apiKey: string | undefined;
        apiSecret: string | undefined;
    };
    mail: {
        host: string | undefined;
        port: number;
        user: string | undefined;
        pass: string | undefined;
        from: string;
    };
};
export default _default;
