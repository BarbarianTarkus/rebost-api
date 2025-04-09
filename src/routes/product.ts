import { Router } from "@oak/oak";

const router = new Router();

import productController from "controllers/product.ts";

router
  .get("/products", productController.getAllProducts)
  .post("/products", productController.createProduct)
  .get("/products/:id", productController.getProductById)
  .put("/products/:id", productController.updateProductById)
  .delete("/products/:id", productController.deleteProductById);

export default router;
