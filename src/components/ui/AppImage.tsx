'use client';

import { useState } from 'react';
import NextImage, { type ImageProps } from 'next/image';
import { getCachedImageUrl } from '@/lib/utils/image';

interface AppImageProps extends ImageProps {
  skeletonClassName?: string;
}

export default function Image({
  src,
  alt,
  fill,
  width,
  height,
  className = '',
  skeletonClassName = '',
  onLoad,
  onError,
  ...props
}: AppImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const resolvedSrc =
    typeof src === 'string' ? getCachedImageUrl(src) : src;
  const srcKey = typeof resolvedSrc === 'string' ? resolvedSrc : 'static';
  const isLoaded = loadedSrc === srcKey;

  const skeletonOverlay = !isLoaded && (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#E8E1D7]/70 animate-pulse flex items-center justify-center rounded-[inherit] ${skeletonClassName}`}
    >
      <svg
        className="w-5 h-5 max-w-[45%] max-h-[45%] text-[#9B8B78]/45"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </span>
  );

  const imageElement = (
    <NextImage
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      onLoad={(e) => {
        setLoadedSrc(srcKey);
        onLoad?.(e);
      }}
      onError={(e) => {
        setLoadedSrc(srcKey);
        onError?.(e);
      }}
      {...props}
    />
  );

  if (fill) {
    return (
      <>
        {skeletonOverlay}
        {imageElement}
      </>
    );
  }

  return (
    <span className="relative inline-flex items-center justify-center overflow-hidden">
      {skeletonOverlay}
      {imageElement}
    </span>
  );
}
