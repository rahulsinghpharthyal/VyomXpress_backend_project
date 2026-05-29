require('dotenv').config();

const common = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || null,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  define: { underscored: true },
};

module.exports = {
  development: common,
  test: { ...common, database: `${process.env.DB_NAME}_test` },
  production: { ...common, logging: false },
};
