import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}
