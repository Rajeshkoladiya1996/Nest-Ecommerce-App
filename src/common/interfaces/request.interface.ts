import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any; // Adjust type if you have a specific user type
}