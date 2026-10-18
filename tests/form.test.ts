// Quote-form rules: validation, attachment limits (5 files, 10 MB in total — FormSubmit's limit), services and budget.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addFiles, budgetField, budgetRangeLabel, budgetRanges, caretAfterDigits, CURRENCIES, EMPTY_FORM, formatAmount, inquirySubject,
  MAX_TOTAL_BYTES, parseAmount, serviceField, validate, type Currency,
} from '../data/form.ts';

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

const valid = { ...EMPTY_FORM, name: 'A', email: 'a@b.co', services: ['Thermal Simulation'], description: 'x'.repeat(20) };

test('validation messages, in field order', () => {
  assert.deepEqual(Object.keys(validate(EMPTY_FORM)), ['name', 'email', 'services', 'description']);
  assert.deepEqual(validate(valid), {});
});

test('at least one service is required', () => {
  assert.equal(validate({ ...valid, services: [] }).services, 'Please select at least one service.');
  assert.deepEqual(validate({ ...valid, services: ['Thermal Simulation', 'Computational Fluid Dynamics (CFD)'] }), {});
});

test('"Other / Not Sure" can be combined with other services', () => {
  assert.deepEqual(validate({ ...valid, services: ['Other / Not Sure'] }), {});
  assert.equal(serviceField(['Other / Not Sure', 'Thermal Simulation']), 'Thermal Simulation, Other / Not Sure');
});

test('Service field joins selections with ", " in list order', () => {
  assert.equal(serviceField(['Thermal Simulation']), 'Thermal Simulation');
  assert.equal(
    serviceField(['Thermal Simulation', 'CAD Design & 3D Modeling', 'Finite Element Analysis (FEA)']),
    'CAD Design & 3D Modeling, Finite Element Analysis (FEA), Thermal Simulation',
  );
});

test('email subject: one service, or first service +N more', () => {
  assert.equal(inquirySubject(['Thermal Simulation'], ' Ana '), 'New project inquiry — Thermal Simulation — Ana');
  assert.equal(
    inquirySubject(['Thermal Simulation', 'CAD Design & 3D Modeling', 'Other / Not Sure'], 'Ana'),
    'New project inquiry — CAD Design & 3D Modeling +2 more — Ana',
  );
});

// ── Budget ──
test('amount parser keeps digits only and drops leading zeros', () => {
  assert.equal(parseAmount('IDR 50.000.000,-'), '50000000');
  assert.equal(parseAmount('$ 5,000'), '5000');
  assert.equal(parseAmount('0007'), '7');
  assert.equal(parseAmount('0'), '0');
  assert.equal(parseAmount('abc'), '');
  assert.equal(parseAmount('1'.repeat(20)).length, 15);
});

test('amount formatter adds en-US thousands separators', () => {
  assert.equal(formatAmount(''), '');
  assert.equal(formatAmount('999'), '999');
  assert.equal(formatAmount('5000'), '5,000');
  assert.equal(formatAmount('15000000'), '15,000,000');
  assert.equal(formatAmount(parseAmount('1,2,3,4')), '1,234');
});

test('caret stays after the same digit when separators move', () => {
  // "1234|" → "1,234|"; "12|34" (2 digits before) → "1,2|34"; start stays at 0.
  assert.equal(caretAfterDigits('1,234', 4), 5);
  assert.equal(caretAfterDigits('1,234', 2), 3);
  assert.equal(caretAfterDigits('15,000,000', 3), 4);
  assert.equal(caretAfterDigits('1,234', 0), 0);
});

test('range labels per currency', () => {
  const labels = (c: Currency) => budgetRanges(c).map(r => r.label);
  assert.deepEqual(labels('USD'), ['Under USD 1,000', 'USD 1,000–5,000', 'USD 5,000–20,000', 'Over USD 20,000']);
  assert.deepEqual(labels('EUR'), ['Under EUR 1,000', 'EUR 1,000–5,000', 'EUR 5,000–20,000', 'Over EUR 20,000']);
  assert.deepEqual(labels('GBP'), ['Under GBP 750', 'GBP 750–4,000', 'GBP 4,000–15,000', 'Over GBP 15,000']);
  assert.deepEqual(labels('SGD'), ['Under SGD 1,500', 'SGD 1,500–7,000', 'SGD 7,000–27,000', 'Over SGD 27,000']);
  assert.deepEqual(labels('AUD'), ['Under AUD 1,500', 'AUD 1,500–8,000', 'AUD 8,000–30,000', 'Over AUD 30,000']);
  assert.deepEqual(labels('IDR'), ['Under IDR 15,000,000', 'IDR 15,000,000–80,000,000', 'IDR 80,000,000–300,000,000', 'Over IDR 300,000,000']);
});

test('the selected tier survives a currency change', () => {
  // The form stores the tier, not the label: the same value maps to the matching range in every currency.
  for (const c of CURRENCIES) {
    assert.deepEqual(budgetRanges(c).map(r => r.value), ['0', '1', '2', '3']);
  }
  assert.equal(budgetRangeLabel('USD', '1'), 'USD 1,000–5,000');
  assert.equal(budgetRangeLabel('IDR', '1'), 'IDR 15,000,000–80,000,000');
  assert.equal(budgetRangeLabel('GBP', 'unsure'), 'Not sure yet');
});

test('Budget field string', () => {
  assert.equal(budgetField('IDR', '1', ''), 'IDR 15,000,000–80,000,000');
  assert.equal(budgetField('IDR', '', '50000000'), 'IDR 50,000,000');
  assert.equal(budgetField('IDR', '1', '50000000'), 'IDR 15,000,000–80,000,000 (exact: IDR 50,000,000)');
  assert.equal(budgetField('USD', 'unsure', ''), 'Not sure yet');
  assert.equal(budgetField('EUR', 'unsure', '7500'), 'Not sure yet (exact: EUR 7,500)');
  assert.equal(budgetField('USD', '', ''), '—');
  assert.equal(budgetField('USD', '0', ''), 'Under USD 1,000');
});
