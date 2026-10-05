/**
 * zlib (RFC 1950) compress / decompress with the platform's own
 * CompressionStream — available in every current browser and in Node 18+,
 * so no extra library is needed. "deflate" here means the zlib-wrapped
 * format, which is exactly what PNG IDAT, PDF /FlateDecode and TIFF
 * compression 8 all use.
 */

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const blob = new Blob([bytes as unknown as BlobPart]);
  const out = blob.stream().pipeThrough(stream as unknown as ReadableWritablePair<Uint8Array, Uint8Array>);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

export function zlibDeflate(bytes: Uint8Array): Promise<Uint8Array> {
  return pipe(bytes, new CompressionStream("deflate"));
}

/**
 * Inflate zlib data. PDF streams are often slightly broken (missing Adler
 * checksum, trailing garbage), which makes the strict stream reject; in that
 * case we retry as raw deflate after skipping the 2-byte header and keep
 * whatever decoded before the error.
 */
export async function zlibInflate(bytes: Uint8Array): Promise<Uint8Array> {
  try {
    return await pipe(bytes, new DecompressionStream("deflate"));
  } catch {
    return inflateLenient(bytes.subarray(2));
  }
}

async function inflateLenient(raw: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("deflate-raw");
  const writer = ds.writable.getWriter();
  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  const readAll = (async () => {
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        total += value.byteLength;
      }
    } catch {
      /* keep what we have */
    }
  })();
  try {
    await writer.write(raw as unknown as Uint8Array<ArrayBuffer>);
    await writer.close();
  } catch {
    /* truncated / trailing garbage */
  }
  await readAll;
  if (total === 0) throw new Error("Could not decompress data.");
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return out;
}
