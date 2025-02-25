import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { MailService } from "../mail/mail.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: "ONG" | "VOLUNTEER";
    confirmPassword?: string; // opcional agora
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Desconstrói apenas os campos necessários
    const { confirmPassword, ...userData } = data;

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    // Remove o password do retorno
    const { password, ...result } = user;
    return result;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const token = this.jwtService.sign(
      { email },
      { secret: process.env.JWT_RESET_SECRET, expiresIn: "1h" }
    );

    await this.prisma.user.update({
      where: { email },
      data: { resetPasswordToken: token },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await this.mailService.sendMail({
      to: email,
      subject: "Recuperação de Senha",
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Este link é válido por 1 hora.</p>
        <p>Se você não solicitou esta recuperação, ignore este email.</p>
      `,
    });

    return { message: "Email de recuperação enviado com sucesso" };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET,
      });

      const user = await this.prisma.user.findFirst({
        where: {
          email: payload.email,
          resetPasswordToken: token,
        },
      });

      if (!user) {
        throw new UnauthorizedException("Token inválido");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { email: payload.email },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
        },
      });

      return { message: "Senha alterada com sucesso" };
    } catch (error) {
      throw new UnauthorizedException("Token inválido ou expirado");
    }
  }
}
