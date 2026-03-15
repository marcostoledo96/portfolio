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

    it('isOpen("aerotest-qa") retorna false antes de cualquier interacción', () => {
      expect(component.isOpen('aerotest-qa')).toBeFalse();
    });

    it('isOpen("scout-evento") retorna false antes de cualquier interacción', () => {
      expect(component.isOpen('scout-evento')).toBeFalse();
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

    it('AEROTEST es un grupo con 2 sub-entradas', () => {
      const aerotest = component.experiences[0];
      expect(aerotest.subEntries).toBeDefined();
      expect(aerotest.subEntries!.length).toBe(2);
    });

    it('la primera sub-entry de AEROTEST es el rol de QA Tester & Desarrollador', () => {
      expect(component.experiences[0].subEntries![0].role).toBe('QA Tester & Desarrollador Web | Soporte IT');
    });

    it('la segunda sub-entry de AEROTEST es el rol de Secretario Médico', () => {
      expect(component.experiences[0].subEntries![1].role).toBe('Secretario Médico & Técnico de Laboratorio');
    });

    it('AEROTEST grupo no tiene links externos (los links van en sub-entries si los hubiera)', () => {
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

    it('todas las sub-entries y entries normales tienen al menos una responsabilidad', () => {
      component.experiences.forEach(exp => {
        if (exp.subEntries) {
          exp.subEntries.forEach(sub => expect(sub.responsibilities!.length).toBeGreaterThan(0));
        } else {
          expect(exp.responsibilities!.length).toBeGreaterThan(0);
        }
      });
    });

    it('todas las sub-entries y entries normales tienen al menos una tecnología', () => {
      component.experiences.forEach(exp => {
        if (exp.subEntries) {
          exp.subEntries.forEach(sub => expect(sub.technologies!.length).toBeGreaterThan(0));
        } else {
          expect(exp.technologies!.length).toBeGreaterThan(0);
        }
      });
    });

    it('todas las sub-entries y entries normales tienen exactamente 4 métricas', () => {
      component.experiences.forEach(exp => {
        if (exp.subEntries) {
          exp.subEntries.forEach(sub => expect(sub.metrics!.length).toBe(4));
        } else {
          expect(exp.metrics!.length).toBe(4);
        }
      });
    });
  });

  // ─── Lógica de acordeón ────────────────────────────────────────────────────

  describe('toggleExperience()', () => {
    it('abre "scout-mod" al llamar toggleExperience("scout-mod")', () => {
      component.toggleExperience('scout-mod');
      expect(component.openIndex()).toBe('scout-mod');
      expect(component.isOpen('scout-mod')).toBeTrue();
    });

    it('cierra "scout-mod" al llamarla dos veces consecutivas', () => {
      component.toggleExperience('scout-mod');
      component.toggleExperience('scout-mod');
      expect(component.openIndex()).toBeNull();
      expect(component.isOpen('scout-mod')).toBeFalse();
    });

    it('abrir "ifts26" cierra automáticamente "scout-mod"', () => {
      component.toggleExperience('scout-mod');
      component.toggleExperience('ifts26');
      expect(component.isOpen('scout-mod')).toBeFalse();
      expect(component.isOpen('ifts26')).toBeTrue();
    });

    it('solo la entry abierta retorna true en isOpen; el resto retorna false', () => {
      component.toggleExperience('scout-evento');
      expect(component.isOpen('aerotest-qa')).toBeFalse();
      expect(component.isOpen('scout-mod')).toBeFalse();
      expect(component.isOpen('ifts26')).toBeFalse();
      expect(component.isOpen('scout-evento')).toBeTrue();
    });

    it('openIndex refleja el último ID abierto', () => {
      component.toggleExperience('scout-mod');
      expect(component.openIndex()).toBe('scout-mod');
      component.toggleExperience('scout-evento');
      expect(component.openIndex()).toBe('scout-evento');
    });

    it('puede abrir sub-entries dentro del grupo AEROTEST de forma independiente', () => {
      component.toggleExperience('aerotest-qa');
      expect(component.isOpen('aerotest-qa')).toBeTrue();
      component.toggleExperience('aerotest-sec');
      expect(component.isOpen('aerotest-qa')).toBeFalse();
      expect(component.isOpen('aerotest-sec')).toBeTrue();
    });
  });

  // ─── Interacción DOM ───────────────────────────────────────────────────────

  describe('renderizado en el DOM', () => {
    it('renderiza 5 botones de header (2 sub-entries AEROTEST + 3 entries normales)', () => {
      const headers = fixture.nativeElement.querySelectorAll('.exp__entry-header');
      expect(headers.length).toBe(5);
    });

    it('no hay cuerpos expandidos en el estado inicial', () => {
      const bodies = fixture.nativeElement.querySelectorAll('.exp__entry-body');
      expect(bodies.length).toBe(0);
    });

    it('el click en el primer header actualiza el estado de "aerotest-qa"', () => {
      const headers = fixture.nativeElement.querySelectorAll('.exp__entry-header');
      (headers[0] as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(component.isOpen('aerotest-qa')).toBeTrue();
    });

    it('el cuerpo de una entrada es visible en el DOM tras abrirla', () => {
      component.toggleExperience('aerotest-qa');
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector('.exp__entry-body');
      expect(body).not.toBeNull();
    });

    it('el cuerpo desaparece del DOM al cerrar la entrada', fakeAsync(() => {
      component.toggleExperience('scout-mod');
      fixture.detectChanges();
      component.toggleExperience('scout-mod'); // Cierro
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
      component.toggleExperience('aerotest-qa');
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('.exp__entry-header') as HTMLButtonElement;
      expect(btn.getAttribute('aria-expanded')).toBe('true');
    });
  });
});
