import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
      delete user.hash;
      //return the saved User
      return { user };
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
    const hash = await argon.verify(user.hash, authDto.password);
    if (!hash) {
      throw new ForbiddenException("Credentials incorrect");
    }
    delete user.hash;
    //send back the user
    return { user };
  }
}
