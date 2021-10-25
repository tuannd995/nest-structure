import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/utils/types';
import { ROLES_KEY } from 'src/utils/constants';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
