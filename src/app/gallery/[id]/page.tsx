// Gallery detail page

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { mockGalleries, GalleryLink } from '@/lib/galleries';

function renderLink(link: GalleryLink, index: number) {
  switch (link.type) {
    case 'cryptoart_listing':
      return (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900">
              Listing
            </span>
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
              #{link.listingId}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-400 mt-2 truncate">
            cryptoart.social/listing/{link.listingId}
          </p>
        </a>
      );

    case 'farcaster_cast':
      return (
        <a
          key={index}
          href={`https://warpcast.com/~/conversations/${link.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              Cast
            </span>
            {link.author && (
              <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                by @{link.author}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-gray-400 mt-2 truncate">
            {link.hash.slice(0, 10)}...
          </p>
        </a>
      );

    case 'nft':
      return (
        <div
          key={index}
          className="block p-4 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
              NFT
            </span>
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
              #{link.tokenId}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-400 mt-2 truncate">
            {link.contract} · chain {link.chainId}
          </p>
        </div>
      );
  }
}

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = mockGalleries.find((g) => g.id === id);

  if (!gallery) {
    notFound();
  }

  const createdDate = new Date(gallery.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-black dark:border-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="font-mono text-sm text-gray-500 hover:text-black dark:hover:text-white mb-4 inline-block"
          >
            ← Back to galleries
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mt-4">
            {gallery.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
            <span>by {gallery.creatorName}</span>
            <span>·</span>
            <span>{createdDate}</span>
            <span>·</span>
            <span>{gallery.links.length} links</span>
          </div>
          {gallery.description && (
            <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {gallery.description}
            </p>
          )}
        </div>
      </header>

      {/* Links */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="font-serif text-xl font-bold mb-6">Links</h2>
        <div className="space-y-3">
          {gallery.links.map((link, index) => renderLink(link, index))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black dark:border-white mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
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
