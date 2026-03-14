/**
 * Setup global para tests: provee mocks de APIs del browser que no están
 * disponibles en el entorno de Karma / ChromeHeadless.
 * Este archivo se incluye en polyfills del bloque "test" de angular.json.
 */

// ── IntersectionObserver ────────────────────────────────────────────────────
// Karma/ChromeHeadless puede no exponer IntersectionObserver; lo stubeo para
// que las directivas que lo usan no rompan al instanciarse durante los tests.
if (typeof IntersectionObserver === 'undefined') {
  (window as any)['IntersectionObserver'] = class MockIntersectionObserver {
    observe   = () => {};
    unobserve = () => {};
    disconnect = () => {};
    constructor(private callback: IntersectionObserverCallback) {}
  };
}

// ── requestAnimationFrame ───────────────────────────────────────────────────
// Algunos tests usan fakeAsync; rAF puede no estar disponible en todos los contextos.
if (typeof requestAnimationFrame === 'undefined') {
  (window as any)['requestAnimationFrame'] = (fn: FrameRequestCallback) => setTimeout(fn, 16);
  (window as any)['cancelAnimationFrame']  = clearTimeout;
}

// ── matchMedia ──────────────────────────────────────────────────────────────
// Karma no implementa matchMedia; lo stubeo para las directivas (parallax, barra-lateral)
// que consultan prefers-reduced-motion al inicializarse.
if (typeof window.matchMedia === 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList),
  });
}
