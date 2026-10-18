// Calculator spec, ported 1:1 from CALC_GROUPS in the design prototype.
// Regression values live in tests/calculators.test.ts — keep them passing.
import { f4, fJ, fN, fPa, fW } from '../lib/calc/format.ts';
import { line, type FormulaLine } from '../lib/calc/formula.ts';
import { checkField, type Rule } from '../lib/calc/validate.ts';

export type WarnLevel = 'amber' | 'red' | 'info';
type Vals = Record<string, number>;
type Result = { o: [string, string][]; w?: [WarnLevel, string][] };

export type Input = { k: string; label: string; d: string; rule?: Rule; help?: string; mode?: string };
export type Calc = {
  id: string; title: string;
  modes?: [string, string][];
  f: FormulaLine[] | Record<string, FormulaLine[]>;
  in: Input[];
  check?: (v: Vals, mode: string) => Record<string, string>;
  out: string[] | ((mode: string) => string[]);
  run: (v: Vals, mode: string) => Result;
  note: string;
};

const SB = 5.670374419e-8;
const DT_HELP = 'A difference of 1 K equals 1 °C.';
const I = (k: string, label: string, d: string, rule?: Rule, help?: string, mode?: string): Input => ({ k, label, d, rule, help, mode });

export const CALC_GROUPS: { tag: string; items: Calc[] }[] = [
  { tag: 'THERMAL', items: [
    { id: 'cond', title: 'Conductive heat loss through insulation', f: [line('Q̇', ['k · A · ΔT', 'L'])],
      in: [I('k', 'Thermal conductivity k [W/m·K]', '0.1', 'pos'), I('A', 'Area A [m²]', '1', 'pos'), I('dT', 'Temperature difference ΔT [K]', '800', undefined, DT_HELP), I('L', 'Insulation thickness L [mm]', '100', 'pos')],
      out: ['Heat transfer rate'], run: v => ({ o: [['Heat transfer rate', fW(v.k * v.A * v.dT / (v.L / 1000))]] }),
      note: 'Steady-state, one-dimensional conduction through a flat wall with constant thermal conductivity. Thickness is converted to metres internally. Radiation, contact resistance, thermal bridges, and edge effects are excluded.' },
    { id: 'conv', title: 'Convective heat transfer', f: [line('Q̇', 'h · A · (T_{s} − T_{∞})')],
      in: [I('h', 'Heat transfer coefficient h [W/m²·K]', '10', 'pos'), I('A', 'Surface area A [m²]', '1', 'pos'), I('Ts', 'Surface temperature Ts [°C]', '80', 'tabs'), I('Tf', 'Fluid temperature T∞ [°C]', '25', 'tabs')],
      out: ['Convective heat transfer rate'], run: v => ({ o: [['Convective heat transfer rate', fW(v.h * v.A * (v.Ts - v.Tf))]] }),
      note: 'Uses a constant heat transfer coefficient over the selected surface. Appropriate for preliminary estimates of heat exchange between equipment surfaces and surrounding fluids.' },
    { id: 'rad', title: 'Radiative heat transfer', f: [line('Q̇', 'ε · σ · A · (T_{s}⁴ − T_{sur}⁴)')],
      in: [I('e', 'Surface emissivity ε [0–1]', '0.8', 'eps'), I('A', 'Radiating area A [m²]', '1', 'pos'), I('Ts', 'Surface temperature Ts [°C]', '500', 'tabs'), I('Tsur', 'Surrounding temperature Tsur [°C]', '25', 'tabs')],
      out: ['Net radiative heat transfer rate'],
      run: v => {
        const q = v.e * SB * v.A * ((v.Ts + 273.15) ** 4 - (v.Tsur + 273.15) ** 4);
        return q < 0
          ? { o: [['Net radiative heat gain', fW(-q)]], w: [['info', 'Surface is colder than surroundings — net heat flows into the surface.']] }
          : { o: [['Net radiative heat transfer rate', fW(q)]] };
      },
      note: 'Uses the Stefan–Boltzmann law with temperatures converted to kelvin internally. Assumes a simplified radiative exchange between a surface and large, approximately isothermal surroundings. Complex view factors and enclosure effects are excluded.' },
    { id: 'heat', title: 'Heating energy and power requirement', f: [line('E', 'm · c_{p} · ΔT'), line('P_{avg}', ['E', 't'])],
      in: [I('m', 'Material mass m [kg]', '10', 'pos'), I('cp', 'Specific heat capacity cp [kJ/kg·K]', '0.5', 'pos'), I('dT', 'Temperature change ΔT [K]', '800', undefined, DT_HELP), I('t', 'Heating time t [min]', '60', 'pos')],
      out: ['Heating energy', 'Average heating power'],
      run: v => { const E = v.m * v.cp * 1000 * v.dT; return { o: [['Heating energy', fJ(E)], ['Average heating power', fW(E / (v.t * 60))]] }; },
      note: "Estimates the sensible heat required to raise a material's temperature and the average power needed over a specified heating period. Assumes constant specific heat capacity. Heat losses, phase changes, and temperature-dependent material properties are excluded." },
    { id: 'exp', title: 'Linear thermal expansion', f: [line('ΔL', 'α · L_{0} · ΔT')],
      in: [I('a', 'Coefficient of thermal expansion α [×10⁻⁶ /K]', '12', undefined, 'Typical: carbon steel ≈ 12, stainless 304 ≈ 17, aluminium ≈ 23.'), I('L0', 'Initial length L₀ [mm]', '1000', 'pos'), I('dT', 'Temperature change ΔT [K]', '800', undefined, DT_HELP)],
      out: ['Change in length ΔL'], run: v => ({ o: [['Change in length ΔL', f4(v.a * 1e-6 * v.L0 * v.dT) + ' mm']] }),
      note: 'Assumes uniform temperature change and unrestricted expansion. Mechanical constraints, temperature gradients, and thermal stresses are not considered.' },
  ] },
  { tag: 'STRUCTURAL', items: [
    { id: 'tor', title: 'Torsional shear stress in a shaft', modes: [['solid', 'Solid shaft'], ['hollow', 'Hollow shaft']],
      f: { solid: [line('τ_{max}', ['16 · T', 'π · d³'])], hollow: [line('τ_{max}', ['16 · T · d', 'π · (d⁴ − d_{i}⁴)'])] },
      in: [I('T', 'Torque T [N·m]', '50'), I('d', 'Shaft diameter d [mm]', '20', 'pos'), I('di', 'Inner diameter di [mm]', '10', 'pos', undefined, 'hollow')],
      check: (v, m): Record<string, string> => (m === 'hollow' && v.di >= v.d ? { di: 'Must be smaller than shaft diameter d' } : {}),
      out: ['Maximum shear stress'],
      run: (v, m) => ({ o: [['Maximum shear stress', fPa((m === 'hollow' ? 16 * v.T * 1000 * v.d / (Math.PI * (v.d ** 4 - v.di ** 4)) : 16 * v.T * 1000 / (Math.PI * v.d ** 3)) * 1e6)]] }),
      note: 'For a circular shaft under pure torsion. Torque is converted internally to N·mm to maintain consistent units. Stress concentrations, bending loads, fatigue, and geometric discontinuities are excluded.' },
    { id: 'ax', title: 'Axial stress in a structural member', f: [line('σ', ['F', 'A'])],
      in: [I('F', 'Axial force F [N]', '10000'), I('A', 'Cross-sectional area A [mm²]', '100', 'pos')],
      out: ['Average normal stress'], run: v => ({ o: [['Average normal stress', fPa(v.F / v.A * 1e6)]] }),
      note: 'Assumes a uniform, concentric axial load and a uniform cross-section. Local stress concentrations, buckling, and eccentric loading are excluded.' },
    { id: 'pv', title: 'Thin-walled pressure vessel stress', f: [line('σ_{h}', ['p · D', '2 · t']), line('σ_{l}', ['p · D', '4 · t'])],
      in: [I('p', 'Internal differential pressure p [MPa]', '1'), I('D', 'Internal diameter D [mm]', '500', 'pos'), I('t', 'Wall thickness t [mm]', '10', 'pos')],
      out: ['Hoop stress σh', 'Longitudinal stress σl', 'Wall ratio t/D'],
      run: v => {
        const r = v.t / v.D, w: [WarnLevel, string][] = [];
        if (r > 0.10) w.push(['red', 'Thin-wall assumption is not valid for this geometry.']);
        else if (r > 0.05) w.push(['amber', 'Thin-wall assumption becomes inaccurate (D/t < 20). Consider thick-wall (Lamé) equations.']);
        return { o: [['Hoop stress σh', fPa(v.p * v.D / (2 * v.t) * 1e6)], ['Longitudinal stress σl', fPa(v.p * v.D / (4 * v.t) * 1e6)], ['Wall ratio t/D', f4(r)]], w };
      },
      note: 'Estimates membrane stresses in a thin-walled cylindrical vessel with closed ends under internal pressure. Assumes wall thickness is small relative to vessel diameter. Uses internal diameter. Design codes such as ASME BPVC Section VIII use different formulations (e.g. t = PR / (SE − 0.6P)) including joint efficiency and allowable stress. Excludes head geometry, nozzle reinforcement, weld efficiency, local stresses, external-pressure buckling, and code-specific requirements. This is a preliminary screening calculation, not a pressure-vessel design verification.' },
    { id: 'eul', title: 'Critical buckling load (Euler / Johnson)',
      f: [line('P_{cr,Euler}', ['π² · E · I', '(K · L)²']), line('P_{cr,Johnson}', 'A · [S_{y} − ', ['S_{y}²', '4 · π² · E'], ' · λ²]'), line('λ_{c}', '√(2 · π² · E / S_{y})')],
      in: [I('E', "Young's modulus E [MPa]", '200000', 'pos'), I('I', 'Second moment of area I [mm⁴]', '13333', 'pos', 'Default (A = 400 mm², I = 13,333 mm⁴) corresponds to a 20 × 20 mm solid square bar. Rectangle: I = b·h³/12. Solid round: I = π·d⁴/64.'), I('A', 'Cross-sectional area A [mm²]', '400', 'pos'), I('Sy', 'Material yield strength Sy [MPa]', '250', 'pos'), I('L', 'Unsupported length L [mm]', '1000', 'pos'), I('K', 'Effective length factor K [–]', '1', 'pos')],
      out: ['Critical load Pcr', 'Slenderness ratio λ', 'Critical slenderness λc', 'Method used'],
      run: v => {
        const r = Math.sqrt(v.I / v.A), lam = v.K * v.L / r, lc = Math.sqrt(2 * Math.PI ** 2 * v.E / v.Sy), eu = lam >= lc;
        const P = eu ? Math.PI ** 2 * v.E * v.I / (v.K * v.L) ** 2 : v.A * (v.Sy - v.Sy ** 2 / (4 * Math.PI ** 2 * v.E) * lam ** 2);
        return {
          o: [['Critical load Pcr', fN(P)], ['Slenderness ratio λ', f4(lam)], ['Critical slenderness λc', f4(lc)], ['Method used', eu ? 'Euler (elastic)' : 'Johnson (inelastic)']],
          w: eu ? [] : [['amber', 'Column is short/intermediate — yielding governs before elastic buckling, so the Euler result would be non-conservative.']],
        };
      },
      note: 'Slenderness λ = K·L / r with r = √(I/A). Euler applies to slender columns (λ ≥ λc); the Johnson parabola is used for shorter columns. Assumes concentric axial compression, linear-elastic material up to yield, and idealized end restraints. Initial imperfections, residual stresses, and local buckling are excluded.' },
    { id: 'fos', title: 'Yield-based factor of safety', f: [line('FoS', ['S_{y}', 'σ_{eq}'])],
      in: [I('Sy', 'Material yield strength Sy [MPa]', '250', 'pos'), I('s', 'Equivalent von Mises stress σeq [MPa]', '100', 'pos')],
      out: ['Yield-based factor of safety'], run: v => ({ o: [['Yield-based factor of safety', f4(v.Sy / v.s)]] }),
      note: 'Provides a preliminary yield-margin estimate for ductile materials using von Mises equivalent stress. Material condition, fatigue, fracture, instability, load uncertainty, and applicable design criteria must be assessed separately.' },
  ] },
  { tag: 'CFD & FLUID FLOW', items: [
    { id: 're', title: 'Impeller Reynolds number in a mixing vessel', f: [line('Re', ['ρ · N · D²', 'μ'])],
      in: [I('rho', 'Fluid density ρ [kg/m³]', '1500', 'pos'), I('N', 'Impeller speed N [rpm]', '300'), I('D', 'Impeller diameter D [mm]', '80', 'pos'), I('mu', 'Dynamic viscosity μ [mPa·s]', '50', 'pos')],
      out: ['Impeller Reynolds number', 'Estimated flow regime'],
      run: v => { const re = v.rho * (v.N / 60) * (v.D / 1000) ** 2 / (v.mu / 1000); return { o: [['Impeller Reynolds number', f4(re)], ['Estimated flow regime', re < 10 ? 'Laminar' : re < 1e4 ? 'Transitional' : 'Turbulent']] }; },
      note: 'Rotational speed, diameter, and viscosity are converted to consistent SI units internally. Impeller speed is converted from rpm to revolutions per second (N/60), not rad/s, as required by the standard mixing Reynolds number definition. For Newtonian fluids in stirred vessels, indicative regimes are laminar below Re = 10, transitional from approximately Re = 10 to 10⁴, and turbulent above Re = 10⁴. Actual transition behaviour depends on impeller geometry, vessel configuration, and fluid properties. Non-Newtonian fluids may require an apparent viscosity evaluated at a representative shear rate.' },
    { id: 'vel', title: 'Mean velocity in a circular pipe', f: [line('v', ['4 · Q', 'π · D²'])],
      in: [I('Q', 'Volumetric flow rate Q [L/min]', '20'), I('D', 'Internal pipe diameter D [mm]', '25', 'pos')],
      out: ['Mean flow velocity'], run: v => ({ o: [['Mean flow velocity', f4(4 * (v.Q / 60000) / (Math.PI * (v.D / 1000) ** 2)) + ' m/s']] }),
      note: 'Calculates the cross-sectional average velocity for steady flow through a fully filled circular pipe. Assumes the specified volumetric flow rate corresponds to the operating conditions.' },
    { id: 'dw', title: 'Darcy–Weisbach pressure drop', modes: [['manual', 'Enter f manually'], ['calc', 'Calculate f']],
      f: {
        manual: [line('Δp', 'f · ', ['L', 'D_{h}'], ' · ', ['ρ · v²', '2'])],
        calc: [line('Δp', 'f · ', ['L', 'D_{h}'], ' · ', ['ρ · v²', '2']), line('Re', ['ρ · v · D_{h}', 'μ']), line('1/√f', '−2 · log₁₀(', ['ε/D_{h}', '3.7'], ' + ', ['2.51', 'Re · √f'], ')')],
      },
      in: [I('f', 'Darcy friction factor f [–] (not Fanning; f_Darcy = 4 × f_Fanning)', '0.02', 'pos', undefined, 'manual'), I('L', 'Pipe length L [m]', '10', 'pos'), I('Dh', 'Hydraulic diameter Dh [mm]', '25', 'pos'), I('rho', 'Fluid density ρ [kg/m³]', '1000', 'pos'), I('v', 'Mean flow velocity v [m/s]', '1.5'), I('mu', 'Dynamic viscosity μ [mPa·s]', '1.0', 'pos', undefined, 'calc'), I('rough', 'Absolute roughness ε [mm]', '0.045', 'nonneg', 'Commercial steel ≈ 0.045, drawn tubing ≈ 0.0015, PVC ≈ 0.0015–0.007', 'calc')],
      out: m => (m === 'calc' ? ['Straight-pipe frictional pressure drop', 'Reynolds number', 'Flow regime', 'Calculated friction factor f'] : ['Straight-pipe frictional pressure drop']),
      run: (v, m) => {
        let f = v.f;
        const o: [string, string][] = [], w: [WarnLevel, string][] = [];
        if (m === 'calc') {
          const Re = v.rho * Math.abs(v.v) * (v.Dh / 1000) / (v.mu / 1000);
          let reg: string;
          if (Re < 2300) { f = 64 / Re; reg = 'Laminar'; }
          else {
            // Colebrook–White, seeded with Haaland, 30 fixed-point iterations on x = 1/√f.
            const er = (v.rough / v.Dh) / 3.7;
            let x = -1.8 * Math.log10(er ** 1.11 + 6.9 / Re);
            for (let k = 0; k < 30; k++) x = -2 * Math.log10(er + 2.51 * x / Re);
            f = 1 / (x * x);
            reg = Re < 4000 ? 'Transitional' : 'Turbulent';
            if (Re < 4000) w.push(['amber', 'Friction factor is uncertain in the transitional regime.']);
          }
          o.push(['Reynolds number', f4(Re)], ['Flow regime', reg], ['Calculated friction factor f', f4(f)]);
        }
        return { o: [['Straight-pipe frictional pressure drop', fPa(f * (v.L / (v.Dh / 1000)) * (v.rho * v.v ** 2 / 2))], ...o], w };
      },
      note: 'Estimates major pressure losses for steady, incompressible flow. The friction factor must correspond to the applicable flow regime and pipe roughness; in calculated mode it uses f = 64/Re for laminar flow and the Colebrook–White equation (solved iteratively) otherwise. Fittings, valves, entrances, exits, and other minor losses are excluded.' },
    { id: 'pump', title: 'Pump shaft power estimate', f: [line('P_{hyd}', 'Δp · Q'), line('P_{shaft}', ['Δp · Q', 'η'])],
      in: [I('dp', 'Required pressure rise Δp [kPa]', '200'), I('Q', 'Volumetric flow rate Q [L/min]', '100'), I('eta', 'Pump efficiency η [%]', '70', 'eta')],
      out: ['Hydraulic power', 'Estimated pump shaft power'],
      run: v => { const h = v.dp * 1000 * (v.Q / 60000); return { o: [['Hydraulic power', fW(h)], ['Estimated pump shaft power', fW(h / (v.eta / 100))]] }; },
      note: 'Estimates the shaft power required to deliver the specified flow against a given pressure rise. Efficiency is converted to a fraction internally. Static elevation, additional system losses, motor efficiency, and operating-point limitations must be considered separately.' },
  ] },
];

