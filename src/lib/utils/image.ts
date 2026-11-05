/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Resizes large dimensions to max 1000px and converts to WebP (or JPEG fallback),
 * reducing multi-megabyte camera photos/PNGs down to ~40-90KB.
 */
export async function compressImage(
  file: File,
  maxWidth = 1000,
  quality = 0.8
): Promise<File> {
  if (typeof window === 'undefined') return file;
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const outputType = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const actualType = blob.type || outputType;
            const ext = actualType === 'image/webp' ? '.webp' : '.jpg';
            if (blob.size >= file.size && file.type === actualType) {
              resolve(file);
              return;
            }
            const cleanBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const compressedFile = new File([blob], `${cleanBase}${ext}`, {
              type: actualType,
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

/**
 * Rewrites a public Supabase Storage URL to pass through our local `/storage/...`
 * edge rewrite so Vercel's CDN caches it for 1 year and avoids Supabase Cached Egress.
 */
export function getCachedImageUrl(url?: string | null, fallback = '/images/product-placeholder.svg'): string {
  if (!url) return fallback;
  const marker = '/storage/v1/object/public/';
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    return `/storage/${url.substring(idx + marker.length)}`;
  }
  return url;
}
