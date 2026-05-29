import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}
