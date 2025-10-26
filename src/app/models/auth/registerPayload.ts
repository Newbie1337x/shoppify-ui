import { User } from './user';
import { Credentials } from './credentials';

export interface RegisterPayload {
  user: User;
  credentials: Credentials;
}
