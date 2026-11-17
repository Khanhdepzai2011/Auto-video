import {mkdtempSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';

const [jobPath, destination] = process.argv.slice(2);
if (!jobPath || !destination) throw new Error('Usage: node render.mjs JOB OUTPUT.mp4');
const job = resolve(jobPath);
const timeline = JSON.parse(readFileSync(join(job, 'timeline.json'), 'utf8'));
const outDir = mkdtempSync(join(tmpdir(), 'kaz-remotion-'));
try {
  const serveUrl = await bundle({
    outDir,
    entryPoint: fileURLToPath(new URL('./src/index.jsx', import.meta.url)),
    publicDir: join(job, 'public'),
  });
  const options = {
    serveUrl,
    inputProps: {timeline},
    ...(process.env.KAZ_CHROME ? {browserExecutable: process.env.KAZ_CHROME} : {}),
  };
  const composition = await selectComposition({...options, id: 'KazV6'});
  await renderMedia({
    ...options, composition, codec: 'h264', audioCodec: 'aac', concurrency: 2,
    outputLocation: resolve(destination),
  });
} finally {
  rmSync(outDir, {recursive: true, force: true});
}

