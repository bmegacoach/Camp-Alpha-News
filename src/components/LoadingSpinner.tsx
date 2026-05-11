export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin"></div>
      </div>
    </div>
  )
}