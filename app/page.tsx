import Link from 'next/link'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Bookmark, Search, Tags, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-gradient-to-r from-blue-500 to-pink-500">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
  Your Smart Bookmark Manager
</span>

          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Save, organize, and find your favorite links instantly. Categorize with tags, search effortlessly, and keep your digital library perfectly organized.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-500 to-green-500 text-white ">
              Get Started Free
              <Zap className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Save Bookmarks
            </h3>
            <p className="text-muted-foreground">
              Quickly save any link with a title, description, and notes. Build your personal knowledge base.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-red-400 rounded-xl flex items-center justify-center mb-4">
              <Tags className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Organize & Categorize
            </h3>
            <p className="text-muted-foreground">
              Use tags and categories to organize your bookmarks. Create your own system that works for you.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-400 rounded-xl flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Search & Filter
            </h3>
            <p className="text-muted-foreground">
              Find any bookmark in seconds with powerful search and filtering by tags or categories.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl p-12 sm:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Ready to organize your web?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are managing their bookmarks smarter with BookMark.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:text-purple-600 transition-colors"
            >
              Start Free Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground animate-pulse">
          <p>
            Built with ❤️ by{" "}
            <span className="font-bold text-primary">Shreyansh Gupta © 2026</span>
          </p>
          {/* <p>© 2026 BookMark. All rights reserved.</p> */}
        </div>
      </footer>
    </main>
  )
}
