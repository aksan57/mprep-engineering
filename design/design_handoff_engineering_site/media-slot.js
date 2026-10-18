// <media-slot sid="..."> — wraps an <image-slot> and adds 3D (GLB/GLTF/STL/OBJ, orbit) and 2D drawing (SVG zoom/pan, PDF) viewing.
// Production: set model-src="assets/part.glb" or drawing-src="assets/ga.svg" to load a file by path.
(function () {
  const EXT3D = ['glb', 'gltf', 'stl', 'obj'];
  const EXT2D = ['svg', 'pdf'];
  const EXTIMG = ['jpg', 'jpeg', 'png', 'webp'];
  const ALL = [...EXTIMG, ...EXT3D, ...EXT2D, 'dwg', 'dxf'];
  const ACCEPT = ALL.map(e => '.' + e).join(',');
  const TV = '0.160.0';
  let threeP = null;
  const loadThree = () => threeP || (threeP = Promise.all([
    import(`https://esm.sh/three@${TV}`),
    import(`https://esm.sh/three@${TV}/examples/jsm/controls/OrbitControls.js`),
    import(`https://esm.sh/three@${TV}/examples/jsm/loaders/GLTFLoader.js`),
    import(`https://esm.sh/three@${TV}/examples/jsm/loaders/STLLoader.js`),
    import(`https://esm.sh/three@${TV}/examples/jsm/loaders/OBJLoader.js`),
    import(`https://esm.sh/three@${TV}/examples/jsm/loaders/DRACOLoader.js`),
    import(`https://esm.sh/three@${TV}/examples/jsm/libs/meshopt_decoder.module.js`),
  ]).then(([T, O, G, S, B, D, MO]) => ({ T, OrbitControls: O.OrbitControls, GLTFLoader: G.GLTFLoader, STLLoader: S.STLLoader, OBJLoader: B.OBJLoader, DRACOLoader: D.DRACOLoader, MeshoptDecoder: MO.MeshoptDecoder })));
  // Defer heavy work until a slot is near the viewport
  const near = (el, fn) => { const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); fn(); } }, { rootMargin: '200px' }); io.observe(el); return io; };

  // IndexedDB persistence (browser-local preview)
  const DB = 'mprep-media', ST = 'files';
  const db = () => new Promise((res, rej) => { const r = indexedDB.open(DB, 1); r.onupgradeneeded = () => r.result.createObjectStore(ST); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const idb = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => { const t = d.transaction(ST, mode); const q = fn(t.objectStore(ST)); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  const put = (k, v) => idb('readwrite', s => s.put(v, k));
  const get = k => idb('readonly', s => s.get(k));
  const del = k => idb('readwrite', s => s.delete(k));
  const ext = n => (n.split('.').pop() || '').toLowerCase();

  const CSS = `
  :host{display:block;position:relative}
  .layer{position:absolute;inset:0;z-index:3;background:radial-gradient(120% 90% at 50% 35%,#1C3D5E 0%,#102A43 70%);display:none;overflow:hidden;touch-action:none}
  .layer.on{display:block}
  .layer.d2{background:#FFFFFF;cursor:grab}
  .layer.d2:active{cursor:grabbing}
  canvas{display:block;width:100%;height:100%;cursor:grab}
  canvas:active{cursor:grabbing}
  .pan{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
  .pan img{display:block;max-width:none;user-select:none;-webkit-user-drag:none}
  iframe{border:0;width:100%;height:100%;background:#fff}
  .bar{position:absolute;left:8px;bottom:8px;z-index:5;display:flex;gap:6px;align-items:center;opacity:0;transition:opacity .15s;font:500 10.5px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.06em}
  :host(:hover) .bar,:host(:focus-within) .bar,.bar.keep{opacity:1}
  @media (hover:none){.bar{opacity:1}}
  button,.tag{appearance:none;border:1px solid rgba(46,196,196,.55);background:rgba(16,42,67,.88);color:#E6F7F7;border-radius:3px;padding:6px 8px;font:inherit;letter-spacing:inherit;cursor:pointer;text-transform:uppercase}
  button:hover{background:#2EC4C4;color:#102A43;border-color:#2EC4C4}
  .tag{cursor:default;border-color:rgba(255,255,255,.2);color:#9FB3C8}
  .d2 ~ .bar .tag{background:rgba(16,42,67,.88)}
  .msg{position:absolute;inset:0;z-index:6;display:none;align-items:center;justify-content:center;padding:18px;text-align:center;background:rgba(16,42,67,.94);color:#E6F7F7;font:400 12.5px/1.55 'IBM Plex Sans',system-ui,sans-serif}
  .msg.on{display:flex}
  .msg b{color:#2EC4C4;font-weight:500}
  .drop{position:absolute;inset:0;z-index:7;display:none;align-items:center;justify-content:center;border:2px dashed #2EC4C4;background:rgba(46,196,196,.12);color:#102A43;font:500 11px 'IBM Plex Mono',monospace;letter-spacing:.08em;pointer-events:none}
  .drop.on{display:flex}
  .drop span{background:#2EC4C4;padding:6px 10px;border-radius:3px}
  .spin{position:absolute;inset:0;z-index:4;display:none;align-items:center;justify-content:center;color:#9FB3C8;font:500 11px 'IBM Plex Mono',monospace;letter-spacing:.1em}
  .spin.on{display:flex}`;

  class MediaSlot extends HTMLElement {
    static get observedAttributes() { return ['model-src', 'drawing-src', 'sid']; }
    connectedCallback() {
      if (this._init) return; this._init = true;
      const r = this.attachShadow({ mode: 'open' });
      r.innerHTML = `<style>${CSS}</style><slot></slot>
        <div class="layer" part="viewer"></div>
        <div class="spin">LOADING MODEL…</div>
        <div class="msg"></div>
        <div class="drop"><span>DROP JPG · PNG · GLB · STL · OBJ · SVG · PDF</span></div>
        <div class="bar" data-dc-edit-transparent>
          <button data-a="up" title="Upload image (JPG/JPEG/PNG), 3D model (GLB/STL/OBJ) or drawing (SVG/PDF)">+ Upload</button>
        </div>
        <input type="file" accept="${ACCEPT}" hidden>`;
      this.$ = s => r.querySelector(s);
      this._layer = this.$('.layer'); this._bar = this.$('.bar'); this._input = this.$('input');
      this._bar.addEventListener('click', e => { const a = e.target.closest('button')?.dataset.a; if (!a) return; e.stopPropagation(); this._act(a); });
      this._input.addEventListener('change', () => { const f = this._input.files[0]; this._input.value = ''; if (f) this._file(f); });
      this.$('.msg').addEventListener('click', () => this.$('.msg').classList.remove('on'));
      const isOurs = e => { const it = e.dataTransfer?.items; return !!(it && [...it].some(i => i.kind === 'file')); };
      this.addEventListener('dragover', e => { if (isOurs(e)) { e.preventDefault(); e.stopPropagation(); this.$('.drop').classList.add('on'); } }, true);
      this.addEventListener('dragleave', e => { if (!this.contains(e.relatedTarget)) this.$('.drop').classList.remove('on'); }, true);
      this.addEventListener('drop', e => { this.$('.drop').classList.remove('on'); const f = e.dataTransfer?.files?.[0]; if (f) { e.preventDefault(); e.stopPropagation(); this._file(f); } }, true);
      this._restore();
    }
    attributeChangedCallback() { if (this._init) this._restore(); }
    disconnectedCallback() { this._teardown(); }
    get _key() { return this.getAttribute('sid') || this.id || ''; }

    async _restore() {
      const ms = this.getAttribute('model-src'), ds = this.getAttribute('drawing-src');
      if (ms) return this._show(ext(ms), ms, ms.split('/').pop(), false);
      if (ds) return this._show(ext(ds), ds, ds.split('/').pop(), false);
      if (!this._key) return;
      try { const v = await get(this._key); if (v && v.blob) this._show(ext(v.name), URL.createObjectURL(v.blob), v.name, true); } catch (e) {}
    }
    async _file(f) {
      const x = ext(f.name);
      if (EXTIMG.includes(x) || /^image\/(png|jpeg|webp)$/.test(f.type)) { const im = this.querySelector('image-slot'); if (this._key) del(this._key).catch(() => {}); this._teardown(); this._setBar(); if (im && im._ingest) im._ingest(f); return; }
      if (!ALL.includes(x)) return this._msg('<div><b>Unsupported file.</b><br>Images: JPG, JPEG, PNG · 3D: GLB, STL, OBJ · Drawings: SVG, PDF<br><span style="opacity:.6;font-size:11px">click to dismiss</span></div>');
      if (x === 'dwg' || x === 'dxf') return this._msg(`<div><b>${x.toUpperCase()} can’t be shown in a browser.</b><br>2D drawing → export to <b>SVG</b> or <b>PDF</b>.<br>3D model → export to <b>STL</b> or <b>GLB</b>.<br><span style="opacity:.6;font-size:11px">click to dismiss</span></div>`);
      if (this._key) { try { await put(this._key, { name: f.name, blob: f }); } catch (e) {} }
      this._show(x, URL.createObjectURL(f), f.name, true);
    }
    _msg(h) { const m = this.$('.msg'); m.innerHTML = h; m.classList.add('on'); }
    _act(a) {
      if (a === 'up') this._input.click();
      else if (a === 'reset') this._reset && this._reset();
      else if (a === 'rot') { if (this._ctl) { this._ctl.autoRotate = !this._ctl.autoRotate; this._kick(); } }
      else if (a === 'rm') { if (this._key) del(this._key).catch(() => {}); this._teardown(); this._setBar(); }
    }
    _setBar(kind, name, local) {
      const b = [];
      if (kind) b.push(`<span class="tag">${name.length > 22 ? name.slice(0, 20) + '…' : name}</span>`, `<button data-a="reset" title="Reset view">Reset</button>`);
      if (kind === '3d') b.push(`<button data-a="rot" title="Toggle auto-rotate">Spin</button>`);
      if (kind && local) b.push(`<button data-a="rm" title="Remove and show image">×</button>`);
      b.push(`<button data-a="up" title="Upload image (JPG/JPEG/PNG), 3D model (GLB/STL/OBJ) or drawing (SVG/PDF)">${kind ? 'Replace' : '+ Upload'}</button>`);
      this._bar.innerHTML = b.join('');
    }
    _teardown() {
      this._alive = false;
      if (this._raf) cancelAnimationFrame(this._raf);
      this._ro && this._ro.disconnect(); this._io && this._io.disconnect(); this._wait && (this._wait.disconnect(), this._wait = null);
      this._scene && this._scene.traverse(o => { o.geometry && o.geometry.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach(mm => { for (const k in mm) mm[k] && mm[k].isTexture && mm[k].dispose(); mm.dispose(); }); }); this._scene = null;
      document.removeEventListener('visibilitychange', this._vis || (() => {}));
      this._ctl && this._ctl.dispose(); this._rend && (this._rend.dispose(), this._rend.forceContextLoss && this._rend.forceContextLoss());
      this._ctl = this._rend = this._reset = null;
      if (this._url && this._url.startsWith('blob:')) URL.revokeObjectURL(this._url);
      if (this._layer) { this._layer.innerHTML = ''; this._layer.className = 'layer'; }
    }
    _show(x, url, name, local) {
      this._teardown(); this._url = url;
      if (EXT3D.includes(x)) { this._setBar('3d', name, local); this._wait = near(this, () => { this._wait = null; this._show3d(x, url, name, local); }); }
      else if (x === 'svg') this._show2d(url, name, local);
      else if (x === 'pdf') { this._layer.className = 'layer on'; this._layer.innerHTML = `<iframe src="${url}#view=FitH" title="${name}"></iframe>`; this._reset = () => { const f = this._layer.querySelector('iframe'); f.src = f.src; }; this._setBar('2d', name, local); }
    }
    _show2d(url, name, local) {
      const L = this._layer; L.className = 'layer on d2';
      L.innerHTML = `<div class="pan"><img draggable="false" alt="${name}"></div>`;
      const pan = L.firstChild, img = pan.firstChild;
      let s = 1, tx = 0, ty = 0, fit = 1;
      const ap = () => pan.style.transform = `translate(${tx}px,${ty}px) scale(${s})`;
      const reset = () => { const w = img.naturalWidth || 1000, h = img.naturalHeight || 700, W = L.clientWidth, H = L.clientHeight; fit = Math.min(W / w, H / h) * .94; s = fit; tx = (W - w * s) / 2; ty = (H - h * s) / 2; ap(); };
      img.onload = () => { if (!img.naturalWidth) { img.style.width = '1200px'; } reset(); };
      img.src = url;
      L.addEventListener('wheel', e => { e.preventDefault(); const r = L.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, k = Math.exp(-e.deltaY * .0015), ns = Math.min(Math.max(s * k, fit * .5), fit * 40); tx = mx - (mx - tx) * ns / s; ty = my - (my - ty) * ns / s; s = ns; ap(); }, { passive: false });
      const pts = new Map(); let last = null;
      L.addEventListener('pointerdown', e => { L.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); last = null; });
      L.addEventListener('pointermove', e => {
        if (!pts.has(e.pointerId)) return; const p = pts.get(e.pointerId); const nx = e.clientX, ny = e.clientY;
        if (pts.size === 1) { tx += nx - p[0]; ty += ny - p[1]; }
        else { const o = [...pts.entries()].find(([k]) => k !== e.pointerId)[1]; const d = Math.hypot(nx - o[0], ny - o[1]); if (last) { const r = L.getBoundingClientRect(), cx = (nx + o[0]) / 2 - r.left, cy = (ny + o[1]) / 2 - r.top, ns = Math.min(Math.max(s * d / last, fit * .5), fit * 40); tx = cx - (cx - tx) * ns / s; ty = cy - (cy - ty) * ns / s; s = ns; } last = d; }
        pts.set(e.pointerId, [nx, ny]); ap();
      });
      const up = e => { pts.delete(e.pointerId); last = null; };
      L.addEventListener('pointerup', up); L.addEventListener('pointercancel', up);
      L.addEventListener('dblclick', reset);
      this._ro = new ResizeObserver(reset); this._ro.observe(L);
      this._reset = reset; this._setBar('2d', name, local);
    }
    async _show3d(x, url, name, local) {
      const L = this._layer; L.className = 'layer on'; this._alive = true;
      const sp = this.$('.spin'); sp.classList.add('on'); this._setBar('3d', name, local);
      let M;
      try { M = await loadThree(); } catch (e) { sp.classList.remove('on'); return this._msg('<div><b>3D viewer failed to load.</b><br>Check internet connection.</div>'); }
      if (!this._alive || this._url !== url) return;
      const { T } = M;
      const dpr = devicePixelRatio || 1;
      const rend = new T.WebGLRenderer({ antialias: dpr < 1.5, alpha: true, powerPreference: 'low-power' });
      rend.setPixelRatio(Math.min(dpr, 1.5)); rend.outputColorSpace = T.SRGBColorSpace;
      rend.toneMapping = T.ACESFilmicToneMapping; rend.toneMappingExposure = 1.05;
      L.appendChild(rend.domElement); this._rend = rend;
      const scene = new T.Scene(); this._scene = scene; const cam = new T.PerspectiveCamera(35, 1, .01, 1e6);
      scene.add(new T.HemisphereLight(0xEAF4FA, 0x223344, 1.6));
      const k = new T.DirectionalLight(0xffffff, 2.2); k.position.set(3, 5, 4); scene.add(k);
      const f2 = new T.DirectionalLight(0x9FE6E6, .8); f2.position.set(-4, 2, -3); scene.add(f2);
      const ctl = new M.OrbitControls(cam, rend.domElement); ctl.enableDamping = true; ctl.autoRotate = true; ctl.autoRotateSpeed = 1.2; this._ctl = ctl;
      ctl.addEventListener('start', () => { ctl.autoRotate = false; this._kick(); });
      let obj;
      const mat = new T.MeshStandardMaterial({ color: 0xB9C6D0, metalness: .35, roughness: .45 });
      try {
        if (x === 'glb' || x === 'gltf') { const gl = new M.GLTFLoader(); const dr = new M.DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/'); gl.setDRACOLoader(dr); gl.setMeshoptDecoder(M.MeshoptDecoder); obj = (await gl.loadAsync(url)).scene; dr.dispose(); }
        else if (x === 'stl') { const g = await new M.STLLoader().loadAsync(url); g.computeVertexNormals(); obj = new T.Mesh(g, g.hasColors ? new T.MeshStandardMaterial({ vertexColors: true, metalness: .3, roughness: .5 }) : mat); obj.rotation.x = -Math.PI / 2; }
        else { obj = await new M.OBJLoader().loadAsync(url); obj.traverse(o => { if (o.isMesh && (!o.material || !o.material.map)) o.material = mat; }); }
      } catch (e) { sp.classList.remove('on'); this._teardown(); this._setBar(); return this._msg('<div><b>Could not read this file.</b><br>Try exporting again as GLB or binary STL.</div>'); }
      if (!this._alive || this._url !== url) return;
      sp.classList.remove('on');
      const wrap = new T.Group(); wrap.add(obj); scene.add(wrap);
      wrap.updateMatrixWorld(true);
      const box = new T.Box3().setFromObject(wrap), c = box.getCenter(new T.Vector3()), sz = box.getSize(new T.Vector3());
      obj.position.sub(c); const rad = Math.max(sz.length() / 2, 1e-6);
      const grid = new T.GridHelper(rad * 4, 20, 0x2EC4C4, 0x2A4A6A); grid.position.y = -sz.y / 2; grid.material.transparent = true; grid.material.opacity = .35; scene.add(grid);
      const reset = () => { const d = rad / Math.sin(T.MathUtils.degToRad(cam.fov / 2)) * 1.05; cam.position.set(d * .62, d * .42, d * .66); cam.near = d / 100; cam.far = d * 100; cam.updateProjectionMatrix(); ctl.target.set(0, 0, 0); ctl.update(); this._kick(); };
      const size = () => { const w = L.clientWidth || 1, h = L.clientHeight || 1; rend.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); this._kick(); };
      this._ro = new ResizeObserver(size); this._ro.observe(L); size(); reset(); this._reset = reset;
      let vis = true;
      this._io = new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) this._kick(); }); this._io.observe(L);
      this._vis = () => { if (!document.hidden) this._kick(); }; document.addEventListener('visibilitychange', this._vis);
      let idle = 0, lastT = 0, active = false;
      ctl.addEventListener('start', () => active = true); ctl.addEventListener('end', () => active = false);
      const loop = t => { this._raf = 0; if (!this._alive || !vis || document.hidden) return;
        // auto-spin capped at ~30fps; full rate only while the user drags
        if (active || !ctl.autoRotate || t - lastT > 32) { lastT = t; const moved = ctl.update(); rend.render(scene, cam); idle = moved || ctl.autoRotate ? 0 : idle + 1; }
        if (idle < 30) this._raf = requestAnimationFrame(loop); };
      this._kick = () => { idle = 0; if (!this._raf && this._alive) this._raf = requestAnimationFrame(loop); };
      ctl.addEventListener('change', this._kick);
      this._kick();
    }
    _kick() {}
  }
  if (!customElements.get('media-slot')) customElements.define('media-slot', MediaSlot);
})();
