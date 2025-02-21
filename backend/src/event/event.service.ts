import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Event, Prisma } from "@prisma/client";
import { S3Service } from "../s3/s3.service";

@Injectable()
export class EventService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service
  ) {}

  async findAll(limit?: string, search?: string): Promise<Event[]> {
    const take = limit ? parseInt(limit) : undefined;
    const searchLower = search?.toLowerCase() || "";

    return this.prisma.event.findMany({
      take,
      where: {
        OR: [
          { name: { contains: searchLower } },
          { description: { contains: searchLower } },
          { location: { contains: searchLower } },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        volunteers: {
          select: {
            email: true,
          },
        },
        causas: {
          select: {
            nome: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  }

  async findOne(id: number): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        volunteers: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async create(
    data: Omit<Prisma.EventCreateInput, "image">,
    file?: Express.Multer.File
  ) {
    let imageUrl: string | undefined;

    if (!file) {
      throw new Error("Imagem é obrigatória");
    }

    try {
      imageUrl = await this.s3Service.uploadFile(file);

      return this.prisma.event.create({
        data: {
          ...data,
          vagas:
            typeof data.vagas === "string" ? parseInt(data.vagas) : data.vagas,
          image: imageUrl,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          volunteers: {
            select: {
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo:", error);
      throw new Error("Erro ao processar imagem do evento");
    }
  }

  async update(
    id: number,
    data: Partial<Omit<Event, "id" | "createdAt" | "updatedAt">>,
    file?: Express.Multer.File
  ) {
    let updateData: Partial<Event> = {
      ...data,
      vagas: typeof data.vagas === "string" ? parseInt(data.vagas) : data.vagas,
    };

    if (file) {
      const currentEvent = await this.prisma.event.findUnique({
        where: { id },
        select: { image: true },
      });

      if (currentEvent) {
        if (currentEvent.image) {
          await this.s3Service.deleteFile(currentEvent.image);
        }
        updateData.image = await this.s3Service.uploadFile(file);
      }
    }

    return this.prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        volunteers: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: {
        image: true,
      },
    });

    if (event?.image) {
      await this.s3Service.deleteFile(event.image);
    }

    // Usar transaction para garantir que todas as operações sejam executadas ou nenhuma
    return this.prisma.$transaction(async (prisma) => {
      // Primeiro, remove todas as applications
      await prisma.volunteerApplication.deleteMany({
        where: { eventId: id },
      });

      // Depois, remove o evento (que automaticamente desconecta os voluntários)
      return prisma.event.delete({
        where: { id },
      });
    });
  }

  async toggleAttendance(eventId: number, userEmail: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        volunteers: true,
      },
    });

    if (!event) throw new Error("Evento não encontrado");

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) throw new Error("Usuário não encontrado");

    const isAttending = event.volunteers.some((v) => v.email === userEmail);

    if (isAttending) {
      // Se está inscrito, remove tanto a relação quanto a application
      await this.prisma.$transaction([
        // Remove a application
        this.prisma.volunteerApplication.deleteMany({
          where: {
            eventId: eventId,
            userId: user.id,
          },
        }),
        // Remove o voluntário
        this.prisma.event.update({
          where: { id: eventId },
          data: {
            volunteers: {
              disconnect: { email: userEmail },
            },
          },
        }),
      ]);
    } else {
      // Se não está inscrito, apenas adiciona como voluntário
      // (a application será criada pelo método applyForEvent)
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          volunteers: {
            connect: { email: userEmail },
          },
        },
      });
    }

    // Retorna o evento atualizado com todas as informações
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        volunteers: {
          select: {
            email: true,
            name: true,
          },
        },
        applications: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getEventsByUser(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user?.role === "ONG") {
      return this.prisma.event.findMany({
        where: {
          creatorId: user.id,
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          volunteers: {
            select: {
              email: true,
            },
          },
        },
      });
    }
    return this.prisma.event.findMany({
      where: {
        volunteers: {
          some: {
            email,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        volunteers: {
          select: {
            email: true,
          },
        },
      },
    });
  }

  async applyForEvent(
    eventId: number,
    applicationData: {
      email: string;
      name: string;
      phone: string;
      qualifications: string;
      observations: string;
    }
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new Error("Evento não encontrado");

    const user = await this.prisma.user.findUnique({
      where: { email: applicationData.email },
    });

    if (!user) throw new Error("Usuário não encontrado");

    // Criar a inscrição e conectar o usuário como voluntário
    await this.prisma.$transaction([
      // Criar/atualizar a application
      this.prisma.volunteerApplication.upsert({
        where: {
          eventId_userId: {
            eventId: eventId,
            userId: user.id,
          },
        },
        create: {
          phone: applicationData.phone,
          qualifications: applicationData.qualifications,
          observations: applicationData.observations || "",
          event: { connect: { id: eventId } },
          user: { connect: { id: user.id } },
        },
        update: {
          phone: applicationData.phone,
          qualifications: applicationData.qualifications,
          observations: applicationData.observations || "",
        },
      }),
      // Conectar o usuário como voluntário
      this.prisma.event.update({
        where: { id: eventId },
        data: {
          volunteers: {
            connect: { id: user.id },
          },
        },
      }),
    ]);

    // Retornar o evento atualizado com todas as informações
    return this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        volunteers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        applications: {
          include: {
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
