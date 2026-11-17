import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';

const job = resolve(process.argv[2] ?? 'preview-job');
const assets = join(job, 'public');
mkdirSync(assets, {recursive: true});
const fps = 30;
const examples = [
  ['Bảng tính', 'Tóm tắt chi tiêu', 'Giao dịch', 'Bảng tổng hợp'],
  ['Tài liệu', 'Tìm ý chính', 'Bài đọc', 'Danh sách ý'],
  ['Viết mã', 'Giải thích một hàm', 'Đoạn mã', 'Giải thích'],
  ['Thiết kế', 'Thử một bố cục', 'Bản phác', 'Mẫu áp phích'],
  ['Ghi âm', 'Tìm lại câu nói', 'Bản ghi', 'Mốc thời gian'],
];
const narration = [
  'Đây là bản thử của KAZ. Hãy xem năm cách dùng trí tuệ nhân tạo trong công việc.',
  'Với một bảng tính, hãy thử tóm tắt các khoản chi tiêu theo từng tháng.',
  'Khi đọc tài liệu dài, hãy yêu cầu tóm tắt và kiểm tra lại từng ý chính.',
  'Nếu gặp một hàm khó hiểu, hãy yêu cầu giải thích từng bước và kiểm tra đầu ra.',
  'Khi thiết kế, hãy tạo vài bố cục từ bản phác rồi chọn mẫu phù hợp.',
  'Với bản ghi âm, hãy tìm đoạn cần trích và kiểm tra lại mốc thời gian.',
  'Bắt đầu với một việc nhỏ. Xem lại kết quả trước khi dùng trong công việc.',
];
let start = 0;
const scenes = narration.map((line, index) => {
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
  const file = 'visual-' + index + '.svg';
  const hue = 150 + index * 14;
  writeFileSync(join(assets, file),
    '<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">' +
    '<rect width="1080" height="1080" fill="hsl(' + hue + ',28%,18%)"/>' +
    '<circle cx="540" cy="540" r="310" fill="hsl(' + hue + ',21%,34%)"/>' +
    '<rect x="' + (265 + index * 18) + '" y="430" width="440" height="230" rx="38" fill="#ffc889"/>' +
    '</svg>');
  const frames = Math.ceil((duration + 0.3) * fps);
  const scene = {
    start, frames, voice, words, music: [],
    visual: {file, credit: 'Đồ họa mẫu KAZ'},
  };
  start += frames;
  const example = examples[index - 1];
  if (example) {
    const [title, headline, input, output] = example;
    return {...scene, title, example: {headline, input, output}};
  }
  return {...scene, headline: index ? 'Thử với một việc thật' : '5 cách dùng AI',
    subtitle: index ? 'Chọn việc  →  Thử  →  Kiểm tra' : 'Bảng tính  ·  Tài liệu  ·  Ghi âm'};
});

writeFileSync(join(job, 'timeline.json'), JSON.stringify({
  width: 1080, height: 1920, fps, frames: start, scenes,
}, null, 2));

