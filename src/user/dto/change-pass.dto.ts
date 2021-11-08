import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @MinLength(6)
  confirmPass: string;
  @IsString()
  @MinLength(6)
  currentPass: string;
}
