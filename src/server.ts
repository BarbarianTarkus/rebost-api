import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";
import { Application } from "@oak/oak";

import productRouter from "routes/product.ts";
import userRouter from "routes/user.ts";
import logger from "middlewares/logger.ts";
import notFound from "middlewares/notFound.ts";

const app = new Application();
const port = 8693;

// order of execution is important;
app.use(logger.logger);
app.use(logger.responseTime);

app.use(productRouter.routes());
app.use(userRouter.routes());
app.use(productRouter.allowedMethods());

// 404 page
app.use(notFound);

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(
    `${yellow("Listening on:")} ${green(url)}`,
  );
});

await app.listen({ port });
