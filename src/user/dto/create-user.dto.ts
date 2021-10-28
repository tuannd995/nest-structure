import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
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

  @IsOptional()
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
  @Min(0)
  @Max(1)
  status: number;

  @IsOptional()
  @IsString()
  avatar: string;
  @IsDate()
  updatedAt: Date;
}
