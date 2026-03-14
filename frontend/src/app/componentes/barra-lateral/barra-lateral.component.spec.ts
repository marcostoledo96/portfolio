// BarraLateralComponent Tests: verifica los items de navegación, emisión de navClick,
// toggle de tema y acceso a NAV_ITEMS.

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BarraLateralComponent, NAV_ITEMS } from './barra-lateral.component';
import { TemaService } from '../../servicios/tema.service';

describe('BarraLateralComponent', () => {
  let fixture: ComponentFixture<BarraLateralComponent>;
  let component: BarraLateralComponent;
  let temaService: TemaService;

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    // Lucide no está en el ambiente de tests; lo stubeo para evitar ReferenceError
    (window as any)['lucide'] = { createIcons: jasmine.createSpy('createIcons') };

    await TestBed.configureTestingModule({
      imports: [BarraLateralComponent],
      providers: [TemaService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture     = TestBed.createComponent(BarraLateralComponent);
    component   = fixture.componentInstance;
    temaService = TestBed.inject(TemaService);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete (window as any)['lucide'];
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('items de navegación', () => {
    it('expone exactamente 9 items de navegación', () => {
      expect(component.navItems.length).toBe(9);
    });

    it('el primer item es "hero"', () => {
      expect(component.navItems[0].id).toBe('hero');
    });

    it('el último item es "contacto"', () => {
      expect(component.navItems[component.navItems.length - 1].id).toBe('contacto');
    });

    it('NAV_ITEMS exportado tiene 9 ítems', () => {
      expect(NAV_ITEMS.length).toBe(9);
    });

    it('cada item tiene id, label e icon', () => {
      for (const item of component.navItems) {
        expect(item.id).toBeTruthy();
        expect(item.label).toBeTruthy();
        expect(item.icon).toBeTruthy();
      }
    });
  });

  describe('navegación', () => {
    it('onNavClick emite el id de la sección correcta', () => {
      const navClickSpy = jasmine.createSpy('navClick');
      component.navClick.subscribe(navClickSpy);

      component.onNavClick('portfolio');

      expect(navClickSpy).toHaveBeenCalledWith('portfolio');
    });

    it('activeSection por defecto es "sobre-mi"', () => {
      expect(component.activeSection).toBe('sobre-mi');
    });

    it('acepta cambios en activeSection vía @Input', () => {
      component.activeSection = 'educacion';
      fixture.detectChanges();
      expect(component.activeSection).toBe('educacion');
    });
  });

  describe('progreso de scroll', () => {
    it('scrollProgress por defecto es 0', () => {
      expect(component.scrollProgress).toBe(0);
    });
  });

  describe('toggle de tema', () => {
    it('toggleTheme delega al TemaService', () => {
      const spy = spyOn(temaService, 'toggleTheme');
      component.toggleTheme();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
