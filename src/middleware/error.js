export function notFound(req, res) {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
}

export function errorHandler(err, req, res, next) {
  // sequelize validation errors come through with this name
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: err.errors?.[0]?.message || 'Validation error',
    });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}
