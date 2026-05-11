import { useCronStatus } from '../hooks/useCronStatus'
import { Clock, CheckCircle, AlertCircle, XCircle, Activity, Calendar } from 'lucide-react'
import { cn } from '../lib/utils'

interface SystemStatusProps {
  compact?: boolean
}

export function SystemStatus({ compact = false }: SystemStatusProps) {
  const { cronStatus, loading, error } = useCronStatus()

  if (loading) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-muted-foreground",
        compact ? "text-sm" : "text-base"
      )}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span>Loading status...</span>
      </div>
    )
  }

  if (error || !cronStatus) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-muted-foreground",
        compact ? "text-sm" : "text-base"
      )}>
        <AlertCircle className="w-4 h-4 text-yellow-500" />
        <span>Status unavailable</span>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
      case 'overdue':
        return <Clock className="w-4 h-4 text-orange-400" />
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-400'
      case 'degraded':
        return 'text-yellow-400'
      case 'overdue':
        return 'text-orange-400'
      case 'unhealthy':
        return 'text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 24) {
      return `Today at ${formatTime(dateString)}`
    } else if (diffHours < 48) {
      return `Yesterday at ${formatTime(dateString)}`
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const getNextRunText = () => {
    const nextRun = new Date(cronStatus.next_scheduled_run)
    const now = new Date()
    const diffHours = (nextRun.getTime() - now.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 1) {
      const diffMinutes = Math.round(diffHours * 60)
      return `in ${diffMinutes} min`
    } else if (diffHours < 24) {
      return `in ${Math.round(diffHours)}h`
    } else {
      return formatTime(cronStatus.next_scheduled_run)
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {getStatusIcon(cronStatus.system_health.status)}
          <span className={getStatusColor(cronStatus.system_health.status)}>
            System {cronStatus.system_health.status}
          </span>
        </div>
        

        
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span>Next: {getNextRunText()}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Automation Status
        </h3>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(cronStatus.system_health.status)}
          <span className={cn("font-medium capitalize", getStatusColor(cronStatus.system_health.status))}>
            {cronStatus.system_health.status}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-muted-foreground mb-1">Next Scheduled Run</div>
          <div className="font-medium text-foreground">
            {getNextRunText()}
          </div>
          <div className="text-muted-foreground text-xs mt-1">
            Daily at 8:00 AM & 4:00 PM UTC
          </div>
        </div>
        
        <div>
          <div className="text-muted-foreground mb-1">24h Performance</div>
          <div className="font-medium text-foreground">
            {cronStatus.system_health.successful_runs_24h} successful
            {cronStatus.system_health.failed_runs_24h > 0 && (
              <span className="text-red-400">, {cronStatus.system_health.failed_runs_24h} failed</span>
            )}
          </div>
          <div className="text-muted-foreground text-xs mt-1">
            Reliability: {cronStatus.system_health.successful_runs_24h + cronStatus.system_health.failed_runs_24h > 0 
              ? Math.round((cronStatus.system_health.successful_runs_24h / (cronStatus.system_health.successful_runs_24h + cronStatus.system_health.failed_runs_24h)) * 100)
              : 0}%
          </div>
        </div>
      </div>
      
      {cronStatus.latest_run && cronStatus.latest_run.status === 'failed' && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-1">
            <XCircle className="w-4 h-4" />
            Latest Run Failed
          </div>
          <div className="text-red-400 text-xs">
            {formatDate(cronStatus.latest_run.executed_at)} • {cronStatus.latest_run.error_message}
          </div>
        </div>
      )}
    </div>
  )
}