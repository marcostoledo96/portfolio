// Paleta de comandos tipo VS Code: búsqueda rápida de secciones, proyectos y acciones.
// Se activa con Ctrl+K / Cmd+K y soporta navegación completa por teclado.
import {
  Component, ChangeDetectionStrategy, HostListener,
  signal, computed, ViewChild, ElementRef,
  Output, EventEmitter, AfterViewChecked, OnDestroy,
  inject, PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TemaService } from '../../servicios/tema.service';
import { NAV_ITEMS } from '../barra-lateral/barra-lateral.component';

declare const lucide: any; // Lucide cargado desde CDN

// Estructura de cada ítem de la paleta
export interface PaletaItem {
  id: string;
  label: string;
  icon: string;
  category: 'Secciones' | 'Proyectos' | 'Acciones';
  action: () => void;
}

// Orden de categorías en la lista
const CATEGORIES: Array<'Secciones' | 'Proyectos' | 'Acciones'> = [
  'Secciones', 'Proyectos', 'Acciones',
];

// Datos de los 9 proyectos del portfolio con sus íconos
const PROJECTS_DATA = [
  { title: 'Historias Clínicas',             icon: 'stethoscope'      },
  { title: 'Página web Scout San Patricio',  icon: 'flag'             },
  { title: 'IFTS N°26 – Sitio Web Oficial',  icon: 'school'           },
  { title: 'Tienda SanpaHolmes',             icon: 'shopping-bag'     },
  { title: 'Tienda CandyLand',               icon: 'candy'            },
  { title: 'Explorador de Juegos',           icon: 'gamepad-2'        },
  { title: 'Cultura General Scout',          icon: 'help-circle'      },
  { title: 'GeoDespertador',                 icon: 'map-pin'          },
  { title: 'Portfolio personal',             icon: 'layout-dashboard' },
];

