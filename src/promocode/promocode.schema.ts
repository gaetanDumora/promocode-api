import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const registerCodeDTO = z.object({
  name: z.string(),
  advantage: z.object({
    percent: z.number(),
  }),
  restrictions: z.array(
    z.record(z.string(), z.unknown()),
    z.record(z.string(), z.unknown())
  ),
});

export type RegisterCodeDTO = z.infer<typeof registerCodeDTO>;
const registerCodeResponseDTO = z.object({
  status: z.string(),
});
export type RegisterCodeResponseDTO = z.infer<typeof registerCodeResponseDTO>;

const validateCodeDTO = z.object({
  promocode_name: z.string(),
  arguments: z.object({
    age: z.number().optional(),
    town: z.string().optional(),
    date: z.string().optional(),
  }),
});
export type ValidateCodeDTO = z.infer<typeof validateCodeDTO>;

const validateCodeResponseDTO = z.object({
  promocode_name: z.string(),
  status: z.string(),
  advantage: z
    .object({
      percent: z.number(),
    })
    .optional(),
  reasons: z.array(z.record(z.string(), z.string())).optional(),
});
export type ValidateCodeResponseDTO = z.infer<typeof validateCodeResponseDTO>;

export const { schemas: promocodeSchemas, $ref } = buildJsonSchemas(
  {
    registerCodeDTO,
    registerCodeResponseDTO,
    validateCodeDTO,
    validateCodeResponseDTO,
  },
  { $id: "promocodeSchemas" }
);
