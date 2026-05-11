import { useState, useEffect } from 'react'
import { supabase, Newsletter } from '../lib/supabase'

export function useNewsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsletters()
  }, [])

  async function fetchNewsletters() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .eq('published', true)
        .order('newsletter_date', { ascending: false })
        .order('generated_at', { ascending: false })
        .limit(50) // Increased limit for archive

      if (error) {
        throw error
      }

      setNewsletters(data || [])
    } catch (err: any) {
      console.error('Error fetching newsletters:', err)
      setError(err.message || 'Failed to fetch newsletters')
    } finally {
      setLoading(false)
    }
  }

  async function generateNewsletter() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.functions.invoke('generate-newsletter', {
        body: {}
      })

      if (error) {
        throw error
      }

      // Refresh newsletters after generation
      await fetchNewsletters()
      return data
    } catch (err: any) {
      console.error('Error generating newsletter:', err)
      setError(err.message || 'Failed to generate newsletter')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    newsletters,
    loading,
    error,
    fetchNewsletters,
    generateNewsletter
  }
}