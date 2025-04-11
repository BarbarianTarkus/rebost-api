import { Context } from "jsr:@oak/oak@^17.1.4";
import { validateJwt } from "../helpers.ts";
import { User } from "../interfaces/User.ts";
import { UserModel } from "../models/user.ts";

export async function handleAuthHeader(
  ctx: Context<{ user: Omit<User, "password"> | null }>,
  next: () => Promise<void>,
) {
  try {
    const { request, state } = ctx;

    const jwt = request.headers.get("authorization")?.split("bearer ")?.[1] ||
      "";

    const validatedJwt = await validateJwt(jwt);

    if (!validatedJwt) {
      state.user = null;
    }

    const user = await UserModel.getUserById(
      validatedJwt?.userId as string,
    );

    if (!user) {
      state.user = null;
    }

    state.user = user;
    await next();
  } catch (error) {
    throw error;
  }
}
