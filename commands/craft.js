const crafts = require('../listCraft.js');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const craftCommand = new SlashCommandBuilder()
  .setName('craft')
  .setDescription('Permet de retourner tous se qu\'il faut pour crafter un item')
  .addStringOption((option) =>
    option
      .setName('item')
      .setDescription('Nom de l\'item à crafter')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('quantity')
      .setDescription('Quantité à crafter')
      .setRequired(false)
  );
  

for (const craft of crafts) {
  craftCommand.options[0].addChoices({
    name: craft.name, 
    value: craft._id});
}

exports.data = craftCommand;

  

exports.execute = async (interaction) => {
  const item = await interaction.options.getString('item');
  const quantity = await interaction.options.getInteger('quantity') || 1;
  if (quantity < 1) {
    await interaction.reply({ content: 'La quantité doit être supérieur à 0', ephemeral: true });
    return;
  }
  // eslint-disable-next-line no-undef
  const url = `${process.env.URL_BACK}objects/${item}?nb=${quantity}`;
  const response = await fetch(url);
  const data = await response.json();
  const objects = data.body;

  const name = objects.objectMainToCraft[0].name;
  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle(`Crafting ${quantity} ${name}`);

  if (objects.objectsToCraft.length > 0) {
    embed
      .addFields([
        { name: 'Ingrédients:', value: '```\n' + objects.objectsToCraft.map((object) => `${object.quantity} ${object.name}` + (object.cost ? ` pour ${object.cost} golds` : '')).join('\n') + '\n```' },
      ]);
  }
  embed
    .addFields([
      { name: 'Ressources à farmer:', value: '```\n' + objects.objectsToFarm.map((object) => `${object.quantity} ${object.name}` + (object.cost ? ` pour ${object.cost} golds` : '')).join('\n') + '\n```' },
    ])
    .setFooter({ text: `Coût total: ${objects.totalCost} golds` });

  await interaction.reply({ embeds: [embed.toJSON()] });
};
