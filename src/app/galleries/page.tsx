// Galleries browse page - All galleries with sorting

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockGalleries, Gallery } from '@/lib/galleries';
import { GalleryTeaser } from '@/components/GalleryTeaser';

type SortKey = 'updated' | 'creator' | 'revenue';

function sortGalleries(galleries: Gallery[], sortBy: SortKey): Gallery[] {
  return [...galleries].sort((a, b) => {
    switch (sortBy) {
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'creator':
        return a.creatorName.localeCompare(b.creatorName);
      case 'revenue':
        return parseFloat(b.totalRevenue) - parseFloat(a.totalRevenue);
      default:
        return 0;
    }
  });
}

export default function GalleriesPage() {
  const [sortBy, setSortBy] = useState<SortKey>('updated');
  const sortedGalleries = sortGalleries(mockGalleries, sortBy);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-black dark:border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/" className="font-serif text-2xl font-bold hover:underline">
                such.gallery
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-1 font-mono text-sm">
                All Galleries
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

      {/* Sort Controls */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-gray-500">Sort by:</span>
          <div className="flex gap-2">
            {(['updated', 'creator', 'revenue'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-3 py-1 font-mono text-sm border transition-colors ${
                  sortBy === key
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                    : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-black dark:hover:border-white'
                }`}
              >
                {key === 'updated' ? 'Last Updated' : key === 'creator' ? 'Creator' : 'Revenue'}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedGalleries.map((gallery) => (
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
