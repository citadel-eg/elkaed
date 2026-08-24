import { z } from 'zod';

export const ProductFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(255, 'Product name must be less than 255 characters'),
  slug: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : undefined)),
  description: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  price: z.coerce
    .number()
    .min(0, 'Price must be greater than or equal to 0'),
  compare_at_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : val),
    z.coerce.number().min(0, 'Compare-at price must be greater than or equal to 0').nullable().optional()
  ),
  category: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val && val.trim() !== '' ? val.trim() : null)),
  stock: z.coerce
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock must be greater than or equal to 0'),
  is_active: z.preprocess(
    (val) => val === true || val === 'true' || val === 'on' || val === 1 || val === '1',
    z.boolean().default(true)
  ),
});

export const ProductIdSchema = z.string().uuid('Invalid Product ID format');

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
