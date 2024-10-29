const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  // Check if the message is in the specified channel and not from the bot itself
  if (message.channel.id === config.channelId && !message.author.bot) {
    // Extract the number from the message
    const numberMatch = message.content.match(/^\d+$/);

    if (numberMatch) {
      const number = numberMatch[0];
      const userTag = message.author.tag; // Get user's tag (username#discriminator)
      const logChannel = await client.channels.fetch(config.logChannelId);

      try {
        // Change the user's nickname to "number | user tag"
        await message.member.setNickname(`${number} | ${userTag}`);
        console.log(`Nickname updated to: ${number} | ${userTag}`);

        // Send success log to the log channel
        if (logChannel) {
          logChannel.send(`✅ Nickname changed for **${userTag}** to \`${number} | ${userTag}\``);
        }

        // Delete the user's message
        await message.delete();
      } catch (error) {
        console.error(`Failed to update nickname or delete message: ${error}`);

        // Send error log to the log channel
        if (logChannel) {
          logChannel.send(`❌ Error changing nickname for **${userTag}**: ${error.message}`);
        }
      }
    }else{
      message.delete();
    }
  }
});

client.login(config.token);
