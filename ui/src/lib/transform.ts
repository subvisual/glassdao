import { Field } from "o1js";

/* 
01js doesnt export these utils, so replicate them here
*/

const STOP = 0x01;

function bytesOfConstantField(field: Field): Uint8Array {
  return Uint8Array.from(Field.toBytes(field));
}

function bytesToFields(bytes: Uint8Array) {
  // we encode 248 bits (31 bytes) at a time into one field element
  let fields = [];
  let currentBigInt = 0n;
  let bitPosition = 0n;
  for (let byte of bytes) {
    currentBigInt += BigInt(byte) << bitPosition;
    bitPosition += 8n;
    if (bitPosition === 248n) {
      fields.push(Field(currentBigInt.toString()));
      currentBigInt = 0n;
      bitPosition = 0n;
    }
  }
  // encode the final chunk, with an added STOP byte to make the mapping invertible
  currentBigInt += BigInt(STOP) << bitPosition;
  fields.push(Field(currentBigInt.toString()));
  return fields;
}

function bytesFromFields(fields: Field[]) {
  // find STOP byte in last chunk to determine length of byte array
  let lastChunk = fields.pop();
  if (lastChunk === undefined) return new Uint8Array();
  let lastChunkBytes = bytesOfConstantField(lastChunk);
  let i = lastChunkBytes.lastIndexOf(STOP, 30);
  if (i === -1) throw Error("Error (bytesFromFields): Invalid encoding.");
  let bytes = new Uint8Array(fields.length * 31 + i);
  bytes.set(lastChunkBytes.subarray(0, i), fields.length * 31);
  // convert the remaining fields
  i = 0;
  for (let field of fields) {
    bytes.set(bytesOfConstantField(field).subarray(0, 31), i);
    i += 31;
  }
  fields.push(lastChunk);
  return bytes;
}

export function stringToFields(message: string) {
  let bytes = new TextEncoder().encode(message);
  return bytesToFields(bytes);
}

export function stringFromFields(fields: Field[]) {
  let bytes = bytesFromFields(fields);
  return new TextDecoder().decode(bytes);
}
