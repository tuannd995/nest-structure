import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ProjectStatus } from 'src/utils/types';

export class CreateProjectDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsString()
  @Min(3)
  @Max(255)
  name: string;

  @IsString()
  @Min(3)
  @Max(255)
  client: string;

  @IsInt()
  pmId: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDate()
  startDate: Date;

  @IsOptional()
  @IsDate()
  endDate: Date;

  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @IsOptional()
  @IsArray()
  memberIds: number[];

  @IsDate()
  updatedAt: Date;
}
