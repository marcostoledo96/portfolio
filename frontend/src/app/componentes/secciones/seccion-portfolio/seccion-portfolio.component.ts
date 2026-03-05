// Sección Portfolio: grilla de proyectos filtrable (todos / en desarrollo / finalizado) con efecto tilt 3D.
import {
  Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ImagenFallbackComponent } from '../../imagen-fallback/imagen-fallback.component';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations'; // Animación de entrada/salida de tarjetas al cambiar filtro
import { Project, ProjectStatus } from './project.model';

declare const lucide: any; // Lucide cargado desde CDN

// Lista completa de proyectos; para agregar uno nuevo sólo agrego una entrada aquí
const PROJECTS: Project[] = [
  {
    title: 'Historias Cl\u00ednicas',
    description:
      'Plataforma integral para la gesti\u00f3n de historias cl\u00ednicas, turnos y pacientes, con una interfaz moderna, segura y escalable.',
    longDescription:
      'Sistema integral de gesti\u00f3n de historias cl\u00ednicas dise\u00f1ado como MVP para consultorios y centros m\u00e9dicos peque\u00f1os. Permite dar de alta pacientes con datos personales y de contacto, registrar consultas m\u00e9dicas con diagn\u00f3sticos y tratamientos, administrar turnos con un calendario visual interactivo y gestionar toda la informaci\u00f3n cl\u00ednica desde una interfaz moderna y responsiva. La arquitectura del backend incluye autenticaci\u00f3n basada en JWT, un esquema relacional en PostgreSQL optimizado para consultas frecuentes y una API RESTful documentada. Se implementaron validaciones tanto en frontend como en backend para garantizar la integridad de los datos sensibles.',
    image: 'assets/img/historias-clinicas.webp',
    images: ['assets/img/historias-clinicas.webp'],
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
    longDescription:
      'Plataforma web completa para el grupo scout San Patricio, desarrollada en equipo con enfoque en comunidad y gesti\u00f3n interna. Incluye un sistema de autenticaci\u00f3n con roles diferenciados (administrador, dirigente, colaborador), un panel de noticias con posibilidad de comentarios y moderaci\u00f3n, una biblioteca digital para compartir documentos y recursos educativos, galer\u00eda de fotos organizada por eventos y ramas, y m\u00e1s de 20 p\u00e1ginas est\u00e1ticas con informaci\u00f3n institucional, historia del grupo, actividades y contacto. El frontend consume una API desarrollada en ASP.NET con Entity Framework y SQL Server, con despliegue en IIS.',
    image: 'assets/img/pagina_grupo.webp',
    images: ['assets/img/pagina_grupo.webp'],
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
    longDescription:
      'Sitio web oficial del Instituto de Formaci\u00f3n T\u00e9cnica Superior N\u00b026, desarrollado en equipo como proyecto acad\u00e9mico que obtuvo aprobaci\u00f3n institucional para su uso real. Presenta secciones informativas sobre las carreras ofrecidas, el cuerpo docente, horarios de cursada, requisitos de inscripci\u00f3n y novedades del instituto. Incluye un formulario de contacto funcional, secci\u00f3n de preguntas frecuentes, mapa de ubicaci\u00f3n integrado y dise\u00f1o completamente responsivo. Fue construido con Angular siguiendo buenas pr\u00e1cticas de accesibilidad web y optimizaci\u00f3n de rendimiento. Actualmente desplegado en Netlify con CI/CD autom\u00e1tico desde GitHub.',
    image: 'assets/img/ifts26.webp',
    images: ['assets/img/ifts26.webp'],
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
    longDescription:
      'Aplicaci\u00f3n web desarrollada como tienda digital para un evento ben\u00e9fico del grupo Scout San Patricio, con una tem\u00e1tica inmersiva de casos criminales al estilo Sherlock Holmes. Los asistentes al evento pod\u00edan explorar el men\u00fa de comidas y bebidas desde sus celulares, realizar pedidos y seguir el estado de su orden en tiempo real. La app se us\u00f3 con \u00e9xito durante todo el evento, procesando decenas de pedidos simult\u00e1neos. El backend en Node.js con Express gestiona los pedidos y el inventario en PostgreSQL, mientras que el frontend en React ofrece una experiencia visual atrapante con animaciones tem\u00e1ticas y dise\u00f1o mobile-first.',
    image: 'assets/img/sanpaholmes.webp',
    images: ['assets/img/sanpaholmes.webp'],
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
    longDescription:
      'Plataforma de e-commerce desarrollada en equipo enfocada en golosinas y productos de confiter\u00eda. Cuenta con un cat\u00e1logo din\u00e1mico con filtros por categor\u00eda y rango de precios, fichas de producto detalladas con galer\u00eda de im\u00e1genes, sistema de carrito de compras con persistencia y un flujo de compra paso a paso. El backend expone una API RESTful con Node.js y Express, mientras que React maneja el estado global del carrito con Context API. Los datos de productos y \u00f3rdenes se almacenan en PostgreSQL con un modelo relacional dise\u00f1ado para escalar el inventario.',
    image: 'assets/img/candyland.webp',
    images: ['assets/img/candyland.webp'],
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
    longDescription:
      'Aplicaci\u00f3n web colaborativa para explorar y descubrir videojuegos. Permite realizar b\u00fasquedas por nombre, filtrar por g\u00e9nero, plataforma y a\u00f1o de lanzamiento, y acceder a fichas detalladas con descripci\u00f3n, capturas de pantalla, calificaci\u00f3n y plataformas disponibles. El proyecto consumi\u00f3 la API p\u00fablica de RAWG para obtener la base de datos de juegos, mientras que el backend en Node.js agrega una capa de cach\u00e9 para reducir latencia y controlar los l\u00edmites de uso. El frontend fue construido con HTML, CSS puro y JavaScript vanilla, demostrando que se puede lograr una UX fluida sin frameworks.',
    image: 'assets/img/juegos.webp',
    images: ['assets/img/juegos.webp'],
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
    longDescription:
      'Aplicaci\u00f3n m\u00f3vil para j\u00f3venes scouts que combina trivia, cultura general y conocimiento movimentista. El sistema de gamificaci\u00f3n incluye puntuaci\u00f3n acumulativa, rachas de aciertos, insignias desbloqueables y ranking entre integrantes de la misma patrulla. Las preguntas, clasificadas por nivel de dificultad y categor\u00eda, se obtienen de un backend en Node.js con base de datos SQLite. Desarrollada con React Native para funcionar tanto en Android como en iOS, con sincronizaci\u00f3n offline que permite jugar sin conexi\u00f3n y sincronizar puntajes al recuperar internet.',
    image: 'assets/img/cultura_general.webp',
    images: ['assets/img/cultura_general.webp'],
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
    longDescription:
      'Aplicaci\u00f3n m\u00f3vil que reemplaza las alarmas tradicionales por alertas geogr\u00e1ficas. El usuario configura zonas en un mapa interactivo y elige si quiere recibir la alerta al entrar o al salir de cada zona. Ideal para dormirse en el transporte p\u00fablico sin pasarse de parada. Usa la API de geolocalalizaci\u00f3n en background de React Native para monitorear la posici\u00f3n incluso con la pantalla apagada. Los datos de zonas y preferencias del usuario se persisten localmente con AsyncStorage, sin necesidad de backend ni conexi\u00f3n a internet.',
    image: 'assets/img/deoDespertador.webp',
    images: ['assets/img/deoDespertador.webp'],
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
    longDescription:
      'Portfolio profesional desarrollado con Angular 20 y arquitectura standalone, dise\u00f1ado con foco en rendimiento, accesibilidad y experiencia visual. Implementa lazy loading con @defer para las secciones pesadas, animaciones CSS y Angular Animations coordinadas, detección de scroll con requestAnimationFrame para 60fps, tema claro/oscuro persistente v\u00eda CSS custom properties y modo de movimiento reducido. Incluye integraci\u00f3n con Cloudflare Turnstile para el formulario de contacto protegido contra bots, SEO con metadatos din\u00e1micos, paleta de comandos Ctrl+K y soporte i18n. Desplegado en Vercel con CI/CD autom\u00e1tico desde GitHub.',
    image: 'assets/img/portfolio.webp',
    images: ['assets/img/portfolio.webp'],
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
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective, ImagenFallbackComponent, ProjectModalComponent],
  templateUrl: './seccion-portfolio.component.html',
  styleUrls: ['./seccion-portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
  animations: [
    // Trigger en el CONTENEDOR del grid: detecta :enter/:leave de los cards hijos
    // Las fases son secuenciales (como AnimatePresence mode="popLayout"):
    //   1. Cards que salen se encogen y desvanecen (250ms)
    //   2. Cards que entran aparecen con stagger de 50ms desde abajo (400ms)
    trigger('listAnim', [
      transition('* => *', [
        // Fase 1: salida — todas las tarjetas que desaparecen a la vez
        query(':leave', [
          animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
        ], { optional: true }),
        // Fase 2: entrada — tarjetas nuevas con stagger escalonado
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
          stagger('50ms', [
            animate('400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class SeccionPortfolioComponent implements AfterViewInit {

  filters = FILTERS;
  activeFilter: 'all' | ProjectStatus = 'all'; // Filtro activo por defecto
  filteredProjects: Project[] = PROJECTS;       // Lista reactiva usada en el template

  selectedProject: Project | null = null; // Proyecto seleccionado para el modal de detalle

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

  // Abre el modal de detalle para el proyecto dado
  openModal(project: Project): void {
    this.selectedProject = project;
    this.cdr.markForCheck();
    // Re-renderiza los íconos Lucide dentro del modal tras un tick
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  // Cierra el modal de detalle
  closeModal(): void {
    this.selectedProject = null;
    this.cdr.markForCheck();
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }

  // Inicializo íconos de Lucide una vez que el DOM está listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
