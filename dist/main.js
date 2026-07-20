"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.use((0, helmet_1.default)());
        app.enableCors({
            origin: (origin, callback) => {
                const allowedOrigins = [
                    process.env.FRONTEND_URL,
                    'https://roymall-frontend.vercel.app',
                    'https://roymallscents.vercel.app',
                    'https://roymall-scents.vercel.app',
                ].filter(Boolean);
                if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin) || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(null, false);
                }
            },
            credentials: true,
        });
        app.setGlobalPrefix('api');
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }));
        app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
        app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Roymall Scents API')
            .setDescription('Premium Perfume Ecommerce Platform API')
            .setVersion('1.0')
            .addServer('https://roymall-backend-production.up.railway.app', 'Production Server')
            .addServer(`http://localhost:${process.env.PORT || 4000}`, 'Local Development Server')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        const port = parseInt(process.env.PORT || '4000', 10);
        await app.listen(port);
        console.log(`🚀 Roymall Scents API running on port ${port}`);
        console.log(`📄 Swagger docs at http://localhost:${port}/api/docs`);
    }
    catch (err) {
        console.error('❌ Error during application bootstrap:', err);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception thrown:', err);
});
bootstrap();
//# sourceMappingURL=main.js.map