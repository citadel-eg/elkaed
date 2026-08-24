export const STORE_PHONE = '+20 10 63905083';
export const WHATSAPP_NUMBER = '201063905083';
export const FACEBOOK_URL = 'https://www.facebook.com/share/18AnoxDv1Y/';
export const TIKTOK_URL = 'https://vm.tiktok.com/ZS9B8dRMoC7oM-VORFt/';
export const STORE_NAME = 'القائد للتقنية';
export const STORE_LOCATION_MAHALLA = 'شارع البحر المحلة';
export const STORE_LOCATION_SAMANOUD = 'سمنود';
export const STORE_HOURS = 'يوميًا 11ص – 11م';

export const PRODUCTS_BUCKET_URL =
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL ||
  `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hqmnistbtiozalclszhm.supabase.co'}/storage/v1/object/public/products`;

export const BUCKET_URL = PRODUCTS_BUCKET_URL;

export const TEAM_BUCKET_URL =
  process.env.NEXT_PUBLIC_SUPABASE_TEAM_STORAGE_URL ||
  `${process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hqmnistbtiozalclszhm.supabase.co'}/storage/v1/object/public/team`;

export function getWhatsAppUrl(customMessage?: string): string {
  const message = customMessage || 'مرحبًا القائد، أود الاستفسار عن المنتجات والخدمات.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
