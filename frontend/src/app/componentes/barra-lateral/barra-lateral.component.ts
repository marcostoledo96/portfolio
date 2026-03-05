// Barra lateral del portfolio: muestra avatar, navegación, progreso de scroll y toggle de tema.
// Se comunica con AppComponent vía @Input() (sección activa, progreso) y @Output() (clic en nav).

// Decoradores y utilidades de Angular necesarios para este componente
import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, AfterViewInit,
  ViewChild, ViewChildren, QueryList,
  ElementRef, OnChanges, SimpleChanges, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor en la plantilla
import { TemaService } from '../../servicios/tema.service'; // Gestiona el tema claro/oscuro
import { ImagenFallbackComponent } from '../imagen-fallback/imagen-fallback.component';

// Lucide se carga desde CDN; la declaro como 'any' porque no tiene tipos TS
declare const lucide: any;

// Forma de cada ítem del menú de navegación
export interface NavItem {
  id: string;    // ID de la sección a la que apunta
  label: string; // Texto visible en el botón
  icon: string;  // Nombre del ícono Lucide
}

// Lista exportada para que otros componentes (ej: header móvil) la reutilicen
export const NAV_ITEMS: NavItem[] = [
  { id: 'hero',                 label: 'Inicio',               icon: 'home'           },
  { id: 'sobre-mi',             label: 'Sobre mí',             icon: 'user'           },
  { id: 'habilidades-tecnicas', label: 'Habilidades Técnicas', icon: 'code-2'         },
  { id: 'habilidades-blandas',  label: 'Habilidades Blandas',  icon: 'heart'          },
  { id: 'idiomas',              label: 'Idiomas',              icon: 'languages'      },
  { id: 'experiencia',          label: 'Experiencia',          icon: 'briefcase'      },
  { id: 'educacion',            label: 'Educación',            icon: 'graduation-cap' },
  { id: 'portfolio',            label: 'Portfolio',            icon: 'folder-open'    },
  { id: 'contacto',             label: 'Contacto',             icon: 'mail'           },
];

// OnPush: Angular solo re-renderiza este componente cuando cambia algún @Input()
@Component({
  selector: 'app-barra-lateral',
  standalone: true,
  imports: [CommonModule, ImagenFallbackComponent],
  templateUrl: './barra-lateral.component.html',
  styleUrls: ['./barra-lateral.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraLateralComponent implements AfterViewInit, OnChanges {

  @Input() activeSection = 'sobre-mi'; // ID de la sección actualmente visible
  @Input() scrollProgress = 0;         // Valor 0-1 que indica el progreso del scroll

  // Emite el ID de la sección cuando el usuario hace clic en un botón de navegación
  @Output() navClick = new EventEmitter<string>();

  // Referencia directa al <div #progressBar> para manipularlo sin pasar por Angular
  // static: true permite usarlo desde ngOnChanges (antes del primer render)
  @ViewChild('progressBar', { static: true }) progressBarRef!: ElementRef<HTMLElement>;

  // Referencia a la lista <ul> para calcular posición relativa del pill
  @ViewChild('navList') navListRef!: ElementRef<HTMLElement>;

  // Referencias a todos los botones de navegación (recolectadas por ViewChildren)
  @ViewChildren('navBtn') navBtns!: QueryList<ElementRef<HTMLButtonElement>>;

  // Posición y alto del pill deslizante (signal para actualizar con OnPush)
  pillPos = signal<{ top: number; height: number }>({ top: 0, height: 44 });

  // Tooltip de navegación: posición y texto del ítem hovered
  tooltip = signal<{ label: string; top: number; left: number } | null>(null);
  private tooltipTimer: ReturnType<typeof setTimeout> | null = null;

  // Respeta prefers-reduced-motion: sin transición si está activo
  readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  navItems = NAV_ITEMS; // Lista de ítems disponible para el *ngFor de la plantilla

  // TemaService se inyecta como public para poder usarlo directamente en el HTML
  constructor(public temaService: TemaService) {}

  // Se ejecuta cada vez que cambia un @Input().
  // Actualizo la barra de progreso directo en el DOM para evitar re-renders.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['scrollProgress'] && this.progressBarRef) {
      this.progressBarRef.nativeElement.style.transform =
        `scaleY(${this.scrollProgress})`; // 0 = colapsada, 1 = altura completa
    }
    // Al cambiar la sección activa, reposiciono el pill y oculto el tooltip
    if (changes['activeSection'] && this.navBtns?.length) {
      this.updatePill();
      this.hideTooltip();
    }
  }

  // Se ejecuta una vez cuando la vista está lista; inicializo los íconos y el pill
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons(); // Convierte cada <i data-lucide="..."> en su SVG
    }
    // Posición inicial del pill (sin transición para que aparezca directo)
    this.updatePill();
    // Segunda medición tras 800ms para compensar animaciones de entrada del layout
    setTimeout(() => this.updatePill(), 800);
  }

  // Emite el ID de la sección al componente padre para que haga el scroll
  onNavClick(id: string): void {
    this.navClick.emit(id);
  }

  // Delega el cambio de tema al servicio centralizado
  toggleTheme(): void {
    this.temaService.toggleTheme();
  }

  // Muestra el tooltip tras 400ms si el ítem no es el activo
  onMouseEnter(item: NavItem, event: MouseEvent): void {
    if (item.id === this.activeSection) return;
    this.clearTooltipTimer();
    const btn = event.currentTarget as HTMLElement;
    this.tooltipTimer = setTimeout(() => {
      const rect = btn.getBoundingClientRect();
      this.tooltip.set({
        label: item.label,
        top:  rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    }, 400);
  }

  // Oculta el tooltip al salir del botón
  onMouseLeave(): void {
    this.hideTooltip();
  }

  private hideTooltip(): void {
    this.clearTooltipTimer();
    this.tooltip.set(null);
  }

  private clearTooltipTimer(): void {
    if (this.tooltipTimer !== null) {
      clearTimeout(this.tooltipTimer);
      this.tooltipTimer = null;
    }
  }

  // Mide la posición del botón activo relativa al <ul> y actualiza el signal del pill
  private updatePill(): void {
    if (!this.navListRef || !this.navBtns?.length) return;

    const activeIndex = this.navItems.findIndex(n => n.id === this.activeSection);
    if (activeIndex < 0) return;

    const activeBtn = this.navBtns.get(activeIndex);
    if (!activeBtn) return;

    const ulRect  = this.navListRef.nativeElement.getBoundingClientRect();
    const btnRect = activeBtn.nativeElement.getBoundingClientRect();

    // top relativo al <ul>, considerando su scroll interno (si lo hubiera)
    const top    = btnRect.top - ulRect.top + this.navListRef.nativeElement.scrollTop;
    const height = btnRect.height;

    this.pillPos.set({ top, height });
  }
}
