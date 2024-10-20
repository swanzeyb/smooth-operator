import { Client, GatewayIntentBits } from 'discord.js'
import { Duplex } from 'stream'

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
      console.info(`Reader logged in as ${client.user.tag}!`)

      // Fetch the user by their ID
      const user = await client.users.fetch(process.env.DISCORD_USER_ID)

      if (user) {
        user.send('Hello! This is a DM from your bot!')
      }
    })

    // Command to send a DM when triggered (for example: !dm)
    this.#client.on('messageCreate', async (message) => {
      // Enqueue message from user
      if (!message.author.bot) {
        controller.enqueue(message)
      }

      if (message.content === '!dm') {
        const user = message.author
        await user.send('Hey! I am sending you a DM!')
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
  start(controller) {}
}

export const Discord = new Duplex({
  reader: new DiscordReader(),
  writer: null,
})

// export class Discord extends Duplex {
//   #client

//   constructor() {
//     super()

//     // Create a new client instance
//     this.#client =

//     // Log in to Discord with your bot token
//     return this.#client.login(process.env.DISCORD_BOT_TOKEN)
//   }

//   // Readable Stream
//   // pull(controller)
//   // cancel(reason)

//   // Writeable Stream
//   // start(controller)
//   // write(chunk, controller)
//   // close(controller)
//   // abort(reason)
// }
