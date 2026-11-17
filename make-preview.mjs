import {execFileSync} from 'node:child_process';
import {copyFileSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, extname, join, resolve} from 'node:path';
import {validateEpisode} from './episode.mjs';

const job = resolve(process.argv[2] ?? 'preview-job');
const assets = join(job, 'public');
mkdirSync(assets, {recursive: true});
const fps = 30;
const episodePath = resolve(process.argv[3] ?? 'episodes/demo.json');
const episode = JSON.parse(readFileSync(episodePath, 'utf8'));
validateEpisode(episode);
let start = 0;
const scenes = episode.scenes.map((content, index) => {
  const {narration: line} = content;
  const voice = 'voice-' + index + '.wav';
  const audio = join(assets, voice);
  execFileSync('espeak-ng', ['-v', 'vi', '-s', '155', '-w', audio, line]);
  const duration = Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio,
  ], {encoding: 'utf8'}).trim());
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('Missing narration audio');
  const tokens = line.split(/\s+/);
  const words = tokens.map((text, offset) => ({
    text, start: duration * offset / tokens.length, end: duration * (offset + 1) / tokens.length,
  }));
  const image = content.image;
  if (image && (!/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(image.file ?? '') || !image.credit?.trim())) {
    throw new Error('Scene ' + (index + 1) + ': use an image beside the JSON and add its credit.');
  }
  const file = 'visual-' + index + (image ? extname(image.file) : '.svg');
  const hue = 150 + index * 14;
  if (image) copyFileSync(join(dirname(episodePath), image.file), join(assets, file));
  else writeFileSync(join(assets, file),
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">' +
    '<rect width="1080" height="1080" fill="hsl(' + hue + ',28%,18%)"/>' +
    '<circle cx="540" cy="540" r="310" fill="hsl(' + hue + ',21%,34%)"/>' +
    '<rect x="' + (265 + index * 18) + '" y="430" width="440" height="230" rx="38" fill="#ffc889"/>' +
    '</svg>');
  const frames = Math.ceil((duration + 0.3) * fps);
  const scene = {
    start, frames, voice, words, music: [],
    visual: {file, credit: image?.credit ?? 'Đồ họa mẫu KAZ'},
  };
  start += frames;
  const {title, headline, subtitle, input, output} = content;
  if (index === 0 || index === 6) return {...scene, headline, subtitle};
  return {...scene, title, example: {headline, input, output}};
});

writeFileSync(join(job, 'timeline.json'), JSON.stringify({
  width: 1080, height: 1920, fps, frames: start, scenes,
}, null, 2));


