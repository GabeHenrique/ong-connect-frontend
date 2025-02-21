import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { EventModule } from "./event/event.module";
import { RolesGuard } from "./auth/guards/roles.guard";
import { ConfigModule } from "@nestjs/config";
import { S3Module } from "./s3/s3.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    EventModule,
    S3Module,
  ],
  controllers: [],
  providers: [RolesGuard],
})
export class AppModule {}
