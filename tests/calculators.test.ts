// Regression values from the design handoff README ("Verified defaults" and "Edge cases").
// Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CALC_GROUPS, defaultMode, defaultValues, evaluate, type Calc } from '../data/calculators.ts';

const calc = (id: string) => CALC_GROUPS.flatMap(g => g.items).find(c => c.id === id) as Calc;
const run = (id: string, over: Record<string, string> = {}, mode?: string) => {
  const c = calc(id);
  return evaluate(c, { ...defaultValues(c), ...over }, mode ?? defaultMode(c));
};
const out = (id: string, over?: Record<string, string>, mode?: string) => Object.fromEntries(run(id, over, mode).outputs);

test('verified defaults', () => {
  assert.equal(out('cond')['Heat transfer rate'], '800.0 W');
  assert.equal(out('conv')['Convective heat transfer rate'], '550.0 W');
  assert.equal(out('rad')['Net radiative heat transfer rate'], '15.85 kW');
  assert.deepEqual(out('heat'), { 'Heating energy': '4.000 MJ', 'Average heating power': '1.111 kW' });
  assert.equal(out('exp')['Change in length ΔL'], '9.600 mm');
  assert.equal(out('tor')['Maximum shear stress'], '31.83 MPa');
  assert.equal(out('tor', {}, 'hollow')['Maximum shear stress'], '33.95 MPa');
  assert.equal(out('ax')['Average normal stress'], '100.0 MPa');
  assert.deepEqual(out('pv'), { 'Hoop stress σh': '25.00 MPa', 'Longitudinal stress σl': '12.50 MPa', 'Wall ratio t/D': '0.02000' });
  assert.deepEqual(out('eul'), { 'Critical load Pcr': '26.32 kN', 'Slenderness ratio λ': '173.2', 'Critical slenderness λc': '125.7', 'Method used': 'Euler (elastic)' });
  assert.equal(out('fos')['Yield-based factor of safety'], '2.500');
  assert.deepEqual(out('re'), { 'Impeller Reynolds number': '960.0', 'Estimated flow regime': 'Transitional' });
  assert.equal(out('vel')['Mean flow velocity'], '0.6791 m/s');
  assert.equal(out('dw')['Straight-pipe frictional pressure drop'], '9.000 kPa');
  assert.deepEqual(out('pump'), { 'Hydraulic power': '333.3 W', 'Estimated pump shaft power': '476.2 W' });
});

test('pressure vessel t = 60 shows the red warning', () => {
  const r = run('pv', { t: '60' });
  assert.equal(r.warns[0][0], 'red');
});

test('pressure vessel 0.05 < t/D ≤ 0.10 shows the amber warning', () => {
  assert.equal(run('pv', { t: '30' }).warns[0][0], 'amber');
});

test('buckling L = 300 switches to Johnson', () => {
  const o = out('eul', { L: '300' });
  assert.equal(o['Method used'], 'Johnson (inelastic)');
  assert.equal(o['Slenderness ratio λ'], '51.96');
  assert.equal(o['Critical load Pcr'], '91.45 kN');
});

test('radiation Ts = 0 °C reports a net heat gain', () => {
  const r = run('rad', { Ts: '0' });
  assert.deepEqual(r.outputs, [['Net radiative heat gain', '105.9 W']]);
  assert.equal(r.warns[0][0], 'info');
});

test('Darcy calculated-f defaults: Re 37,500, turbulent, Colebrook f ≈ 0.0269', () => {
  const o = out('dw', {}, 'calc');
  assert.equal(o['Reynolds number'], '37,500');
  assert.equal(o['Flow regime'], 'Turbulent');
  assert.equal(o['Calculated friction factor f'], '0.02690');
  assert.equal(o['Straight-pipe frictional pressure drop'], '12.11 kPa');
});

test('Darcy transitional regime warns', () => {
  const r = run('dw', { v: '0.12' }, 'calc');
  assert.equal(Object.fromEntries(r.outputs)['Flow regime'], 'Transitional');
  assert.equal(r.warns[0][0], 'amber');
});

test('validation: empty, non-numeric and rule failures block the result', () => {
  const empty = run('cond', { k: '' });
  assert.equal(empty.inputs.find(i => i.k === 'k')!.err, 'Enter a number');
  assert.equal(empty.outputs[0][1], '—');
  assert.equal(run('rad', { e: '1.2' }).inputs.find(i => i.k === 'e')!.err, 'Must be between 0 and 1');
  assert.equal(run('pump', { eta: '0' }).inputs.find(i => i.k === 'eta')!.err, 'Must be between 0 and 100');
  assert.match(run('conv', { Ts: '-300' }).inputs.find(i => i.k === 'Ts')!.err, /absolute zero/);
  assert.equal(run('dw', { rough: '-1' }, 'calc').inputs.find(i => i.k === 'rough')!.err, 'Must be 0 or greater');
});

test('hollow shaft requires di < d', () => {
  const r = run('tor', { di: '20' }, 'hollow');
  assert.equal(r.inputs.find(i => i.k === 'di')!.err, 'Must be smaller than shaft diameter d');
  assert.equal(r.outputs[0][1], '—');
});

test('only the active mode inputs are shown', () => {
  assert.equal(run('tor').inputs.some(i => i.k === 'di'), false);
  assert.equal(run('dw', {}, 'calc').inputs.some(i => i.k === 'f'), false);
});
