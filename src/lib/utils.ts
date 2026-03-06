import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ALL_TITLES, TitleMetadata } from "./constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Logic to calculate user titles based on profile data.
 * This makes titles "functional" as they reflect real profile quality.
 */
export function getUserTitles(user: any, language: 'RU' | 'EN'): (TitleMetadata & { displayName: string })[] {
  const titles: (TitleMetadata & { displayName: string })[] = [];
  
  if (!user) return [];

  // LEVEL 4: Dating King (High Match / Popularity)
  if (user.match >= 90) {
    const meta = ALL_TITLES.find(t => t.id === 'king')!;
    titles.push({ ...meta, displayName: language === 'RU' ? meta.name_ru : meta.name_en });
  }
  
  // LEVEL 3: Life of the Party (Many Interests)
  if (user.interests && user.interests.length >= 5) {
    const meta = ALL_TITLES.find(t => t.id === 'party')!;
    titles.push({ ...meta, displayName: language === 'RU' ? meta.name_ru : meta.name_en });
  }
  
  // LEVEL 2: Budding Romantic (Bio Effort)
  if (user.bio && user.bio.length > 20) {
    const meta = ALL_TITLES.find(t => t.id === 'romantic')!;
    titles.push({ ...meta, displayName: language === 'RU' ? meta.name_ru : meta.name_en });
  }
  
  // LEVEL 1: Rookie (Default for active profiles)
  // If no other titles earned, user is a Rookie.
  if (titles.length === 0) {
    const meta = ALL_TITLES.find(t => t.id === 'rookie')!;
    titles.push({ ...meta, displayName: language === 'RU' ? meta.name_ru : meta.name_en });
  }

  // Sort by priority (higher first)
  return titles.sort((a, b) => b.priority - a.priority);
}
