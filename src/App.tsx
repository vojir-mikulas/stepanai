import { useChats } from "@/hooks/useChats";
import { useTheme } from "@/hooks/useTheme";
import { Sidebar } from "@/components/Sidebar";
import { ChatView } from "@/components/ChatView";
import { Button } from "@/components/ui/button";

export default function App() {
  const chats = useChats();
  const { theme, toggle } = useTheme();
  const { active } = chats;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <Sidebar
        conversations={chats.conversations}
        activeId={chats.activeId}
        theme={theme}
        onNew={chats.newChat}
        onSelect={chats.selectChat}
        onDelete={chats.deleteChat}
        onToggleTheme={toggle}
      />

      <main className="flex-1 overflow-hidden">
        {active ? (
          <ChatView
            key={active.id}
            conversation={active}
            onUserMessage={(text) => chats.addMessage(active.id, "user", text)}
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
      </main>
    </div>
  );
}
