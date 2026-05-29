import { SlashCommandBuilder } from 'discord.js';
import { createService } from '../../services/service.js';
import { getByUsername } from '../../services/user.js';

export const data = new SlashCommandBuilder()
  .setName('ppcreateservice')
  .setDescription('Create a service for a user')
  .addStringOption((o) => o.setName('username').setDescription('Owner username').setRequired(true))
  .addStringOption((o) => o.setName('name').setDescription('Service name').setRequired(true))
  .addStringOption((o) => o.setName('description').setDescription('Description').setRequired(false))
  .addNumberOption((o) => o.setName('price').setDescription('Price').setRequired(false));

export async function execute(interaction) {
  const username = interaction.options.getString('username');
  const name = interaction.options.getString('name');
  const description = interaction.options.getString('description');
  const price = interaction.options.getNumber('price');

  await interaction.deferReply({ ephemeral: true });

  try {
    const owner = await getByUsername(username);
    const svc = await createService({ name, description, price, userId: owner.id });
    await interaction.editReply(`Service **${svc.name}** created for ${owner.username}`);
  } catch (err) {
    await interaction.editReply(`Failed: ${err.message}`);
  }
}
