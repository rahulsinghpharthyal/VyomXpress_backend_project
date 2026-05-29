// run once whenever you add/edit slash commands:
//   npm run bot:deploy
import { REST, Routes } from 'discord.js';
import env from '../config/env.js';
import { commands } from './index.js';

const body = [...commands.values()].map((c) => c.data.toJSON());

const rest = new REST({ version: '10' }).setToken(env.discord.token);

try {
  if (env.discord.guildId) {
    // guild-scoped commands appear instantly — good for dev
    await rest.put(Routes.applicationGuildCommands(env.discord.clientId, env.discord.guildId), { body });
    console.log(`registered ${body.length} commands to guild ${env.discord.guildId}`);
  } else {
    // global commands can take up to an hour to roll out
    await rest.put(Routes.applicationCommands(env.discord.clientId), { body });
    console.log(`registered ${body.length} global commands`);
  }
} catch (err) {
  console.error('failed to deploy commands:', err);
  process.exit(1);
}
