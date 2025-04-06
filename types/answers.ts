// Shared types for the answers feature
export interface Citation {
  title: string
  url: string
  favicon: string
}

export interface SavedAnswer {
  id: string
  query: string
  answer: string
  citations?: Citation[] | null
  shared: boolean
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
}

export interface SaveAnswerInput {
  query: string
  answer: string
  citations?: Citation[] | null
  shared?: boolean
}

export interface AnswerResponse {
  answer: string
  citations?: Citation[]
  error?: string
}
