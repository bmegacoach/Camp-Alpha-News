import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Newsletter = {
  id: string
  title: string
  content: {
    title: string
    sections: {
      top_stories: NewsletterItem[]
      ai_tools: NewsletterItem[]
      research: NewsletterItem[]
      insights: NewsletterItem[]
    }
  }
  newsletter_date: string
  generated_at: string
  published: boolean
}

export type NewsletterItem = {
  title: string
  summary: string
  link: string
  source: string
  category?: string
}