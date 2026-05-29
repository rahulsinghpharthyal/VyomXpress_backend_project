import bcrypt from 'bcryptjs';
import * as userRepo from '../repositories/user.js';
import * as userService from './user.js';
import { signToken } from '../utils/token.js';

export async function signup(data) {
  const user = await userService.createUser(data);
  const token = signToken(user);
  return { user, token };
}

export async function login({ username, password }) {
  if (!username || !password) {
    const e = new Error('username and password are required');
    e.status = 400;
    throw e;
  }

  const user = await userRepo.findByUsername(username, { withPassword: true });
  if (!user) {
    const e = new Error('invalid credentials');
    e.status = 401;
    throw e;
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const e = new Error('invalid credentials');
    e.status = 401;
    throw e;
  }

  const token = signToken(user);
  const { password: _omit, ...safe } = user.toJSON();
  return { user: safe, token };
}
