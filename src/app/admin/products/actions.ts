"use server";

import { requireAdminSession } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductFormSchema, ProductIdSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils/slugify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Ensures 'products' bucket exists and is public in Supabase
 */
let isBucketReady = false;
async function ensureProductsBucket(
  supabase: ReturnType<typeof createAdminClient>,
) {
  if (isBucketReady) return;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === "products");
    if (!exists) {
      await supabase.storage.createBucket("products", {
        public: true,
        fileSizeLimit: 20971520, // 20MB
      });
    }
    isBucketReady = true;
  } catch (err) {
    console.warn("Auto-verify products bucket error:", err);
  }
}

/**
 * Uploads a file to Supabase storage bucket 'products'
 */
async function uploadProductFile(
  supabase: ReturnType<typeof createAdminClient>,
  file: File,
): Promise<string> {
  await ensureProductsBucket(supabase);

  const fileExt =
    file.name
      .split(".")
      .pop()
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "") || "jpg";
  const cleanFileName = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let { error: uploadError } = await supabase.storage
    .from("products")
    .upload(cleanFileName, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });

  // If upload failed because bucket was not found, attempt to create and retry
  if (
    uploadError &&
    (uploadError.message?.toLowerCase().includes("bucket") ||
      (uploadError as { statusCode?: number }).statusCode === 404)
  ) {
    try {
      await supabase.storage.createBucket("products", { public: true });
      const retry = await supabase.storage
        .from("products")
        .upload(cleanFileName, buffer, {
          contentType: file.type || "image/jpeg",
          upsert: true,
        });
      uploadError = retry.error;
    } catch {
      // ignore
    }
  }

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(`فشل رفع الصورة: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("products")
    .getPublicUrl(cleanFileName);

  return publicUrlData.publicUrl;
}

/**
 * Reconstructs gallery images in the exact order selected by the user
 */
function reconstructGallery(
  galleryOrderRaw: FormDataEntryValue | null,
  retainedImages: string[],
  uploadedUrls: string[],
): string[] {
  if (galleryOrderRaw && typeof galleryOrderRaw === "string") {
    try {
      const order = JSON.parse(galleryOrderRaw) as Array<{
        type: "existing" | "new";
        url?: string;
        index?: number;
      }>;
      const result: string[] = [];
      for (const item of order) {
        if (item.type === "existing" && item.url) {
          result.push(item.url);
        } else if (
          item.type === "new" &&
          typeof item.index === "number" &&
          uploadedUrls[item.index]
        ) {
          result.push(uploadedUrls[item.index]);
        }
      }
      if (result.length > 0) return result;
    } catch {
      // fallback
    }
  }
  return [...retainedImages, ...uploadedUrls];
}

/**
 * Helper to parse JSON fields safely
 */
function safeJsonParse<T>(val: FormDataEntryValue | null, fallback: T): T {
  if (!val || typeof val !== "string") return fallback;
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    description: formData.get("description"),
    price: formData.get("price"),
    compare_at_price: formData.get("compare_at_price"),
    stock: formData.get("stock"),
    available_branches: formData.get("available_branches") || "all",
    is_featured:
      formData.get("is_featured") === "true" ||
      formData.get("is_featured") === "on",
    is_active:
      formData.get("is_active") === "true" ||
      formData.get("is_active") === "on",
  };

  const parsed = ProductFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "يرجى مراجعة وتصحيح الحقول المطلوبة.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();

  // Generate unique slug
  let finalSlug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);
  if (!finalSlug) {
    finalSlug = `product-${Date.now()}`;
  }

  const { data: existingProduct } = await supabase
    .from("products")
    .select("id")
    .eq("slug", finalSlug)
    .maybeSingle();

  if (existingProduct) {
    finalSlug = `${finalSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }

  // Handle multiple image uploads
  const imageFiles = formData.getAll("gallery_files") as File[];
  const uploadedUrls: string[] = [];

  for (const file of imageFiles) {
    if (file && file.size > 0 && file.name) {
      try {
        const uploadedUrl = await uploadProductFile(supabase, file);
        uploadedUrls.push(uploadedUrl);
      } catch (err: unknown) {
        return {
          success: false,
          error: (err as Error).message || "حدث خطأ أثناء رفع صور المنتج.",
        };
      }
    }
  }

  // Retained existing images (if any)
  const retainedImages = safeJsonParse<string[]>(
    formData.get("retained_gallery_images"),
    [],
  );
  const allGalleryImages = reconstructGallery(
    formData.get("gallery_order"),
    retainedImages,
    uploadedUrls,
  );
  const primaryImageUrl =
    allGalleryImages.length > 0 ? allGalleryImages[0] : null;

  // Parse JSON/Array fields
  const colors = safeJsonParse(formData.get("colors"), null);
  const specs = safeJsonParse(formData.get("specs"), null);
  const highlights = safeJsonParse(formData.get("highlights"), null);

  const newProductData = {
    name: parsed.data.name,
    slug: finalSlug,
    brand: parsed.data.brand,
    category: parsed.data.category,
    description: parsed.data.description,
    price: parsed.data.price,
    compare_at_price: parsed.data.compare_at_price,
    image_url: primaryImageUrl,
    gallery_images: allGalleryImages,
    colors: colors,
    specs: specs,
    highlights: highlights,
    stock: parsed.data.stock,
    available_branches: parsed.data.available_branches,
    is_featured: parsed.data.is_featured,
    is_active: parsed.data.is_active,
  };

  const { error: insertError } = await supabase
    .from("products")
    .insert(newProductData);

  if (insertError) {
    console.error("Failed to create product:", insertError);
    return {
      success: false,
      error: `فشل حفظ المنتج: ${insertError.message}`,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/products");
}

/**
 * Update an existing product
 */
export async function updateProduct(
  productId: string,
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  await requireAdminSession();

  const idValidation = ProductIdSchema.safeParse(productId);
  if (!idValidation.success) {
    return { success: false, error: "معرف المنتج غير صالح." };
  }

  const rawData = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    description: formData.get("description"),
    price: formData.get("price"),
    compare_at_price: formData.get("compare_at_price"),
    stock: formData.get("stock"),
    available_branches: formData.get("available_branches") || "all",
    is_featured:
      formData.get("is_featured") === "true" ||
      formData.get("is_featured") === "on",
    is_active:
      formData.get("is_active") === "true" ||
      formData.get("is_active") === "on",
  };

  const parsed = ProductFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "يرجى مراجعة وتصحيح الحقول المطلوبة.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();

  const { data: currentProduct } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  let finalSlug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);
  if (!finalSlug)
    finalSlug = currentProduct?.slug || `product-${productId.substring(0, 8)}`;

  // Handle multiple image uploads
  const imageFiles = formData.getAll("gallery_files") as File[];
  const newlyUploadedUrls: string[] = [];

  for (const file of imageFiles) {
    if (file && file.size > 0 && file.name) {
      try {
        const uploadedUrl = await uploadProductFile(supabase, file);
        newlyUploadedUrls.push(uploadedUrl);
      } catch (err: unknown) {
        return {
          success: false,
          error: (err as Error).message || "حدث خطأ أثناء رفع صور المنتج.",
        };
      }
    }
  }

  // Retained existing images
  const retainedImages = safeJsonParse<string[]>(
    formData.get("retained_gallery_images"),
    currentProduct?.gallery_images ||
      (currentProduct?.image_url ? [currentProduct.image_url] : []),
  );

  const allGalleryImages = reconstructGallery(
    formData.get("gallery_order"),
    retainedImages,
    newlyUploadedUrls,
  );
  const primaryImageUrl =
    allGalleryImages.length > 0 ? allGalleryImages[0] : null;

  // Parse JSON/Array fields
  const colors = safeJsonParse(
    formData.get("colors"),
    currentProduct?.colors || null,
  );
  const specs = safeJsonParse(
    formData.get("specs"),
    currentProduct?.specs || null,
  );
  const highlights = safeJsonParse(
    formData.get("highlights"),
    currentProduct?.highlights || null,
  );

  const updatedData = {
    name: parsed.data.name,
    slug: finalSlug,
    brand: parsed.data.brand,
    category: parsed.data.category,
    description: parsed.data.description,
    price: parsed.data.price,
    compare_at_price: parsed.data.compare_at_price,
    image_url: primaryImageUrl,
    gallery_images: allGalleryImages,
    colors: colors,
    specs: specs,
    highlights: highlights,
    stock: parsed.data.stock,
    available_branches: parsed.data.available_branches,
    is_featured: parsed.data.is_featured,
    is_active: parsed.data.is_active,
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("products")
    .update(updatedData)
    .eq("id", productId);

  if (updateError) {
    console.error("Failed to update product:", updateError);
    return {
      success: false,
      error: `فشل تعديل المنتج: ${updateError.message}`,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${finalSlug}`);
  revalidatePath(`/products/${productId}`);
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath("/categories");
  redirect("/admin/products");
}

/**
 * Toggle product active status
 */
export async function toggleProductActive(
  productId: string,
  currentState: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({
        is_active: !currentState,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Toggle product featured status
 */
export async function toggleProductFeatured(
  productId: string,
  currentState: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .update({
        is_featured: !currentState,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(
  productId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);
    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");
    revalidatePath("/categories");
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
