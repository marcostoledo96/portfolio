// Sección Portfolio: grilla de proyectos filtrable (todos / en desarrollo / finalizado) con efecto tilt 3D.
import {
  Component, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ImagenFallbackComponent } from '../../imagen-fallback/imagen-fallback.component';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { ScrollIndicatorComponent } from '../../scroll-indicator/scroll-indicator.component';
import {
  trigger, transition, style, animate, query, stagger,
} from '@angular/animations'; // Animación de entrada/salida de tarjetas al cambiar filtro
import { Project, ProjectStatus } from './project.model';

declare const lucide: any; // Lucide cargado desde CDN

// Lista completa de proyectos; para agregar uno nuevo sólo agrego una entrada aquí
const PROJECTS: Project[] = [
  {
    title: 'Consultorios Cabildo',
    description:
      'Plataforma médica full-stack en desarrollo para consultorios privados, con autenticación, dashboard interno, módulo de pacientes avanzado, RBAC y testing automatizado.',
    longDescription:
      'Consultorios Cabildo es una plataforma médica full-stack en desarrollo para consultorios privados. El objetivo es centralizar la gestión interna de pacientes, turnos, consultas, agenda, sala de espera, adjuntos y roles del equipo médico.\n\nEl sistema está construido con Angular 20, Node.js 22, Express, TypeScript y PostgreSQL. Incluye autenticación JWT con refresh token, RBAC para admin, doctores y secretarias, validaciones con Zod, migraciones SQL versionadas y una estrategia de testing automatizado por capas.\n\nActualmente se encuentra en desarrollo local. Auth y dashboard ya están terminados; pacientes está avanzado; agenda, turnos, consultas y sala de espera siguen en desarrollo; reportes, administración y portal público quedan como etapas posteriores.',
    roleDescription:
      'Desarrollo el proyecto de forma integral: frontend Angular, backend Node/Express, base de datos PostgreSQL, autenticación, validaciones, diseño de interfaz, documentación técnica y testing automatizado.',
    problem:
      'En el consultorio donde trabajo, Consultorios Cabildo, la información de pacientes, turnos, historias clínicas, agenda y tareas administrativas queda distribuida entre planillas, mensajes, sistemas aislados o procesos manuales.',
    solution:
      'Diseñé una plataforma interna con autenticación por roles, dashboard responsive, módulo de pacientes avanzado, búsqueda server-side, paginación, filtros, validaciones y una base técnica preparada para escalar hacia turnos, consultas clínicas y gestión de agenda.',
    impact:
      'El proyecto consolida mi perfil HealthTech porque combina mi experiencia real en consultorios médicos con desarrollo full-stack, QA funcional, documentación y testing automatizado. Actualmente cuenta con una base de más de 80 archivos de test entre frontend y backend.',
    image: 'assets/img/portfolio/historias-clinicas.webp',
    images: [
      'assets/img/portfolio/historias-clinicas.webp',
      'assets/img/portfolio/consultorios_0.webp',
      'assets/img/portfolio/consultorios_1.webp',
      'assets/img/portfolio/consultorios_2.webp',
      'assets/img/portfolio/consultorios_3.webp',
      'assets/img/portfolio/consultorios_4.webp',
      'assets/img/portfolio/consultorios_5.webp',
    ],
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: [
      'Angular 20',
      'TypeScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'JWT',
      'Zod',
      'Vitest',
      'Jest',
      'Supertest',
      'Figma'
    ],
    featured: true,
  },
  {
    title: 'Plataforma Web Grupo Scout San Patricio',
    description:
      'Plataforma institucional en producción para una comunidad de más de 180 miembros, con frontend/UI-UX en Blazor WebAssembly, panel administrativo y Google Drive API.',
    longDescription:
      'Plataforma institucional en producción para el Grupo Scout San Patricio, una comunidad con más de 33 años de historia. El proyecto moderniza la presencia digital del grupo y suma herramientas para comunicación, documentación y gestión interna.\n\nMi trabajo principal estuvo enfocado en el frontend y diseño UI/UX del sitio público y panel administrativo, construyendo una experiencia responsive, clara y orientada a familias, dirigentes y miembros de la institución.\n\nLa plataforma ya está publicada, pero continúa en evolución con nuevos módulos internos, mejoras visuales y funcionalidades administrativas. Uno de los principales desafíos técnicos fue integrar Google Drive API para cargar y visualizar imágenes, resolviendo bloqueos CORS en producción.',
    roleDescription:
      'Soy responsable principal del frontend y diseño UI/UX. Trabajo sobre Blazor WebAssembly para el sitio público y panel administrativo, colaboro en funciones puntuales de backend .NET y SQL Server, y participo en testing, documentación y mejora continua junto al desarrollador backend principal.',
    problem:
      'La institución necesitaba modernizar su sitio web y avanzar hacia una plataforma más dinámica para comunicar actividades, ordenar documentación, mostrar contenido institucional y sumar módulos administrativos.',
    solution:
      'Desarrollé interfaces responsive para el sitio público y panel administrativo, integré flujos visuales de módulos internos y resolví la visualización de imágenes mediante Google Drive API, manteniendo una experiencia clara para usuarios no técnicos.',
    impact:
      'La plataforma está publicada en producción, orientada a una comunidad de más de 180 miembros y con una biblioteca digital de más de 500 documentos en crecimiento. Además, sigue evolucionando con mejoras y módulos internos.',
    image: 'assets/img/portfolio/pagina_grupo.webp',
    images: [
      'assets/img/portfolio/pagina_grupo.webp',
      'assets/img/portfolio/gruposcout_1.webp',
      'assets/img/portfolio/gruposcout_2.webp',
      'assets/img/portfolio/gruposcout_3.webp',
      'assets/img/portfolio/gruposcout_4.webp',
      'assets/img/portfolio/gruposcout_5.webp',
    ],
    status: 'finished',
    statusLabel: 'En producción',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: [
      'Blazor WebAssembly',
      '.NET 8',
      'C#',
      'SQL Server',
      'Google Drive API',
      'Figma',
      'GitHub',
    ],
    featured: true,
    showInDevWhileInProd: true,
    siteUrl: 'https://www.gruposcoutsanpatricio.com.ar/grupo/',
    siteLabel: 'Ver sitio',
  },
  {
    title: 'Busca Empleos AI',
    description:
      'Herramienta personal full-stack para automatizar búsqueda laboral IT, integrando ofertas públicas, normalización de datos, evaluación con IA y dashboard Angular.',
    longDescription:
      'Busca Empleos AI es una herramienta personal full-stack que desarrollé para ordenar y mejorar mi búsqueda laboral IT. Centraliza ofertas de distintas fuentes, normaliza datos, evalúa compatibilidad con mi perfil mediante IA y permite hacer seguimiento de postulaciones desde un dashboard propio.\n\nEl sistema está construido con Angular 20, Node.js/Express 5 y PostgreSQL, sin ORM. Usa Firebase Auth, DeepSeek API e integraciones con fuentes públicas de empleo, combinando APIs, actores externos y scraping controlado cuando corresponde.\n\nLa evaluación con IA utiliza preferencias configurables, prompt dinámico desde base de datos, score de compatibilidad, explicación del resultado y defensas programáticas post-IA para reducir falsos positivos. Lo uso como herramienta personal semanal y como caso de estudio técnico.',
    roleDescription:
      'Desarrollé el proyecto de punta a punta: arquitectura, frontend Angular, backend Node/Express, PostgreSQL, autenticación Firebase, integración multi-fuente, pipeline IA, modo demo, testing, debugging y documentación.',
    problem:
      'La búsqueda laboral IT puede volverse repetitiva y desordenada cuando las ofertas están distribuidas en múltiples plataformas, tienen requisitos ambiguos o no encajan realmente con el perfil buscado.',
    solution:
      'Construí un pipeline que obtiene ofertas públicas, normaliza datos, evita duplicados, evalúa compatibilidad con IA y muestra resultados en un dashboard con estados de postulación, modo demo y seguimiento de oportunidades.',
    impact:
      'El proyecto funciona como herramienta personal de uso semanal y como caso de estudio técnico sobre IA aplicada a productividad. Incluye modo demo público y una suite amplia de pruebas sobre backend, frontend, validaciones, rate limits y defensas post-IA.',
    image: 'assets/img/portfolio/busca_empleo0.webp',
    images: [
      'assets/img/portfolio/busca_empleo0.webp',
      'assets/img/portfolio/busca_empleo1.webp',
      'assets/img/portfolio/busca_empleo2.webp',
      'assets/img/portfolio/busca_empleo3.webp',
      'assets/img/portfolio/busca_empleo4.webp',
    ],
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: [
      'Angular 20',
      'TypeScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Firebase Auth',
      'DeepSeek AI',
      'Jest',
      'Supertest',
    ],
    featured: true,
    siteUrl: 'https://busca-empleos.vercel.app/login',
    siteLabel: 'Demo pública',
    githubUrl: 'https://github.com/marcostoledo96/busca_empleos',
  },
  {
    title: 'SanPa Holmes',
    description:
      'E-commerce a beneficio usado en evento real, con flujo mobile-first, carrito, checkout, comprobantes, panel administrativo, Google Sheets y demo online.',
    longDescription:
      'SanPa Holmes fue desarrollado para gestionar ventas durante un evento scout realizado el 15/11/2025. El sistema centralizó catálogo, carrito, checkout, carga de comprobantes, administración de pedidos y exportación de ventas.\n\nEl proyecto fue pensado específicamente para celulares y redes móviles, ya que los usuarios iban a utilizarlo durante el evento. Lo probé en dispositivos reales, redes 4G/5G y escenarios de conexión limitada.\n\nLa versión real del evento fue dada de baja porque utilizaba una base de datos temporal. Actualmente mantengo una demo online que simula cómo se veía y funcionaba el sistema.',
    roleDescription:
      'Desarrollé el proyecto de forma individual, usando IA como apoyo para desarrollo y documentación. Me encargué del frontend, backend, base de datos, autenticación, panel administrativo, flujo de compra, deploy, testing manual y resolución de bugs.',
    problem:
      'La gestión de pedidos y ventas durante el evento podía depender de procesos manuales, mensajes dispersos o planillas difíciles de coordinar en tiempo real.',
    solution:
      'Construí un e-commerce mobile-first con catálogo, carrito, checkout, carga de comprobantes, estados de pedido, panel administrativo, exportación a Google Sheets y links de WhatsApp con mensaje prearmado.',
    impact:
      'El sistema fue usado en un evento real por aproximadamente 50 personas y permitió gestionar más de 60 ventas durante una tarde. También me permitió validar un flujo completo en celulares reales, redes móviles y contexto operativo real.',
    image: 'assets/img/portfolio/sanpaholmes.webp',
    images: [
      'assets/img/portfolio/sanpaholmes.webp',
      'assets/img/portfolio/sanpaholmes_0.webp',
      'assets/img/portfolio/sanpaholmes_1.webp',
      'assets/img/portfolio/sanpaholmes_2.webp',
      'assets/img/portfolio/sanpaholmes_3.webp',
      'assets/img/portfolio/sanpaholmes_4.webp',
      'assets/img/portfolio/sanpaholmes_5.webp',
      'assets/img/portfolio/sanpaholmes_6.webp',
    ],
    status: 'finished',
    statusLabel: 'Demo online',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: [
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'Express',
      'PostgreSQL',
      'JWT',
      'Vercel',
      'Google Sheets',
    ],
    featured: false,
    siteUrl: 'https://demo-sanpaholmes.vercel.app',
    siteLabel: 'Ver demo',
    githubUrl: 'https://github.com/marcostoledo96/sanpaholmes',
  },
  {
    title: 'IFTS N°26 — Web Institucional',
    description:
      'Web institucional para uso real, desarrollada como práctica profesionalizante con Angular 20, UI/UX en Figma, más de 30 páginas e integración con CMS.',
    longDescription:
      'Proyecto de práctica profesionalizante orientado a modernizar la web institucional del IFTS N.º 26, migrando desde Google Sites hacia una interfaz moderna desarrollada con Angular 20 y pensada para uso real por la comunidad educativa.\n\nEl sitio incluye secciones institucionales, carreras, alumnos, docentes, preinscripción y contacto. El proyecto base fue aprobado institucionalmente y quedó preparado para continuar evolutivos, dominio definitivo, ajustes finales y migración de documentación histórica.\n\nLa intención del proyecto es convertirse en la web oficial del instituto una vez completadas las etapas pendientes de desarrollo, validación y aprobación final.',
    roleDescription:
      'Me encargué del diseño UI/UX en Figma y del desarrollo frontend con Angular 20, TypeScript, SCSS y CoreUI. Trabajé de forma colaborativa integrando el frontend con la API, backend y CMS desarrollados por mi compañero.',
    problem:
      'La institución necesitaba reemplazar una web en Google Sites por una plataforma más clara, moderna y organizada para estudiantes, docentes, autoridades y aspirantes.',
    solution:
      'Desarrollé el frontend de más de 30 páginas, cuidando estructura visual, navegación, responsive, contenidos institucionales y consistencia de interfaz, con integración preparada para gestión de contenido mediante CMS.',
    impact:
      'El proyecto fue aprobado institucionalmente como base para una web más mantenible y escalable, con planificación para convertirse en sitio oficial luego de completar evolutivos, dominio definitivo y validaciones finales.',
    image: 'assets/img/portfolio/ifts26.webp',
    images: [
      'assets/img/portfolio/ifts26.webp',
      'assets/img/portfolio/ifts26_0.webp',
      'assets/img/portfolio/ifts26_1.webp',
      'assets/img/portfolio/ifts26_2.webp',
      'assets/img/portfolio/ifts26_3.webp',
    ],
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: [
      'Angular 20',
      'TypeScript',
      'SCSS',
      'CoreUI',
      'Decap CMS',
      'Figma',
      'GitHub',
    ],
    featured: false,
    siteUrl: 'https://ifts26.netlify.app',
    siteLabel: 'Ver sitio',
    githubUrl: 'https://github.com/FedeOsorio/IFTS26',
  },
  {
    title: 'CandyLand',
    description:
      'E-commerce académico de golosinas desarrollado en equipo con React, TypeScript, Express, PostgreSQL, Scrum y flujo de compra completo.',
    longDescription:
      'CandyLand es un e-commerce full-stack de golosinas y confitería desarrollado en equipo como proyecto académico de la Tecnicatura Superior en Desarrollo de Software.\n\nLa aplicación incluye catálogo, carrito, checkout guiado y persistencia de datos. Fue una experiencia importante para trabajar con metodología ágil, organizar entregables, gestionar un backlog real en Jira y validar un flujo de compra completo.',
    roleDescription:
      'Asumí formalmente el rol de Scrum Master y también tomé responsabilidades de coordinación tipo Project Manager. Organicé la planificación del equipo, armé y mantuve el backlog en Jira, estructuré casos de uso, prioricé tareas y colaboré como desarrollador en backend, integración y validación funcional.',
    problem:
      'El objetivo académico era construir un e-commerce funcional en equipo, aplicando metodología ágil, división de tareas, integración frontend/backend, persistencia de datos y despliegue.',
    solution:
      'Construimos una aplicación full-stack con React, TypeScript, Express, Prisma y PostgreSQL, con catálogo, carrito, checkout, gestión de datos y organización del trabajo mediante Jira.',
    impact:
      'Fue mi primera experiencia fuerte coordinando un proyecto académico con Scrum, gestión de backlog, casos de uso, PostgreSQL en la nube, deploy serverless y validación funcional de un flujo de compra completo.',
    image: 'assets/img/portfolio/candyland.webp',
    images: [
      'assets/img/portfolio/candyland.webp',
      'assets/img/portfolio/candyland_0.webp',
      'assets/img/portfolio/candyland_1.webp',
      'assets/img/portfolio/candyland_2.webp',
      'assets/img/portfolio/candyland_3.webp',
      'assets/img/portfolio/candyland_4.webp',
    ],
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Express',
      'Prisma',
      'PostgreSQL',
      'Jira',
    ],
    featured: false,
    siteUrl: 'https://candy-land-mvp.vercel.app',
    siteLabel: 'Ver demo',
    githubUrl: 'https://github.com/marcostoledo96/candyLand-mvp',
  },

  // TODO: Proyecto oculto temporalmente. Descomentar si se decide volver a mostrarlo.
  /*
  {
    title: 'Explorador de Juegos',
    description:
      'Catálogo interactivo de videojuegos free-to-play construido con HTML, CSS y JavaScript puro.',
    longDescription:
      'Proyecto académico desarrollado en dupla para explorar videojuegos free-to-play mediante consumo de API externa, filtros, búsqueda y carruseles interactivos.',
    image: 'assets/img/portfolio/juegos.webp',
    images: [
      'assets/img/portfolio/juegos.webp',
      'assets/img/portfolio/gamestore_0.webp',
      'assets/img/portfolio/gamestore_1.webp',
      'assets/img/portfolio/gamestore_2.webp',
      'assets/img/portfolio/gamestore_3.webp',
    ],
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js'],
    featured: false,
    siteUrl: 'https://explorador-gamerstore.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/explorador_juegos',
  },
  */

  // TODO: Proyecto oculto temporalmente. Descomentar cuando el proyecto esté listo para publicar.
  /*
  {
    title: 'GeoDespertador',
    description:
      'App móvil que monitorea ubicación y dispara alertas al llegar a destino.',
    longDescription:
      'Proyecto de app móvil planificado con React Native y Expo para alarmas por ubicación mediante geofencing.',
    image: 'assets/img/portfolio/deoDespertador.webp',
    images: [
      'assets/img/portfolio/deoDespertador.webp',
      'assets/img/portfolio/geodespertador_0.webp',
      'assets/img/portfolio/geodespertador_1.webp',
      'assets/img/portfolio/geodespertador_2.webp',
      'assets/img/portfolio/geodespertador_3.webp',
      'assets/img/portfolio/geodespertador_4.webp',
      'assets/img/portfolio/geodespertador_5.webp',
    ],
    status: 'in-dev',
    statusLabel: 'En planeamiento',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React Native', 'Expo', 'TypeScript', 'MMKV', 'Figma'],
    featured: false,
  },
  */

  // TODO: Proyecto oculto temporalmente. Descomentar si se quiere mostrar el portfolio como caso técnico.
  /*
  {
    title: 'Portfolio personal',
    description:
      'Aplicación web desarrollada para presentar trayectoria, proyectos y habilidades técnicas.',
    longDescription:
      'Portfolio personal desarrollado con Angular, diseño responsive, animaciones, accesibilidad y estructura modular.',
    image: 'assets/img/portfolio.webp',
    images: ['assets/img/portfolio.webp'],
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['Angular', 'TypeScript', 'Figma'],
    featured: false,
    githubUrl: 'https://github.com/marcostoledo96/portfolio',
  },
  */
];

// Definición de cada botón de filtro
interface FilterDef {
  key: 'all' | ProjectStatus;
  label: string;
}

// Filtros disponibles en la barra de herramientas
const FILTERS: FilterDef[] = [
  { key: 'all',      label: 'Todos' },
  { key: 'in-dev',   label: 'En desarrollo / evolución' },
  { key: 'finished', label: 'Finalizados / publicados' },
];

@Component({
  selector: 'app-seccion-portfolio',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective, ImagenFallbackComponent, ProjectModalComponent, ScrollIndicatorComponent],
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
    if (key === 'in-dev') return PROJECTS.filter(p => p.status === 'in-dev' || p.showInDevWhileInProd).length;
    return PROJECTS.filter(p => p.status === key).length;
  }

  // Actualizo el filtro activo y notifico al detector de cambios (OnPush)
  setFilter(f: 'all' | ProjectStatus): void {
    this.activeFilter = f;
    if (f === 'all') {
      this.filteredProjects = PROJECTS;
    } else if (f === 'in-dev') {
      this.filteredProjects = PROJECTS.filter(p => p.status === 'in-dev' || p.showInDevWhileInProd);
    } else {
      this.filteredProjects = PROJECTS.filter(p => p.status === f);
    }
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
