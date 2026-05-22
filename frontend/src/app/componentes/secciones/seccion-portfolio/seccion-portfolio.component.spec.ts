// SeccionPortfolioComponent Tests: verifica filtros, conteo, apertura/cierre del modal,
// y contenido de proyectos visibles vs ocultos.

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
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(SeccionPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('proyectos iniciales', () => {
    it('muestra 6 proyectos por defecto (filtro "Todos")', () => {
      expect(component.filteredProjects.length).toBe(6);
    });

    it('el filtro activo por defecto es "all"', () => {
      expect(component.activeFilter).toBe('all');
    });

    it('getCount("all") retorna 6', () => {
      expect(component.getCount('all')).toBe(6);
    });
  });

  describe('filtros', () => {
    it('setFilter("in-dev") incluye proyectos en desarrollo / evolución con showInDevWhileInProd', () => {
      component.setFilter('in-dev');
      expect(component.filteredProjects.length).toBe(2);
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).toContain('Consultorios Cabildo');
      expect(nombres).toContain('Plataforma Web Grupo Scout San Patricio');
    });

    it('setFilter("finished") muestra solo proyectos finalizados / publicados', () => {
      component.setFilter('finished');
      expect(component.filteredProjects.every(p => p.status === 'finished')).toBeTrue();
    });

    it('setFilter("all") restaura los 6 proyectos', () => {
      component.setFilter('in-dev');
      component.setFilter('all');
      expect(component.filteredProjects.length).toBe(6);
    });

    it('setFilter actualiza activeFilter', () => {
      component.setFilter('finished');
      expect(component.activeFilter).toBe('finished');
    });

    it('getCount("in-dev") retorna 2 (Consultorios Cabildo + Grupo Scout con showInDevWhileInProd)', () => {
      expect(component.getCount('in-dev')).toBe(2);
    });

    it('getCount("finished") retorna 5', () => {
      expect(component.getCount('finished')).toBe(5);
    });

    it('in-dev (2) + finished (5) = 7 porque Grupo Scout aparece en ambos tabs', () => {
      const inDev    = component.getCount('in-dev');
      const finished = component.getCount('finished');
      expect(inDev + finished).toBe(7);
    });
  });

  describe('proyectos destacados (featured)', () => {
    it('exactamente 3 proyectos tienen featured = true', () => {
      const featured = component.filteredProjects.filter(p => p.featured);
      expect(featured.length).toBe(3);
    });

    it('los destacados son Consultorios Cabildo, Grupo Scout y Busca Empleos AI', () => {
      const featured = component.filteredProjects.filter(p => p.featured);
      const nombres = featured.map(p => p.title);
      expect(nombres).toContain('Consultorios Cabildo');
      expect(nombres).toContain('Plataforma Web Grupo Scout San Patricio');
      expect(nombres).toContain('Busca Empleos AI');
    });
  });

  describe('proyectos visibles', () => {
    it('incluye Consultorios Cabildo', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).toContain('Consultorios Cabildo');
    });

    it('incluye SanPa Holmes', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).toContain('SanPa Holmes');
    });

    it('incluye IFTS N°26 — Web Institucional', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).toContain('IFTS N°26 — Web Institucional');
    });

    it('incluye CandyLand', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).toContain('CandyLand');
    });
  });

  describe('proyectos ocultos', () => {
    it('NO incluye Explorador de Juegos', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).not.toContain('Explorador de Juegos');
    });

    it('NO incluye GeoDespertador', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).not.toContain('GeoDespertador');
    });

    it('NO incluye Portfolio personal', () => {
      const nombres = component.filteredProjects.map(p => p.title);
      expect(nombres).not.toContain('Portfolio personal');
    });
  });

  describe('labels especiales', () => {
    it('Busca Empleos AI tiene siteLabel "Demo pública"', () => {
      const busca = component.filteredProjects.find(p => p.title === 'Busca Empleos AI');
      expect(busca?.siteLabel).toBe('Demo pública');
    });

    it('SanPa Holmes tiene statusLabel "Demo online"', () => {
      const sanpa = component.filteredProjects.find(p => p.title === 'SanPa Holmes');
      expect(sanpa?.statusLabel).toBe('Demo online');
    });

    it('Grupo Scout tiene statusLabel "En producción"', () => {
      const scout = component.filteredProjects.find(p => p.title === 'Plataforma Web Grupo Scout San Patricio');
      expect(scout?.statusLabel).toBe('En producción');
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

  describe('definición de filtros disponibles', () => {
    it('define 3 filtros (Todos, En desarrollo / evolución, Finalizados / publicados)', () => {
      expect(component.filters.length).toBe(3);
    });

    it('el primer filtro es "all"', () => {
      expect(component.filters[0].key).toBe('all');
    });
  });
});
