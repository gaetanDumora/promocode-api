import { FastifyInstance } from "fastify";
import { registerCode, validateCode } from "./promocode.controller";
import { $ref } from "./promocode.schema";

async function promocodeRoutes(server: FastifyInstance) {
  server.post(
    "/register",
    {
      schema: {
        body: $ref("registerCodeDTO"),
        response: { 201: $ref("registerCodeResponseDTO") },
      },
    },
    registerCode
  );
  server.post(
    "/validate",
    {
      schema: {
        body: $ref("validateCodeDTO"),
        response: {
          200: $ref("validateCodeResponseDTO"),
        },
      },
    },
    validateCode
  );
}

export default promocodeRoutes;
