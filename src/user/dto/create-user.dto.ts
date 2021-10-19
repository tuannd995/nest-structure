import { Role } from './../../utils/types';
import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
} from 'class-validator';
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(20)
  lastName: string;

  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  @IsEnum(Role)
  role: Role;

  @IsInt()
  status: number;

  @IsOptional()
  avatar: string | any;
  @IsDate()
  updatedAt: Date;
}
