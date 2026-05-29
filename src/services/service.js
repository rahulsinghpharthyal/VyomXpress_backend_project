import * as serviceRepo from '../repositories/service.js';
import * as userRepo from '../repositories/user.js';

export async function createService({ name, description, price, userId }) {
  if (!name) {
    const e = new Error('service name is required');
    e.status = 400;
    throw e;
  }

  const owner = await userRepo.findById(userId);
  if (!owner) {
    const e = new Error('owner user not found');
    e.status = 404;
    throw e;
  }

  return serviceRepo.create({ name, description, price, userId });
}

export function listByUser(userId) {
  return serviceRepo.findByUserId(userId);
}
