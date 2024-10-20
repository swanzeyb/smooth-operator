import { Client, GatewayIntentBits } from 'discord.js'

// async function getClient() {
//   if (global.client) {
//     return global.client
//   } else {

//   }
// }

class DiscordReader {
  #client

  async start(controller) {
    this.#client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
    })

    // When the bot is ready
    this.#client.once('ready', async () => {
      console.info(`Reader logged in as ${this.#client.user.tag}!`)
    })

    // Command to send a DM when triggered (for example: !dm)
    console.log(this.#client.on)
    this.#client.on('messageCreate', async (message) => {
      console.info('🥚: ', message.content)
      // Enqueue message from user
      if (!message.author.bot) {
        console.info('Enqueueing message from user: ', message.content)
        controller.enqueue(message)
      }
    })

    this.#client.on('ready', async () => {
      const x = await this.#client.users.fetch(process.env.DISCORD_USER_ID)
      // x.send('Hello! I am now online.')
    })

    // Log in to Discord with your bot token
    this.#client.login(process.env.DISCORD_BOT_TOKEN)
  }

  cancel(reason) {
    return this.#client.destroy()
  }
}

class DiscordWriter {
  #client
  #user

  async start(controller) {
    this.#client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
      ],
    })

    // When the bot is ready
    this.#client.once('ready', async () => {
      console.info(`Writer logged in as ${this.#client.user.tag}!`)
    })

    // Log in to Discord with your bot token
    await this.#client.login(process.env.DISCORD_BOT_TOKEN)

    // Store the user so we can DM them later.
    this.#user = await this.#client.users.fetch(process.env.DISCORD_USER_ID)
  }

  write(chunk, controller) {
    return this.#user.send(chunk)
  }

  close(controller) {
    return this.#client.destroy()
  }
}

const ChatReader = new ReadableStream(new DiscordReader())
const ChatWriter = new WritableStream(new DiscordWriter())

export { ChatReader, ChatWriter }
