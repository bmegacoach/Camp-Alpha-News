import { useState, useMemo } from 'react'
import { useNewsletters } from '../hooks/useNewsletters'
import { NewsletterCard } from '../components/NewsletterCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { Navigation } from '../components/Navigation'
import { SystemStatus } from '../components/SystemStatus'
import { Archive, Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Newsletter } from '../lib/supabase'

type FilterOption = 'all' | 'thisWeek' | 'thisMonth' | 'lastMonth'

export function ArchivePage() {
  const { newsletters, loading, error, fetchNewsletters } = useNewsletters()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const itemsPerPage = 6

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

  // Filter and sort newsletters
  const filteredNewsletters = useMemo(() => {
    let filtered = [...newsletters]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(newsletter => 
        newsletter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsletter.content.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply date filter
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    switch (filterBy) {
      case 'thisWeek':
        filtered = filtered.filter(newsletter => 
          new Date(newsletter.newsletter_date) >= oneWeekAgo
        )
        break
      case 'thisMonth':
        filtered = filtered.filter(newsletter => 
          new Date(newsletter.newsletter_date) >= oneMonthAgo
        )
        break
      case 'lastMonth':
        filtered = filtered.filter(newsletter => {
          const date = new Date(newsletter.newsletter_date)
          return date >= twoMonthsAgo && date < oneMonthAgo
        })
        break
    }

    // Apply default sorting (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.newsletter_date).getTime()
      const dateB = new Date(b.newsletter_date).getTime()
      return dateB - dateA
    })

    return filtered
  }, [newsletters, searchQuery, filterBy])

  // Pagination
  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNewsletters = filteredNewsletters.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  const handleFilterChange = (newFilter: FilterOption) => {
    setFilterBy(newFilter)
    setCurrentPage(1)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <Navigation onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Archive className="w-6 h-6 text-accent-foreground" />
              </div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">CoachAI Newsletter Archive</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Browse through our complete collection of CoachAI newsletters with enhanced detailed summaries. 
              Discover insights, track trends, and explore the evolution of artificial intelligence for business building.
            </p>
          </div>

          {/* System Status */}
          <div className="mb-8">
            <SystemStatus />
          </div>

          {/* Enhanced Filters and Search */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search newsletters by title or content..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-muted-foreground" />
                  <select
                    value={filterBy}
                    onChange={(e) => handleFilterChange(e.target.value as FilterOption)}
                    className="px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-sm font-medium"
                  >
                    <option value="all">All Time</option>
                    <option value="thisWeek">This Week</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Enhanced Results count */}
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredNewsletters.length === 0 ? (
                  'No newsletters found'
                ) : (
                  <>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredNewsletters.length)} of {filteredNewsletters.length} newsletters</>
                )}
              </p>
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="text-sm text-accent hover:text-accent/80 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Newsletter Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={handleRefresh} />
        ) : filteredNewsletters.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Archive className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {searchQuery || filterBy !== 'all' ? 'No Results Found' : 'No Newsletters Yet'}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchQuery || filterBy !== 'all' 
                ? 'Try adjusting your search or filter criteria to find the newsletters you\'re looking for.' 
                : 'Generate your first CoachAI newsletter to start building the archive with enhanced detailed summaries.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {paginatedNewsletters.map((newsletter, index) => (
                <NewsletterCard 
                  key={newsletter.id} 
                  newsletter={newsletter} 
                  compact={true}
                  isLatest={index === 0 && currentPage === 1}
                />
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-muted/50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page;
                    if (totalPages <= 7) {
                      page = i + 1;
                    } else {
                      if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-accent text-accent-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-muted/50"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </>
        )}
      </main>
      
      {/* Footer with System Status */}
      <footer className="border-t border-border mt-20 bg-card">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <SystemStatus compact={true} />
          </div>
        </div>
      </footer>
    </div>
  )
}