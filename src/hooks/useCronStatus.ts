import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export type CronStatus = {
  latest_success: {
    executed_at: string
    duration_ms: number
    newsletter_id?: string
    articles_processed?: number
  } | null
  latest_run: {
    executed_at: string
    status: string
    duration_ms: number
    error_message?: string
  } | null
  next_scheduled_run: string
  system_health: {
    status: 'healthy' | 'degraded' | 'unhealthy' | 'overdue'
    successful_runs_24h: number
    failed_runs_24h: number
    is_overdue: boolean
  }
  automation_schedule: {
    frequency: string
    times: string[]
    timezone: string
  }
}

export function useCronStatus() {
  const [cronStatus, setCronStatus] = useState<CronStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCronStatus()
    
    // Refresh status every 5 minutes
    const interval = setInterval(fetchCronStatus, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  async function fetchCronStatus() {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.functions.invoke('get-cron-status', {
        method: 'GET'
      })

      if (error) {
        throw error
      }

      setCronStatus(data.data)
    } catch (err: any) {
      console.error('Error fetching cron status:', err)
      setError(err.message || 'Failed to fetch cron status')
    } finally {
      setLoading(false)
    }
  }

  return {
    cronStatus,
    loading,
    error,
    refetch: fetchCronStatus
  }
}