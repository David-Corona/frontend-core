export interface User {
  id: string;
  email: string;
  isVerified: boolean;
  isActive: boolean;
  roles: string[];
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
