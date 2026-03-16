// GalleryTeaser - Newspaper-style card for a gallery

'use client';

import Link from 'next/link';

interface GalleryTeaserProps {
  id: string;
  title: string;
  description: string;
  linkCount: number;
  creatorName: string;
  updatedAt: string;
}

export function GalleryTeaser({
  id,
  title,
  description,
  linkCount,
  creatorName,
  updatedAt,
}: GalleryTeaserProps) {
  const dateStr = new Date(updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link href={`/gallery/${id}`} className="group block">
      <article className="border border-black dark:border-white bg-white dark:bg-black h-full flex flex-col">
        {/* Placeholder image area */}
        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900 border-b border-black dark:border-white flex items-center justify-center">
          <span className="text-4xl font-serif text-gray-300 dark:text-gray-700">
            {title.charAt(0)}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-serif text-xl font-bold leading-tight group-hover:underline">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 flex-1">
            {description}
          </p>

          {/* Meta */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center text-xs font-mono text-gray-500">
            <span>{linkCount} link{linkCount !== 1 ? 's' : ''}</span>
            <span>by {creatorName} · {dateStr}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
