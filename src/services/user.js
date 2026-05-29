import bcrypt from 'bcryptjs';
import * as userRepo from '../repositories/user.js';

export async function createUser({ username, email, password }) {
  if (!username || !password) {
    const e = new Error('username and password are required');
    e.status = 400;
    throw e;
  }
  if (password.length < 6) {
    const e = new Error('password must be at least 6 characters');
    e.status = 400;
    throw e;
  }

  const exists = await userRepo.findByUsername(username);
  if (exists) {
    const e = new Error('username already taken');
    e.status = 409;
    throw e;
  }

  const hash = await bcrypt.hash(password, 12);
  return userRepo.create({ username, email, password: hash });
}

export async function getByUsername(username) {
  const user = await userRepo.findByUsername(username);
  if (!user) {
    const e = new Error('user not found');
    e.status = 404;
    throw e;
  }
  return user;
}

export function getById(id) {
  return userRepo.findById(id);
}
