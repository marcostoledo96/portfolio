// SeccionHabilidadesTecnicasComponent Tests: verifica los datos, el filtrado
// por categoría, el comportamiento de las pills y la interacción de flip.

import {
  TestBed, ComponentFixture,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SeccionHabilidadesTecnicasComponent } from './seccion-habilidades-tecnicas.component';

describe('SeccionHabilidadesTecnicasComponent', () => {
  let fixture: ComponentFixture<SeccionHabilidadesTecnicasComponent>;
  let component: SeccionHabilidadesTecnicasComponent;

  beforeEach(async () => {
    // Mock de Lucide CDN para evitar errores en el entorno de pruebas
    (window as any)['lucide'] = { createIcons: jasmine.createSpy('createIcons') };

    await TestBed.configureTestingModule({
      imports: [SeccionHabilidadesTecnicasComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(SeccionHabilidadesTecnicasComponent);
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
    it('activeFilter inicia en "Todas"', () => {
      expect(component.activeFilter()).toBe('Todas');
    });

    it('filteredSkills retorna todas las habilidades cuando el filtro es "Todas"', () => {
      expect(component.filteredSkills().length).toBe(18);
    });

    it('flippedIndex inicia en null', () => {
      expect(component.flippedIndex).toBeNull();
    });

    it('filterTabs tiene 7 tabs (Todas + 6 categorías)', () => {
      expect(component.filterTabs.length).toBe(7);
      expect(component.filterTabs[0]).toBe('Todas');
    });
  });

  // ─── Contadores de filtro ─────────────────────────────────────────────────

  describe('getFilterCount', () => {
    it('"Todas" retorna 18 (total de habilidades)', () => {
      expect(component.getFilterCount('Todas')).toBe(18);
    });

    it('"Fundamentos Web" retorna 4 (HTML, CSS, JS, TS)', () => {
      expect(component.getFilterCount('Fundamentos Web')).toBe(4);
    });

    it('"Frameworks" retorna 3 (Angular, React, React Native)', () => {
      expect(component.getFilterCount('Frameworks')).toBe(3);
    });

    it('"Backend" retorna 2 (Node.js & Express, ASP.NET)', () => {
      expect(component.getFilterCount('Backend')).toBe(2);
    });

    it('"Bases de datos" retorna 3 (MySQL, PostgreSQL, SQL Server)', () => {
      expect(component.getFilterCount('Bases de datos')).toBe(3);
    });

    it('"QA & Testing" retorna 2 (QA Testing, Postman)', () => {
      expect(component.getFilterCount('QA & Testing')).toBe(2);
    });

    it('"Herramientas" retorna 4 (Jira, Git, Figma, UML)', () => {
      expect(component.getFilterCount('Herramientas')).toBe(4);
    });

    it('la suma de todas las categorías es igual al total de skills', () => {
      const categorias: Array<'Fundamentos Web' | 'Frameworks' | 'Backend' | 'Bases de datos' | 'QA & Testing' | 'Herramientas'> = [
        'Fundamentos Web', 'Frameworks', 'Backend', 'Bases de datos', 'QA & Testing', 'Herramientas',
      ];
      const suma = categorias.reduce((acc, cat) => acc + component.getFilterCount(cat), 0);
      expect(suma).toBe(component.getFilterCount('Todas'));
    });
  });

  // ─── Filtrado por categoría ───────────────────────────────────────────────

  describe('filtrado por categoría', () => {
    it('setFilter("Fundamentos Web") filtra a 4 skills', () => {
      component.setFilter('Fundamentos Web');
      expect(component.filteredSkills().length).toBe(4);
    });

    it('setFilter("Frameworks") filtra a 3 skills', () => {
      component.setFilter('Frameworks');
      expect(component.filteredSkills().length).toBe(3);
    });

    it('setFilter("Backend") filtra a 2 skills', () => {
      component.setFilter('Backend');
      expect(component.filteredSkills().length).toBe(2);
    });

    it('setFilter("Bases de datos") filtra a 3 skills', () => {
      component.setFilter('Bases de datos');
      expect(component.filteredSkills().length).toBe(3);
    });

    it('setFilter("QA & Testing") filtra a 2 skills', () => {
      component.setFilter('QA & Testing');
      expect(component.filteredSkills().length).toBe(2);
    });

    it('setFilter("Herramientas") filtra a 4 skills', () => {
      component.setFilter('Herramientas');
      expect(component.filteredSkills().length).toBe(4);
    });

    it('volver a "Todas" restaura los 18 skills', () => {
      component.setFilter('Backend');
      component.setFilter('Todas');
      expect(component.filteredSkills().length).toBe(18);
    });

    it('los skills de "QA & Testing" son QA Testing y Postman', () => {
      component.setFilter('QA & Testing');
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('QA Testing');
      expect(nombres).toContain('Postman');
    });

    it('QA Testing tiene iconName definido; Postman usa imagen y no tiene iconName', () => {
      component.setFilter('QA & Testing');
      const skills = component.filteredSkills();
      const qa = skills.find(s => s.name === 'QA Testing');
      const postman = skills.find(s => s.name === 'Postman');
      expect(qa?.iconName).toBeDefined();
      expect(postman?.iconName).toBeUndefined();
    });
  });

  // ─── Reset de estado al cambiar filtro ───────────────────────────────────

  describe('setFilter resetea estado de flip', () => {
    it('setFilter resetea flippedIndex a null', () => {
      component.flippedIndex = 2;
      component.setFilter('Backend');
      expect(component.flippedIndex).toBeNull();
    });

    it('setFilter resetea activeHoverIndex a null', () => {
      component.activeHoverIndex = 1;
      component.setFilter('Frameworks');
      expect(component.activeHoverIndex).toBeNull();
    });

    it('setFilter resetea proactividadFlipped a false', () => {
      component.proactividadFlipped = true;
      component.setFilter('Herramientas');
      expect(component.proactividadFlipped).toBeFalse();
    });
  });

  // ─── Índice global ────────────────────────────────────────────────────────

  describe('getGlobalIndex', () => {
    it('HTML tiene índice 0 en ALL_SKILLS', () => {
      const html = component.filteredSkills().find(s => s.name === 'HTML')!;
      expect(component.getGlobalIndex(html)).toBe(0);
    });

    it('el índice global de un skill filtrado es consistente en "Todas" y en su categoría', () => {
      // El índice global de Angular debe ser el mismo independientemente del filtro activo
      const inAll = component.filteredSkills().find(s => s.name === 'Angular')!;
      const idxAll = component.getGlobalIndex(inAll);

      component.setFilter('Frameworks');
      const inFiltered = component.filteredSkills().find(s => s.name === 'Angular')!;
      const idxFiltered = component.getGlobalIndex(inFiltered);

      expect(idxAll).toBe(idxFiltered);
    });
  });
});
