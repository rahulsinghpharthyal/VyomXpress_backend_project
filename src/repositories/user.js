import { User } from '../models/index.js';

export function findByUsername(username, { withPassword = false } = {}) {
  const scope = withPassword ? User.scope('withPassword') : User;
  return scope.findOne({ where: { username } });
}

export function findById(id) {
  return User.findByPk(id);
}

export function create({ username, email, password }) {
  return User.create({ username, email, password });
}
