import crypto from "crypto";

// Simple AES-256-GCM encrypt/decrypt for storing OAuth tokens at rest.
// ENCRYPTION_KEY must be exactly 32 characters (256 bits).
const ALGORITHM = "aes-256-gcm";

const getKey = () => Buffer.from(process.env.ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32));

export const encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
};

export const decrypt = (payload) => {
  const buf = Buffer.from(payload, "base64");
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(12, 28);
  const encrypted = buf.subarray(28);
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
};
