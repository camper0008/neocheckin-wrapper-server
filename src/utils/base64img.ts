import { createHash } from "crypto";

export type BinaryString = string;
export type Base64 = string;
export type Md5Hash = string;

export const base64FromBinaryString = (binaryString: BinaryString): string => {
  const buffer = Buffer.from(binaryString, 'binary');
  const base64 = buffer.toString('base64');
  return base64;
}

export const base64hash = (base64: Base64): Md5Hash => {
  return createHash('md5').update(base64).digest('hex');
}
