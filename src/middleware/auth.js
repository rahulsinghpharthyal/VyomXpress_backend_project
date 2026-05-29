import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export default function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = { id: payload.id, username: payload.username };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
