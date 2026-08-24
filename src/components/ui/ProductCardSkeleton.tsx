export function ProductCardSkeleton() {
  return (
    <div className="bg-[#F2EEE8] rounded-xl overflow-hidden flex flex-col justify-between p-4 space-y-4 animate-pulse">
      {/* Product Image Shimmer */}
      <div className="h-64 sm:h-72 w-full rounded-lg bg-black/5 relative overflow-hidden flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-black/5" />
      </div>

      {/* Details Shimmer */}
      <div className="space-y-3 pt-2 text-start">
        {/* Brand Tag */}
        <div className="h-3 w-16 bg-[#A78463]/20 rounded" />

        {/* Title */}
        <div className="h-5 w-4/5 bg-black/10 rounded" />

        {/* Description lines */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 w-full bg-black/5 rounded" />
          <div className="h-3.5 w-3/5 bg-black/5 rounded" />
        </div>

        {/* Price & Stock Row */}
        <div className="flex items-center justify-between pt-3">
          <div className="h-6 w-24 bg-black/10 rounded" />
          <div className="h-4 w-12 bg-black/5 rounded-full" />
        </div>

        {/* Action Buttons Shimmer */}
        <div className="flex items-center gap-2 pt-2">
          <div className="flex-1 h-10 rounded-[20px] bg-gold/30" />
          <div className="h-10 w-20 rounded-[20px] bg-black/10" />
        </div>
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
