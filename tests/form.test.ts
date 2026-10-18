// Quote-form rules: validation and attachment limits (5 files, 10 MB in total — FormSubmit's limit).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addFiles, EMPTY_FORM, MAX_TOTAL_BYTES, validate } from '../data/form.ts';

const MB = 1024 * 1024;
const f = (name: string, size = 1 * MB) => ({ name, size });

test('rejects wrong types and de-duplicates by name + size', () => {
  const r = addFiles([f('a.pdf')], [f('a.pdf'), f('virus.exe'), f('b.STEP')]);
  assert.deepEqual(r.files.map(x => x.name), ['a.pdf', 'b.STEP']);
  assert.equal(r.error, 'Not added: virus.exe (type).');
});

test('enforces 10 MB in total and points to the link field', () => {
  const r = addFiles([f('a.pdf', 6 * MB)], [f('b.pdf', 3 * MB), f('c.pdf', 2 * MB)]);
  assert.deepEqual(r.files.map(x => x.name), ['a.pdf', 'b.pdf']);
  assert.match(r.error, /c\.pdf \(over 10 MB in total\)/);
  assert.match(r.error, /For larger files, paste a shareable link below\./);
  assert.ok(r.files.reduce((n, x) => n + x.size, 0) <= MAX_TOTAL_BYTES);
});

test('a single file over 10 MB is rejected', () => {
  const r = addFiles([], [f('big.zip', 11 * MB)]);
  assert.equal(r.files.length, 0);
  assert.match(r.error, /shareable link/);
});

test('keeps the 5-file cap', () => {
  const r = addFiles([], ['1', '2', '3', '4', '5', '6'].map(n => f(n + '.png', 0.1 * MB)));
  assert.equal(r.files.length, 5);
  assert.equal(r.error, 'Maximum 5 files.');
});

test('validation messages', () => {
  assert.deepEqual(Object.keys(validate(EMPTY_FORM)), ['name', 'email', 'service', 'description']);
  assert.deepEqual(validate({ ...EMPTY_FORM, name: 'A', email: 'a@b.co', service: 'Thermal Simulation', description: 'x'.repeat(20) }), {});
});
