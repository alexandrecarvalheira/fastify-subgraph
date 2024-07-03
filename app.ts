import fastify from "fastify";
import "dotenv/config";
import { graphHandler } from "./handlers";

const port = process.env.PORT || 3000;
const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;

const server = fastify({
  logger: true,
});

// fastify.get("/", function (request, reply) {
//   reply.type("text/html").send(html);
// });

server.get("/", graphHandler);
server.listen({ port: Number(port), host }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
