import { ProductsGridSkeleton } from '@/components/ui/ProductCardSkeleton';

export default function ProductsLoading() {
  return (
    <div className="w-full bg-[#FCFBF8]">
      {/* 1. Hero Shimmer */}
      <section className="relative w-full min-h-120 lg:min-h-135 flex items-center overflow-hidden bg-dark-card text-white">
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 lg:px-16 py-20 flex flex-col items-start gap-8 animate-pulse">
          <div className="flex items-center gap-3 w-full">
            <div className="h-4 w-20 bg-white/20 rounded" />
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <div className="space-y-3 w-full">
            <div className="h-14 w-64 sm:w-96 bg-white/20 rounded-xl" />
            <div className="h-14 w-48 sm:w-80 bg-white/20 rounded-xl" />
          </div>
          <div className="h-6 w-full max-w-lg bg-white/10 rounded" />
          <div className="h-14 w-60 bg-gold/40 rounded-[20px]" />
        </div>
      </section>

      {/* 2. Main Content & Sidebar Skeletons */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-16 bg-black/10 rounded" />
              <div className="h-12 w-full bg-white border border-[#E2D9CD] rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-16 bg-black/10 rounded" />
              <div className="h-12 w-full bg-white border border-[#E2D9CD] rounded-lg" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-4 w-16 bg-black/10 rounded" />
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-black/10 rounded" />
                <div className="h-4 w-24 bg-black/10 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-black/10 rounded" />
                <div className="h-4 w-24 bg-black/10 rounded" />
              </div>
            </div>
            <div className="bg-[#1F1F1F] rounded-3xl p-6 h-44" />
          </aside>

          {/* Catalog & Cards Skeleton */}
          <div className="flex-1 w-full space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full animate-pulse">
              <div className="flex-1 w-full h-12 bg-white border border-[#E2D9CD] rounded-full" />
              <div className="h-12 w-48 bg-white border border-[#E2D9CD] rounded-lg" />
            </div>

            <ProductsGridSkeleton count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
