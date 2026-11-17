import test from 'node:test';
import assert from 'node:assert/strict';
import {postingSlots} from '../schedule.mjs';

test('exactly four unique, evenly spaced slots per Vietnam time window', () => {
  assert.deepEqual(postingSlots, [
    '06:15', '06:45', '07:15', '07:45',
    '10:15', '10:45', '11:15', '11:45',
    '16:15', '16:45', '17:15', '17:45',
    '19:07', '19:22', '19:37', '19:52',
    '20:15', '20:45', '21:15', '21:45',
  ]);
});

