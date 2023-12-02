const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`); 
  if ('data' in command && 'execute' in command) {
    console.log(`Deploying command ${file}`);
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command ${file} is missing a required "data" or "execute" property.`);
  }
}

// eslint-disable-next-line no-undef
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    // eslint-disable-next-line no-undef
    const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, process.env.SERVERID), {
      body: commands,
    });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
