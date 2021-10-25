import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from './../../utils/types';
export class CreateUserDto {
  @IsOptional()
  @IsNumber()
  id: number;

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

  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsString()
  avatar: string;
  @IsDate()
  updatedAt: Date;
}
