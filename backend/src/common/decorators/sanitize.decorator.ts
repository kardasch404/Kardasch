import { Transform } from 'class-transformer';

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export function SanitizeHtml() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    
    // Remove HTML tags and dangerous characters
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '')
      .trim();
  });
}

/**
 * Strips all HTML tags
 */
export function StripHtml() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    return value.replace(/<[^>]*>/g, '').trim();
  });
}

/**
 * Sanitizes string to prevent NoSQL injection
 */
export function SanitizeNoSQL() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    
    // Remove MongoDB operators and special characters
    return value
      .replace(/[${}]/g, '')
      .replace(/\.\./g, '')
      .trim();
  });
}

/**
 * Trims whitespace from string
 */
export function Trim() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
}

/**
 * Converts to lowercase
 */
export function ToLowerCase() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
    return value;
  });
}

/**
 * Normalizes email address
 */
export function NormalizeEmail() {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase().trim();
    }
    return value;
  });
}

/**
 * Sanitizes URL to prevent XSS
 */
export function SanitizeUrl() {
  return Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    
    const trimmed = value.trim();
    
    // Only allow http, https, and mailto protocols
    if (!/^(https?:\/\/|mailto:)/i.test(trimmed)) {
      return '';
    }
    
    // Remove javascript: and data: protocols
    if (/^(javascript|data):/i.test(trimmed)) {
      return '';
    }
    
    return trimmed;
  });
}
