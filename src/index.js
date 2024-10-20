import { ChatReader, ChatWriter } from './chat.js'
import { AssistantReader, AssistantWriter } from './assistant.js'

await (async () => {
  console.info('--- Bot is now starting ---')

  // Start the chat reader and writer
  await ChatReader.ready
  await ChatWriter.ready

  // Start the assistant reader and writer
  await AssistantReader.ready
  await AssistantWriter.ready

  // Pipe the chat reader to the assistant writer
  ChatReader.pipeTo(AssistantWriter)
  AssistantReader.pipeTo(ChatWriter)
})()
