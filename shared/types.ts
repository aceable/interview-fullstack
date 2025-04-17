/**
 * Shared types for the interview app
 */

/**
 * User roles in the application
 */
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * User interface representing a user in the system
 */
export interface User {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}