import {
    CacheInterceptor,
    CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RateLimiterGuard, RateLimiterModule } from "nestjs-rate-limiter";
import { HttpLoggerMiddleWare } from "./middlewares/http-logger.middleware";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { rateLimiterOptions } from "./config/rate-limiter";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { mailerAsyncOptions } from "./config/mailer";
import { RegisterModule } from "./register/register.module";
import { LoginModule } from "./login/login.module";
import { ChangePasswordModule } from "./change-password/change-password.module";
import { ForgotPasswordModule } from "./forgot-password/forgot-password.module";
import { UsersModule } from "./users/users.module";
import { typeOrmDevOptions, typeOrmProdOptions } from "./config/typeorm";

const typeOrmOptions: TypeOrmModuleOptions =
    process.env.NODE_ENV === "production"
        ? typeOrmProdOptions
        : typeOrmDevOptions;

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RateLimiterModule.register(rateLimiterOptions),
        TypeOrmModule.forRoot(typeOrmOptions),
        MailerModule.forRootAsync(mailerAsyncOptions),
        CacheModule.register({ isGlobal: true }),
        RegisterModule,
        UsersModule,
        LoginModule,
        ChangePasswordModule,
        ForgotPasswordModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: RateLimiterGuard,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleWare).forRoutes("*");
    }
}
