import { Context } from "@oak/oak";
import * as yup from "npm:yup";
import { User } from "interfaces/User.ts";
import { UserModel } from "models/user.ts";
import { generateJwt, validateJwt } from "../helpers.ts";

export function hello(ctx: Context) {
  const { response } = ctx;
  response.status = 200;
  response.body = {
    message: "Hello, World",
  };
}

const signupSchema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
  name: yup.string().required(),
});

const loginSchema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  password: yup.string().required(),
});

/**
 * POST /users
 * Register a new user
 * @param user User
 * @returns userId string
 */
export async function signup(ctx: Context) {
  const { request, response } = ctx;

  try {
    const body = await request.body.json();

    await signupSchema.validate(body);

    const userId = crypto.randomUUID();

    // check if the user with this email already registerd
    const userIdAlreadyExists = await UserModel.getUserByEmail(body.email);

    if (userIdAlreadyExists) {
      response.status = 400;
      response.body = {
        message: `User with email : ${body.email} already exist`,
      };
      return;
    }

    const newUser: User = {
      id: userId,
      email: body.email,
      name: body.name,
      password: body.password,
    };

    const id = await UserModel.createUser(newUser);

    const jwt = await generateJwt({ userId: id });

    response.status = 201;
    response.body = {
      data: jwt,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * POST /login
 * Login a user
 * @param ctx
 * @returns
 */
export async function login(ctx: Context) {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const data = body;
    await loginSchema.validate(data);

    // check if the user with this email already registerd
    const userId = await UserModel.getUserByEmail(data.email);
    if (!userId) {
      response.status = 400;
      response.body = {
        message: `User with email : ${data.email} not found`,
      };
      return;
    }

    const user = await UserModel.passwordCheck(
      userId,
      data.password,
    );

    if (!user) {
      response.status = 400;
      response.body = {
        message: "Bad password",
      };
      return;
    }

    const jwt = await generateJwt({ userId: userId });

    response.status = 201;
    response.body = {
      message: "Login successfully",
      data: jwt,
    };
  } catch (error) {
    throw error;
  }
}

/**
 * GET /me
 * Get the current user
 * @param ctx
 * @returns
 */
export async function me(ctx: Context) {
  try {
    const { request, response } = ctx;
    const jwt = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!jwt) {
      response.status = 401;
      response.body = {
        message: "Unauthorized",
      };
      return;
    }

    const payload = await validateJwt(jwt);

    if (!payload) {
      response.status = 401;
      response.body = {
        message: "Unauthorized",
      };
      return;
    }

    const user = await UserModel.getUserById(payload.userId as string);
    if (!user) {
      response.status = 401;
      response.body = {
        message: "Unauthorized",
      };
      return;
    }

    response.status = 200;
    response.body = user;
  } catch (error) {
    throw error;
  }
}
