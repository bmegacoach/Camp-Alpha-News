import { useState } from 'react'
import { useNewsletters } from '../hooks/useNewsletters'
import { NewsletterCard } from '../components/NewsletterCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { Navigation } from '../components/Navigation'
import { SystemStatus } from '../components/SystemStatus'
import { Clock, Zap, TrendingUp, Calendar, CheckCircle } from 'lucide-react'

export function HomePage() {
  const { newsletters, loading, error, fetchNewsletters, generateNewsletter } = useNewsletters()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleGenerateNewsletter = async () => {
    try {
      setIsGenerating(true)
      await generateNewsletter()
    } catch (err) {
      console.error('Failed to generate newsletter:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      await fetchNewsletters()
    } catch (err) {
      console.error('Failed to refresh newsletters:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  const latestNewsletter = newsletters[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <Navigation 
        onGenerateNewsletter={handleGenerateNewsletter} 
        isGenerating={isGenerating}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-foreground mb-6 tracking-tight">
              AI Insights for Business Building
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              CoachAI Daily Newsletter delivers curated AI insights, research breakthroughs, 
              and tool discoveries. Generated twice daily to accelerate your business growth.
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-xl mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">Twice Daily</h3>
                <p className="text-muted-foreground text-sm">Fresh insights at 8 AM & 4 PM</p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-xl mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">AI Powered</h3>
                <p className="text-muted-foreground text-sm">Enhanced content with detailed analysis</p>
              </div>
              
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/20 rounded-xl mb-4 mx-auto">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">Premium Sources</h3>
                <p className="text-muted-foreground text-sm">TechCrunch, The Verge, ArXiv & more</p>
              </div>
            </div>
          </div>
        </section>

        {/* System Status Section */}
        <section className="mb-12">
          <SystemStatus />
        </section>

        {/* Latest Newsletter */}
        {loading && !latestNewsletter ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRefresh} />
        ) : !latestNewsletter ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">No Newsletters Yet</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Generate your first CoachAI newsletter with enhanced detailed summaries to get started.
              </p>
              <button
                onClick={handleGenerateNewsletter}
                disabled={isGenerating}
                className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                    Generating Enhanced Newsletter...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate First Newsletter
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Latest Newsletter</h2>
                <p className="text-muted-foreground">Enhanced with detailed insights and analysis</p>
              </div>
            </div>
            
            <NewsletterCard newsletter={latestNewsletter} isLatest={true} />
          </section>
        )}
      </main>

      {/* Enhanced Footer with System Status */}
      <footer className="border-t border-border mt-20 bg-card">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Main Footer Content */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground text-sm font-bold">AI</span>
              </div>
              <span className="text-lg font-bold text-foreground">CoachAI Daily Newsletter</span>
            </div>
            <p className="text-muted-foreground mb-2">Powered by MiniMax Agent</p>
            <p className="text-sm text-muted-foreground">Enhanced AI news aggregation for business building</p>
          </div>
          
          {/* Compact System Status */}
          <div className="border-t border-border pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SystemStatus compact={true} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}