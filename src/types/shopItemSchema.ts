import { z } from 'zod';

export const shopItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  shopType: z.string().default('supermarket'),
  latitude: z.number(),
  longitude: z.number(),
});

export type ShopItem = z.infer<typeof shopItemSchema>;
