
export type VerificationErrorCode = 'SIG_MISMATCH' | 'TOKEN_EXPIRED' | 'SERVER_ERROR' | 'NONE';

export interface VerificationResult {
  isValid: boolean;
  errorCode: VerificationErrorCode;
  uidHex: string;
  rawUid: string;
  epcHex: string;
  tokenHex: string;
  ivHex: string;
  fBin: string;
  sigHex: string;
  decryptedHex: string;
  validationDetails: {
    flag: boolean;
    token: boolean;
    uid: boolean;
    serverSync: boolean;
  };
}

const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function base64UrlToBytes(input: string): Uint8Array {
  if (!input) return new Uint8Array(0);
  try {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(base64 + padding);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    return new Uint8Array(0);
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

// Minimal AES-CBC Engine
class AesCbcEngine {
  private static S = new Uint8Array([0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]);
  private static IS = new Uint8Array(256);
  static { for (let i = 0; i < 256; i++) AesCbcEngine.IS[AesCbcEngine.S[i]] = i; }
  private ks: Uint8Array[];
  constructor(key: Uint8Array) { this.ks = this.expand(key); }
  private expand(key: Uint8Array): Uint8Array[] {
    const ks = [new Uint8Array(key)], rcon = [1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
    for (let r = 1; r <= 10; r++) {
      const prev = ks[r - 1], curr = new Uint8Array(16);
      let t = new Uint8Array([prev[13], prev[14], prev[15], prev[12]]);
      for (let i = 0; i < 4; i++) t[i] = AesCbcEngine.S[t[i]];
      t[0] ^= rcon[r - 1];
      for (let i = 0; i < 4; i++) curr[i] = prev[i] ^ t[i];
      for (let i = 4; i < 16; i++) curr[i] = prev[i] ^ curr[i - 4];
      ks.push(curr);
    }
    return ks;
  }
  private mul(a: number, b: number) {
    let p = 0;
    for (let i = 0; i < 8; i++) {
      if (b & 1) p ^= a;
      const hi = a & 0x80; a = (a << 1) & 0xFF; if (hi) a ^= 0x1B; b >>= 1;
    }
    return p;
  }
  private mixInv(st: Uint8Array) {
    for (let i = 0; i < 4; i++) {
      const o = i * 4, s0 = st[o], s1 = st[o + 1], s2 = st[o + 2], s3 = st[o + 3];
      st[o] = this.mul(s0, 14) ^ this.mul(s1, 11) ^ this.mul(s2, 13) ^ this.mul(s3, 9);
      st[o + 1] = this.mul(s0, 9) ^ this.mul(s1, 14) ^ this.mul(s2, 11) ^ this.mul(s3, 13);
      st[o + 2] = this.mul(s0, 13) ^ this.mul(s1, 9) ^ this.mul(s2, 14) ^ this.mul(s3, 11);
      st[o + 3] = this.mul(s0, 11) ^ this.mul(s1, 13) ^ this.mul(s2, 9) ^ this.mul(s3, 14);
    }
  }
  private decryptBlock(ciphertext: Uint8Array): Uint8Array {
    let st = new Uint8Array(ciphertext);
    for (let i = 0; i < 16; i++) st[i] ^= this.ks[10][i];
    for (let r = 9; r >= 1; r--) {
      let t = st[1]; st[1] = st[13]; st[13] = st[9]; st[9] = st[5]; st[5] = t;
      t = st[2]; st[2] = st[10]; st[10] = t; t = st[6]; st[6] = st[14]; st[14] = t;
      t = st[3]; st[3] = st[7]; st[7] = st[11]; st[11] = st[15]; st[15] = t;
      for (let i = 0; i < 16; i++) st[i] = AesCbcEngine.IS[st[i]];
      for (let i = 0; i < 16; i++) st[i] ^= this.ks[r][i];
      this.mixInv(st);
    }
    let t2 = st[1]; st[1] = st[13]; st[13] = st[9]; st[9] = st[5]; st[5] = t2;
    t2 = st[2]; st[2] = st[10]; st[10] = t2; t2 = st[6]; st[6] = st[14]; st[14] = t2;
    t2 = st[3]; st[3] = st[7]; st[7] = st[11]; st[11] = st[15]; st[15] = t2;
    for (let i = 0; i < 16; i++) st[i] = AesCbcEngine.IS[st[i]];
    for (let i = 0; i < 16; i++) st[i] ^= this.ks[0][i];
    return st;
  }
  decryptCbc(ciphertext: Uint8Array, iv: Uint8Array): Uint8Array {
    const block = this.decryptBlock(ciphertext);
    const result = new Uint8Array(16);
    for (let i = 0; i < 16; i++) result[i] = block[i] ^ iv[i];
    return result;
  }
}

// UPDATE: Replace with your actual backend URL
const API_BASE_URL = ''; 

/**
 * Performs verification. 
 * UPDATED LOGIC: Replay protection now communicates with a real backend to track token usage per UID.
 */
export async function verifyHkParams(query: URLSearchParams): Promise<VerificationResult> {
  const rawUidStr = query.get('uid') || '';
  const tokenStr = query.get('token') || '';
  const fStr = query.get('f') || '';
  const sigStr = query.get('sig') || '';
  const ivStr = query.get('iv') || '';
  const epcStr = query.get('epc') || '';

  const KEY = new Uint8Array([0x1F,0x1E,0x1D,0x1C,0x1B,0x1A,0x19,0x18,0x17,0x16,0x15,0x14,0x13,0x12,0x11,0x10]);
  
  const uidBytes = base64UrlToBytes(rawUidStr);
  const tokenBytes = base64UrlToBytes(tokenStr);
  const sigBytes = base64UrlToBytes(sigStr);
  const ivBytes = base64UrlToBytes(ivStr);
  const effectiveIv = ivBytes.length === 16 ? ivBytes : new Uint8Array(16);

  const result: VerificationResult = {
    isValid: false,
    errorCode: 'NONE',
    uidHex: bytesToHex(uidBytes),
    rawUid: rawUidStr,
    epcHex: bytesToHex(base64UrlToBytes(epcStr)),
    tokenHex: bytesToHex(tokenBytes),
    ivHex: bytesToHex(effectiveIv),
    fBin: fStr,
    sigHex: bytesToHex(sigBytes),
    decryptedHex: '',
    validationDetails: { flag: false, token: false, uid: false, serverSync: false }
  };

  if (!rawUidStr || !sigStr) return result;

  // --- ACTUAL BACKEND CROSS-DEVICE REPLAY PROTECTION ---
  try {
    const response = await fetch(`${API_BASE_URL}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: rawUidStr, token: tokenStr })
    });

    if (response.status === 409) {
      // Replay detected by the global backend
      result.errorCode = 'TOKEN_EXPIRED';
      result.validationDetails.serverSync = true;
      return result;
    }

    if (!response.ok) {
        throw new Error('Server returned error status');
    }

    result.validationDetails.serverSync = true;
  } catch (e) {
    console.error("Critical Backend Sync Fault:", e);
    result.errorCode = 'SERVER_ERROR';
    return result;
  }

  // --- CRYPTOGRAPHIC VERIFICATION ---
  try {
    const aes = new AesCbcEngine(KEY);
    const decrypted = aes.decryptCbc(sigBytes, effectiveIv);
    result.decryptedHex = bytesToHex(decrypted);

    const fIdx = BASE64_ALPHABET.indexOf(fStr);
    const expectedFlag = 0x40 | (fIdx === -1 ? 0 : fIdx);
    result.validationDetails.flag = decrypted[0] === expectedFlag;

    let tokenMatch = true;
    for (let i = 0; i < 3; i++) {
      if (decrypted[i+1] !== (tokenBytes[i] || 0)) tokenMatch = false;
    }
    result.validationDetails.token = tokenMatch;

    let uidMatch = true;
    for (let i = 0; i < 8; i++) {
      if (decrypted[i+4] !== (uidBytes[i] || 0)) uidMatch = false;
    }
    result.validationDetails.uid = uidMatch;

    result.isValid = result.validationDetails.flag && result.validationDetails.token && result.validationDetails.uid;
    
    if (!result.isValid) {
      result.errorCode = 'SIG_MISMATCH';
    }
  } catch (e) {
    result.errorCode = 'SIG_MISMATCH';
  }

  return result;
}
