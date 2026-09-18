import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET || "fallback_manager_secret_key_change_in_prod";
const key = new TextEncoder().encode(SECRET_KEY);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(managerId: string): Promise<string> {
  const token = await new SignJWT({ managerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);

  cookies().set({
    name: "manager_session",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return token;
}

export async function verifySession(): Promise<{ managerId: string } | null> {
  const token = cookies().get("manager_session")?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, key);
    return verified.payload as { managerId: string };
  } catch (err) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  cookies().set({
    name: "manager_session",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
}