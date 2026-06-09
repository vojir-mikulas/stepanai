import { useState } from "react"
import { Moon, Plus, Sun, Trash2 } from "lucide-react"
import type { Conversation } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function Sidebar({
  conversations,
  activeId,
  theme,
  onNew,
  onSelect,
  onDelete,
  onToggleTheme,
}: {
  conversations: Conversation[]
  activeId: string | null
  theme: "light" | "dark"
  onNew: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onToggleTheme: () => void
}) {
  const [pendingDelete, setPendingDelete] = useState<Conversation | null>(null)

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2 px-1">
          <span className="font-semibold tracking-tight">stepesAI</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>
      </div>

      <div className="px-3 pb-2">
        <Button className="w-full justify-start gap-2" onClick={onNew}>
          <Plus className="size-4" />
          New chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-0.5 p-2">
          {conversations.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              No chats yet.
            </p>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "group flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors",
                  c.id === activeId
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50",
                )}
              >
                <button
                  className="flex-1 truncate text-left"
                  onClick={() => onSelect(c.id)}
                  title={c.title}
                >
                  {c.title}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                  onClick={() => setPendingDelete(c)}
                  aria-label="Delete chat"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be gone forever. Just like nic.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingDelete) onDelete(pendingDelete.id)
                setPendingDelete(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  )
}
