import type { Conversation } from "@/types"

const KEY = "stepesai:conversations"

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Conversation[]
  } catch {
    return []
  }
}

export function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(conversations))
  } catch {
    // out of space / private mode — nothing we can do, stay quiet
  }
}