@Component({
  selector: 'app-paleta-comandos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paleta-comandos.component.html',
  styleUrls: ['./paleta-comandos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaletaComandosComponent implements AfterViewChecked, OnDestroy {

  // Emite el ID de sección para que AppComponent realice la navegación
  @Output() navRequest = new EventEmitter<string>();

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('listContainer') listRef!: ElementRef<HTMLElement>;

  // Estado reactivo con signals
  isOpen        = signal(false);
  query         = signal('');
  selectedIndex = signal(0);

  // Categorías expuestas al template para el @for
  readonly categories = CATEGORIES;

  // Flags internos para tareas post-render
  private shouldFocus     = false;
  private needsIconRefresh = false;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Lista completa de ítems (se construye una sola vez)
  private readonly allItems: PaletaItem[];

  constructor(private temaService: TemaService) {
    this.allItems = this.buildItems();
  }

  // ─── Construcción de ítems ────────────────────────────────────────────────

  private buildItems(): PaletaItem[] {
    // Secciones: las 8 del NAV_ITEMS
    const sections: PaletaItem[] = NAV_ITEMS.map(n => ({
      id:       n.id,
      label:    n.label,
      icon:     n.icon,
      category: 'Secciones' as const,
      action: () => {
        this.navRequest.emit(n.id);
        this.close();
      },
    }));

    // Proyectos: los 9 del portfolio, todos navegan a #portfolio
    const projects: PaletaItem[] = PROJECTS_DATA.map((p, i) => ({
      id:       `project-${i}`,
      label:    p.title,
      icon:     p.icon,
      category: 'Proyectos' as const,
      action: () => {
        this.navRequest.emit('portfolio');
        this.close();
      },
    }));

    // Acciones globales
    const actions: PaletaItem[] = [
      {
        id:       'toggle-theme',
        label:    'Cambiar tema',
        icon:     'sun-moon',
        category: 'Acciones',
        action: () => {
          this.temaService.toggleTheme();
          this.close();
        },
      },
      {
        id:       'download-cv',
        label:    'Descargar CV',
        icon:     'download',
        category: 'Acciones',
        action: () => {
          if (this.isBrowser) window.open('assets/doc/CV_ToledoMarcos_IT.pdf', '_blank');
          this.close();
        },
      },
      {
        id:       'send-message',
        label:    'Enviar mensaje',
        icon:     'send',
        category: 'Acciones',
        action: () => {
          this.navRequest.emit('contacto');
          this.close();
        },
      },
    ];

    return [...sections, ...projects, ...actions];
  }

  // ─── Búsqueda fuzzy ────────────────────────────────────────────────────────

  // Normaliza acentos y convierte a minúsculas para comparación insensible
  private normalize(s: string): string {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }

  // Items filtrados según el query actual (computed reacciona al signal query)
  readonly filteredItems = computed((): PaletaItem[] => {
    const q = this.normalize(this.query());
    if (!q) return this.allItems;
    return this.allItems.filter(item => this.normalize(item.label).includes(q));
  });

  // Items agrupados por categoría (para el template con @for sobre categories)
  readonly filteredByCategory = computed((): Record<string, PaletaItem[]> => {
    const groups: Record<string, PaletaItem[]> = {};
    for (const cat of CATEGORIES) {
      const items = this.filteredItems().filter(i => i.category === cat);
      if (items.length) groups[cat] = items;
    }
    return groups;
  });

  // ─── Atajos de teclado ────────────────────────────────────────────────────

  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent): void {
    // Ctrl+K / Cmd+K → toggle paleta
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.isOpen() ? this.close() : this.open();
      return;
    }

    if (!this.isOpen()) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.moveSelection(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveSelection(-1);
        break;
      case 'Enter':
        event.preventDefault();
        this.executeSelected();
        break;
    }
  }

  // ─── Acciones públicas ────────────────────────────────────────────────────

  open(): void {
    this.query.set('');
    this.selectedIndex.set(0);
    this.isOpen.set(true);
    this.shouldFocus     = true;
    this.needsIconRefresh = true;
    if (this.isBrowser) document.body.style.overflow = 'hidden'; // Bloqueo scroll de fondo
  }

  close(): void {
    this.isOpen.set(false);
    if (this.isBrowser) document.body.style.overflow = '';
  }

  onQueryChange(value: string): void {
    this.query.set(value);
    this.selectedIndex.set(0);
    this.needsIconRefresh = true;
  }

  executeItem(item: PaletaItem): void {
    item.action();
  }

  // ─── Selección de ítems ───────────────────────────────────────────────────

  getGlobalIndex(item: PaletaItem): number {
    return this.filteredItems().indexOf(item);
  }

  isSelected(item: PaletaItem): boolean {
    return this.getGlobalIndex(item) === this.selectedIndex();
  }

  onItemHover(item: PaletaItem): void {
    this.selectedIndex.set(this.getGlobalIndex(item));
  }

  private moveSelection(delta: number): void {
    const total = this.filteredItems().length;
    if (!total) return;
    const next = (this.selectedIndex() + delta + total) % total;
    this.selectedIndex.set(next);
    this.scrollSelectedIntoView();
  }

  private executeSelected(): void {
    const item = this.filteredItems()[this.selectedIndex()];
    if (item) item.action();
  }

  private scrollSelectedIntoView(): void {
    if (!this.listRef) return;
    const selected = this.listRef.nativeElement.querySelector<HTMLElement>('.palette-item--selected');
    selected?.scrollIntoView({ block: 'nearest' });
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  ngAfterViewChecked(): void {
    // Foco en el input al abrir
    if (this.shouldFocus && this.searchInputRef) {
      setTimeout(() => this.searchInputRef?.nativeElement.focus(), 20);
      this.shouldFocus = false;
    }
    // Inicialización de íconos Lucide tras cada update de la lista
    if (this.needsIconRefresh && this.isOpen()) {
      if (typeof lucide !== 'undefined') lucide.createIcons();
      this.needsIconRefresh = false;
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) document.body.style.overflow = ''; // Limpieza por si se destruye con la paleta abierta
  }
}
