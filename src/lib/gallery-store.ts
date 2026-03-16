// Gallery storage - JSON file based for now, can migrate to DB later

import fs from 'fs';
import path from 'path';
import { Gallery, GalleryLink } from './galleries';

const GALLERIES_FILE = path.join(process.cwd(), 'data', 'galleries.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.dirname(GALLERIES_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read all galleries
export function getAllGalleries(): Gallery[] {
  ensureDataDir();
  
  if (!fs.existsSync(GALLERIES_FILE)) {
    // Start with mock data if no file exists
    const mockGalleries: Gallery[] = [
      {
        id: 'genesis-01',
        title: 'Genesis Collection',
        description: 'The first curated selection of works from cryptoart.social artists.',
        links: [
          { type: 'cryptoart_listing', url: 'https://cryptoart.social/listing/118', listingId: '118' },
        ],
        creatorName: 'mxjxn',
        creatorFid: 4905,
        createdAt: '2026-03-16T00:00:00Z',
        updatedAt: '2026-03-16T20:00:00Z',
        totalRevenue: '0.0',
      },
    ];
    fs.writeFileSync(GALLERIES_FILE, JSON.stringify(mockGalleries, null, 2));
    return mockGalleries;
  }
  
  const data = fs.readFileSync(GALLERIES_FILE, 'utf-8');
  return JSON.parse(data);
}

// Get single gallery by ID
export function getGalleryById(id: string): Gallery | null {
  const galleries = getAllGalleries();
  return galleries.find(g => g.id === id) || null;
}

// Save new gallery
export function createGallery(gallery: Omit<Gallery, 'id' | 'createdAt' | 'updatedAt' | 'totalRevenue'>): Gallery {
  const galleries = getAllGalleries();
  
  // Generate ID from title
  const id = gallery.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50) + '-' + Date.now().toString(36);
  
  const newGallery: Gallery = {
    ...gallery,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalRevenue: '0.0',
  };
  
  galleries.push(newGallery);
  fs.writeFileSync(GALLERIES_FILE, JSON.stringify(galleries, null, 2));
  
  return newGallery;
}

// Update gallery
export function updateGallery(id: string, updates: Partial<Gallery>): Gallery | null {
  const galleries = getAllGalleries();
  const index = galleries.findIndex(g => g.id === id);
  
  if (index === -1) return null;
  
  galleries[index] = {
    ...galleries[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(GALLERIES_FILE, JSON.stringify(galleries, null, 2));
  return galleries[index];
}

// Delete gallery
export function deleteGallery(id: string): boolean {
  const galleries = getAllGalleries();
  const index = galleries.findIndex(g => g.id === id);
  
  if (index === -1) return false;
  
  galleries.splice(index, 1);
  fs.writeFileSync(GALLERIES_FILE, JSON.stringify(galleries, null, 2));
  return true;
}
