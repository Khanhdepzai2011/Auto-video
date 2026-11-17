import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEpisode} from '../episode.mjs';

const bookend = {headline: 'Tiêu đề', subtitle: 'Phụ đề', narration: 'Văn bản đọc.'};
const tool = {headline: 'Tiêu đề', title: 'Công cụ', input: 'Đầu vào', output: 'Kết quả', narration: 'Văn bản đọc.'};
const episode = {scenes: [bookend, ...Array(5).fill(tool), bookend]};
test('accepts a Vietnamese seven-scene episode', () => assert.doesNotThrow(() => validateEpisode(episode)));
test('rejects a missing narration and an incomplete scene list', () => {
  assert.throws(() => validateEpisode({scenes: []}), /7/);
  assert.throws(() => validateEpisode({scenes: [{...bookend, narration: ' '}, ...episode.scenes.slice(1)]}), /narration/);
});

