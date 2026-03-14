// PaletaComandosComponent Tests: verifica apertura/cierre, búsqueda, normalización
// de acentos, navegación por teclado y emisión de navRequest.

import {
  TestBed, ComponentFixture,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PaletaComandosComponent } from './paleta-comandos.component';
import { TemaService } from '../../servicios/tema.service';

describe('PaletaComandosComponent', () => {
  let fixture: ComponentFixture<PaletaComandosComponent>;
  let component: PaletaComandosComponent;

  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');

    (window as any)['lucide'] = { createIcons: jasmine.createSpy('createIcons') };

    await TestBed.configureTestingModule({
      imports: [PaletaComandosComponent],
      providers: [TemaService],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture   = TestBed.createComponent(PaletaComandosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    delete (window as any)['lucide'];
    document.body.style.overflow = '';
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('estado inicial', () => {
    it('isOpen inicia en false', () => {
      expect(component.isOpen()).toBeFalse();
    });

    it('query inicia vacío', () => {
      expect(component.query()).toBe('');
    });

    it('selectedIndex inicia en 0', () => {
      expect(component.selectedIndex()).toBe(0);
    });
  });

  describe('open() y close()', () => {
    it('open() pone isOpen en true', () => {
      component.open();
      expect(component.isOpen()).toBeTrue();
    });

    it('open() resetea el query', () => {
      component.onQueryChange('algo');
      component.open();
      expect(component.query()).toBe('');
    });

    it('open() resetea selectedIndex a 0', () => {
      component.open();
      expect(component.selectedIndex()).toBe(0);
    });

    it('close() pone isOpen en false', () => {
      component.open();
      component.close();
      expect(component.isOpen()).toBeFalse();
    });

    it('open() bloquea el scroll del body', () => {
      component.open();
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('close() desbloquea el scroll del body', () => {
      component.open();
      component.close();
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('búsqueda y filtrado', () => {
    it('sin query muestra todos los items (secciones + proyectos + acciones)', () => {
      // 9 secciones + 9 proyectos + 3 acciones = 21
      expect(component.filteredItems().length).toBe(21);
    });

    it('filtrar por "educacion" devuelve al menos un item', () => {
      component.onQueryChange('educacion');
      expect(component.filteredItems().length).toBeGreaterThan(0);
    });

    it('filtrar por "xxxxxxinexistente" devuelve lista vacía', () => {
      component.onQueryChange('xxxxxxinexistente');
      expect(component.filteredItems().length).toBe(0);
    });

    it('onQueryChange resetea selectedIndex a 0', () => {
      component.open();
      // Avanzo la selección
      const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      document.dispatchEvent(keyEvent);
      component.onQueryChange('port');
      expect(component.selectedIndex()).toBe(0);
    });
  });

  describe('normalización de acentos', () => {
    it('buscar "sobre" encuentra "Sobre mí" (acento normalizado)', () => {
      component.onQueryChange('sobre');
      const found = component.filteredItems().some(i =>
        i.label.toLowerCase().includes('sobre')
      );
      expect(found).toBeTrue();
    });

    it('buscar "Educacion" encuentra "Educación" (mayúsculas + sin tilde)', () => {
      component.onQueryChange('Educacion');
      const found = component.filteredItems().some(i =>
        i.label.toLowerCase().includes('educaci')
      );
      expect(found).toBeTrue();
    });
  });

  describe('atajos de teclado', () => {
    it('Ctrl+K abre la paleta', () => {
      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
      document.dispatchEvent(event);
      expect(component.isOpen()).toBeTrue();
    });

    it('Ctrl+K cierra la paleta si ya estaba abierta', () => {
      component.open();
      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
      document.dispatchEvent(event);
      expect(component.isOpen()).toBeFalse();
    });

    it('Escape cierra la paleta', () => {
      component.open();
      const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      document.dispatchEvent(event);
      expect(component.isOpen()).toBeFalse();
    });

    it('ArrowDown aumenta selectedIndex', () => {
      component.open();
      const before = component.selectedIndex();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      document.dispatchEvent(event);
      expect(component.selectedIndex()).toBe(before + 1);
    });

    it('ArrowUp no baja de 0 (wraps al final)', () => {
      component.open();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      document.dispatchEvent(event);
      // El índice debe ser el último (wrapping circular)
      expect(component.selectedIndex()).toBe(component.filteredItems().length - 1);
    });
  });

  describe('categorías', () => {
    it('define 3 categorías', () => {
      expect(component.categories.length).toBe(3);
    });

    it('incluye la categoría "Secciones"', () => {
      expect(component.categories).toContain('Secciones');
    });

    it('incluye la categoría "Proyectos"', () => {
      expect(component.categories).toContain('Proyectos');
    });

    it('incluye la categoría "Acciones"', () => {
      expect(component.categories).toContain('Acciones');
    });
  });

  describe('isSelected', () => {
    it('el primer item está seleccionado al abrir (índice 0)', () => {
      component.open();
      const firstItem = component.filteredItems()[0];
      expect(component.isSelected(firstItem)).toBeTrue();
    });
  });
});
