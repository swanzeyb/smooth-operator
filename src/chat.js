import { Client, GatewayIntentBits } from 'discord.js'

class DiscordReader {
  #client

  start(controller) {
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
    this.#client.on('messageCreate', async (message) => {
      // Enqueue message from user
      if (!message.author.bot) {
        controller.enqueue(message)
      }
    })

    // Log in to Discord with your bot token
    return this.#client.login(process.env.DISCORD_BOT_TOKEN)
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
