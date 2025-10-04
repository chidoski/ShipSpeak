import { User } from '../types/auth';

export class UserService {
  async findById(_id: string): Promise<User | null> {
    throw new Error('Not implemented yet - TDD implementation needed');
  }

  async findByEmail(_email: string): Promise<User | null> {
    throw new Error('Not implemented yet - TDD implementation needed');
  }

  async create(_userData: any): Promise<User> {
    throw new Error('Not implemented yet - TDD implementation needed');
  }

  async update(_id: string, _userData: any): Promise<User | null> {
    throw new Error('Not implemented yet - TDD implementation needed');
  }
}

export const userService = new UserService();