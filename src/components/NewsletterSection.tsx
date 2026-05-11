import { ExternalLink } from 'lucide-react'

interface NewsletterItem {
  title: string
  summary: string
  link: string
  source: string
}

interface NewsletterSectionProps {
  title: string
  items: NewsletterItem[]
  icon: React.ReactNode
}

export function NewsletterSection({ title, items, icon }: NewsletterSectionProps) {

  if (!items || items.length === 0) {
    return null
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
          {icon}
          <h2 className="text-2xl font-bold text-black">{title}</h2>
        </div>
        
        <div className="grid gap-6">
          {items.map((item, index) => (
            <article 
              key={index} 
              className="group bg-gray-50/50 hover:bg-gray-50 rounded-2xl p-6 transition-all duration-300 hover:shadow-sm border border-transparent hover:border-gray-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <h3 className="text-xl font-bold text-black group-hover:text-gray-800 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed">
                    {item.summary}
                  </p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border border-gray-200 text-gray-700">
                        {item.source}
                      </span>
                      <span className="text-sm text-gray-500">• Recent</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors rounded-lg hover:bg-blue-50"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Read Article
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>


    </>
  )
}