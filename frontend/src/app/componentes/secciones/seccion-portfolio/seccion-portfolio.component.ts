// Sección Portfolio: grilla de proyectos filtrable (todos / en desarrollo / finalizado) con efecto tilt 3D.
import {
  Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations'; // Animación de entrada/salida de tarjetas al cambiar filtro

declare const lucide: any; // Lucide cargado desde CDN

// Posibles estados de un proyecto
type ProjectStatus = 'in-dev' | 'finished';
// Tipo de equipo de trabajo
type TeamType = 'individual' | 'team';

// Estructura de cada proyecto del portfolio
interface Project {
  title: string;
  description: string;
  image: string;
  status: ProjectStatus;
  statusLabel: string;   // Texto para mostrar en el badge de estado
  teamType: TeamType;
  teamLabel: string;     // Texto para mostrar en el badge de equipo
  technologies: string[];
  featured: boolean;     // Muestra el badge "Destacado" en la imagen
  siteUrl?: string;      // URL de demo (opcional)
  githubUrl?: string;    // URL del repositorio (opcional)
}

// Lista completa de proyectos; para agregar uno nuevo sólo agrego una entrada aquí
const PROJECTS: Project[] = [
  {
    title: 'Historias Cl\u00ednicas',
    description:
      'Plataforma integral para la gesti\u00f3n de historias cl\u00ednicas, turnos y pacientes, con una interfaz moderna, segura y escalable.',
    image: 'assets/img/historias-clinicas.webp',
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['Angular', 'Node.js', 'PostgreSQL'],
    featured: true,
  },
  {
    title: 'P\u00e1gina web Scout San Patricio',
    description:
      'Portal web institucional con gesti\u00f3n de usuarios por roles, panel de noticias interactivo, biblioteca digital y galer\u00eda multimedia.',
    image: 'assets/img/pagina_grupo.webp',
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: ['C#', 'ASP.NET', 'SQL Server'],
    featured: true,
  },
  {
    title: 'IFTS N\u00b026 \u2013 Sitio Web Oficial',
    description:
      'Sitio web oficial del instituto, dise\u00f1ado para optimizar la comunicaci\u00f3n institucional y el acceso a recursos acad\u00e9micos.',
    image: 'assets/img/ifts26.webp',
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: ['Angular'],
    featured: true,
    siteUrl: 'https://ifts26.netlify.app',
    githubUrl: 'https://github.com/marcostoledo96/ifts26',
  },
  {
    title: 'Tienda SanpaHolmes',
    description:
      'E-commerce tem\u00e1tico desarrollado para un evento de caridad, con gesti\u00f3n de pedidos en tiempo real y dise\u00f1o responsivo.',
    image: 'assets/img/sanpaholmes.webp',
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    featured: true,
    siteUrl: 'https://demo-sanpaholmes.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/tienda-sanpaholmes',
  },
  {
    title: 'Tienda CandyLand',
    description:
      'Plataforma de e-commerce con cat\u00e1logo din\u00e1mico, fichas de producto detalladas y un flujo de compra optimizado.',
    image: 'assets/img/candyland.webp',
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    featured: false,
    siteUrl: 'https://candy-land-mvp.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/candy-land',
  },
  {
    title: 'Explorador de Juegos',
    description:
      'Aplicaci\u00f3n web para descubrir videojuegos, integrando b\u00fasqueda avanzada, filtros por categor\u00eda y vistas de detalle.',
    image: 'assets/img/juegos.webp',
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    featured: false,
    siteUrl: 'https://explorador-gamerstore.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/explorador-juegos',
  },
  {
    title: 'Cultura General Scout',
    description:
      'Aplicaci\u00f3n m\u00f3vil interactiva de preguntas y respuestas, dise\u00f1ada para fomentar el aprendizaje mediante gamificaci\u00f3n.',
    image: 'assets/img/cultura_general.webp',
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React Native', 'Node.js', 'SQLite'],
    featured: false,
  },
  {
    title: 'GeoDespertador',
    description:
      'Aplicaci\u00f3n m\u00f3vil basada en geolocalizaci\u00f3n que alerta al usuario al aproximarse a zonas configuradas en el mapa.',
    image: 'assets/img/deoDespertador.webp',
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React Native', 'Node.js', 'AsyncStorage'],
    featured: false,
  },
  {
    title: 'Portfolio personal',
    description:
      'Aplicaci\u00f3n web de alto rendimiento desarrollada para exhibir mi trayectoria, proyectos y habilidades t\u00e9cnicas.',
    image: 'assets/img/portfolio.webp',
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['Angular'],
    featured: false,
    githubUrl: 'https://github.com/marcostoledo96/portfolio',
  },
];

// Definición de cada botón de filtro
interface FilterDef {
  key: 'all' | ProjectStatus;
  label: string;
}

// Filtros disponibles en la barra de herramientas
const FILTERS: FilterDef[] = [
  { key: 'all',      label: 'Todos' },
  { key: 'in-dev',   label: 'En desarrollo' },
  { key: 'finished', label: 'Finalizado' },
];

@Component({
  selector: 'app-seccion-portfolio',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './seccion-portfolio.component.html',
  styleUrls: ['./seccion-portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
  animations: [
    trigger('cardAnim', [
      // Tarjeta que aparece al filtrar: desliza desde abajo con fade
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(25px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      // Tarjeta que desaparece al filtrar: encoge con fade
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' })),
      ]),
    ]),
  ],
})
export class SeccionPortfolioComponent implements AfterViewInit {

  filters = FILTERS;
  activeFilter: 'all' | ProjectStatus = 'all'; // Filtro activo por defecto
  filteredProjects: Project[] = PROJECTS;       // Lista reactiva usada en el template

  constructor(private cdr: ChangeDetectorRef) {}

  // Devuelvo la cantidad de proyectos para el badge de cada botón de filtro
  getCount(key: 'all' | ProjectStatus): number {
    if (key === 'all') return PROJECTS.length;
    return PROJECTS.filter(p => p.status === key).length;
  }

  // Actualizo el filtro activo y notifico al detector de cambios (OnPush)
  setFilter(f: 'all' | ProjectStatus): void {
    this.activeFilter = f;
    this.filteredProjects = f === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === f);
    this.cdr.markForCheck();
  }

  // Efecto tilt 3D: calculo ángulos a partir de la posición del mouse relativa a la tarjeta
  onMouseMove(event: MouseEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform =
      `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
  }

  // Al salir del hover, restauro la transformación al estado neutro
  onMouseLeave(card: HTMLElement): void {
    card.style.transform =
      'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
  }

  // Inicializo íconos de Lucide una vez que el DOM está listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
