import { NewsletterItem as NewsletterItemType } from '../lib/supabase'
import { ExternalLink } from 'lucide-react'

interface NewsletterItemProps {
  item: NewsletterItemType
  index: number
}

export function NewsletterItem({ item, index }: NewsletterItemProps) {
  return (
    <div className="group border-b border-gray-100 pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0 hover:bg-gray-50/50 -mx-4 px-4 py-4 rounded-xl transition-all duration-200">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-black rounded-lg group-hover:bg-gray-800 transition-colors">
              {index + 1}
            </span>
            <span className="text-sm text-gray-500 font-semibold uppercase tracking-wide">{item.source}</span>
          </div>
          
          <h3 className="text-xl font-bold text-black mb-4 leading-tight group-hover:text-gray-800 transition-colors">
            {item.title}
          </h3>
          
          {/* Enhanced summary with better typography for longer content */}
          <div className="prose prose-gray max-w-none mb-5">
            <p className="text-gray-700 leading-relaxed text-base m-0">
              {item.summary}
            </p>
          </div>
          
          <a 
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-all duration-200 hover:gap-3 group/link bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
          >
            <span className="border-b border-transparent group-hover/link:border-blue-600 transition-all duration-200">
              Read Full Article
            </span>
            <ExternalLink className="w-4 h-4 transition-transform duration-200 group-hover/link:scale-110" />
          </a>
        </div>
      </div>
    </div>
  )
}