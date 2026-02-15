export interface Bookmark {
  id: string
  user_id: string
  url: string
  title: string
  description: string
  tags: string[]
  category: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
}
