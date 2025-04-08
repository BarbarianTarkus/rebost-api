import { Application } from "@oak/oak";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";

import productRouter from "./routes/product.ts";

const app = new Application();
const port = 8693;

app.use(productRouter.routes());
app.use(productRouter.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(
    `${yellow("Listening on:")} ${green(url)}`,
  );
});

await app.listen({ port });
