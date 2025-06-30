import * as z from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  image: z.string().url('Image URL must be valid'),
});

export type Product = z.infer<typeof productSchema> & { id: number; rating: { rate: number; count: number } };
