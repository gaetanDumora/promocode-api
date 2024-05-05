import { FastifyReply, FastifyRequest } from "fastify";
import {
  RegisterCodeDTO,
  ValidateCodeDTO,
  ValidateCodeResponseDTO,
} from "./promocode.schema";
import { memoryStorage } from "../services/storage/memory.storage";
import { validatePromocode } from "./validators/validator.promocode";

const formatErr = (errors: Record<string, any>[]) => {
  return errors.map((err) => {
    const { context, isValid, ...reason } = err;
    return reason;
  });
};

export async function registerCode(
  request: FastifyRequest<{ Body: RegisterCodeDTO }>,
  reply: FastifyReply
) {
  const { body } = request;
  try {
    memoryStorage.set(body.name, body);
    return reply.code(201).send({ status: "ok" });
  } catch (error) {
    return reply.code(500).send(error);
  }
}

export async function validateCode(
  request: FastifyRequest<{ Body: ValidateCodeDTO }>,
  reply: FastifyReply
) {
  const { body } = request;
  const { arguments: candidate, promocode_name } = body;
  try {
    const promocode = memoryStorage.get(promocode_name);
    if (!promocode) {
      throw new Error(`promocode: ${promocode_name} not found`);
    }
    const result = await validatePromocode(candidate, promocode.restrictions);

    const isErrors = result.errors.length;

    const response: ValidateCodeResponseDTO = {
      promocode_name,
      status: isErrors ? "denied" : "accepted",
      ...(isErrors
        ? { reasons: formatErr(result.errors) }
        : { advantage: promocode.advantage }),
    };

    return reply.code(200).send(JSON.stringify(response));
  } catch (error) {
    return reply.code(500).send(error);
  }
}
