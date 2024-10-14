import { User } from "../../types/entities";

export interface UserDao {
  createUser(user: User): Promise<void>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateCurrentUser(user: Partial<User>): Promise<void>;
}
