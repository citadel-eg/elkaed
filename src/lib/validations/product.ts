import { z } from 'zod';

export const ProductColorSchema = z.object({
  name: z.string().trim().min(1, 'اسم اللون مطلوب'),
  hex: z.string().trim().min(1, 'رمز اللون مطلوب'),
});

export const ProductFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'اسم المنتج مطلوب')
    .max(255, 'يجب أن يكون اسم المنتج أقل من 255 حرفًا'),
  slug: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : undefined)),
  brand: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  category: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  description: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  price: z.coerce
    .number()
    .min(0, 'يجب أن يكون السعر أكبر من أو يساوي 0'),
  compare_at_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.coerce.number().min(0, 'يجب أن يكون السعر قبل الخصم أكبر من 0').nullable().optional()
  ),
  stock: z.coerce
    .number()
    .int('يجب أن يكون المخزون رقمًا صحيحًا')
    .min(0, 'يجب أن يكون المخزون أكبر من أو يساوي 0')
    .default(0),
  available_branches: z.enum(['all', 'mahalla', 'samanoud']).default('all'),
  is_featured: z.preprocess(
    (val) => val === true || val === 'true' || val === 'on' || val === 1 || val === '1',
    z.boolean().default(false)
  ),
  is_active: z.preprocess(
    (val) => val === true || val === 'true' || val === 'on' || val === 1 || val === '1',
    z.boolean().default(true)
  ),
});

export const ProductIdSchema = z.string().uuid('معرف المنتج غير صالح');

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
