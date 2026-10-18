'use client';

import { useEffect, useRef, useState } from 'react';
import Img from './Img';
import s from './ModelViewer.module.css';

type Props = {
  src: string; poster: string; alt: string; sizeLabel: string;
  /** Fill a positioned parent (e.g. a fixed-ratio frame) instead of using the default 16:9 box. */
  fill?: boolean;
  /** How the poster sits in the frame: `contain` for renders with margins, `cover` for full-bleed images. */
  posterFit?: 'contain' | 'cover';
  /** Load the poster eagerly (above-the-fold use, e.g. the Home hero). */
  posterPriority?: boolean;
};
type Status = 'poster' | 'waiting' | 'loading' | 'ready' | 'error';

/** Save-Data, low memory or few cores: show the poster and let the user opt in. */
function isLowPower() {
  const n = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return !!n.connection?.saveData || (n.deviceMemory ?? 8) <= 2 || (n.hardwareConcurrency ?? 8) <= 2
    || matchMedia('(prefers-reduced-data: reduce)').matches;
}

/**
 * three.js orbit viewer for GLB/glTF. Lazy-loads three only when within 200px of the viewport,
 * renders on demand (auto-spin capped ~30 fps), pauses off-screen / in hidden tabs, and disposes on unmount.
 */
export default function ModelViewer({ src, poster, alt, sizeLabel, fill, posterFit = 'contain', posterPriority }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const api = useRef<{ reset: () => void; setSpin: (on: boolean) => void } | null>(null);
  const [status, setStatus] = useState<Status>('waiting');
  const [spin, setSpin] = useState(true);
  const [optIn, setOptIn] = useState(false);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) setSpin(false);
    if (!optIn && isLowPower()) { setStatus('poster'); return; }

    let disposed = false;
    let cleanup = () => {};
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();
      setStatus('loading');
      init(!reduced).then(c => { if (disposed) c(); else cleanup = c; }).catch(() => !disposed && setStatus('error'));
    }, { rootMargin: '200px' });
    io.observe(box.current!);

    async function init(autoRotate: boolean) {
      const [T, { OrbitControls }, { GLTFLoader }, { DRACOLoader }, { MeshoptDecoder }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
        import('three/examples/jsm/loaders/GLTFLoader.js'),
        import('three/examples/jsm/loaders/DRACOLoader.js'),
        import('three/examples/jsm/libs/meshopt_decoder.module.js'),
      ]);
      const L = layer.current!;
      const dpr = window.devicePixelRatio || 1;
      const rend = new T.WebGLRenderer({ antialias: dpr < 1.5, alpha: true, powerPreference: 'low-power' });
      rend.setPixelRatio(Math.min(dpr, 1.5));
      rend.outputColorSpace = T.SRGBColorSpace;
      rend.toneMapping = T.ACESFilmicToneMapping;
      rend.toneMappingExposure = 1.05;
      rend.domElement.setAttribute('role', 'img');
      rend.domElement.setAttribute('aria-label', alt);

      const scene = new T.Scene();
      const cam = new T.PerspectiveCamera(35, 1, 0.01, 1e6);
      scene.add(new T.HemisphereLight(0xeaf4fa, 0x223344, 1.6));
      const key = new T.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 4); scene.add(key);
      const fill = new T.DirectionalLight(0x9fe6e6, 0.8); fill.position.set(-4, 2, -3); scene.add(fill);

      const loader = new GLTFLoader();
      const draco = new DRACOLoader().setDecoderPath('/draco/');
      loader.setDRACOLoader(draco);
      loader.setMeshoptDecoder(MeshoptDecoder);
      const gltf = await loader.loadAsync(src);
      draco.dispose();
      if (disposed) { rend.dispose(); return () => {}; }

      const ctl = new OrbitControls(cam, rend.domElement);
      ctl.enableDamping = true; ctl.autoRotate = autoRotate; ctl.autoRotateSpeed = 1.2;

      // Auto-frame: centre the model and size the grid and camera to its bounds.
      const obj = gltf.scene, wrap = new T.Group();
      wrap.add(obj); scene.add(wrap); wrap.updateMatrixWorld(true);
      const bounds = new T.Box3().setFromObject(wrap);
      const c = bounds.getCenter(new T.Vector3()), size = bounds.getSize(new T.Vector3());
      obj.position.sub(c);
      const rad = Math.max(size.length() / 2, 1e-6);
      const grid = new T.GridHelper(rad * 4, 20, 0x2ec4c4, 0x2a4a6a);
      grid.position.y = -size.y / 2;
      (grid.material as InstanceType<typeof T.Material>).transparent = true;
      (grid.material as InstanceType<typeof T.Material>).opacity = 0.35;
      scene.add(grid);

      L.appendChild(rend.domElement);

      let raf = 0, idle = 0, last = 0, dragging = false, visible = true;
      const loop = (t: number) => {
        raf = 0;
        if (!visible || document.hidden) return;
        if (dragging || !ctl.autoRotate || t - last > 32) {
          last = t;
          const moved = ctl.update();
          rend.render(scene, cam);
          idle = moved || ctl.autoRotate ? 0 : idle + 1;
        }
        if (idle < 30) raf = requestAnimationFrame(loop);
      };
      const kick = () => { idle = 0; if (!raf) raf = requestAnimationFrame(loop); };

      const reset = () => {
        const d = rad / Math.sin(T.MathUtils.degToRad(cam.fov / 2)) * 1.05;
        cam.position.set(d * 0.62, d * 0.42, d * 0.66);
        cam.near = d / 100; cam.far = d * 100; cam.updateProjectionMatrix();
        ctl.target.set(0, 0, 0); ctl.update(); kick();
      };
      const resize = () => {
        const w = L.clientWidth || 1, h = L.clientHeight || 1;
        rend.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); kick();
      };

      // Touch: one finger scrolls the page; two fingers drag to rotate and pinch to zoom. Mouse is unchanged.
      // OrbitControls sets touch-action:none (blocks page scroll); pan-y hands vertical one-finger swipes
      // back to the browser, and ONE:null makes OrbitControls ignore single-finger touches.
      ctl.touches = { ONE: null, TWO: T.TOUCH.DOLLY_ROTATE };
      const canvas = rend.domElement;
      canvas.style.touchAction = 'pan-y';
      // pan-y alone would also let a two-finger vertical drag scroll the page. Cancel the scroll while two
      // or more fingers are down, so those pointer events reach OrbitControls. Needs passive:false.
      const holdTwoFinger = (e: TouchEvent) => { if (e.touches.length > 1 && e.cancelable) e.preventDefault(); };
      canvas.addEventListener('touchstart', holdTwoFinger, { passive: false });
      canvas.addEventListener('touchmove', holdTwoFinger, { passive: false });

      ctl.addEventListener('start', () => { dragging = true; if (ctl.autoRotate) { ctl.autoRotate = false; setSpin(false); } kick(); });
      ctl.addEventListener('end', () => { dragging = false; });
      ctl.addEventListener('change', kick);
      canvas.addEventListener('dblclick', reset);

      const ro = new ResizeObserver(resize); ro.observe(L);
      const vis = new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }); vis.observe(L);
      const onVis = () => { if (!document.hidden) kick(); };
      document.addEventListener('visibilitychange', onVis);

      resize(); reset();
      api.current = { reset, setSpin: on => { ctl.autoRotate = on; kick(); } };
      setStatus('ready');

      return () => {
        if (raf) cancelAnimationFrame(raf);
        ro.disconnect(); vis.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        canvas.removeEventListener('dblclick', reset);
        canvas.removeEventListener('touchstart', holdTwoFinger);
        canvas.removeEventListener('touchmove', holdTwoFinger);
        scene.traverse(o => {
          const m = o as InstanceType<typeof T.Mesh>;
          m.geometry?.dispose();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          mats.forEach(mat => {
            for (const v of Object.values(mat)) if (v && (v as { isTexture?: boolean }).isTexture) (v as InstanceType<typeof T.Texture>).dispose();
            mat.dispose();
          });
        });
        ctl.dispose(); rend.dispose(); rend.forceContextLoss(); rend.domElement.remove();
        api.current = null;
      };
    }

    return () => { disposed = true; io.disconnect(); cleanup(); };
  }, [src, alt, optIn]);

  const toggleSpin = () => { const next = !spin; setSpin(next); api.current?.setSpin(next); };

  return (
    <div ref={box} className={`${s.viewer}${fill ? ' ' + s.fill : ''}`}>
      {status !== 'ready' && (
        <div className={s.poster} data-fit={posterFit}>
          <Img src={poster} alt={alt} fit={posterFit} priority={posterPriority} />
        </div>
      )}
      <div ref={layer} className={s.layer} data-on={status === 'ready' || undefined} />
      {status === 'loading' && <div className={s.status} role="status">LOADING MODEL…</div>}
      {status === 'error' && <div className={s.status} role="alert">The 3D model could not be loaded.</div>}
      {status === 'poster' && (
        <div className={s.optIn}>
          <button type="button" className={s.btn} onClick={() => setOptIn(true)}>Load 3D model ({sizeLabel})</button>
        </div>
      )}
      {status === 'ready' && (
        <div className={s.bar}>
          <button type="button" className={s.btn} onClick={() => api.current?.reset()}>Reset</button>
          <button type="button" className={s.btn} aria-pressed={spin} onClick={toggleSpin}>Spin</button>
        </div>
      )}
    </div>
  );
}
