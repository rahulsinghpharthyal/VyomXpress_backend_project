import { SlashCommandBuilder } from 'discord.js';
import { createUser } from '../../services/user.js';

export const data = new SlashCommandBuilder()
  .setName('ppcreateuser')
  .setDescription('Create a new user')
  .addStringOption((o) => o.setName('username').setDescription('Username').setRequired(true))
  .addStringOption((o) => o.setName('password').setDescription('Password').setRequired(true))
  .addStringOption((o) => o.setName('email').setDescription('Email').setRequired(false));

export async function execute(interaction) {
  const username = interaction.options.getString('username');
  const password = interaction.options.getString('password');
  const email = interaction.options.getString('email') || null;

  await interaction.deferReply({ ephemeral: true });

  try {
    const user = await createUser({ username, password, email });
    await interaction.editReply(`User created: **${user.username}** (id: ${user.id})`);
  } catch (err) {
    await interaction.editReply(`Failed: ${err.message}`);
  }
}
