'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { BRAND, NAV } from '@/data/site';
import { LogoMark, Wordmark } from './Logo';
import s from './Shell.module.css';

const MIN_W = 76, MAX_W = 380, SNAP_BELOW = 150, MIN_EXPANDED = 200, STORE = 'mprep-side';

// Runs before first paint (inlined in <head>) so a stored sidebar width/collapse state never flashes.
export const SIDEBAR_BOOT = `try{var d=JSON.parse(localStorage.getItem('${STORE}')||'null');if(d){var r=document.documentElement;if(d.collapsed)r.dataset.side='collapsed';var w=Math.min(${MAX_W},Math.max(${MIN_EXPANDED},+d.w||256));r.style.setProperty('--side-w',w+'px')}}catch(e){}`;

function isCurrent(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname === href.slice(0, -1) || pathname.startsWith(href);
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Sidebar({ pathname }: { pathname: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(256);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (d) { setCollapsed(!!d.collapsed); setWidth(Math.min(MAX_W, Math.max(MIN_EXPANDED, +d.w || 256))); }
    } catch {}
    setReady(true);
  }, []);

  // Mirror state onto <html> so CSS (and the pre-paint boot script) share one source of truth.
  // Skipped until the stored state is read, so the boot script's values aren't overwritten by defaults.
  useEffect(() => {
    if (!ready) return;
    const r = document.documentElement;
    if (collapsed) r.dataset.side = 'collapsed'; else delete r.dataset.side;
    r.style.setProperty('--side-w', width + 'px');
  }, [ready, collapsed, width]);

  const persist = (c: boolean, w: number) => { try { localStorage.setItem(STORE, JSON.stringify({ collapsed: c, w })); } catch {} };
  const toggle = () => setCollapsed(c => { persist(!c, width); return !c; });

  const startResize = (e: React.PointerEvent) => {
    e.preventDefault();
    // Width follows the pointer's absolute position from the sidebar's left edge, so it stays
    // correct even if a width transition is still running when the drag starts.
    const left = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect().left;
    const x0 = e.clientX;
    let moved = false, c = collapsed, w = width;
    document.documentElement.dataset.resizing = '';
    const mv = (ev: PointerEvent) => {
      const next = Math.min(MAX_W, Math.max(MIN_W, ev.clientX - left));
      if (Math.abs(ev.clientX - x0) > 3) moved = true;
      if (next < SNAP_BELOW) { c = true; } else { c = false; w = Math.max(MIN_EXPANDED, next); }
      setCollapsed(c); setWidth(w);
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up);
      delete document.documentElement.dataset.resizing;
      if (moved) persist(c, w);
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  };

  const onResizerKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(MAX_W, Math.max(MIN_EXPANDED, width + (e.key === 'ArrowRight' ? 16 : -16)));
      setCollapsed(false); setWidth(next); persist(false, next);
    } else if (e.key === 'Enter') { e.preventDefault(); toggle(); }
  };

  const label = collapsed ? 'Expand sidebar' : 'Collapse sidebar';

  return (
    <aside className={s.sidebar} aria-label="Primary">
      <div
        role="separator" aria-orientation="vertical" aria-label="Resize sidebar"
        aria-valuemin={MIN_W} aria-valuemax={MAX_W} aria-valuenow={collapsed ? MIN_W : width}
        tabIndex={0} title="Drag to resize · double-click to toggle"
        className={s.resizer} onPointerDown={startResize} onDoubleClick={toggle} onKeyDown={onResizerKey}
      />
      <div className={s.logoBlock}>
        <Link href="/" aria-label={`${BRAND} — Home`} className={`${s.logoLink} ${s.logoExpanded}`}>
          <LogoMark size={52} />
          <Wordmark size="lg" />
        </Link>
        <Link href="/" aria-label={`${BRAND} — Home`} title={BRAND} className={`${s.logoLink} ${s.logoCollapsed}`}>
          <LogoMark size={40} />
        </Link>
      </div>
      <div className={s.collapseWrap}>
        <button type="button" className={s.collapseBtn} onClick={toggle} aria-label={label} aria-expanded={!collapsed} title={label}>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v16M20 12H9M13 8l-4 4 4 4" />
          </svg>
          <span className={s.whenExpanded}>Collapse</span>
        </button>
      </div>
      <nav className={s.nav} aria-label="Site">
        {NAV.map(item => (
          <Link key={item.href} href={item.href} className={s.navItem} title={item.label} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined}>
            <NavIcon d={item.icon} />
            <span className={s.whenExpanded}>{item.label}</span>
            <span className={`${s.whenCollapsed} sr-only`}>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className={s.sideFoot}>
        <Link href="/contact/" className={s.sideCta}>
          <span className={s.whenExpanded}>Request a Quote</span>
          <svg className={s.whenCollapsed} aria-label="Request a Quote" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18v12H3zM3 7l9 6 9-6" />
          </svg>
        </Link>
        <p className={`${s.sideNote} ${s.whenExpanded}`}>Engineering Equipment for Material Preparation</p>
      </div>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => { setOpen(false); menuBtn.current?.focus(); }, []);

  // Close on navigation.
  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !drawer.current) return;
      // Focus trap: wrap Tab / Shift+Tab inside the drawer.
      const items = drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [open, close]);

  return (
    <>
      <header className={s.mobileHeader}>
        <Link href="/" aria-label={`${BRAND} — Home`} className={s.mobileLogo}>
          <LogoMark size={38} />
          <Wordmark size="sm" />
        </Link>
        <button ref={menuBtn} type="button" className={s.menuBtn} onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-drawer">
          MENU
        </button>
      </header>
      {open && (
        <div className={s.drawerRoot}>
          <div className={s.scrim} onClick={close} aria-hidden="true" />
          <div ref={drawer} id="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation" className={s.drawer}>
            <div className={s.drawerHead}>
              <span className={s.drawerBrand}>
                <LogoMark size={36} />
                <Wordmark size="sm" />
              </span>
              <button ref={closeBtn} type="button" className={s.menuBtn} onClick={close} aria-label="Close navigation">CLOSE</button>
            </div>
            <nav className={s.drawerNav} aria-label="Site">
              {NAV.map(item => (
                <Link key={item.href} href={item.href} className={s.drawerItem} aria-current={isCurrent(pathname, item.href) ? 'page' : undefined} onClick={() => setOpen(false)}>
                  <NavIcon d={item.icon} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
            <Link href="/contact/" className={s.drawerCta} onClick={() => setOpen(false)}>Request a Quote</Link>
          </div>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <span className={s.footerBrand}><LogoMark size={26} color="#FFFFFF" />© 2026 {BRAND}</span>
        <span className={s.footerLine}>CAD · FEA · CFD · Thermal · Process equipment</span>
      </div>
    </footer>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || '/';
  return (
    <div className={s.shell}>
      <a href="#main" className="skip-link">Skip to content</a>
      <Sidebar pathname={pathname} />
      <div className={s.mainCol}>
        <MobileNav pathname={pathname} />
        <main id="main" className={s.main} tabIndex={-1}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
