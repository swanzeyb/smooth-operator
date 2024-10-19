const { Client, GatewayIntentBits } = require('discord.js')

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// When the bot is ready
client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  // Fetch the user by their ID
  const user = await client.users.fetch(process.env.USER_ID)

  if (user) {
    user.send('Hello! This is a DM from your bot!')
  }
})

// Command to send a DM when triggered (for example: !dm)
client.on('messageCreate', async (message) => {
  if (message.content === '!dm') {
    const user = message.author
    await user.send('Hey! I am sending you a DM!')
  }
})

// Log in to Discord with your bot token
client.login(process.env.BOT_TOKEN)
