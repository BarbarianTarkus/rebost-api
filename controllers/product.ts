import { Context } from "node:vm";
import { Product } from "../interfaces/Product.ts";
import { Context } from "@oak/oak";

const kv = await Deno.openKv();

export default {
  getAllProducts: async ({ response }: Context) => {
    const products: Product[] = [];

    try {
      for await (const product of kv.list<Product>({ prefix: ["products"] })) {
        products.push(product.value);
      }
      response.status = 200;
      response.body = {
        success: true,
        data: products,
      };
    } catch (error) {
      response.status = 500;
      response.body = {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
  createProduct: async ({ request, response }: Context) => {
    const body = await request.body.json();

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: body.name,
      quantity: body.quantity,
    };

    try {
      const key = ["products", newProduct.id];
      const value = newProduct;

      await kv.atomic()
        .check({ key, versionstamp: null })
        .set(key, value)
        .commit();

      response.body = {
        success: true,
        data: newProduct,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
  getProductById: async (
    { params, response }: { params: { id: string }; response: Context },
  ) => {
    const { id } = params;
    try {
      const res = await kv.get(["products", id]);
      const product: Product = res.value as Product;

      if (!product) {
        throw new Error("Product not found");
      }

      response.status = 200;
      response.body = {
        success: true,
        data: product,
      };
    } catch (error) {
      response.status = 404;
      response.body = {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
  updateProductById: async (
    { params, request, response }: {
      params: { id: string };
      request: Context;
      response: Context;
    },
  ) => {
    const { id } = params;
    const body = await request.body.json();

    const updatedProduct: Product = {
      id,
      name: body.name,
      quantity: body.quantity,
    };

    try {
      const res = await kv.set(["products", id], updatedProduct);

      if (res.versionstamp) {
        throw new Error("Product not found");
      }

      response.status = 200;
      response.body = {
        success: true,
        data: updatedProduct,
      };
    } catch (error) {
      response.status = 400;
      response.body = {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
  deleteProductById: async ({ params, response }: Context) => {
    const { id } = params;
    try {
      const res = await kv.get(["products", id]);
      const product: Product = res.value as Product;
      if (!product) {
        throw new Error("Product not found");
      } else {
        kv.delete(["products", id]);
      }
      response.status = 200;
      response.body = {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      response.status = 404;
      response.body = {
        success: false,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  },
};
