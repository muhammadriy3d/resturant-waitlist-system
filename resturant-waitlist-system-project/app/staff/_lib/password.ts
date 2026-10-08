import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const HASH_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, HASH_LENGTH);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [saltHex, hashHex] = storedHash.split(":");
  if (!saltHex || !hashHex || !/^[a-f0-9]{32}$/i.test(saltHex)) {
    return false;
  }

  const expectedHash = Buffer.from(hashHex, "hex");
  if (expectedHash.length !== HASH_LENGTH) {
    return false;
  }

  const actualHash = scryptSync(password, Buffer.from(saltHex, "hex"), HASH_LENGTH);
  return timingSafeEqual(actualHash, expectedHash);
}
