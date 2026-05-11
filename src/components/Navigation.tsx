import { Link, useLocation } from 'react-router-dom'
import { Bot, Archive, Home, Sparkles, RefreshCw } from 'lucide-react'
import { cn } from '../lib/utils'

interface NavigationProps {
  onGenerateNewsletter?: () => void
  isGenerating?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function Navigation({ onGenerateNewsletter, isGenerating, onRefresh, isRefreshing }: NavigationProps) {
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <header className="bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group transition-all duration-200">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight group-hover:text-muted-foreground transition-colors">
                CoachAI Daily Newsletter
              </h1>
              <p className="text-sm text-muted-foreground font-medium">AI insights for business building</p>
            </div>
          </Link>
          
          {/* Navigation and Actions */}
          <div className="flex items-center gap-1">
            {/* Navigation Links */}
            <nav className="flex items-center gap-1 mr-4">
              <Link
                to="/"
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative",
                  isActive('/') 
                    ? "bg-muted text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
                {isActive('/') && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
              
              <Link
                to="/archive"
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 relative",
                  isActive('/archive') 
                    ? "bg-muted text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Archive className="w-4 h-4" />
                <span>Archive</span>
                {isActive('/archive') && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 pl-4 border-l border-border">
              {/* Refresh Button */}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing || isGenerating}
                  className="inline-flex items-center gap-2 px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                  title="Refresh newsletters"
                >
                  <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
              
              {/* Generate Button */}
              {onGenerateNewsletter && (
                <button
                  onClick={onGenerateNewsletter}
                  disabled={isGenerating || isRefreshing}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm",
                    "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-md",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">Gen...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Generate Now</span>
                      <span className="sm:hidden">Generate</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}