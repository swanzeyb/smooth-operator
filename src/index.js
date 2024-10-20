import OpenAI from 'openai'
const openai = new OpenAI()

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

await (async () => {
  console.info('--- Bot is now starting ---')

  // Read the config
  const file = Bun.file('src/config.json')
  const config = await file.json()

  // Get the assistant
  const assistant = await getAssistant({ assistantId: config.assistantId })
  console.log(`Assistant ID: ${assistant.id}`)

  // Save the assistant ID
  if (!config.assistantId) {
    config.assistantId = assistant.id

    await Bun.write(file, JSON.stringify(config, null, 2))
  }

  // Get the thread
  const thread = await getThread({ threadId: config.threadId })
  console.log(`Thread ID: ${thread.id}`)

  // Save the thread ID
  if (!config.threadId) {
    config.threadId = thread.id

    await Bun.write(file, JSON.stringify(config, null, 2))
  }

  console.info('--- Bot is now ready ---')
})()
