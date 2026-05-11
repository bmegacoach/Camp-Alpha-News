import { Newsletter as NewsletterType } from '../lib/supabase'
import { NewsletterSection } from './NewsletterSection'
import { Newspaper, Wrench, Microscope, Lightbulb, Calendar } from 'lucide-react'

interface NewsletterProps {
  newsletter: NewsletterType
}

export function Newsletter({ newsletter }: NewsletterProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const sections = [
    {
      key: 'top_stories',
      title: 'Top Stories',
      icon: <Newspaper className="w-6 h-6" />,
      items: newsletter.content.sections.top_stories
    },
    {
      key: 'ai_tools',
      title: 'New AI Tools',
      icon: <Wrench className="w-6 h-6" />,
      items: newsletter.content.sections.ai_tools
    },
    {
      key: 'research',
      title: 'Cutting-Edge Research',
      icon: <Microscope className="w-6 h-6" />,
      items: newsletter.content.sections.research
    },
    {
      key: 'insights',
      title: 'Quick AI Insights',
      icon: <Lightbulb className="w-6 h-6" />,
      items: newsletter.content.sections.insights
    }
  ]

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
      {/* Newsletter Header */}
      <header className="text-center mb-10 pb-8 border-b border-gray-100">
        <h1 className="text-4xl font-bold text-black mb-4">
          {newsletter.content.title}
        </h1>
        
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <time dateTime={newsletter.newsletter_date}>
            {formatDate(newsletter.newsletter_date)}
          </time>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          Generated at {new Date(newsletter.generated_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </div>
      </header>

      {/* Newsletter Content */}
      <div className="space-y-12">
        {sections.map((section) => (
          <NewsletterSection
            key={section.key}
            title={section.title}
            items={section.items}
            icon={section.icon}
          />
        ))}
      </div>
      
      {/* Newsletter Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-100 text-center">
        <div className="text-sm text-gray-500">
          <p>This newsletter is automatically generated twice daily using AI.</p>
          <p className="mt-1">Stay informed about the latest developments in artificial intelligence.</p>
        </div>
      </footer>
    </article>
  )
}