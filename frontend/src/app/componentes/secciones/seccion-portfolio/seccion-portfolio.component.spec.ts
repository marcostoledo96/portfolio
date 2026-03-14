// SeccionPortfolioComponent Tests: verifica filtros, conteo y apertura/cierre del modal.
// No testeo renderizado visual complejo (animaciones, tilt 3D) — eso es testing manual.

import {
  TestBed, ComponentFixture,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SeccionPortfolioComponent } from './seccion-portfolio.component';

describe('SeccionPortfolioComponent', () => {
  let fixture: ComponentFixture<SeccionPortfolioComponent>;
  let component: SeccionPortfolioComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionPortfolioComponent, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA], // Ignoro componentes hijo (modal, imagen-fallback, etc.)
    }).compileComponents();

    fixture   = TestBed.createComponent(SeccionPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('proyectos iniciales', () => {
    it('muestra 9 proyectos por defecto (filtro "Todos")', () => {
      expect(component.filteredProjects.length).toBe(9);
    });

    it('el filtro activo por defecto es "all"', () => {
      expect(component.activeFilter).toBe('all');
    });

    it('getCount("all") retorna 9', () => {
      expect(component.getCount('all')).toBe(9);
    });
  });

  describe('filtros', () => {
    it('setFilter("in-dev") muestra solo proyectos en desarrollo', () => {
      component.setFilter('in-dev');
      expect(component.filteredProjects.every(p => p.status === 'in-dev')).toBeTrue();
    });

    it('setFilter("finished") muestra solo proyectos finalizados', () => {
      component.setFilter('finished');
      expect(component.filteredProjects.every(p => p.status === 'finished')).toBeTrue();
    });

    it('setFilter("all") restaura los 9 proyectos', () => {
      component.setFilter('in-dev');
      component.setFilter('all');
      expect(component.filteredProjects.length).toBe(9);
    });

    it('setFilter actualiza activeFilter', () => {
      component.setFilter('finished');
      expect(component.activeFilter).toBe('finished');
    });

    it('getCount("in-dev") coincide con proyectos filtrados', () => {
      const count = component.getCount('in-dev');
      component.setFilter('in-dev');
      expect(component.filteredProjects.length).toBe(count);
    });

    it('getCount("finished") coincide con proyectos filtrados', () => {
      const count = component.getCount('finished');
      component.setFilter('finished');
      expect(component.filteredProjects.length).toBe(count);
    });

    it('getCount("all") + getCount("in-dev") + getCount("finished") consisten en total correcto', () => {
      const inDev    = component.getCount('in-dev');
      const finished = component.getCount('finished');
      expect(inDev + finished).toBe(9);
    });
  });

  describe('modal de detalle', () => {
    it('selectedProject inicia como null', () => {
      expect(component.selectedProject).toBeNull();
    });

    it('openModal asigna el proyecto seleccionado', () => {
      const proyecto = component.filteredProjects[0];
      component.openModal(proyecto);
      expect(component.selectedProject).toBe(proyecto);
    });

    it('closeModal limpia el proyecto seleccionado', () => {
      component.openModal(component.filteredProjects[0]);
      component.closeModal();
      expect(component.selectedProject).toBeNull();
    });

    it('abrir y cerrar el modal no deja estado inconsistente', () => {
      component.openModal(component.filteredProjects[0]);
      component.closeModal();
      component.openModal(component.filteredProjects[1]);
      expect(component.selectedProject).toBe(component.filteredProjects[1]);
    });
  });

  describe('proyectos destacados (featured)', () => {
    it('exactamente 4 proyectos tienen featured = true', () => {
      const featured = component.filteredProjects.filter(p => p.featured);
      expect(featured.length).toBe(4);
    });
  });

  describe('definición de filtros disponibles', () => {
    it('define 3 filtros (Todos, En desarrollo, Finalizado)', () => {
      expect(component.filters.length).toBe(3);
    });

    it('el primer filtro es "all"', () => {
      expect(component.filters[0].key).toBe('all');
    });
  });
});
