import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config/dist";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  async signup(authDto: AuthDto) {
    //generate the hash
    const hash = await argon.hash(authDto.password);
    //save the new User in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Credentials taken");
        }
      }
      console.log(error);
      throw error;
    }
  }

  async signin(authDto: AuthDto) {
    //find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    //if the user doesnt exist throw exception
    if (!user) {
      throw new ForbiddenException("Credentials incorrect");
    }
    //compare password
    //if the password is wrong throw exception
    const hashMatch = await argon.verify(user.hash, authDto.password);
    if (!hashMatch) {
      throw new ForbiddenException("Credentials incorrect");
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };
    const secret = this.config.get("JWT_SECRET");
    const token = await this.jwt.signAsync(payload, {
      expiresIn: "100m",
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
