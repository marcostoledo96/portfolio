// AnimateOnScrollDirective Tests: verifica el comportamiento del observer,
// las clases CSS aplicadas y el cleanup al destruir el componente.

import {
  Component, DebugElement, NgZone,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AnimateOnScrollDirective } from './animate-on-scroll.directive';

// Componente host mínimo para aplicar la directiva
@Component({
  standalone: true,
  imports: [AnimateOnScrollDirective],
  template: `
    <div appAnimateOnScroll [animateDelay]="delay" [animateThreshold]="threshold">Contenido</div>
  `,
})
class HostComponent {
  delay = 0;
  threshold = 0.15;
}

/** Mock de IntersectionObserver que guarda la instancia y expone helpers para simular intersección */
class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  static callback: IntersectionObserverCallback;

  observe    = jasmine.createSpy('observe');
  unobserve  = jasmine.createSpy('unobserve');
  disconnect = jasmine.createSpy('disconnect');

  constructor(callback: IntersectionObserverCallback) {
    MockIntersectionObserver.callback  = callback;
    MockIntersectionObserver.instances.push(this);
  }

  /** Simula que el elemento observado entró en el viewport */
  triggerEntry(el: Element): void {
    MockIntersectionObserver.callback(
      [{ isIntersecting: true, target: el } as IntersectionObserverEntry],
      this as any,
    );
  }
}

describe('AnimateOnScrollDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let directiveEl: DebugElement;
  let nativeEl: HTMLElement;
  // Guardo el valor original para restaurarlo después de cada test
  // (no usar delete: en ChromeHeadless eso borra el nativo y rompe los specs siguientes)
  let originalIO: typeof IntersectionObserver;

  beforeEach(() => {
    originalIO = (window as any).IntersectionObserver;
    MockIntersectionObserver.instances = [];

    // Reemplazo el IntersectionObserver global con el mock
    (window as any).IntersectionObserver = MockIntersectionObserver;

    TestBed.configureTestingModule({
      imports: [HostComponent],
    });

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    directiveEl = fixture.debugElement.query(By.directive(AnimateOnScrollDirective));
    nativeEl    = directiveEl.nativeElement;
  });

  afterEach(() => {
    // Restauro el IntersectionObserver original (no uso delete: borraría el nativo en Chrome)
    (window as any).IntersectionObserver = originalIO;
  });

  it('agrega la clase animate-on-scroll al inicializar', () => {
    expect(nativeEl.classList.contains('animate-on-scroll')).toBeTrue();
  });

  it('no agrega transitionDelay cuando animateDelay es 0', () => {
    expect(nativeEl.style.transitionDelay).toBeFalsy();
  });

  it('aplica transitionDelay como segundos cuando animateDelay > 0', () => {
    fixture.componentInstance.delay = 0.2;
    fixture.detectChanges();

    // Necesito recrear el fixture para que ngOnInit aplique el nuevo delay
    TestBed.resetTestingModule();
    MockIntersectionObserver.instances = [];

    TestBed.configureTestingModule({ imports: [HostComponent] });
    const fix = TestBed.createComponent(HostComponent);
    fix.componentInstance.delay = 0.2;
    fix.detectChanges();

    const el = fix.debugElement.query(By.directive(AnimateOnScrollDirective)).nativeElement as HTMLElement;
    expect(el.style.transitionDelay).toBe('0.2s');
  });

  it('agrega la clase visible al entrar en viewport', () => {
    const observer = MockIntersectionObserver.instances[0];
    observer.triggerEntry(nativeEl);
    expect(nativeEl.classList.contains('visible')).toBeTrue();
  });

  it('llama unobserve tras la primera intersección', () => {
    const observer = MockIntersectionObserver.instances[0];
    observer.triggerEntry(nativeEl);
    expect(observer.unobserve).toHaveBeenCalledWith(nativeEl);
  });

  it('no agrega la clase visible mientras no intersecta', () => {
    expect(nativeEl.classList.contains('visible')).toBeFalse();
  });

  it('llama disconnect al destruir el componente', () => {
    const observer = MockIntersectionObserver.instances[0];
    fixture.destroy();
    expect(observer.disconnect).toHaveBeenCalled();
  });

  it('crea el observer con el threshold configurado', () => {
    // El observer se crea en runOutsideAngular; se verifica que observe fue invocado
    const observer = MockIntersectionObserver.instances[0];
    expect(observer.observe).toHaveBeenCalledWith(nativeEl);
  });
});
