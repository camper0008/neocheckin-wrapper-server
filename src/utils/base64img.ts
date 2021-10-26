
export type BinaryString = string;

export const base64FromBinaryString = (binaryString: BinaryString): string => {
  const buffer = Buffer.from(binaryString, 'binary');
  const base64 = buffer.toString('base64');
  return base64;
}
