// SplashScreenComponent Tests: verifica que el timer emite el evento `finished`
// y que con reduced motion el componente sale sin delay.

import {
  TestBed, ComponentFixture, fakeAsync, tick,
} from '@angular/core/testing';
import { SplashScreenComponent } from './splash-screen.component';

describe('SplashScreenComponent', () => {
  let fixture: ComponentFixture<SplashScreenComponent>;
  let component: SplashScreenComponent;

  describe('sin reduced motion', () => {
    beforeEach(async () => {
      // Simulo que el usuario NO pidió reducción de movimiento
      spyOn(window, 'matchMedia').and.returnValue({
        matches: false,
      } as MediaQueryList);

      await TestBed.configureTestingModule({
        imports: [SplashScreenComponent],
      }).compileComponents();

      fixture   = TestBed.createComponent(SplashScreenComponent);
      component = fixture.componentInstance;
    });

    it('debería crearse correctamente', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('exiting inicia en false', () => {
      fixture.detectChanges();
      expect(component.exiting()).toBeFalse();
    });

    it('emite el evento finished después de ~1620ms (1200 + 420)', fakeAsync(() => {
      const finishedSpy = jasmine.createSpy('finished');
      fixture.detectChanges();
      component.finished.subscribe(finishedSpy);

      tick(1200); // Espero la duración mínima
      tick(420);  // Espero la animación de salida

      expect(finishedSpy).toHaveBeenCalledTimes(1);
    }));

    it('exiting pasa a true después de 1200ms', fakeAsync(() => {
      fixture.detectChanges();
      tick(1200);
      expect(component.exiting()).toBeTrue();
    }));
  });

  describe('con prefers-reduced-motion: reduce', () => {
    beforeEach(async () => {
      spyOn(window, 'matchMedia').and.returnValue({
        matches: true, // El usuario pidió reducción de movimiento
      } as MediaQueryList);

      await TestBed.configureTestingModule({
        imports: [SplashScreenComponent],
      }).compileComponents();

      fixture   = TestBed.createComponent(SplashScreenComponent);
      component = fixture.componentInstance;
    });

    it('reducedMotion es true cuando matchMedia devuelve matches=true', () => {
      fixture.detectChanges();
      expect(component.reducedMotion).toBeTrue();
    });

    it('emite finished inmediatamente (0ms) con reduced motion', fakeAsync(() => {
      const finishedSpy = jasmine.createSpy('finished');
      fixture.detectChanges();
      component.finished.subscribe(finishedSpy);

      tick(0); // Con reduced motion los timers son 0ms

      expect(finishedSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('cleanup', () => {
    beforeEach(async () => {
      spyOn(window, 'matchMedia').and.returnValue({ matches: false } as MediaQueryList);

      await TestBed.configureTestingModule({
        imports: [SplashScreenComponent],
      }).compileComponents();

      fixture   = TestBed.createComponent(SplashScreenComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('no lanza error al destruir el componente antes de que termine el timer', fakeAsync(() => {
      expect(() => {
        fixture.destroy();
        tick(2000); // Avanzo el tiempo sin el componente vivo
      }).not.toThrow();
    }));
  });
});
