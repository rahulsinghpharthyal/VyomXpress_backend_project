import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getByUsername } from '../../services/user.js';
import { listByUser } from '../../services/service.js';

export const data = new SlashCommandBuilder()
  .setName('ppgetuser')
  .setDescription('Get a user by username')
  .addStringOption((o) => o.setName('username').setDescription('Username').setRequired(true));

export async function execute(interaction) {
  const username = interaction.options.getString('username');

  await interaction.deferReply({ ephemeral: true });

  try {
    const user = await getByUsername(username);
    const services = await listByUser(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`User: ${user.username}`)
      .addFields(
        { name: 'ID', value: String(user.id), inline: true },
        { name: 'Email', value: user.email || '—', inline: true },
        { name: 'Services', value: String(services.length), inline: true },
      )
      .setTimestamp(user.createdAt);

    await interaction.editReply({ embeds: [embed] });
  } catch (err) {
    await interaction.editReply(`Failed: ${err.message}`);
  }
}
