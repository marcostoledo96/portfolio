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
    title: 'Turnos e Historias Clínicas',
    description:
      'Plataforma integral para la gestión de historias clínicas, turnos y pacientes, con una interfaz moderna, segura y escalable.',
    longDescription:
      'Sistema integral de gestión para consultorios médicos, desarrollado para optimizar los flujos de trabajo en salud.\n\nLa arquitectura del backend está construida con Node.js, Express y PostgreSQL, utilizando Prisma como ORM para una gestión eficiente de la base de datos. Implementa un control de acceso estricto mediante JWT y Angular Guards, diferenciando rutas y permisos para roles de Administrador, Médico y Secretario, protegiendo así la confidencialidad de los datos.\n\nEl sistema permite gestionar agendas multi-profesional, automatizar el envío de recordatorios de turnos por email y administrar historias clínicas digitales. Como parte del ciclo de vida, diseño y ejecuto pruebas funcionales (QA) para asegurar la integridad de los datos médicos. Actualmente en fase de desarrollo.',
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
    technologies: ['Angular', 'Node.js', 'PostgreSQL', 'QA Testing'],
    featured: true,
  },
  {
    title: 'Página web Scout San Patricio',
    description:
      'Portal web institucional con gestión de usuarios por roles, panel de noticias interactivo, biblioteca digital y galería multimedia.',
    longDescription:
      'Rediseño integral y modernización de una web con más de 20 años de antigüedad, transformada en una plataforma dinámica para una comunidad de más de 170 miembros activos.\n\nEste proyecto fue desarrollado en dupla junto a mi hermano. Diseñé las interfaces (UI/UX) en Figma y construí el Frontend responsivo utilizando Blazor y Bootstrap, además de brindar soporte en el Backend. Mi hermano estuvo a cargo de la arquitectura principal de la API (ASP.NET, Entity Framework, SQL Server).\n\nLa plataforma resuelve necesidades administrativas y educativas: incluye un sistema de autenticación con roles, control de asistencia y progresiones de los scouts, panel de noticias interactivo y una biblioteca digital con más de 400 documentos. Además, integré APIs públicas (huellas de animales, botánica) para enriquecer el contenido educativo estático. El proyecto se encuentra desplegado en IIS.',
    image: 'assets/img/portfolio/pagina_grupo.webp',
    images: [
      'assets/img/portfolio/pagina_grupo.webp',
      'assets/img/portfolio/gruposcout_1.webp',
      'assets/img/portfolio/gruposcout_2.webp',
      'assets/img/portfolio/gruposcout_3.webp',
      'assets/img/portfolio/gruposcout_4.webp',
      'assets/img/portfolio/gruposcout_5.webp',
    ],
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'team',
    teamLabel: 'En equipo',
    technologies: ['C#', 'ASP.NET', 'Blazor', 'Bootstrap', 'SQL Server'],
    siteUrl: 'https://www.gruposcoutsanpatricio.com.ar/grupo/',
    featured: true,
  },
  {
    title: 'Busca Empleos AI (AI Job Scraper)',
    description:
      'Sistema automatizado full-stack de recolección y filtrado inteligente de ofertas laborales utilizando Web Scraping y modelos de Inteligencia Artificial generativa.',
    longDescription:
      'Desarrollé una plataforma personal end-to-end diseñada para automatizar y optimizar mi búsqueda activa de empleo IT. El sistema extrae periódicamente cientos de ofertas laborales desde portales como LinkedIn, Computrabajo, Indeed, Bumeran, y más opciones de forma automatizada mediante la API de Apify, evadiendo bloqueos IP tradicionales.\n\nUna vez recolectadas, cada oferta es evaluada y discriminada por un modelo de lenguaje (DeepSeek AI). La IA analiza semánticamente si los requisitos técnicos, las tareas y los años de experiencia sugeridos hacen "match" real con mi perfil, logrando descartar falsos positivos y roles con títulos confusos (ej., QA en industrias de salud vs. QA de software). Finalmente, las ofertas filtradas y aprobadas se centralizan en una interfaz (dashboard) robusta que construí en Angular.\n\nEl backend fue desarrollado con Node.js y Express estructurado en servicios limpios, con un manejo de base de datos directa en PostgreSQL usando consultas parametrizadas (sin ORM), y tests de integración con Jest. Por motivos de seguridad y control de costos, el acceso a la plataforma es estrictamente privado: implementé un sistema de autenticación con Google Auth que restringe el ingreso de forma exclusiva a mi usuario para evitar el consumo no autorizado de los créditos de la API de DeepSeek. Además, la plataforma incluye vistas analíticas del estado de cada postulación.',image: 'assets/img/portfolio/busca_empleo0.webp',
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
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Apify API', 'DeepSeek AI', 'Firebase Auth', 'Jest'],
    featured: true,
    siteUrl: 'https://busca-empleos.vercel.app/login',
    siteLabel: 'Demo (privado)',
    githubUrl: 'https://github.com/marcostoledo96/busca_empleos',
  },
  {
    title: 'IFTS N°26 – Sitio Web Oficial',
    description:
      'Sitio web oficial del instituto, diseñado para optimizar la comunicación institucional y el acceso a recursos académicos.',
    longDescription:
      'Rediseño y modernización de la plataforma institucional (reemplazando su antigua versión en Google Sites). Este proyecto fue desarrollado en un equipo de dos personas. \n\nEstuve a cargo de liderar el diseño UI/UX utilizando Figma y la maquetación Frontend en Angular, logrando una interfaz moderna, limpia, completamente responsiva y con un rendimiento optimizado. Mi compañero se enfocó en el desarrollo de la API y el Backend para la gestión dinámica y el funcionamiento de los formularios de contacto. \n\nEl proyecto cuenta con aprobación institucional y actualmente se encuentra desplegado en Netlify mediante CI/CD automático desde GitHub, listo para su lanzamiento a producción mientras se finalizan los trámites del dominio oficial y la documentación final.',
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
    technologies: ['Angular', 'Figma', 'CI/CD'],
    featured: true,
    siteUrl: 'https://ifts26.netlify.app',
    githubUrl: 'https://github.com/FedeOsorio/IFTS26',
  },
  {
    title: 'Tienda SanpaHolmes',
    description:
      'E-commerce temático desarrollado para un evento de caridad, con gestión de pedidos en tiempo real y diseño responsivo.',
    longDescription:
      'Aplicación web Full-Stack desarrollada y desplegada en producción (Vercel) para un evento temático. Operó con éxito bajo presión, procesando más de 60 ventas reales simultáneas, tras superar rigurosas pruebas de carga y funcionales (QA) previas al evento.\n\nEl sistema cuenta con dos interfaces: una experiencia mobile-first en React para los usuarios, donde exploraban el menú inmersivo y adjuntaban comprobantes de pago por transferencia; y un panel de administración para gestionar los estados del pedido (Abonado, Listo, Retirado).\n\nEl backend en Node.js, Express y PostgreSQL gestionó la lógica de inventario de forma robusta. Para optimizar la operación en vivo, integré notificaciones automáticas vía WhatsApp para avisar a los clientes cuando su orden estaba lista, y sincronicé los datos en tiempo real con Google Sheets para el control operativo de la cocina.',
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
    statusLabel: 'Finalizado',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'QA Testing'],
    featured: true,
    siteUrl: 'https://demo-sanpaholmes.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/sanpaholmes',
  },
  {
    title: 'Tienda CandyLand',
    description:
      'Plataforma de e-commerce con catálogo dinámico, fichas de producto detalladas y un flujo de compra optimizado.',
    longDescription:
      'Plataforma de e-commerce de golosinas y confitería, desarrollada en equipo como proyecto para la tecnicatura.\n\nEn este proyecto asumí un doble rol. Como Scrum Master, gestioné el flujo de trabajo utilizando Jira, redactando historias de usuario por módulos y facilitando ceremonias ágiles como las retrospectivas. Como desarrollador, me enfoqué en pulir el diseño web en React, asegurar el funcionamiento de la API RESTful (Node.js y Express), ejecutar pruebas funcionales (QA) del flujo de compra y lograr el despliegue del proyecto.\n\nLa aplicación incluye un catálogo dinámico, carrito de compras manejado con Context API y un flujo de checkout. Además, este desarrollo marcó un hito técnico personal al ser mi primera experiencia alojando y gestionando una base de datos relacional (PostgreSQL) en la nube.',
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
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Jira'],
    featured: false,
    siteUrl: 'https://candy-land-mvp.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/candyLand-mvp',
  },
  {
    title: 'Explorador de Juegos',
    description:
      'Aplicación web para descubrir videojuegos, integrando búsqueda avanzada, filtros por categoría y vistas de detalle.',
    longDescription:
      'Aplicación web colaborativa desarrollada en dupla como proyecto para la tecnicatura, enfocada en la exploración y descubrimiento de videojuegos "free-to-play".\n\nEl proyecto destaca por estar construido íntegramente con HTML, CSS y JavaScript puro (Vanilla JS), demostrando bases sólidas en el desarrollo web y manipulación del DOM sin depender de frameworks. La plataforma permite buscar títulos, filtrar por género o plataforma y acceder a fichas detalladas.\n\nPara poblar el catálogo, se integró y consumió la API pública de FreeToGame. Además, desarrollé un microservicio en Node.js para dar funcionalidad al formulario de contacto. Este desarrollo representó un hito importante en mi formación, siendo una de mis primeras experiencias exitosas consumiendo APIs externas y gestionando un despliegue en Vercel.',
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
  // TODO: descomentar cuando el proyecto esté listo para publicar.
  /*
  {
    title: 'Cultura General Scout',
    description:
      'Aplicación móvil interactiva de preguntas y respuestas, diseñada para fomentar el aprendizaje mediante gamificación.',
    longDescription:
      'Aplicación móvil gamificada de trivia y cultura scout, desarrollada con React Native y actualmente en etapa de codificación. Un proyecto personal orientado a fortalecer mis habilidades en desarrollo mobile y aportar una herramienta interactiva a mi comunidad.\n\nEl ciclo de vida del proyecto comenzó con una planificación exhaustiva y prototipado de interfaces (UI/UX) en Figma. A nivel técnico, la app destaca por su arquitectura "offline-first": utiliza una base de datos SQLite local en el dispositivo que permite jugar sin conexión en entornos de campamento. Al recuperar la conectividad, el sistema sincroniza los puntajes y descarga nuevas preguntas desde el servidor.\n\nCuenta con mecánicas de retención como rachas, insignias y un ranking entre patrullas. La distribución inicial será mediante APK para validación con usuarios reales, con proyección a ser publicada en la Google Play Store.',
    image: 'assets/img/portfolio/cultura_general.webp',
    images: [
      'assets/img/portfolio/cultura_general.webp',
      'assets/img/portfolio/culturascout_0.webp',
      'assets/img/portfolio/culturascout_1.webp',
      'assets/img/portfolio/culturascout_2.webp',
      'assets/img/portfolio/Culturascout_3.webp',
      'assets/img/portfolio/culturascout_4.webp',
    ],
    status: 'in-dev',
    statusLabel: 'En desarrollo',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React Native', 'Figma', 'SQLite'],
    featured: false,
  },
  */
  {
    title: 'GeoDespertador',
    description:
      'Aplicación móvil basada en geolocalización que alerta al usuario al aproximarse a zonas configuradas en el mapa.',
    longDescription:
      'GeoDespertador: Aplicación móvil de utilidad desarrollada en React Native, con el objetivo de ser publicada en las tiendas oficiales. Diseñada para resolver el problema cotidiano de pasarse de parada en el transporte público, reemplaza las alarmas de tiempo por alertas geográficas basadas en radio de distancia.\n\nEl proyecto destaca por su fuerte enfoque en UI/UX, planificado íntegramente en Figma. Implementé un flujo de onboarding amigable para educar al usuario antes de solicitar permisos sensibles, como el acceso al GPS en segundo plano (background geolocation).\n\nA nivel técnico, integra mapas nativos interactivos para la selección de zonas y funciona de manera 100% offline. Las preferencias, radios de alerta y ubicaciones guardadas se persisten localmente mediante AsyncStorage, garantizando un bajo consumo de datos y batería al no depender de un servidor externo.',
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
    statusLabel: 'En desarrollo',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React Native', 'Figma', 'AsyncStorage'],
    featured: false,
  },
  {
    title: 'Portfolio personal',
    description:
      'Aplicación web de alto rendimiento desarrollada para exhibir mi trayectoria, proyectos y habilidades técnicas.',
    longDescription:
      'Portfolio profesional (marcostoledo.cv) desarrollado con las últimas versiones de Angular bajo una arquitectura standalone. El proceso comenzó con un diseño detallado de UI/UX en Figma, priorizando la accesibilidad y una experiencia visual adaptable, con soporte para tema claro/oscuro persistente y preferencias de movimiento reducido.\n\nA nivel de rendimiento frontend, implementa lazy loading avanzado con @defer para los componentes más pesados y animaciones fluidas a 60fps coordinadas con requestAnimationFrame. Además, la plataforma es completamente bilingüe (español e inglés) y cuenta con optimización SEO mediante metadatos dinámicos.\n\nPara la gestión del contacto, desarrollé un backend propio en Node.js que procesa el formulario de forma segura, protegido contra bots mediante la integración de Cloudflare Turnstile. Todo el ecosistema se encuentra desplegado en Vercel con pipelines de CI/CD automatizados desde GitHub.',
    image: 'assets/img/portfolio.webp',
    images: ['assets/img/portfolio.webp'],
    status: 'finished',
    statusLabel: 'Finalizado',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['Angular', 'Node.js', 'Figma', 'CI/CD'],
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
