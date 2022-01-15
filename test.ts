import {
  assert,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts";
import {
  crc32,
  Crc32Stream,
  hexToUint8Array,
  uint8ArrayToHex,
  numberToHex,
} from "./mod.ts";

const str = "deno";
const str2 = "33";
const bytes = new TextEncoder().encode(str);
const crc32_deno = "fd6f8c63";
const crc32_33 = "0a6216d9"; // Crc with a leading zero

Deno.test("crc32", () => {
  assertEquals(crc32(str), crc32_deno);
  assertEquals(crc32(bytes), crc32_deno);
  assertEquals(crc32(str2), crc32_33);
});

Deno.test("Crc32Stream", () => {
  const crc32Stream = new Crc32Stream();
  crc32Stream.append("d"); // 98dd4acc  === crc32("d")
  crc32Stream.append("e"); // 7d90298b  === crc32("de")
  crc32Stream.append("n"); // 021f6953  === crc32("den")
  assertEquals(crc32Stream.crc32, "021f6953");
  assertEquals(crc32Stream.append("o"), crc32_deno);
  assertEquals(crc32Stream.crc32, crc32_deno);
  assertEquals(crc32Stream.crc32, crc32_deno);

  crc32Stream.reset();

  crc32Stream.append("d"); // 98dd4acc  === crc32("d")
  crc32Stream.append("e"); // 7d90298b  === crc32("de")
  crc32Stream.append("n"); // 021f6953  === crc32("den")
  assertEquals(crc32Stream.crc32, "021f6953");
  assertEquals(crc32Stream.append("o"), crc32_deno);
  assertEquals(crc32Stream.crc32, crc32_deno);
  assertEquals(crc32Stream.crc32, crc32_deno);
});

Deno.test("hexToUint8Array", () => {
  const bytes = hexToUint8Array(crc32_deno);
  assert(parseInt("fd", 16) === bytes[0]);
  assert(parseInt("6f", 16) === bytes[1]);
  assert(parseInt("8c", 16) === bytes[2]);
  assert(parseInt("63", 16) === bytes[3]);
});

Deno.test("uint8ArrayToHex", () => {
  const bytes = new Uint8Array([
    parseInt("fd", 16),
    parseInt("6f", 16),
    parseInt("8c", 16),
    parseInt("63", 16),
  ]);
  assertEquals(uint8ArrayToHex(bytes), crc32_deno);
});
