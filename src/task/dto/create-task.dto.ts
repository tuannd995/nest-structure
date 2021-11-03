import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class CreateTaskDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  notes: string;

  @IsInt()
  @Min(1)
  @Max(6)
  status: number;

  @IsInt()
  @Min(1)
  @Max(2)
  priority: number;

  @IsInt()
  sequence: number;

  @IsInt()
  requestById: number;

  @IsOptional()
  @IsInt()
  assignToId: number;

  @IsInt()
  projectId: number;

  @IsDate()
  dueDate: Date;

  @IsDate()
  updatedAt: Date;
}
