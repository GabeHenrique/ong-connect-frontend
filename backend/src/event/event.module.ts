import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { EventController } from "./event.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { S3Module } from "../s3/s3.module";

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
