import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { User } from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Req() req) {
    return this.authService.login(req.user as User);
  }

  @Post("register")
  async register(
    @Body()
    registerDto: {
      email: string;
      password: string;
      name: string;
      role: "ONG" | "VOLUNTEER";
    },
  ) {
    return this.authService.register(registerDto);
  }

  @Post("signout")
  @HttpCode(200)
  signout() {
    return { message: "Logged out successfully" };
  }
}
