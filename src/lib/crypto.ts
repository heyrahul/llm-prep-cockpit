import encrypted from '../generated/encrypted-content.json';
import type { StudyContent } from '../types';

function base64ToBytes(b64: string): Uint8Array<ArrayBuffer> {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveKey(passphrase: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, [
    'deriveKey',
  ]);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt'],
  );
}

/** Throws if the passphrase is wrong (GCM auth tag verification fails). */
export async function decryptContent(passphrase: string): Promise<StudyContent> {
  const salt = base64ToBytes(encrypted.salt);
  const iv = base64ToBytes(encrypted.iv);
  const ciphertext = base64ToBytes(encrypted.ciphertext);

  const key = await deriveKey(passphrase, salt, encrypted.iterations);
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return JSON.parse(new TextDecoder().decode(plaintext)) as StudyContent;
}

export async function hashPassphrase(passphrase: string): Promise<string> {
  return sha256Hex(passphrase);
}
