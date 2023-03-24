import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    delete user.hash;
    return user;
  }

  async editUser(userId: number, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });
      delete user.hash;
      return user;
    } catch (error) {
      return error;
    }
  }
}
