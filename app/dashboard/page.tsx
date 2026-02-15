'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { BookmarkCard } from '@/components/bookmark-card'
import { BookmarkForm } from '@/components/bookmark-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase-client'
import { Bookmark } from '@/lib/types'
import { Plus, Search, X } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      fetchBookmarks(user.id)
    }
    checkAuth()
  }, [router])

  const fetchBookmarks = async (userId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBookmark = async (data: any) => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase.from('bookmarks').insert([
        {
          user_id: user.id,
          url: data.url,
          title: data.title,
          description: data.description,
          tags: data.tags,
          category: data.category,
        },
      ])

      if (error) throw error

      setShowForm(false)
      fetchBookmarks(user.id)
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to save bookmark')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setBookmarks(bookmarks.filter((b) => b.id !== id))
    } catch (error) {
      console.error('Error deleting bookmark:', error)
    }
  }

  // Get unique categories and tags
  const categories = Array.from(
    new Set(bookmarks.filter((b) => b.category).map((b) => b.category))
  )
  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags || []))
  )

  // Filter bookmarks
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      searchQuery === '' ||
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === '' || bookmark.category === selectedCategory

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => bookmark.tags?.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Bookmarks</h1>
            <p className="text-muted-foreground mt-1">
              {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Bookmark
              </>
            )}
          </Button>
        </div>


        {/* Search and Filters */}
        <div className="bg-card rounded-xl p-6 border border-border mb-8">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Categories Filter */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tags Filter */}
              {allTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            prev.includes(tag)
                              ? prev.filter((t) => t !== tag)
                              : [...prev, tag]
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                  setSelectedTags([])
                }}
                className="text-sm text-primary hover:text-primary/80"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <BookmarkForm
              onSubmit={handleAddBookmark}
              onCancel={() => setShowForm(false)}
              loading={saving}
            />
          </div>
        )}

        {/* Bookmarks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading bookmarks...</p>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {bookmarks.length === 0
                ? 'No bookmarks yet. Add one to get started!'
                : 'No bookmarks match your filters.'}
            </p>
            {bookmarks.length === 0 && (
              <Button onClick={() => setShowForm(true)}>Add Your First Bookmark</Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={handleDeleteBookmark}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
