export const genUsername = (): string => {
  const usernamePrefix = 'user-';

  const randomChars = Math.random().toString(36).slice(2);

  const username = usernamePrefix + randomChars;
  return username;
};

/**
 * Generates a URL-friendly slug from a title string
 * @param title - The title string to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[^\w\s-]/g, '') // Remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
