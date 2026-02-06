import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(20).default(5),
});

export const overdueFilterSchema = z.object({
  min_days_atraso: z.coerce.number().min(0).default(0),
});