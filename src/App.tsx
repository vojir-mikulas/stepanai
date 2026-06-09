import { useEffect, useState } from "react"
import { PanelLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChats } from "@/hooks/useChats"
import { useTheme } from "@/hooks/useTheme"
import { useIsMobile } from "@/hooks/useIsMobile"
import { Sidebar } from "@/components/Sidebar"
import { ChatView } from "@/components/ChatView"
import { Button } from "@/components/ui/button"

export default function App() {
  const chats = useChats()
  const { theme, toggle } = useTheme()
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(!isMobile)
  const { active } = chats

  // Collapse on mobile, expand on desktop when the breakpoint is crossed.
  useEffect(() => setOpen(!isMobile), [isMobile])

  const closeOnMobile = () => {
    if (isMobile) setOpen(false)
  }

  const sidebar = (
    <Sidebar
      conversations={chats.conversations}
      activeId={chats.activeId}
      theme={theme}
      onNew={() => {
        chats.newChat()
        closeOnMobile()
      }}
      onSelect={(id) => {
        chats.selectChat(id)
        closeOnMobile()
      }}
      onDelete={chats.deleteChat}
      onToggleTheme={toggle}
    />
  )

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {isMobile ? (
        <>
          {open && (
            <div
              className="fixed inset-0 z-40 bg-black/50 animate-in fade-in"
              onClick={() => setOpen(false)}
            />
          )}
          <div
            className={cn(
              "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
              open ? "translate-x-0" : "-translate-x-full",
            )}
          >
            {sidebar}
          </div>
        </>
      ) : (
        <div
          className={cn(
            "shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out",
            open ? "w-72" : "w-0",
          )}
        >
          {sidebar}
        </div>
      )}

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <PanelLeft className="size-4" />
          </Button>
          <span className="truncate text-sm font-medium">
            {active?.title ?? "stepesAI"}
          </span>
        </header>

        <div className="flex-1 overflow-hidden">
          {active ? (
            <ChatView
              key={active.id}
              conversation={active}
              onUserMessage={(text) =>
                chats.addMessage(active.id, "user", text)
              }
              onAiMessage={(text) => chats.addMessage(active.id, "ai", text)}
              onAiReact={(messageId, emojis) =>
                chats.aiReact(active.id, messageId, emojis)
              }
              onToggleReaction={(messageId, emoji) =>
                chats.toggleReaction(active.id, messageId, emoji)
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  stepesAI
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">ngr ngr ngr</p>
              </div>
              <Button onClick={chats.newChat}>New chat</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
