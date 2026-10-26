export const STORE_PHONE = '01028845155';
export const WHATSAPP_NUMBER = '201028845155';
export const FACEBOOK_URL = 'https://www.facebook.com/share/1B1GYYmvsB/?mibextid=wwXIfr';
export const TIKTOK_URL = 'https://www.tiktok.com/@alqaedmall?_r=1&_t=ZS-9Asqss3x47j';
export const INSTAGRAM_URL = 'https://www.instagram.com/el_qaed_stores?psln=ZDhldjRpbGg2Mnpi&utm_source=qr';
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
