import * as authService from '../services/auth.js';

export async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body);
    return res.status(201).json({ message: 'signup successful', ...result });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.json({ message: 'login successful', ...result });
  } catch (err) {
    return next(err);
  }
}
