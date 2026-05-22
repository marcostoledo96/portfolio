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
      expect(component.filteredSkills().length).toBe(20);
    });

    it('flippedIndex inicia en null', () => {
      expect(component.flippedIndex).toBeNull();
    });

    it('filterTabs tiene 8 tabs (Todas + 7 categorías)', () => {
      expect(component.filterTabs.length).toBe(8);
      expect(component.filterTabs[0]).toBe('Todas');
    });
  });

  // ─── Contadores de filtro ─────────────────────────────────────────────────

  describe('getFilterCount', () => {
    it('"Todas" retorna 20 (total de habilidades)', () => {
      expect(component.getFilterCount('Todas')).toBe(20);
    });

    it('"Fundamentos Web" retorna 4 (HTML, CSS / SCSS, JS, TS)', () => {
      expect(component.getFilterCount('Fundamentos Web')).toBe(4);
    });

    it('"Frameworks" retorna 3 (Angular, React, Blazor WebAssembly)', () => {
      expect(component.getFilterCount('Frameworks')).toBe(3);
    });

    it('"Backend" retorna 3 (Node.js & Express, APIs REST, ASP.NET / .NET)', () => {
      expect(component.getFilterCount('Backend')).toBe(3);
    });

    it('"Bases de datos" retorna 2 (PostgreSQL, SQL Server)', () => {
      expect(component.getFilterCount('Bases de datos')).toBe(2);
    });

    it('"QA & Testing" retorna 4 (QA Testing, Postman, Jest + Supertest, Vitest + TestBed)', () => {
      expect(component.getFilterCount('QA & Testing')).toBe(4);
    });

    it('"Herramientas" retorna 3 (Git & GitHub, Figma, Jira)', () => {
      expect(component.getFilterCount('Herramientas')).toBe(3);
    });

    it('"IA aplicada" retorna 1 (OpenCode / Gentle AI)', () => {
      expect(component.getFilterCount('IA aplicada')).toBe(1);
    });

    it('la suma de todas las categorías es igual al total de skills', () => {
      const categorias: Array<'Fundamentos Web' | 'Frameworks' | 'Backend' | 'Bases de datos' | 'QA & Testing' | 'Herramientas' | 'IA aplicada'> = [
        'Fundamentos Web', 'Frameworks', 'Backend', 'Bases de datos', 'QA & Testing', 'Herramientas', 'IA aplicada',
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

    it('setFilter("Backend") filtra a 3 skills', () => {
      component.setFilter('Backend');
      expect(component.filteredSkills().length).toBe(3);
    });

    it('setFilter("Bases de datos") filtra a 2 skills', () => {
      component.setFilter('Bases de datos');
      expect(component.filteredSkills().length).toBe(2);
    });

    it('setFilter("QA & Testing") filtra a 4 skills', () => {
      component.setFilter('QA & Testing');
      expect(component.filteredSkills().length).toBe(4);
    });

    it('setFilter("Herramientas") filtra a 3 skills', () => {
      component.setFilter('Herramientas');
      expect(component.filteredSkills().length).toBe(3);
    });

    it('setFilter("IA aplicada") filtra a 1 skill', () => {
      component.setFilter('IA aplicada');
      expect(component.filteredSkills().length).toBe(1);
    });

    it('volver a "Todas" restaura los 20 skills', () => {
      component.setFilter('Backend');
      component.setFilter('Todas');
      expect(component.filteredSkills().length).toBe(20);
    });

    it('los skills de "QA & Testing" son QA Testing, Postman, Jest + Supertest y Vitest + TestBed', () => {
      component.setFilter('QA & Testing');
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('QA Testing');
      expect(nombres).toContain('Postman');
      expect(nombres).toContain('Jest + Supertest');
      expect(nombres).toContain('Vitest + TestBed');
    });

    it('QA Testing tiene iconName definido; los demás skills de QA & Testing usan imagen y no tienen iconName', () => {
      component.setFilter('QA & Testing');
      const skills = component.filteredSkills();
      const qa = skills.find(s => s.name === 'QA Testing');
      const postman = skills.find(s => s.name === 'Postman');
      const jest = skills.find(s => s.name === 'Jest + Supertest');
      const vitest = skills.find(s => s.name === 'Vitest + TestBed');
      expect(qa?.iconName).toBeDefined();
      expect(postman?.iconName).toBeUndefined();
      expect(jest?.iconName).toBeUndefined();
      expect(vitest?.iconName).toBeUndefined();
    });

    it('los skills de "Frameworks" son Angular, React y Blazor WebAssembly', () => {
      component.setFilter('Frameworks');
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('Angular');
      expect(nombres).toContain('React');
      expect(nombres).toContain('Blazor WebAssembly');
    });

    it('los skills de "Bases de datos" son PostgreSQL y SQL Server', () => {
      component.setFilter('Bases de datos');
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('PostgreSQL');
      expect(nombres).toContain('SQL Server');
    });

    it('el skill de "IA aplicada" es OpenCode / Gentle AI', () => {
      component.setFilter('IA aplicada');
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('OpenCode / Gentle AI');
    });

    it('los skills de "Herramientas" son Git & GitHub, Figma y Jira', () => {
      component.setFilter('Herramientas');
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('Git & GitHub');
      expect(nombres).toContain('Figma');
      expect(nombres).toContain('Jira');
    });

    it('no existe una skill con name === "UML"', () => {
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).not.toContain('UML');
    });

    it('existe una skill con name === "Jira"', () => {
      const nombres = component.filteredSkills().map(s => s.name);
      expect(nombres).toContain('Jira');
    });

    it('Jira tiene category === "Herramientas"', () => {
      const jira = component.filteredSkills().find(s => s.name === 'Jira');
      expect(jira?.category).toBe('Herramientas');
    });

    it('Jira tiene level === 3', () => {
      const jira = component.filteredSkills().find(s => s.name === 'Jira');
      expect(jira?.level).toBe(3);
    });

    it('Jira tiene tagLabel === "En uso"', () => {
      const jira = component.filteredSkills().find(s => s.name === 'Jira');
      expect(jira?.tagLabel).toBe('En uso');
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

  // ─── Modal explicativo de estrellas ────────────────────────────────────────

  describe('modal de estrellas', () => {
    it('showStarsInfo inicia en false', () => {
      expect(component.showStarsInfo).toBeFalse();
    });

    it('openStarsInfo() cambia showStarsInfo a true', () => {
      component.openStarsInfo();
      expect(component.showStarsInfo).toBeTrue();
    });

    it('closeStarsInfo() cambia showStarsInfo a false', () => {
      component.showStarsInfo = true;
      component.closeStarsInfo();
      expect(component.showStarsInfo).toBeFalse();
    });

    it('no hay modal en el DOM en estado inicial', () => {
      const modal = fixture.nativeElement.querySelector('.tech__stars-modal');
      expect(modal).toBeNull();
    });

    it('el modal aparece en el DOM tras abrirlo', () => {
      component.openStarsInfo();
      fixture.detectChanges();
      const modal = fixture.nativeElement.querySelector('.tech__stars-modal');
      expect(modal).not.toBeNull();
    });

    it('el modal contiene el título correcto', () => {
      component.openStarsInfo();
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('#stars-modal-title');
      expect(title.textContent.trim()).toContain('¿Cómo interpreto las estrellas?');
    });

    it('el modal contiene los 5 niveles de la escala', () => {
      component.openStarsInfo();
      fixture.detectChanges();
      const text = fixture.nativeElement.querySelector('.tech__stars-scale').textContent;
      expect(text).toContain('Muy fuerte / uso real sostenido');
      expect(text).toContain('Uso real en proyectos importantes');
      expect(text).toContain('Uso práctico intermedio');
      expect(text).toContain('Conocimiento básico o apoyo puntual');
      expect(text).toContain('Exploratorio');
    });

    it('el modal contiene la aclaración sobre uso práctico', () => {
      component.openStarsInfo();
      fixture.detectChanges();
      const desc = fixture.nativeElement.querySelector('.tech__stars-modal-desc');
      expect(desc.textContent).toContain('uso práctico en proyectos');
    });

    it('existe el botón "¿Cómo leer las estrellas?"', () => {
      const btn = fixture.nativeElement.querySelector('.tech__stars-info-btn');
      expect(btn).not.toBeNull();
    });

    it('click en el botón abre el modal', () => {
      const btn = fixture.nativeElement.querySelector('.tech__stars-info-btn');
      btn.click();
      fixture.detectChanges();
      expect(component.showStarsInfo).toBeTrue();
    });
  });
});
