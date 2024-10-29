import discord
import json

# Load config
with open('config.json') as f:
    config = json.load(f)

intents = discord.Intents.default()
intents.message_content = True  # Needed to listen to message content
intents.guilds = True
intents.messages = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'Logged in as {client.user}')

@client.event
async def on_message(message):
    # Check if the message is in the specified channel and not from the bot itself
    if message.channel.id == int(config['channelId']) and not message.author.bot:
        # Extract the number from the message
        if message.content.isdigit():  # Checks if the message is only a number
            number = message.content
            user_tag = str(message.author)  # Get user's tag (username#discriminator)
            log_channel = client.get_channel(int(config['logChannelId']))

            try:
                # Change the user's nickname to "number | user tag"
                await message.author.edit(nick=f"{number} | {user_tag}")
                print(f"Nickname updated to: {number} | {user_tag}")

                # Send success log to the log channel
                if log_channel:
                    await log_channel.send(f"✅ Nickname changed for **{user_tag}** to `{number} | {user_tag}`")

                # Delete the user's message
                await message.delete()
            except Exception as error:
                print(f"Failed to update nickname or delete message: {error}")

                # Send error log to the log channel
                if log_channel:
                    await log_channel.send(f"❌ Error changing nickname for **{user_tag}**: {error}")
        else:
            # Delete the user's message if it doesn't contain only a number
            await message.delete()

client.run(config['token'])
