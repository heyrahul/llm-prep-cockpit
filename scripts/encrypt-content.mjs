// Build step: AES-256-GCM-encrypts src/data/content.json with STUDY_PASSPHRASE
// (Staticrypt pattern) so the syllabus never ships as plaintext in the bundle.
// Runs via the `predev`-style "encrypt" npm script before both `dev` and `build`.
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const env = { ...loadEnv('production', root, ''), ...process.env };
const passphrase = env.STUDY_PASSPHRASE || 'changeme123';

const PBKDF2_ITERATIONS = 210_000;

const contentPath = resolve(root, 'src/data/content.json');
const outDir = resolve(root, 'src/generated');
const outPath = resolve(outDir, 'encrypted-content.json');

const plaintext = readFileSync(contentPath, 'utf-8');

const salt = randomBytes(16);
const iv = randomBytes(12);
const key = pbkdf2Sync(passphrase, salt, PBKDF2_ITERATIONS, 32, 'sha256');

const cipher = createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf-8'), cipher.final()]);
const authTag = cipher.getAuthTag();

// Web Crypto's subtle.decrypt expects the GCM auth tag appended to the ciphertext.
const combined = Buffer.concat([ciphertext, authTag]);

mkdirSync(outDir, { recursive: true });
writeFileSync(
  outPath,
  JSON.stringify(
    {
      iterations: PBKDF2_ITERATIONS,
      salt: salt.toString('base64'),
      iv: iv.toString('base64'),
      ciphertext: combined.toString('base64'),
    },
    null,
    2,
  ),
);

const usingPlaceholder = passphrase === 'changeme123';
console.log(
  `[encrypt-content] wrote ${outPath} (${(combined.length / 1024).toFixed(1)} KB)${
    usingPlaceholder ? ' — using the DEFAULT placeholder passphrase, see README before deploying' : ''
  }`,
);
