// Realistic Git-like SHA-1 hash generator

export function generateGitHash(content: string = ''): { hash: string; shortHash: string } {
  // Generate pseudo-SHA1 hex string based on content + timestamp
  let h1 = 0xdeadbeef ^ content.length;
  let h2 = 0x41c64e6d ^ (Date.now() & 0xffffffff);
  
  for (let i = 0; i < content.length; i++) {
    const ch = content.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const rand1 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  const rand2 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');
  const rand3 = Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0');

  const fullHash = (hex1 + hex2 + rand1 + rand2 + rand3).slice(0, 40);
  const shortHash = fullHash.slice(0, 7);

  return { hash: fullHash, shortHash };
}
