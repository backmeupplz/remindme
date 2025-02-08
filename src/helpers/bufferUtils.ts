export function uint8ArrayToHex(uint8Array: Uint8Array) {
  return Array.from(uint8Array)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToUint8Array(hexString: string) {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even length");
  }
  const uint8Array = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    uint8Array[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return uint8Array;
}