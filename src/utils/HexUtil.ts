export function toHexString(
  bytes: Uint8Array | undefined,
  separator = '',
  uppercase = false,
) {
  if (bytes === undefined) {
    return '';
  }

  const hexArray: string[] = [];
  bytes.forEach(byte => {
    const hex = byte.toString(16).padStart(2, '0');
    hexArray.push(hex);
  });
  let hexString = hexArray.join(separator);
  if (uppercase) {
    hexString = hexString.toUpperCase();
  }
  return hexString;
}
