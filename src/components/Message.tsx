import { cn } from "@/lib/utils"
import type { Message as MessageType } from "@/types"
import { useStreaming } from "@/hooks/useStreaming"
import { ReactionPicker } from "@/components/ReactionPicker"

export function Message({
  message,
  streaming,
  onStreamDone,
  onToggleReaction,
}: {
  message: MessageType
  streaming: boolean
  onStreamDone: () => void
  onToggleReaction: (emoji: string) => void
}) {
  const isAi = message.role === "ai"
  const { shown, done } = useStreaming(message.text, streaming, onStreamDone)

  return (
    <div
      className={cn(
        "group flex w-full flex-col gap-1.5",
        isAi ? "items-start" : "items-end",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          isAi ? "flex-row" : "flex-row-reverse",
        )}
      >
        <div
          className={cn(
            "max-w-[min(75ch,80%)] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isAi
              ? "rounded-tl-sm bg-muted text-foreground"
              : "rounded-tr-sm bg-primary text-primary-foreground",
          )}
        >
          {shown}
          {streaming && !done && (
            <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-pulse bg-current align-middle" />
          )}
        </div>

        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <ReactionPicker onPick={onToggleReaction} />
        </div>
      </div>

      {message.reactions.length > 0 && (
        <div
          className={cn(
            "flex flex-wrap gap-1",
            isAi ? "justify-start" : "justify-end",
          )}
        >
          {message.reactions.map((r) => (
            <button
              key={r.emoji}
              onClick={() => onToggleReaction(r.emoji)}
              className={cn(
                "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                r.mine
                  ? "border-primary/40 bg-primary/10"
                  : "border-border bg-muted/60 hover:bg-muted",
              )}
            >
              <span className="text-sm leading-none">{r.emoji}</span>
              <span className="tabular-nums text-muted-foreground">
                {r.count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
