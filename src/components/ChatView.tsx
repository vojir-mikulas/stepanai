import { useEffect, useRef, useState } from "react"
import { ArrowUp } from "lucide-react"
import type { Conversation } from "@/types"
import { generateNoNic, maybeAiReaction } from "@/lib/nonic"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message } from "@/components/Message"

export function ChatView({
  conversation,
  onUserMessage,
  onAiMessage,
  onAiReact,
  onToggleReaction,
}: {
  conversation: Conversation
  onUserMessage: (text: string) => string
  onAiMessage: (text: string) => string
  onAiReact: (messageId: string, emojis: string[]) => void
  onToggleReaction: (messageId: string, emoji: string) => void
}) {
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const [streamingId, setStreamingId] = useState<string | null>(null)
  const reactTargetRef = useRef<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const busy = thinking || streamingId !== null
  const empty = conversation.messages.length === 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation.messages.length, thinking, streamingId])

  function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput("")
    const userId = onUserMessage(text)
    setThinking(true)
    window.setTimeout(
      () => {
        const aiId = onAiMessage(generateNoNic())
        reactTargetRef.current = userId
        setThinking(false)
        setStreamingId(aiId)
      },
      500 + Math.random() * 900,
    )
  }

  function handleStreamDone() {
    setStreamingId(null)
    const emojis = maybeAiReaction()
    if (emojis && reactTargetRef.current) {
      // a beat of "thinking" before the cursed reaction lands
      const target = reactTargetRef.current
      window.setTimeout(() => onAiReact(target, emojis), 400)
    }
    reactTargetRef.current = null
  }

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-6">
          {empty ? (
            <div className="flex h-[60vh] flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-semibold tracking-tight">
                Ask stepesAI anything
              </h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Truly the most powerful model. It has exactly one thing to say.
              </p>
            </div>
          ) : (
            conversation.messages.map((m) => (
              <Message
                key={m.id}
                message={m}
                streaming={m.id === streamingId}
                onStreamDone={handleStreamDone}
                onToggleReaction={(emoji) => onToggleReaction(m.id, emoji)}
              />
            ))
          )}

          {thinking && (
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-muted px-4 py-3 w-fit">
              <Dot delay="0ms" />
              <Dot delay="150ms" />
              <Dot delay="300ms" />
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t bg-background/80 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-4">
          <div className="flex items-end gap-2 rounded-2xl border bg-card p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              placeholder="Message stepesAI…"
              rows={1}
              className="min-h-0 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button
              size="icon"
              className="size-9 shrink-0 rounded-xl"
              disabled={!input.trim() || busy}
              onClick={send}
              aria-label="Send"
            >
              <ArrowUp className="size-5" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            stepesAI can make mistakes. It cannot, however, change its mind.
          </p>
        </div>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-2 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  )
}
