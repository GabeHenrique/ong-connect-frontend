import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { EventService } from "./event.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Event } from "@prisma/client";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { VolunteerApplicationDto } from "./event.interface";

@Controller("events")
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findAll(@Query("limit") limit?: string, @Query("search") search?: string) {
    return this.eventService.findAll(limit, search || "");
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.eventService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ONG")
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @Request() req,
    @Body()
    createEventDto: {
      name: string;
      description: string;
      location: string;
      date: string;
      vagas: number;
    },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventService.create(
      {
        ...createEventDto,
        date: new Date(createEventDto.date),
        creator: {
          connect: {
            id: req.user.userId,
          },
        },
      },
      file,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ONG")
  @Put(":id")
  @UseInterceptors(FileInterceptor("image"))
  update(
    @Param("id") id: string,
    @Body() data: Partial<Event>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventService.update(+id, data, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ONG")
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.eventService.delete(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/toggle-attendance/:userMail")
  toggleAttendance(
    @Param("id") eventId: string,
    @Param("userMail") userMail: string,
  ) {
    return this.eventService.toggleAttendance(+eventId, userMail);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/apply")
  applyForEvent(
    @Param("id") eventId: string,
    @Body()
    applicationData: {
      email: string;
      name: string;
      phone: string;
      qualifications: string;
      observations: string;
    },
  ) {
    return this.eventService.applyForEvent(+eventId, applicationData);
  }

  @UseGuards(JwtAuthGuard)
  @Get("user/:email")
  getEventsByUser(@Param("email") email: string) {
    return this.eventService.getEventsByUser(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/applications")
  getApplications(@Param("id") id: string): Promise<VolunteerApplicationDto[]> {
    return this.eventService.findVolunteersFromEventId(+id);
  }
}
