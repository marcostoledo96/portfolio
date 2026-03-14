// SeccionExperienciaComponent Tests: verifica el comportamiento del acordeón,
// los datos de las experiencias y la interacción DOM.

import {
  TestBed, ComponentFixture, fakeAsync, flush,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { SeccionExperienciaComponent } from './seccion-experiencia.component';

describe('SeccionExperienciaComponent', () => {
  let fixture: ComponentFixture<SeccionExperienciaComponent>;
  let component: SeccionExperienciaComponent;

  beforeEach(async () => {
    // Mock de Lucide CDN para evitar errores en el entorno de pruebas
    (window as any)['lucide'] = { createIcons: jasmine.createSpy('createIcons') };

    await TestBed.configureTestingModule({
      imports:   [SeccionExperienciaComponent],
      providers: [provideNoopAnimations()], // Deshabilito animaciones reales en tests
      schemas:   [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(SeccionExperienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    delete (window as any)['lucide'];
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // ─── Estado inicial ────────────────────────────────────────────────────────

  describe('estado inicial', () => {
    it('openIndex inicia en null (todas las entradas cerradas)', () => {
      expect(component.openIndex()).toBeNull();
    });

    it('isOpen(0) retorna false antes de cualquier interacción', () => {
      expect(component.isOpen(0)).toBeFalse();
    });

    it('isOpen(3) retorna false antes de cualquier interacción', () => {
      expect(component.isOpen(3)).toBeFalse();
    });

    it('el array experiences tiene exactamente 4 entradas', () => {
      expect(component.experiences.length).toBe(4);
    });
  });

  // ─── Contenido de los datos ────────────────────────────────────────────────

  describe('datos de experiencias', () => {
    it('la primera experiencia es AEROTEST', () => {
      expect(component.experiences[0].company).toBe('AEROTEST');
    });

    it('la segunda experiencia es Grupo Scout N°91 San Patricio (Modernización)', () => {
      expect(component.experiences[1].company).toBe('Grupo Scout N°91 "San Patricio"');
    });

    it('la tercera experiencia es Instituto de Formación Técnica Superior N°26', () => {
      expect(component.experiences[2].company).toBe('Instituto de Formación Técnica Superior N°26');
    });

    it('la cuarta experiencia es Grupo Scout N°91 San Patricio (Plataforma Evento)', () => {
      expect(component.experiences[3].company).toBe('Grupo Scout N°91 "San Patricio"');
    });

    it('AEROTEST no tiene links externos', () => {
      expect(component.experiences[0].links).toBeUndefined();
    });

    it('Grupo Scout Modernización tiene 1 link externo apuntando a la página oficial', () => {
      const modernizacion = component.experiences[1];
      expect(modernizacion.links).toBeDefined();
      expect(modernizacion.links!.length).toBe(1);
      expect(modernizacion.links![0].url).toContain('gruposcoutsanpatricio.com.ar');
    });

    it('IFTS N°26 tiene exactamente 1 link externo apuntando al sitio', () => {
      const ifts = component.experiences[2];
      expect(ifts.links).toBeDefined();
      expect(ifts.links!.length).toBe(1);
      expect(ifts.links![0].url).toContain('ifts26.netlify.app');
    });

    it('Grupo Scout Plataforma Evento tiene exactamente 2 links externos', () => {
      const plataforma = component.experiences[3];
      expect(plataforma.links).toBeDefined();
      expect(plataforma.links!.length).toBe(2);
    });

    it('todas las experiencias tienen al menos una responsabilidad', () => {
      component.experiences.forEach(exp => {
        expect(exp.responsibilities.length).toBeGreaterThan(0);
      });
    });

    it('todas las experiencias tienen al menos una tecnología', () => {
      component.experiences.forEach(exp => {
        expect(exp.technologies.length).toBeGreaterThan(0);
      });
    });

    it('todas las experiencias tienen exactamente 4 métricas', () => {
      component.experiences.forEach(exp => {
        expect(exp.metrics.length).toBe(4);
      });
    });
  });

  // ─── Lógica de acordeón ────────────────────────────────────────────────────

  describe('toggleExperience()', () => {
    it('abre la entrada 0 al llamar toggleExperience(0)', () => {
      component.toggleExperience(0);
      expect(component.openIndex()).toBe(0);
      expect(component.isOpen(0)).toBeTrue();
    });

    it('cierra la entrada 0 al llamarla dos veces consecutivas', () => {
      component.toggleExperience(0);
      component.toggleExperience(0);
      expect(component.openIndex()).toBeNull();
      expect(component.isOpen(0)).toBeFalse();
    });

    it('abrir la entrada 1 cierra automáticamente la entrada 0', () => {
      component.toggleExperience(0);
      component.toggleExperience(1);
      expect(component.isOpen(0)).toBeFalse();
      expect(component.isOpen(1)).toBeTrue();
    });

    it('solo la entrada abierta retorna true en isOpen; el resto retorna false', () => {
      component.toggleExperience(2);
      expect(component.isOpen(0)).toBeFalse();
      expect(component.isOpen(1)).toBeFalse();
      expect(component.isOpen(2)).toBeTrue();
      expect(component.isOpen(3)).toBeFalse();
    });

    it('openIndex refleja el último índice abierto', () => {
      component.toggleExperience(0);
      expect(component.openIndex()).toBe(0);
      component.toggleExperience(3);
      expect(component.openIndex()).toBe(3);
    });
  });

  // ─── Interacción DOM ───────────────────────────────────────────────────────

  describe('renderizado en el DOM', () => {
    it('renderiza 4 botones de header (uno por cada experiencia)', () => {
      const headers = fixture.nativeElement.querySelectorAll('.exp__entry-header');
      expect(headers.length).toBe(4);
    });

    it('no hay cuerpos expandidos en el estado inicial', () => {
      const bodies = fixture.nativeElement.querySelectorAll('.exp__entry-body');
      expect(bodies.length).toBe(0);
    });

    it('el click en el header del primer entry actualiza el estado', () => {
      const headers = fixture.nativeElement.querySelectorAll('.exp__entry-header');
      (headers[0] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(component.isOpen(0)).toBeTrue();
    });

    it('el cuerpo de la primera entrada es visible en el DOM tras abrirla', () => {
      component.toggleExperience(0);
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector('.exp__entry-body');
      expect(body).not.toBeNull();
    });

    it('el cuerpo desaparece del DOM al cerrar la entrada', fakeAsync(() => {
      component.toggleExperience(0);
      fixture.detectChanges();
      component.toggleExperience(0); // Cierro
      fixture.detectChanges();
      flush(); // Espero que la animación :leave de Angular Animations complete su ciclo
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector('.exp__entry-body');
      expect(body).toBeNull();
    }));

    it('el botón del header tiene aria-expanded=false cuando está cerrado', () => {
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('.exp__entry-header') as HTMLButtonElement;
      expect(btn.getAttribute('aria-expanded')).toBe('false');
    });

    it('el botón del header tiene aria-expanded=true cuando está abierto', () => {
      component.toggleExperience(0);
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('.exp__entry-header') as HTMLButtonElement;
      expect(btn.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
