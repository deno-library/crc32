# crc32  
A TypeScript implementation of crc32, can be use for deno.

> CRC means 'Cyclic Redundancy Check' and is a way to checksum data. It is a simple algorithm based on polynomials and is used in such projects as gzip.

## Definition
```ts
crc32(arr: Uint8Array | string): string;
class Crc32Stream {
  reset(): void;
  append(arr: Uint8Array | string): string;
  get crc32(): string;
}
hexToUint8Array(str: string): Uint8Array;
uint8ArrayToHex(bytes: Uint8Array): string;
```

## Usage  

__basic__  
```ts  
import { crc32 } from "https://deno.land/x/crc32/mod.ts";

const str = "deno";
const bytes = new TextEncoder().encode(str);

const crc32_deno = "fd6f8c63";

assert(crc32(str) === crc32_deno);
assert(crc32(bytes) === crc32_deno);
```  

__Crc32Stream__  
Used to calculate src32 value for large file
```ts  
import { Crc32Stream } from "https://deno.land/x/crc32/mod.ts";

const crc32_deno = "fd6f8c63";

const crc32Stream = new Crc32Stream();
crc32Stream.append("d"); // 98dd4acc  === crc32("d")
crc32Stream.append("e"); // 7d90298b  === crc32("de")
crc32Stream.append("n"); // 21f6953   === crc32("den")
const val = crc32Stream.append("o");
assertEquals(val, crc32_deno);
assertEquals(crc32Stream.crc32, crc32_deno);
assertEquals(crc32Stream.crc32, crc32_deno);

crc32Stream.reset();

crc32Stream.append("d"); // 98dd4acc  === crc32("d")
crc32Stream.append("e"); // 7d90298b  === crc32("de")
crc32Stream.append("n"); // 21f6953   === crc32("den")
const val = crc32Stream.append("o");
assertEquals(val, crc32_deno);
assertEquals(crc32Stream.crc32, crc32_deno);
assertEquals(crc32Stream.crc32, crc32_deno);
```  

## Other methods

```ts  
import {
  hexToUint8Array,
  uint8ArrayToHex,
} from "https://deno.land/x/crc32/mod.ts";

const crc32_deno = "fd6f8c63";

// hexToUint8Array
const bytes = hexToUint8Array(crc32_deno);
assert(parseInt("fd", 16) === bytes[0]);
assert(parseInt("6f", 16) === bytes[1]);
assert(parseInt("8c", 16) === bytes[2]);
assert(parseInt("63", 16) === bytes[3]);

// uint8ArrayToHex
const bytes = new Uint8Array([
  parseInt("fd", 16),
  parseInt("6f", 16),
  parseInt("8c", 16),
  parseInt("63", 16),
]);
assert(uint8ArrayToHex(bytes) === crc32_deno);
```
