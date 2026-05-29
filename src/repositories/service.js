import { Service } from '../models/index.js';

export function create({ name, description, price, userId }) {
  return Service.create({ name, description, price, user_id: userId });
}

export function findByUserId(userId) {
  return Service.findAll({ where: { user_id: userId } });
}

export function findById(id) {
  return Service.findByPk(id);
}
