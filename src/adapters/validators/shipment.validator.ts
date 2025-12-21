import { z } from "zod";

export const quoteSchema = z.object({
  weight: z.number().positive("Peso debe ser positivo"),
  dimensions: z.object({
    length: z.number().positive("Largo debe ser positivo"),
    width: z.number().positive("Ancho debe ser positivo"),
    height: z.number().positive("Alto debe ser positivo"),
  }),
  originId: z.number().int().positive("ID de origen inválido"),
  destinationId: z.number().int().positive("ID de destino inválido"),
});

export const createShipmentSchema = z.object({
  origin: z.object({
    id: z.number().int().positive("ID de origen inválido"),
    cityName: z.string().min(1, "Nombre de ciudad requerido"),
  }),
  destination: z.object({
    id: z.number().int().positive("ID de destino inválido"),
    cityName: z.string().min(1, "Nombre de ciudad requerido"),
  }),
  actualWeight: z.number().positive("Peso real debe ser positivo"),
  volumetricWeight: z.number().int().nonnegative("Peso volumétrico inválido"),
  chargeableWeight: z.number().int().positive("Peso cobrable inválido"),
  rate: z.object({
    id: z.number().int().positive("ID de tarifa inválido"),
    basePriceCents: z.number().int().nonnegative("Precio base inválido"),
    pricePerKgCents: z.number().int().nonnegative("Precio por kg inválido"),
  }),
  totalPriceCents: z.number().int().positive("Precio total inválido"),
  dimensions: z.object({
    length: z.number().positive("Largo debe ser positivo"),
    width: z.number().positive("Ancho debe ser positivo"),
    height: z.number().positive("Alto debe ser positivo"),
  }),
});

export function validate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
