import {
  bgRed,
  cyan,
  green,
  white,
} from "https://deno.land/std@0.53.0/fmt/colors.ts";

import { Context } from "jsr:@oak/oak@^17.1.4";

const X_RESPONSE_TIME: string = "X-Response-Time";

export default {
  logger: async (
    { response, request }: Context,
    next: () => Promise<unknown>,
  ) => {
    await next();
    const responseTime = response.headers.get(X_RESPONSE_TIME);
    console.log(`${green(request.method)} ${cyan(request.url.pathname)}`);
    console.log(`${bgRed(white(String(responseTime)))}`);
  },
  responseTime: async (
    { response }: Context,
    next: () => Promise<unknown>,
  ) => {
    const start = Date.now();
    await next();
    const ms: number = Date.now() - start;
    response.headers.set(X_RESPONSE_TIME, `${ms}ms`);
  },
};
