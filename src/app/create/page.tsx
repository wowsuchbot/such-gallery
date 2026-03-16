// Create Gallery page

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parseGalleryLink, GalleryLink } from '@/lib/galleries';
import { ListingPreview } from '@/components/ListingPreview';

export default function CreateGalleryPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [links, setLinks] = useState<GalleryLink[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleAddLink() {
    const trimmed = linkInput.trim();
    if (!trimmed) return;

    const parsed = parseGalleryLink(trimmed);
    if (!parsed) {
      setError('Invalid link format. Use: cryptoart.social/listing/:id, cast hash, or contract/tokenId/chainId');
      return;
    }

    // Check for duplicates
    const isDuplicate = links.some(link => {
      if (link.type !== parsed.type) return false;
      if (link.type === 'cryptoart_listing' && parsed.type === 'cryptoart_listing') {
        return link.listingId === parsed.listingId;
      }
      if (link.type === 'farcaster_cast' && parsed.type === 'farcaster_cast') {
        return link.hash === parsed.hash;
      }
      if (link.type === 'nft' && parsed.type === 'nft') {
        return link.contract === parsed.contract && link.tokenId === parsed.tokenId;
      }
      return false;
    });

    if (isDuplicate) {
      setError('This link is already in your gallery');
      return;
    }

    setLinks([...links, parsed]);
    setLinkInput('');
    setError(null);
  }

  function handleRemoveLink(index: number) {
    setLinks(links.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (links.length === 0) {
      setError('Add at least one link to your gallery');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/galleries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          links,
          creatorName: creatorName || 'Anonymous',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create gallery');
      }

      // Navigate to the new gallery
      router.push(`/gallery/${data.gallery.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gallery');
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-black dark:border-white">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="font-mono text-sm text-gray-500 hover:text-black dark:hover:text-white mb-4 inline-block"
          >
            ← Back to galleries
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-tight mt-4">
            Create Gallery
          </h1>
        </div>
      </header>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block font-mono text-sm text-gray-600 dark:text-gray-400 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Gallery"
              className="w-full px-4 py-3 border border-black dark:border-white bg-transparent font-serif text-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-mono text-sm text-gray-600 dark:text-gray-400 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your gallery..."
              rows={3}
              className="w-full px-4 py-3 border border-black dark:border-white bg-transparent focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            />
          </div>

          {/* Creator Name */}
          <div>
            <label className="block font-mono text-sm text-gray-600 dark:text-gray-400 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Anonymous"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-transparent font-mono text-sm focus:outline-none focus:border-black dark:focus:border-white"
            />
          </div>

          {/* Links */}
          <div>
            <label className="block font-mono text-sm text-gray-600 dark:text-gray-400 mb-2">
              Links *
            </label>
            
            {/* Existing links with previews */}
            {links.length > 0 && (
              <div className="mb-4 space-y-2">
                {links.map((link, index) => (
                  <div key={index}>
                    {link.type === 'cryptoart_listing' ? (
                      <ListingPreview
                        listingId={link.listingId}
                        onRemove={() => handleRemoveLink(index)}
                      />
                    ) : (
                      <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                            {link.type === 'farcaster_cast' ? 'CAST' : 'NFT'}
                          </span>
                          <span className="font-mono text-sm">
                            {link.type === 'farcaster_cast' && `${link.hash.slice(0, 10)}...`}
                            {link.type === 'nft' && `#${link.tokenId}`}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add link input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                placeholder="cryptoart.social/listing/123"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-transparent font-mono text-sm focus:outline-none focus:border-black dark:focus:border-white"
              />
              <button
                type="button"
                onClick={handleAddLink}
                className="px-4 py-2 border border-black dark:border-white font-mono text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Add
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="mt-2 text-sm text-red-500 font-mono">{error}</p>
            )}

            {/* Format help */}
            <p className="mt-3 text-xs text-gray-400 font-mono">
              Formats: cryptoart.social/listing/:id · 0x... (cast hash) · 0xABC.../123/8453 (NFT)
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={links.length === 0 || saving}
            className="w-full px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-mono hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Creating...' : `Create Gallery ${links.length > 0 ? `(${links.length} links)` : ''}`}
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-black dark:border-white mt-auto">
        <div className="max-w-2xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-gray-500 font-mono">
            No auth required yet · Galleries saved locally
          </p>
        </div>
      </footer>
    </main>
  );
}
