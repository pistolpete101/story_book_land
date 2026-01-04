// Security utilities for input validation and sanitization

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Escapes special characters that could be used for script injection
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes text content by removing potentially dangerous characters
 * Keeps newlines and basic formatting
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Remove null bytes and control characters (except newlines and tabs)
  return text
    .replace(/\0/g, '')
    .replace(/[\x01-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Validates and sanitizes story title
 */
export function validateTitle(title: string): { valid: boolean; sanitized: string; error?: string } {
  if (!title || title.trim().length === 0) {
    return { valid: false, sanitized: '', error: 'Title is required' };
  }
  
  const sanitized = sanitizeText(title).trim();
  
  if (sanitized.length < 1) {
    return { valid: false, sanitized: '', error: 'Title is too short' };
  }
  
  if (sanitized.length > 200) {
    return { valid: false, sanitized: sanitized.substring(0, 200), error: 'Title must be 200 characters or less' };
  }
  
  return { valid: true, sanitized };
}

/**
 * Validates and sanitizes story description
 */
export function validateDescription(description: string): { valid: boolean; sanitized: string; error?: string } {
  if (!description) {
    return { valid: true, sanitized: '' }; // Description is optional
  }
  
  const sanitized = sanitizeText(description).trim();
  
  if (sanitized.length > 1000) {
    return { valid: false, sanitized: sanitized.substring(0, 1000), error: 'Description must be 1000 characters or less' };
  }
  
  return { valid: true, sanitized };
}

/**
 * Validates and sanitizes chapter content
 */
export function validateContent(content: string): { valid: boolean; sanitized: string; error?: string } {
  if (!content || content.trim().length === 0) {
    return { valid: false, sanitized: '', error: 'Content is required' };
  }
  
  const sanitized = sanitizeText(content).trim();
  
  if (sanitized.length < 10) {
    return { valid: false, sanitized: '', error: 'Content must be at least 10 characters' };
  }
  
  if (sanitized.length > 10000) {
    return { valid: false, sanitized: sanitized.substring(0, 10000), error: 'Content must be 10,000 characters or less' };
  }
  
  return { valid: true, sanitized };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }
  
  return { valid: true };
}

/**
 * Validates age input
 */
export function validateAge(age: number | string): { valid: boolean; sanitized: number; error?: string } {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  
  if (isNaN(ageNum)) {
    return { valid: false, sanitized: 0, error: 'Age must be a number' };
  }
  
  if (ageNum < 4 || ageNum > 18) {
    return { valid: false, sanitized: ageNum, error: 'Age must be between 4 and 18' };
  }
  
  return { valid: true, sanitized: ageNum };
}

/**
 * Validates file upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only image files are allowed (JPEG, PNG, GIF, WebP)' };
  }
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  
  // Check for empty file
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  return { valid: true };
}

/**
 * Validates base64 image string
 */
export function validateBase64Image(base64: string): { valid: boolean; error?: string } {
  if (!base64) {
    return { valid: false, error: 'Image is required' };
  }
  
  // Check if it's a valid base64 data URL
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  if (!base64Regex.test(base64)) {
    return { valid: false, error: 'Invalid image format' };
  }
  
  // Check approximate size (base64 is ~33% larger than binary)
  const sizeInBytes = (base64.length * 3) / 4;
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (sizeInBytes > maxSize) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }
  
  return { valid: true };
}

/**
 * Escapes HTML for safe display in print output
 */
export function escapeHtmlForPrint(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n/g, '<br>');
}

/**
 * Validates character name
 */
export function validateCharacterName(name: string): { valid: boolean; sanitized: string; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, sanitized: '', error: 'Character name is required' };
  }
  
  const sanitized = sanitizeText(name).trim();
  
  if (sanitized.length < 1) {
    return { valid: false, sanitized: '', error: 'Character name is too short' };
  }
  
  if (sanitized.length > 50) {
    return { valid: false, sanitized: sanitized.substring(0, 50), error: 'Character name must be 50 characters or less' };
  }
  
  return { valid: true, sanitized };
}

/**
 * Validates location/time/weather settings
 */
export function validateSetting(setting: string, maxLength: number = 50): { valid: boolean; sanitized: string; error?: string } {
  if (!setting) {
    return { valid: true, sanitized: '' }; // Settings are optional
  }
  
  const sanitized = sanitizeText(setting).trim();
  
  if (sanitized.length > maxLength) {
    return { valid: false, sanitized: sanitized.substring(0, maxLength), error: `Setting must be ${maxLength} characters or less` };
  }
  
  return { valid: true, sanitized };
}

