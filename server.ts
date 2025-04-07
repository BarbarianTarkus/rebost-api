import { Application, Context, Router } from "@oak/oak";
import { createProduct, getProduct, getProducts, Product } from "./db.ts";

const app = new Application();
const api = new Router();

api.get("/", (ctx) => {
  ctx.response.body = "Hello World!";
});
api.get("/products", async (ctx) => {
  const products: Product[] = await getProducts();
  ctx.response.body = JSON.stringify(products);
});

api.get("/products/:name", async (ctx) => {
  const product: Product = await getProduct(ctx.params.name);
  ctx.response.body = JSON.stringify(product);
});

api.post("/create", async (ctx: Context) => {
  const body = await ctx.request.body.json();

  const product: Product = {
    name: body.name,
    quantity: body.quantity,
  };

  const newProduct: Product = await createProduct(
    product.name,
    product.quantity,
  );

  ctx.response.body = newProduct;
});

app.use(api.routes());
app.use(api.allowedMethods());

await app.listen({ port: 8693 });
