'use server';

import { requireAdminSession } from '@/lib/auth/session';
import { createAdminClient } from '@/lib/supabase/admin';
import { ProductFormSchema, ProductIdSchema } from '@/lib/validations/product';
import { slugify } from '@/lib/utils/slugify';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionState {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Uploads a product image file to Supabase storage bucket 'products'
 */
async function uploadProductImage(
  supabase: ReturnType<typeof createAdminClient>,
  productId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${productId}/${cleanFileName}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from('products')
    .upload(filePath, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from('products')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * Deletes a product image from Supabase storage if it matches our bucket URL
 */
async function deleteProductImageFromStorage(
  supabase: ReturnType<typeof createAdminClient>,
  imageUrl: string
) {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/products/');
    if (parts.length > 1) {
      const storagePath = decodeURIComponent(parts[1]);
      await supabase.storage.from('products').remove([storagePath]);
    }
  } catch (err) {
    console.warn('Could not parse image URL for deletion cleanup:', err);
  }
}

/**
 * Create a new product
 */
export async function createProduct(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    compare_at_price: formData.get('compare_at_price'),
    category: formData.get('category'),
    stock: formData.get('stock'),
    is_active: formData.get('is_active') === 'true' || formData.get('is_active') === 'on',
  };

  const parsed = ProductFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix validation errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();
  const productId = crypto.randomUUID();

  // Handle Slug generation if omitted
  let finalSlug = parsed.data.slug || slugify(parsed.data.name);
  if (!finalSlug) {
    finalSlug = `product-${productId.substring(0, 8)}`;
  }

  // Handle image upload if a file was provided
  let imageUrl: string | null = null;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    try {
      imageUrl = await uploadProductImage(supabase, productId, imageFile);
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Image upload failed.',
      };
    }
  }

  const { error: insertError } = await supabase.from('products').insert({
    id: productId,
    name: parsed.data.name,
    slug: finalSlug,
    description: parsed.data.description || null,
    price: parsed.data.price,
    compare_at_price: parsed.data.compare_at_price || null,
    image_url: imageUrl,
    category: parsed.data.category || null,
    stock: parsed.data.stock,
    is_active: parsed.data.is_active,
  });

  if (insertError) {
    console.error('Failed to insert product into database:', insertError);
    if (insertError.code === '23505') {
      return {
        success: false,
        error: `A product with slug "${finalSlug}" already exists. Please choose a different name or slug.`,
      };
    }
    return {
      success: false,
      error: `Database error: ${insertError.message}`,
    };
  }

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  redirect('/admin/products');
}

/**
 * Update an existing product
 */
export async function updateProduct(
  productId: string,
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  await requireAdminSession();

  const idParsed = ProductIdSchema.safeParse(productId);
  if (!idParsed.success) {
    return { success: false, error: 'Invalid product ID.' };
  }

  const rawData = {
    name: formData.get('name'),
    slug: formData.get('slug'),
    description: formData.get('description'),
    price: formData.get('price'),
    compare_at_price: formData.get('compare_at_price'),
    category: formData.get('category'),
    stock: formData.get('stock'),
    is_active: formData.get('is_active') === 'true' || formData.get('is_active') === 'on',
  };

  const parsed = ProductFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix validation errors in the form.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createAdminClient();

  // Get current product details
  const { data: existingProduct, error: fetchError } = await supabase
    .from('products')
    .select('id, image_url')
    .eq('id', productId)
    .single();

  if (fetchError || !existingProduct) {
    return { success: false, error: 'Product not found.' };
  }

  let finalSlug = parsed.data.slug || slugify(parsed.data.name);
  if (!finalSlug) {
    finalSlug = `product-${productId.substring(0, 8)}`;
  }

  let imageUrl = existingProduct.image_url;
  const imageFile = formData.get('image') as File | null;
  if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
    try {
      imageUrl = await uploadProductImage(supabase, productId, imageFile);
      if (existingProduct.image_url) {
        await deleteProductImageFromStorage(supabase, existingProduct.image_url);
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Image upload failed.',
      };
    }
  }

  const { error: updateError } = await supabase
    .from('products')
    .update({
      name: parsed.data.name,
      slug: finalSlug,
      description: parsed.data.description || null,
      price: parsed.data.price,
      compare_at_price: parsed.data.compare_at_price || null,
      image_url: imageUrl,
      category: parsed.data.category || null,
      stock: parsed.data.stock,
      is_active: parsed.data.is_active,
    })
    .eq('id', productId);

  if (updateError) {
    console.error('Failed to update product in database:', updateError);
    if (updateError.code === '23505') {
      return {
        success: false,
        error: `A product with slug "${finalSlug}" already exists. Please choose a different slug.`,
      };
    }
    return {
      success: false,
      error: `Database error: ${updateError.message}`,
    };
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath('/products');
  revalidatePath(`/products/${productId}`);
  revalidatePath('/');
  redirect('/admin/products');
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();

    const idParsed = ProductIdSchema.safeParse(productId);
    if (!idParsed.success) {
      return { success: false, error: 'Invalid product ID.' };
    }

    const supabase = createAdminClient();

    // Fetch existing product for image cleanup
    const { data: existingProduct } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', productId)
      .single();

    if (existingProduct?.image_url) {
      await deleteProductImageFromStorage(supabase, existingProduct.image_url);
    }

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (deleteError) {
      console.error('Failed to delete product:', deleteError);
      return { success: false, error: `Failed to delete product: ${deleteError.message}` };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete product.',
    };
  }
}

/**
 * Toggle product is_active status
 */
export async function toggleProductActive(
  productId: string,
  currentStatus: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdminSession();

    const idParsed = ProductIdSchema.safeParse(productId);
    if (!idParsed.success) {
      return { success: false, error: 'Invalid product ID.' };
    }

    const supabase = createAdminClient();
    const { error: updateError } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', productId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update status.',
    };
  }
}
