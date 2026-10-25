import { UserRole } from './enums';

/**
 * What every module may rely on after JwtAuthGuard ran: `request.user` has at least these two fields.
 * (The user-mgmt module may attach the whole User entity, which satisfies this type.)
 */
export interface AuthenticatedUser {
  id: string; // uuid
  role: UserRole;
}
