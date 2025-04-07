const kv = await Deno.openKv();

export interface Product {
  name: string;
  quantity: number;
}

export async function getProduct(
  name: string,
): Promise<Product> {
  if (!name) {
    throw new Error("A name and quantity are required");
  }

  const res = await kv.get(["products", name]);

  if (res.value) {
    const p: Product = res.value as Product;
    return p;
  } else {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const products: Product[] = [];
  const iterator = kv.list({ prefix: ["products"] });

  for await (const entry of iterator) {
    products.push(entry.value as Product);
  }

  return products;
}

export async function createProduct(
  name: string,
  quantity: number,
): Promise<Product> {
  if (!name || !quantity) {
    throw new Error("A name and quantity are required");
  }

  const key = ["products", name];
  const value: Product = { name, quantity };

  const res = await kv.atomic()
    .check({ key, versionstamp: null })
    .set(key, value)
    .commit();

  if (res.ok) {
    return value;
  } else {
    throw new Error("Failed to create product");
  }
}
