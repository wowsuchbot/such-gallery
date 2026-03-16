// such.gallery - API route to create a gallery

import { NextResponse } from 'next/server';
import { createGallery } from '@/lib/gallery-store';
import { GalleryLink } from '@/lib/galleries';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { title, description, links, creatorName, creatorFid } = body;
    
    if (!title || !links || !Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, links' 
      }, { status: 400 });
    }
    
    // Validate links
    const validLinks: GalleryLink[] = links.filter((link: any) => {
      if (link.type === 'cryptoart_listing' && link.listingId) return true;
      if (link.type === 'farcaster_cast' && link.hash) return true;
      if (link.type === 'nft' && link.contract && link.tokenId && link.chainId) return true;
      return false;
    });
    
    if (validLinks.length === 0) {
      return NextResponse.json({ 
        error: 'No valid links provided' 
      }, { status: 400 });
    }
    
    const gallery = createGallery({
      title,
      description: description || '',
      links: validLinks,
      creatorName: creatorName || 'Anonymous',
      creatorFid: creatorFid || undefined,
    });
    
    return NextResponse.json({ 
      success: true, 
      gallery 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating gallery:', error);
    return NextResponse.json({ 
      error: 'Failed to create gallery' 
    }, { status: 500 });
  }
}

export async function GET() {
  // Return all galleries
  const { getAllGalleries } = await import('@/lib/gallery-store');
  const galleries = getAllGalleries();
  return NextResponse.json({ galleries });
}
