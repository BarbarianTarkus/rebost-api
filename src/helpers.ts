import "jsr:@std/dotenv/load";
import { JWTPayload, jwtVerify, SignJWT } from "npm:jose@5.9.6";

const secret = new TextEncoder().encode(Deno.env.get("SECRET"));

/**
 * JWT token creation
 * @param payload
 * @returns JWT token
 */
async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return jwt;
}

/**
 * JWT token generation
 * @param userId
 * @returns Payload
 */
export async function generateJwt(
  { userId: id }: { userId: string },
): Promise<string> {
  if (!id) {
    throw new Error("User ID is required");
  }
  const payload = { userId: id };
  const token = await createJWT({ userId: id });
  const validate = await validateJwt(token);
  if (validate == payload) {
    console.log("JWT is valid");
  }
  return token;
}

/**
 * JWT token validation
 * @param token
 * @returns payload or null if invalid
 */
export async function validateJwt(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error("Error validating JWT:", error);
    return null;
  }
}
