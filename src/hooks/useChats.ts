import { useCallback, useEffect, useState } from "react"
import type { Conversation, Message, Role } from "@/types"
import { loadConversations, saveConversations } from "@/lib/storage"

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function titleFrom(text: string): string {
  const t = text.trim().replace(/\s+/g, " ")
  if (!t) return "New chat"
  return t.length > 40 ? t.slice(0, 40) + "…" : t
}

export function useChats() {
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    loadConversations(),
  )
  const [activeId, setActiveId] = useState<string | null>(
    () => loadConversations()[0]?.id ?? null,
  )

  useEffect(() => {
    saveConversations(conversations)
  }, [conversations])

  const active = conversations.find((c) => c.id === activeId) ?? null

  const newChat = useCallback(() => {
    const convo: Conversation = {
      id: uid(),
      title: "New chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setConversations((prev) => [convo, ...prev])
    setActiveId(convo.id)
    return convo.id
  }, [])

  const deleteChat = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id)
        setActiveId((cur) => (cur === id ? next[0]?.id ?? null : cur))
        return next
      })
    },
    [],
  )

  const selectChat = useCallback((id: string) => setActiveId(id), [])

  /** Append a message to a conversation, returning its id. */
  const addMessage = useCallback(
    (convId: string, role: Role, text: string) => {
      const msg: Message = {
        id: uid(),
        role,
        text,
        reactions: [],
        createdAt: Date.now(),
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          const isFirstUser = role === "user" && c.messages.length === 0
          return {
            ...c,
            title: isFirstUser ? titleFrom(text) : c.title,
            messages: [...c.messages, msg],
            updatedAt: Date.now(),
          }
        }),
      )
      return msg.id
    },
    [],
  )

  /** Toggle the current user's reaction with `emoji` on a message. */
  const toggleReaction = useCallback(
    (convId: string, messageId: string, emoji: string) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id !== messageId) return m
              const existing = m.reactions.find((r) => r.emoji === emoji)
              let reactions
              if (!existing) {
                reactions = [...m.reactions, { emoji, count: 1, mine: true }]
              } else if (existing.mine) {
                reactions = m.reactions
                  .map((r) =>
                    r.emoji === emoji
                      ? { ...r, count: r.count - 1, mine: false }
                      : r,
                  )
                  .filter((r) => r.count > 0)
              } else {
                reactions = m.reactions.map((r) =>
                  r.emoji === emoji
                    ? { ...r, count: r.count + 1, mine: true }
                    : r,
                )
              }
              return { ...m, reactions }
            }),
          }
        }),
      )
    },
    [],
  )

  /** The "AI" reacts (does not count as the user's reaction). */
  const aiReact = useCallback(
    (convId: string, messageId: string, emojis: string[]) => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== convId) return c
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id !== messageId) return m
              let reactions = m.reactions
              for (const emoji of emojis) {
                const existing = reactions.find((r) => r.emoji === emoji)
                reactions = existing
                  ? reactions.map((r) =>
                      r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
                    )
                  : [...reactions, { emoji, count: 1, mine: false }]
              }
              return { ...m, reactions }
            }),
          }
        }),
      )
    },
    [],
  )

  return {
    conversations,
    activeId,
    active,
    newChat,
    deleteChat,
    selectChat,
    addMessage,
    toggleReaction,
    aiReact,
  }
}
