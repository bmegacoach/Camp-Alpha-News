import { useState } from 'react'
import { Newsletter as NewsletterType } from '../lib/supabase'
import { NewsletterSection } from './NewsletterSection'
import { Newspaper, Wrench, Microscope, Lightbulb, Calendar, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { cn } from '../lib/utils'

interface NewsletterCardProps {
  newsletter: NewsletterType
  isLatest?: boolean
  compact?: boolean
}

export function NewsletterCard({ newsletter, isLatest = false, compact = false }: NewsletterCardProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }



  const sections = [
    {
      key: 'top_stories',
      title: 'Top Stories',
      icon: <Newspaper className="w-5 h-5" />,
      items: newsletter.content.sections.top_stories,
      color: 'text-blue-600'
    },
    {
      key: 'ai_tools',
      title: 'New AI Tools',
      icon: <Wrench className="w-5 h-5" />,
      items: newsletter.content.sections.ai_tools,
      color: 'text-green-600'
    },
    {
      key: 'research',
      title: 'Cutting-Edge Research',
      icon: <Microscope className="w-5 h-5" />,
      items: newsletter.content.sections.research,
      color: 'text-purple-600'
    },
    {
      key: 'insights',
      title: 'Quick AI Insights',
      icon: <Lightbulb className="w-5 h-5" />,
      items: newsletter.content.sections.insights,
      color: 'text-orange-600'
    }
  ]

  if (compact) {
    return (
      <>
        <article className="group bg-card border border-border hover:border-border/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/10">
          <div className="p-6">
            <header className="mb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-muted-foreground transition-colors">
                    {newsletter.content.title}
                  </h2>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={newsletter.newsletter_date}>
                        {formatDate(newsletter.newsletter_date)}
                      </time>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(newsletter.generated_at)}</span>
                    </div>
                  </div>
                  
                  {isLatest && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 mb-3">
                      Latest Newsletter
                    </span>
                  )}
                </div>
              </div>
            </header>

            {/* Section Preview */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {sections.map((section) => {
                const itemCount = section.items?.length || 0
                return (
                  <div key={section.key} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className={cn("flex-shrink-0", section.color)}>
                      {section.icon}
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{section.title}</div>
                      <div className="text-xs text-muted-foreground">{itemCount} items</div>
                    </div>
                  </div>
                )
              })}
            </div>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-200 font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Read Full Newsletter
                </>
              )}
            </button>
          </div>
          
          {/* Expandable Content */}
          {isExpanded && (
            <div className="border-t border-border p-6 bg-muted/20">
              <div className="space-y-8">
                {sections.map((section) => (
                  <div key={section.key}>
                    {section.items && section.items.length > 0 && (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={section.color}>{section.icon}</div>
                          <h3 className="text-lg font-bold text-foreground">{section.title}</h3>
                        </div>
                        
                        <div className="space-y-4">
                          {section.items.map((item, index) => (
                            <div 
                              key={index} 
                              className="bg-card p-4 rounded-xl border border-border hover:shadow-sm transition-all duration-200"
                            >
                              <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                              <p className="text-muted-foreground mb-3 leading-relaxed">{item.summary}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground font-medium">{item.source}</span>
                                <a 
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
                                >
                                  Read Article
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </>
    )
  }

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Newsletter Header */}
        <header className="text-center px-8 py-10 bg-gradient-to-b from-muted/50 to-card border-b border-border">
          {isLatest && (
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-500/20 text-green-400 mb-6">
              ✨ Latest Newsletter
            </div>
          )}
          
          <h1 className="text-4xl font-bold text-foreground mb-6 tracking-tight">
            {newsletter.content.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <time dateTime={newsletter.newsletter_date} className="font-medium">
                {formatDate(newsletter.newsletter_date)}
              </time>
            </div>
            
            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">{formatTime(newsletter.generated_at)}</span>
            </div>
          </div>
        </header>

        {/* Newsletter Content */}
        <div className="px-8 py-10 space-y-12">
          {sections.map((section) => (
            <NewsletterSection
              key={section.key}
              title={section.title}
              items={section.items}
              icon={<div className={section.color}>{section.icon}</div>}
            />
          ))}
        </div>
        
        {/* Newsletter Footer */}
        <footer className="px-8 py-6 bg-muted/50 border-t border-border text-center">
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">This newsletter is automatically generated twice daily using AI.</p>
            <p>Stay informed about the latest developments in artificial intelligence.</p>
          </div>
        </footer>
      </article>
  )
}