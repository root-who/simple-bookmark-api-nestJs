import { Controller, Get, Post, UseGuards, Body } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorators";
import { JwtGuard } from "src/auth/guard/jwt.guard";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @Get("user")
  getMe(@GetUser() user: User) {
    return user;
  }

  @Post("edit")
  updateUser(@GetUser("id") userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
