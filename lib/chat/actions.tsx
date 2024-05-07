import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showStockPurchase',
          content: JSON.stringify({
            symbol,
            price,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${amount * price
            }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}
import { CohereClient } from "cohere-ai";
async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  const cohere = new CohereClient({
    token: "OnUumoosME9Y9pZO99rkRgQSKir9QylPor1bhkjg",
  });
  const config = {
    message: content,
    chat_history: [],
    temperature: 0.3,
    model: "command-r",
    stream: true,
    connectors: [
      {
        "id": "web-search",
        "options": {
          "site": "https://www.ncbi.nlm.nih.gov/pmc/"
        }
      }
    ],
    prompt_truncation: "AUTO"
  };
  try {
    const chat = await cohere.chat(config);

    console.log(chat.documents);

    const documents = chat.documents;
    const documentUrls = documents ? Object.values(documents).map(doc => doc.url + "\n") : [];// Extract keys from the JSON object

    // Output the document IDs
    console.log(documentUrls);
    const botMessageContent = chat.text + "\n" + "Sources: " + documentUrls;





    // Add documents from chat response to AI state
    // Object.keys(chat.documents).forEach(url => {
    //   aiState.update({
    //     ...aiState.get(),
    //     messages: [
    //       ...aiState.get().messages,
    //       {
    //         id: nanoid(),
    //         role: 'data',
    //         content: chat.documents[url]
    //       }
    //     ]
    //   });
    // });

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'assistant',
          content: botMessageContent
        }
      ]
    });

    return {
      id: nanoid(),
      display: <BotMessage content={botMessageContent} />
    };
  } catch (error) {
    console.error('Error submitting user message:', error);

    // Return an error message to display in the UI
    return {
      id: nanoid(),
      display: <SystemMessage>Error processing user message. Please try again later.</SystemMessage>
    };
  }
}

// async function submitUserMessage(content: string) {
//   'use server'

//   const aiState = getMutableAIState<typeof AI>()

//   aiState.update({
//     ...aiState.get(),
//     messages: [
//       ...aiState.get().messages,
//       {
//         id: nanoid(),
//         role: 'user',
//         content
//       }
//     ]
//   })
//   const cohere = new CohereClient({
//     token: "OnUumoosME9Y9pZO99rkRgQSKir9QylPor1bhkjg",
//   });

//   (async () => {
//     const chat = await cohere.chat({
//       model: "command",
//       message: "Tell me a story in 5 parts!",
//     });
//     const botMessageContent = chat.text;

//     console.log(chat);
//     aiState.done({
//       ...aiState.get(),
//       messages: [
//         ...aiState.get().messages,
//         {
//           id: nanoid(),
//           role: 'assistant',
//           content: botMessageContent
//         }
//       ]
//     });
//     return {
//       id: nanoid(),
//       display: <BotMessage content={botMessageContent} />
//     };
//   })();
//   // try {
//   // const response = await fetch('https://api.cohere.ai/v1/generate', {
//   //   method: 'POST',
//   //   headers: {
//   //     'Content-Type': 'application/json',
//   //     'Authorization': 'Bearer OnUumoosME9Y9pZO99rkRgQSKir9QylPor1bhkjg',
//   //   },
//   //   body: JSON.stringify({
//   //     prompt: content,
//   //     model: 'command-nightly',
//   //     max_tokens: 300,
//   //     stop_sequences: [],
//   //     temperature: 0.9,
//   //     return_likelihoods: 'NONE',
//   //     // stream: true,
//   //     stream: true,
//   //     connector: [{
//   //       "id": "web-search",
//   //       "options": {
//   //         "site": "https://www.ncbi.nlm.nih.gov/pmc/"
//   //       }
//   //     }]

//   //   })
//   // });
//   // const response = 0;
//   // if (!response.ok) {
//   //   throw new Error(`Error ${response.status}: ${await response.text()}`);
//   // }
//   // if (response.ok) {
//   //   throw new Error(`Error bale bale${response.status}: ${await response.text()}`);
//   // }

//   // const responseText = await response.text();
//   // const responseBodyArray = responseText.trim().split('\n');

//   // let botMessageContent = '';

//   // for (const responseBody of responseBodyArray) {
//   //   const parsedResponse = JSON.parse(responseBody);
//   //   if (parsedResponse.text) {
//   //     botMessageContent += parsedResponse.text;
//   //   }
//   // }

//   // console.log(botMessageContent);
//   // const responseBody = await response.json();
//   // console.log(responseBody);
//   // const botMessageContent = responseBody.text;


//   // aiState.done({
//   //   ...aiState.get(),
//   //   messages: [
//   //     ...aiState.get().messages,
//   //     {
//   //       id: nanoid(),
//   //       role: 'assistant',
//   //       content: botMessageContent
//   //     }
//   //   ]
//   // });

//   return {
//     // id: nanoid(),
//     // display: <BotMessage content={botMessageContent} />
//   };
//   // } catch (error) {
//   //   console.error('Error submitting user message:', error);

//   //   // Return an error message to display in the UI
//   //   return {
//   //     id: nanoid(),
//   //     display: <SystemMessage>Error processing user message. Please try again later.</SystemMessage>
//   //   };
//   // }
// }


export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'listStocks' ? (
            <BotCard>
              <Stocks props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPrice' ? (
            <BotCard>
              <Stock props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPurchase' ? (
            <BotCard>
              <Purchase props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'getEvents' ? (
            <BotCard>
              <Events props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
