// EncabezadoMovilComponent Tests: verifica emisión de eventos del drawer
// y delegación del clic de navegación al padre.

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EncabezadoMovilComponent } from './encabezado-movil.component';

describe('EncabezadoMovilComponent', () => {
  let fixture: ComponentFixture<EncabezadoMovilComponent>;
  let component: EncabezadoMovilComponent;

  beforeEach(async () => {
    // Lucide stub para evitar ReferenceError en ngAfterViewInit
    (window as any)['lucide'] = { createIcons: jasmine.createSpy('createIcons') };

    await TestBed.configureTestingModule({
      imports: [EncabezadoMovilComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(EncabezadoMovilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as any)['lucide'];
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('estado inicial', () => {
    it('isDrawerOpen inicia en false', () => {
      expect(component.isDrawerOpen).toBeFalse();
    });

    it('activeSection por defecto es "hero"', () => {
      expect(component.activeSection).toBe('hero');
    });
  });

  describe('toggle del drawer', () => {
    it('onToggle emite el evento toggleDrawer', () => {
      const toggleSpy = jasmine.createSpy('toggleDrawer');
      component.toggleDrawer.subscribe(toggleSpy);

      component.onToggle();

      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('navegación', () => {
    it('onNavClick emite el navClick con el id correcto', () => {
      const navSpy = jasmine.createSpy('navClick');
      component.navClick.subscribe(navSpy);

      component.onNavClick('experiencia');

      expect(navSpy).toHaveBeenCalledWith('experiencia');
    });

    it('onNavClick emite toggleDrawer si el drawer está abierto', () => {
      component.isDrawerOpen = true;
      const toggleSpy = jasmine.createSpy('toggleDrawer');
      component.toggleDrawer.subscribe(toggleSpy);

      component.onNavClick('idiomas');

      expect(toggleSpy).toHaveBeenCalledTimes(1);
    });

    it('onNavClick NO emite toggleDrawer si el drawer ya está cerrado', () => {
      component.isDrawerOpen = false;
      const toggleSpy = jasmine.createSpy('toggleDrawer');
      component.toggleDrawer.subscribe(toggleSpy);

      component.onNavClick('educacion');

      expect(toggleSpy).not.toHaveBeenCalled();
    });
  });
});
