import env from './config/env.js';
import app from './app.js';
import sequelize from './config/sequelize.js';
import { startBot } from './bot/index.js';

async function start() {
  try {
    await sequelize.authenticate();
    console.log('database connected');

    const server = app.listen(env.port, () => {
      console.log(`server listening on http://localhost:${env.port}`);
    });

    startBot().catch((err) => console.error('discord bot failed to start:', err.message));

    const shutdown = async () => {
      console.log('shutting down...');
      server.close();
      await sequelize.close();
      process.exit(0);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('failed to start:', err);
    process.exit(1);
  }
}

start();
