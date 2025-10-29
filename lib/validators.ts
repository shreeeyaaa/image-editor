import { z } from "zod";

export const assetUploadSchema = z.object({
  
});

export const designSchema = z.object({
  title: z.string().min(1),
  width: z.number().min(1),
  height: z.number().min(1),
});

export const layerSchema = z.object({
  assetId: z.string().optional(),
  type: z.enum(["IMAGE"]),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  rotation: z.number().optional(),
  flipX: z.boolean().optional(),
  flipY: z.boolean().optional(),
  opacity: z.number().optional(),
  zIndex: z.number().optional(),
  cropX: z.number().optional(),
  cropY: z.number().optional(),
  cropW: z.number().optional(),
  cropH: z.number().optional(),
});
