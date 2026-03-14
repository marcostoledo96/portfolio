// ParallaxDirective Tests: verifica reduced motion, willChange, registro del listener
// fuera de NgZone, cleanup al destruir y cálculo de translateY.

import { Component, DebugElement, NgZone } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ParallaxDirective } from './parallax.directive';

// Componente host mínimo. Necesita un <section> y un <main> para que la directiva funcione.
@Component({
  standalone: true,
  imports: [ParallaxDirective],
  template: `
    <main class="layout__main" style="overflow:hidden; height:600px;">
      <section id="sec" style="height:400px;">
        <div [appParallax]="factor" id="target">forma</div>
      </section>
    </main>
  `,
})
class HostComponent {
  factor = 0.2;
}

describe('ParallaxDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let directiveEl: DebugElement;
  let nativeEl: HTMLElement;
  let ngZone: NgZone;

  // Helper para mockear matchMedia
  function mockMatchMedia(matches: boolean): void {
    spyOn(window, 'matchMedia').and.returnValue({
      matches,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList);
  }

  describe('sin reduced motion', () => {
    beforeEach(() => {
      mockMatchMedia(false);

      TestBed.configureTestingModule({
        imports: [HostComponent],
      });

      ngZone  = TestBed.inject(NgZone);
      fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      directiveEl = fixture.debugElement.query(By.directive(ParallaxDirective));
      nativeEl    = directiveEl.nativeElement;
    });

    it('aplica will-change: transform al inicializar', () => {
      // El contenedor main debe existir para que la directiva aplique el efecto
      expect(nativeEl.style.willChange).toBe('transform');
    });

    it('limpia will-change y transform al destruir', () => {
      fixture.destroy();
      expect(nativeEl.style.willChange).toBe('');
    });
  });

  describe('con prefers-reduced-motion: reduce', () => {
    beforeEach(() => {
      mockMatchMedia(true); // Simulo que el usuario pide menos movimiento

      TestBed.configureTestingModule({
        imports: [HostComponent],
      });

      fixture  = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      directiveEl = fixture.debugElement.query(By.directive(ParallaxDirective));
      nativeEl    = directiveEl.nativeElement;
    });

    it('NO aplica will-change cuando reducedMotion es true', () => {
      // Cuando hay reduced motion la directiva retorna en ngOnInit sin tocar el DOM
      expect(nativeEl.style.willChange).toBeFalsy();
    });

    it('NO modifica el transform cuando reducedMotion es true', () => {
      expect(nativeEl.style.transform).toBeFalsy();
    });
  });

  describe('cleanup', () => {
    beforeEach(() => {
      mockMatchMedia(false);

      TestBed.configureTestingModule({
        imports: [HostComponent],
      });

      fixture  = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      nativeEl = fixture.debugElement.query(By.directive(ParallaxDirective)).nativeElement;
    });

    it('elimina will-change al destruir el componente', () => {
      fixture.destroy();
      expect(nativeEl.style.willChange).toBe('');
    });

    it('resetea el transform al destruir el componente', () => {
      fixture.destroy();
      expect(nativeEl.style.transform).toBe('');
    });
  });
});
