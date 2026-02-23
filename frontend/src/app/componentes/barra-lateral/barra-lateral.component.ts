// Barra lateral del portfolio: muestra avatar, navegación, progreso de scroll y toggle de tema.
// Se comunica con AppComponent vía @Input() (sección activa, progreso) y @Output() (clic en nav).

// Decoradores y utilidades de Angular necesarios para este componente
import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy, AfterViewInit,
  ViewChild, ElementRef, OnChanges, SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Para usar *ngFor en la plantilla
import { TemaService } from '../../servicios/tema.service'; // Gestiona el tema claro/oscuro

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
  imports: [CommonModule],
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
  }

  // Se ejecuta una vez cuando la vista está lista; inicializo los íconos Lucide
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons(); // Convierte cada <i data-lucide="..."> en su SVG
    }
  }

  // Emite el ID de la sección al componente padre para que haga el scroll
  onNavClick(id: string): void {
    this.navClick.emit(id);
  }

  // Delega el cambio de tema al servicio centralizado
  toggleTheme(): void {
    this.temaService.toggleTheme();
  }
}
