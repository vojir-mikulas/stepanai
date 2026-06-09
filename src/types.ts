export type Role = "user" | "ai"

export type Reaction = {
  emoji: string
  count: number
  /** whether the current user added this reaction */
  mine: boolean
}

export type Message = {
  id: string
  role: Role
  text: string
  reactions: Reaction[]
  createdAt: number
}

export type Conversation = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}
