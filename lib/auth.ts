// most of the code are copied from
// https://github.com/mehmetpekcan/nextjs-13-jwt-auth-example
// thanks to mehmetpeckan for creating examples! hehe

// mengambil secret key reahasiya yang di set pada .env
export function getJWTSecretKey(): Uint8Array {
  const secret = process.env["RAHASIA_JWT_BROW"];
  if (!secret) {
    throw new Error(
      "RAHASIA_JWT_BROW or commonly known as jwt secret key must be set properly"
    );
  }
  return new TextEncoder().encode(secret);
}
