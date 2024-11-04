/**
 * Calculates the CRC32 checksum for the given array.
 *
 * @param arr The array to calculate the CRC32 for, can be a Uint8Array or a string.
 * @returns The CRC32 checksum as a hexadecimal string.
 */
export function crc32(arr: Uint8Array | string): string {
  if (typeof arr === "string") {
    arr = new TextEncoder().encode(arr);
  }

  let crc: number = -1,
    i: number,
    j: number,
    l: number,
    temp: number;
  const poly: number = 0xEDB88320;

  for (i = 0, l = arr.length; i < l; i += 1) {
    temp = (crc ^ arr[i]) & 0xff;
    for (j = 0; j < 8; j += 1) {
      if ((temp & 1) === 1) {
        temp = (temp >>> 1) ^ poly;
      } else {
        temp = temp >>> 1;
      }
    }
    crc = (crc >>> 8) ^ temp;
  }

  return numberToHex(crc ^ -1);
}

/**
 * CRC32 stream processing class for incrementally calculating the CRC32 checksum.
 */
export class Crc32Stream {
  private bytes: number[] = [];
  private poly = 0xEDB88320;
  private crc = 0 ^ -1;
  private encoder = new TextEncoder();
  #crc32: string = "";

  constructor() {
    this.reset();
  }

  /**
   * Gets the current CRC32 checksum.
   * @returns The current CRC32 checksum as a hexadecimal string.
   */
  get crc32(): string {
    return this.#crc32;
  }

  /**
   * Resets the state of the CRC32 stream.
   */
  reset(): void {
    this.#crc32 = "";
    this.crc = 0 ^ -1;

    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) {
        if (c & 1) {
          c = this.poly ^ (c >>> 1);
        } else {
          c = c >>> 1;
        }
      }
      this.bytes[n] = c >>> 0;
    }
  }

  /**
   * Appends new data to the CRC32 stream and updates the checksum.
   *
   * @param arr The data to append, can be a Uint8Array or a string.
   * @returns The updated CRC32 checksum as a hexadecimal string.
   */
  append(arr: Uint8Array | string): string {
    if (typeof arr === "string") {
      arr = this.encoder.encode(arr);
    }

    let crc = this.crc;

    for (let i = 0, l = arr.length; i < l; i += 1) {
      crc = (crc >>> 8) ^ this.bytes[(crc ^ arr[i]) & 0xff];
    }

    this.crc = crc;
    this.#crc32 = numberToHex(crc ^ -1);
    return this.#crc32;
  }
}

/**
 * Converts a number to a hexadecimal string.
 *
 * @param n The number to convert.
 * @returns The converted hexadecimal string.
 */
export function numberToHex(n: number): string {
  return (n >>> 0).toString(16).padStart(8, "0");
}

/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * @param str The hexadecimal string to convert.
 * @returns The converted Uint8Array.
 * @throws Throws an error if the string is invalid.
 */
export function hexToUint8Array(str: string): Uint8Array {
  if (str.length === 0 || str.length % 2 !== 0) {
    throw new Error(`The string "${str}" is not valid hex.`);
  }
  return new Uint8Array(
    str.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
  );
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * @param bytes The Uint8Array to convert.
 * @returns The converted hexadecimal string.
 */
export function uint8ArrayToHex(bytes: Uint8Array): string {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    "",
  );
}