export const defaultValues = (c: Calc) => Object.fromEntries(c.in.map(i => [i.k, i.d])) as Record<string, string>;
export const defaultMode = (c: Calc) => (c.modes ? c.modes[0][0] : '');

export type Evaluation = {
  formulas: FormulaLine[];
  inputs: (Input & { err: string })[];
  outputs: [string, string][];
  warns: [WarnLevel, string][];
};

/** Validates the active inputs for a mode and, only if all are valid, runs the calculation. */
export function evaluate(c: Calc, raw: Record<string, string>, mode: string): Evaluation {
  const active = c.in.filter(i => !i.mode || i.mode === mode);
  const v: Vals = {}, err: Record<string, string> = {};
  for (const i of active) { const [x, e] = checkField(raw[i.k], i.rule); v[i.k] = x; err[i.k] = e; }
  if (!Object.values(err).some(Boolean) && c.check) Object.assign(err, c.check(v, mode));
  const bad = Object.values(err).some(Boolean);
  let r: Result | null = null;
  if (!bad) { try { r = c.run(v, mode); } catch { r = null; } }
  const labels = typeof c.out === 'function' ? c.out(mode) : c.out;
  return {
    formulas: Array.isArray(c.f) ? c.f : c.f[mode],
    inputs: active.map(i => ({ ...i, err: err[i.k] || '' })),
    outputs: r ? r.o : labels.map(l => [l, '—'] as [string, string]),
    warns: r?.w ?? [],
  };
}
