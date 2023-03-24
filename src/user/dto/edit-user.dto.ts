import { IsEmail, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  lastName?: string;
}
