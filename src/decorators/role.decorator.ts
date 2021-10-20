import { Role } from './../utils/types';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...role: Role[]) => SetMetadata('role', role);
