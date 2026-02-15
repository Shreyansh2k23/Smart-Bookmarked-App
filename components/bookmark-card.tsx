'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bookmark } from '@/lib/types'
import { Trash2, ExternalLink } from 'lucide-react'

interface BookmarkCardProps {
  bookmark: Bookmark
  onDelete: (id: string) => void
}

export function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      onDelete(bookmark.id)
    }
  }

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground line-clamp-2">
              {bookmark.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {new URL(bookmark.url).hostname}
            </p>
          </div>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {bookmark.description && (
          <p className="text-sm text-foreground line-clamp-2">
            {bookmark.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {bookmark.category && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {bookmark.category || 'No category'}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

        )}
      </div>
    </Card>
  )
}
