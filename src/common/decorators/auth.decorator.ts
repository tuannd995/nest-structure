import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/utils/types';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from './role.decorator';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(UseGuards(JwtAuthGuard, RolesGuard), Roles(...roles));
};
