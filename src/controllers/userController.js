import * as userService from '../services/user.js';

export async function getOne(req, res, next) {
  try {
    const user = await userService.getByUsername(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await userService.getById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}
