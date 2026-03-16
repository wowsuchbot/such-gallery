// such.gallery - Home page

import Link from 'next/link';
import { getAllGalleries } from '@/lib/gallery-store';
import { GalleryTeaser } from '@/components/GalleryTeaser';
import { ERC6551Teaser } from '@/components/ERC6551Teaser';

export default function Home() {
  const galleries = getAllGalleries();
  const featuredGalleries = galleries.slice(0, 3);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
                such.gallery
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-mono text-sm">
                Curated galleries for cryptoart
              </p>
            </div>
            <Link
              href="/create"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-mono text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Create Gallery
            </Link>
          </div>
        </div>
      </header>

      {/* Featured Galleries */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-2xl font-bold">
            {galleries.length > 3 ? 'Featured Galleries' : 'Galleries'}
          </h2>
          {galleries.length > 3 && (
            <Link
              href="/galleries"
              className="font-mono text-sm text-gray-500 hover:text-black dark:hover:text-white underline"
            >
              View all →
            </Link>
          )}
        </div>

        {featuredGalleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredGalleries.map((gallery) => (
              <GalleryTeaser
                key={gallery.id}
                id={gallery.id}
                title={gallery.title}
                description={gallery.description}
                linkCount={gallery.links.length}
                creatorName={gallery.creatorName}
                updatedAt={gallery.updatedAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 mb-4">No galleries yet</p>
            <Link
              href="/create"
              className="font-mono text-sm underline hover:text-black dark:hover:text-white"
            >
              Create the first gallery →
            </Link>
          </div>
        )}
      </section>

      {/* ERC-6551 Teaser */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <ERC6551Teaser />
      </section>

      {/* Footer */}
      <footer className="border-t border-black dark:border-white mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-gray-500 font-mono">
            Powered by{' '}
            <a
              href="https://cryptoart.social"
              className="underline hover:text-black dark:hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              cryptoart.social
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
