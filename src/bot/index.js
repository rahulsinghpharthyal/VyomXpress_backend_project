import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import env from '../config/env.js';
import * as ppcreateuser from './commands/ppcreateuser.js';
import * as ppcreateservice from './commands/ppcreateservice.js';
import * as ppgetuser from './commands/ppgetuser.js';

const commands = new Collection();
[ppcreateuser, ppcreateservice, ppgetuser].forEach((cmd) => {
  commands.set(cmd.data.name, cmd);
});

export async function startBot() {
  if (!env.discord.token) {
    console.warn('DISCORD_BOT_TOKEN not set — skipping bot startup');
    return;
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once(Events.ClientReady, (c) => {
    console.log(`discord bot ready as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const cmd = commands.get(interaction.commandName);
    if (!cmd) return;

    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error('command error:', err);
      const msg = { content: 'Something went wrong.', ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  });

  await client.login(env.discord.token);
  return client;
}

export { commands };
