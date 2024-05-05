import Fastify from "fastify";
import config from "./config/config.app";
import { promocodeSchemas } from "./promocode/promocode.schema";
import promocodeRoutes from "./promocode/promocode.route";

const fastify = Fastify();

const start = async () => {
  try {
    for (const schema of promocodeSchemas) {
      fastify.addSchema(schema);
    }

    await fastify.register(promocodeRoutes, { prefix: "api/v1/promocode" });
    const port = parseInt(config.PORT, 10);
    await fastify.listen({ port });
    console.log(`Fastify server running on port: ${port}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
