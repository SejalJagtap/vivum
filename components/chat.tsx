'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Marketing from '@/components/marketing'
import { useUIState, useAIState } from 'ai/rsc'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { usePathname } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { Message } from '@/lib/chat/actions'
import { Session } from '@/lib/types'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ id, session, missingKeys }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()
  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    if (session?.user && !path.includes('chat') && messages.length === 1) {
      window.history.replaceState({}, '', `/chat/${id}`)
    }
  }, [id, messages, path, session?.user])

  useEffect(() => {
    if (aiState.messages?.length === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  }, [id, setNewChatId])

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } = useScrollAnchor()

  return (
    <>
      {session ? (
        <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]" ref={scrollRef}>
          <div className="py-10" ref={messagesRef}>
            {messages.length ? (
              <ChatList messages={messages} isShared={false} session={session} />
            ) : (
              <EmptyScreen />
            )}
            <div className="h-px w-full" ref={visibilityRef} />
          </div>
          <ChatPanel id={id} input={input} setInput={setInput} isAtBottom={isAtBottom} scrollToBottom={scrollToBottom} />
        </div>
      ) : (
        <Marketing />
      )}
    </>
  )
}
