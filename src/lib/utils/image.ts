/**
 * Compresses an image file in the browser using HTML5 Canvas.
 * Resizes large dimensions to max 1600px and converts to WebP/JPEG,
 * reducing multi-megabyte camera photos/PNGs down to ~150-300KB.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.85
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

        const outputType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }
            const cleanBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const ext = outputType === 'image/webp' ? '.webp' : '.jpg';
            const compressedFile = new File([blob], `${cleanBase}${ext}`, {
              type: outputType,
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
