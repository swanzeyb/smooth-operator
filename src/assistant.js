import OpenAI from 'openai'
const openai = new OpenAI()

const file = Bun.file('src/config.json')

function getConfig() {
  return file.json()
}

function setConfig(config) {
  return file.write(JSON.stringify(config, null, 2))
}

function getThread({ threadId }) {
  if (threadId) {
    return openai.beta.threads.retrieve(threadId)
  } else {
    return openai.beta.threads.create()
  }
}

function getAssistant({ assistantId }) {
  if (assistantId) {
    return openai.beta.assistants.retrieve(assistantId)
  } else {
    return openai.beta.assistants.create({
      name: 'Shower Thought Helper',
      instructions:
        'You are a personal assitant. Your job is to read my incoming messages and store them in Notion. You can also help me with my thoughts and ideas.',
      tools: [],
      model: 'gpt-4o-mini',
    })
  }
}

async function setupOpenAI() {
  const config = await getConfig()
  const assistant = await getAssistant({ assistantId: config.assistantId })

  // Update assistant ID if needed
  if (config.assistantId !== assistant.id) {
    config.assistantId = assistant.id
    await setConfig(config)
  }

  const thread = await getThread({ threadId: config.threadId })

  // Update thread ID if needed
  if (config.threadId !== thread.id) {
    config.threadId = thread.id
    await setConfig(config)
  }

  return { assistant, thread }
}

class ChatGPTReader {
  async start(controller) {
    const { assistant, thread } = await setupOpenAI()

    const config = await getConfig()

    // Get the last message cursor
    const threadMessages = await openai.beta.threads.messages.list(
      config.threadId
    )

    console.log(threadMessages.data)
  }
}

const SEND_DELAY = 1200 //ms

class ChatGPTWriter {
  #config
  #lastMsgAt = Date.now()

  async start(controller) {
    const { assistant, thread } = await setupOpenAI()

    this.#config = await getConfig()
  }

  async write(chunk) {
    await openai.beta.threads.messages.create(this.#config.threadId, {
      role: 'user',
      content: chunk.content,
    })

    // Store the last message time
    this.#lastMsgAt = Date.now()

    console.log('eggs', chunk)

    return new Promise((resolve) => {
      openai.beta.threads.runs
        .stream(this.#config.threadId, {
          assistant_id: this.#config.assistantId,
          // instructions: "Please address the user as Jane Doe. The user has a premium account."
        })
        .on('messageCreated', (message) => {
          console.log('sent')
          console.log(message)
          resolve()
        })
    })

    // Check if we need to send our messages
    // if (this.#lastMsgAt > Date.now() + SEND_DELAY) {
    //   console.log('Sending messages')

    // }
  }
}

const AssistantReader = new ReadableStream(new ChatGPTReader())
const AssistantWriter = new WritableStream(new ChatGPTWriter())

export { AssistantReader, AssistantWriter }
