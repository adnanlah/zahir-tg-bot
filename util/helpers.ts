import crypto from "crypto";

export const calculateSHA256 = (buffer: Buffer) => {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
};
