// Gallery detail page - Full viewport artwork slides

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGalleryById } from '@/lib/gallery-store';
import { GalleryLink } from '@/lib/galleries';
import { ArtworkSlide } from '@/components/ArtworkSlide';

export default async function GalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = getGalleryById(id);

  if (!gallery) {
    notFound();
  }

  const createdDate = new Date(gallery.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Filter to only cryptoart listings for now (they have preview support)
  const listingLinks = gallery.links.filter(
    (link): link is GalleryLink & { type: 'cryptoart_listing' } => link.type === 'cryptoart_listing'
  );

  return (
    <main className="bg-black text-white">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link
                href="/"
                className="font-mono text-xs text-gray-500 hover:text-white mb-2 inline-block"
              >
                ← Back to galleries
              </Link>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">
                {gallery.title}
              </h1>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs text-gray-400">
                by {gallery.creatorName}
              </p>
              <p className="font-mono text-xs text-gray-500">
                {listingLinks.length} artworks
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Gallery description - Scrollable intro section */}
      <section className="min-h-[60vh] flex items-center justify-center pt-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
            {gallery.description}
          </p>
          <div className="font-mono text-xs text-gray-500">
            Created {createdDate} · {gallery.links.length} links
          </div>
          <div className="mt-8 animate-bounce text-gray-400">
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs mt-2 block">Scroll to view artworks</span>
          </div>
        </div>
      </section>

      {/* Artwork slides - Each takes full viewport */}
      <section className="snap-y snap-mandatory">
        {listingLinks.map((link, index) => (
          <div key={link.listingId} className="snap-start">
            <ArtworkSlide listingId={link.listingId} index={index} />
          </div>
        ))}
      </section>

      {/* Non-listing links section */}
      {gallery.links.some(l => l.type !== 'cryptoart_listing') && (
        <section className="min-h-screen bg-gray-950 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-2xl font-bold mb-8">Additional Links</h2>
            <div className="space-y-3">
              {gallery.links.filter(l => l.type !== 'cryptoart_listing').map((link, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-800 bg-black"
                >
                  {link.type === 'farcaster_cast' && (
                    <a
                      href={`https://warpcast.com/~/conversations/${link.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline"
                    >
                      Farcaster Cast: {link.hash.slice(0, 10)}...
                    </a>
                  )}
                  {link.type === 'nft' && (
                    <span className="text-gray-400">
                      NFT: {link.contract.slice(0, 8)}... #{link.tokenId}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-xs text-gray-500">
            Powered by{' '}
            <a
              href="https://cryptoart.social"
              className="underline hover:text-white"
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
