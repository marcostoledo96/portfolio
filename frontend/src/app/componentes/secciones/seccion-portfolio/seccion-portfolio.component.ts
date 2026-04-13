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
      'Plataforma web para gestión integral de consultorios médicos: historias clínicas digitales con CIE-10, agenda semanal por médico, sala de espera en tiempo real y portal público con turnos online. Implementa control de acceso por roles (Administrador, Médico, Secretario) con JWT y reportes exportables en CSV/PDF.',

    longDescription:
      'Plataforma web EMR/EHR para gestión integral de consultorios médicos, con dos grandes áreas: un portal público institucional y un panel interno autenticado.\n\nEl portal público permite a los pacientes conocer los profesionales, sus especialidades y coberturas, y solicitar turnos online mediante un wizard guiado de 8 pasos con validación en tiempo real.\n\nEl panel interno implementa control de acceso por roles (Administrador, Médico, Secretario) con JWT y Angular Guards. Permite gestionar historias clínicas digitales con clasificación CIE-10, agenda semanal por médico, sala de espera en tiempo real, y reportes exportables en CSV/PDF.\n\nLa arquitectura backend usa Node.js 20/Express con PostgreSQL 15 y SQL parametrizado (sin ORM), Zod para validación de esquemas, Helmet + rate limiting y audit log completo. El frontend usa Angular 18, TailwindCSS 4, Angular Material 18 y NgRx Signals, con soporte de modo oscuro y WCAG 2.1 AA. Proyecto en desarrollo activo.',
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
    technologies: ['Angular 18', 'TailwindCSS', 'Angular Material', 'NgRx', 'Node.js', 'Express', 'PostgreSQL', 'TypeScript'],
    featured: true,
  },
  {
    title: 'Página web Scout San Patricio',
    description:
      'Portal web institucional para una comunidad de más de 170 miembros activos, con autenticación por roles, panel de noticias, biblioteca digital de más de 400 documentos y galería multimedia. Modernización de un sitio con más de 20 años de antigüedad, actualmente en producción en Argentina Hosting.',

    longDescription:
      'Rediseño integral y modernización de una web con más de 20 años de antigüedad, transformada en una plataforma dinámica para una comunidad de más de 170 miembros activos.\n\nEste proyecto fue desarrollado en dupla junto a mi hermano. Diseñé las interfaces (UI/UX) en Figma y construí el Frontend responsivo utilizando Blazor y Bootstrap, además de brindar soporte en el Backend. Mi hermano estuvo a cargo de la arquitectura principal de la API (ASP.NET, Entity Framework, SQL Server).\n\nLa plataforma resuelve necesidades administrativas y educativas: incluye un sistema de autenticación con roles, control de asistencia y progresiones de los scouts, panel de noticias interactivo y una biblioteca digital con más de 400 documentos. Además, integré APIs públicas (huellas de animales, botánica) para enriquecer el contenido educativo estático. El MVP fue lanzado en producción el 10 de abril de 2026 y actualmente se encuentra operativo en Argentina Hosting.',
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
    statusLabel: 'En producción',
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
      'Desarrollé una plataforma personal end-to-end diseñada para automatizar y optimizar mi búsqueda activa de empleo IT. El sistema extrae periódicamente cientos de ofertas laborales desde 8 portales (LinkedIn, Computrabajo, Indeed, Bumeran, Glassdoor, GetOnBrd, Jooble y Google Jobs) de forma automatizada mediante la API de Apify, evadiendo bloqueos IP tradicionales. El ciclo completo (scraping → normalización → carga en base de datos → evaluación IA) se ejecuta cada 72 horas orquestado con node-cron.\n\nUna vez recolectadas, cada oferta es evaluada y discriminada por un modelo de lenguaje (DeepSeek AI). La IA analiza semánticamente si los requisitos técnicos, las tareas y los años de experiencia sugeridos hacen "match" real con mi perfil, generando un score de compatibilidad del 0 al 100, logrando descartar falsos positivos y roles con títulos confusos (ej., QA en industrias de salud vs. QA de software). Finalmente, las ofertas filtradas y aprobadas se centralizan en una interfaz (dashboard) robusta construida con Angular 20 y PrimeNG (Aura theme).\n\nEl backend fue desarrollado con Node.js 22 y Express estructurado en servicios limpios, con un manejo de base de datos directa en PostgreSQL usando consultas parametrizadas (sin ORM), y tests de integración con Jest y Supertest. El deploy usa Railway para el backend y la base de datos, y Vercel para el frontend. Por motivos de seguridad y control de costos, el acceso a la plataforma es estrictamente privado: implementé un sistema de autenticación con Firebase Auth que restringe el ingreso de forma exclusiva a mi usuario para evitar el consumo no autorizado de los créditos de la API de DeepSeek. Además, la plataforma incluye vistas analíticas del estado de cada postulación.',image: 'assets/img/portfolio/busca_empleo0.webp',
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
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Apify API', 'DeepSeek AI', 'Firebase Auth'],
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
      'Rediseño y modernización de la plataforma web institucional del IFTS N°26 (reemplazando su antigua versión en Google Sites). Estuve a cargo de liderar el diseño UI/UX en Figma y desarrollé íntegramente las 30+ páginas del Frontend utilizando Angular 20, TypeScript, SCSS y CoreUI 5 como framework CSS, abarcando secciones de carreras (GIR y HyS), información para alumnos (horarios, becas, constancias, mesas de examen), recursos para docentes, datos institucionales, pre-inscripción y contacto con Google Maps.\n\nMi compañero Federico se encargó del Backend, la API para los formularios de contacto y la integración del CMS headless (Decap CMS + Netlify Identity), que permite a los administradores del instituto editar contenido sin tocar código. El proyecto cuenta con aprobación institucional y se encuentra desplegado en Netlify mediante CI/CD automático desde GitHub.',
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
    technologies: ['Angular 20', 'TypeScript', 'SCSS', 'CoreUI', 'Decap CMS', 'Figma', 'Netlify'],
    featured: true,
    siteUrl: 'https://ifts26.netlify.app',
    githubUrl: 'https://github.com/FedeOsorio/IFTS26',
  },
  {
    title: 'Tienda SanpaHolmes',
    description:
      'E-commerce Full-Stack para evento a beneficio, con autenticación JWT por roles, gestión de pedidos en tiempo real y diseño mobile-first.',
    longDescription:
      'Aplicación web Full-Stack desarrollada y desplegada en producción (Vercel) para un evento temático de recaudación de fondos. Operó con éxito bajo presión, procesando más de 60 ventas reales simultáneas, tras superar rigurosas pruebas de carga y funcionales (QA) previas al evento.\n\nEl sistema cuenta con dos interfaces: una experiencia mobile-first con React, TypeScript, Tailwind CSS y shadcn/ui para los usuarios, donde exploraban el menú inmersivo y adjuntaban comprobantes de pago; y un panel de administración para gestionar los estados del pedido (Abonado, Listo, Retirado).\n\nEl backend en Node.js, Express y PostgreSQL gestionó la lógica de inventario de forma robusta, con autenticación JWT y un sistema de 3 roles (admin, vendedor, visitador) con permisos granulares. Para optimizar la operación en vivo, integré notificaciones vía WhatsApp para avisar a los clientes cuando su orden estaba lista, y sincronicé los datos con Google Sheets para el control operativo de la cocina.',
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
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Vite', 'Vercel'],
    featured: true,
    siteUrl: 'https://demo-sanpaholmes.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/sanpaholmes',
  },
  {
    title: 'Tienda CandyLand',
    description:
      'E-commerce fullstack con catálogo dinámico, checkout en 3 pasos y deploy serverless, desarrollado en equipo con Scrum.',
    longDescription:
      'E-commerce fullstack de golosinas y confitería, desarrollado en equipo de 5 personas bajo metodología Scrum (3 sprints) como proyecto para la tecnicatura.\n\nAsumí un doble rol. Como Scrum Master, gestioné el backlog en Jira con épicas y user stories, facilité planning, dailies, reviews y retrospectivas (formato 4L). Como desarrollador, mi foco fue el backend y la integración: construí la API REST con Express y Prisma ORM sobre PostgreSQL (Neon), configuré el deploy serverless en Vercel con bridge serverless-http, y ejecuté pruebas funcionales (QA) del flujo de compra completo.\n\nLa aplicación incluye catálogo con infinite scroll y code splitting (React.lazy), carrito persistente sincronizado entre localStorage (UUID) y la base de datos, y un checkout guiado en 3 pasos (dirección → pago → confirmación con enlace a WhatsApp). Este desarrollo marcó un hito técnico personal al ser mi primera experiencia gestionando PostgreSQL en la nube y desplegando serverless.',
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
    technologies: ['React 19', 'TypeScript', 'Vite', 'CSS Modules', 'Express', 'Prisma', 'PostgreSQL', 'Vercel', 'Jira'],
    featured: false,
    siteUrl: 'https://candy-land-mvp.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/candyLand-mvp',
  },
  {
    title: 'Explorador de Juegos',
    description:
      'Catálogo interactivo de videojuegos free-to-play construido con HTML, CSS y JavaScript puro, con carruseles, filtros combinables y búsqueda en tiempo real.',
    longDescription:
      'Aplicación web desarrollada en dupla con Yamila García como proyecto para la tecnicatura, enfocada en la exploración y descubrimiento de videojuegos "free-to-play".\n\nEl proyecto destaca por estar construido íntegramente con HTML, CSS y JavaScript puro (Vanilla JS), demostrando bases sólidas en el desarrollo web y manipulación del DOM sin depender de frameworks. La página principal incluye carruseles interactivos de juegos populares y recientes con navegación prev/next, mientras que el catálogo ofrece filtros combinables (género + plataforma + búsqueda en tiempo real con debounce de 300ms + ordenamiento), cache de datos en memoria y lazy loading de imágenes.\n\nPara poblar el catálogo, se consumió la API pública de FreeToGame vía proxy (AllOrigins) para resolver CORS. Además, desarrollé un microservicio en Node.js con Express para dar funcionalidad al formulario de contacto. Este desarrollo representó un hito importante en mi formación, siendo una de mis primeras experiencias exitosas consumiendo APIs externas y gestionando un despliegue en Vercel.',
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
    technologies: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Google Fonts', 'Material Icons'],
    featured: false,
    siteUrl: 'https://explorador-gamerstore.vercel.app',
    githubUrl: 'https://github.com/marcostoledo96/explorador_juegos',
  },
  // TODO: descomentar cuando el proyecto esté listo para publicar.
  /*
  {
    title: 'Cultura General Scout',
    description:
      'App móvil de trivia scout para iOS y Android: un coordinador maneja la partida en su dispositivo mientras las patrullas compiten en tiempo real. 205+ preguntas, 10 categorías, offline-first con SQLite y diseño completo en Figma.',
    longDescription:
      'Aplicación móvil nativa de trivia orientada a grupos scouts argentinos, desarrollada con React Native y Expo SDK 52 (TypeScript). Un coordinador o dirigente maneja la app en su dispositivo mientras las patrullas compiten respondiendo preguntas de cultura general — el juego es infinito: no hay límite de preguntas, el coordinador decide cuándo termina la partida.\n\nEl proyecto cuenta con 8 pantallas diseñadas íntegramente en Figma: splash animado, home con header de bosque SVG (árboles, estrellas, luciérnagas), pantalla de juego con dos modos de respuesta (oral manual y multiple choice interactivo), asignación de puntos por patrulla via bottom sheet, leaderboard en vivo, resultados con confetti y ranking final, historial de partidas expandible y panel de administración con CRUD de preguntas + import/export JSON.\n\nA nivel técnico, la arquitectura es offline-first con expo-sqlite (banco de 205+ preguntas built-in, 10 categorías: Geografía, Historia, Ciencia, Scoutismo, Cultura General, Naturaleza, Argentina, Deportes, Supervivencia, Medio Ambiente). Usa Zustand para state management, NativeWind (Tailwind para RN) para estilos, Reanimated + Moti para animaciones nativas, expo-av para efectos de sonido y expo-haptics para feedback táctil. Cada patrulla tiene nombre y 2 colores personalizables. Sistema de puntuación: +1/-1/0, multiplicador x2 y bonus x1.5 para preguntas difíciles, con undo de última respuesta y crash recovery vía SQLite.',
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
    statusLabel: 'En planeamiento',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'SQLite', 'Figma'],
    featured: false,
  },
  */
  {
    title: 'GeoDespertador',
    description:
      'App móvil que monitorea tu ubicación en segundo plano y te despierta al llegar a destino, con geofencing real, mapas nativos y 8 pantallas diseñadas en Figma.',
    longDescription:
      'Aplicación móvil de utilidad desarrollada con React Native y Expo SDK 52 (TypeScript), con el objetivo de ser publicada en las tiendas oficiales (iOS + Android). Diseñada para resolver el problema cotidiano de pasarse de parada en el transporte público, reemplaza las alarmas de tiempo por alertas geográficas basadas en radio de distancia (100–5000 m).\n\nEl proyecto destaca por su fuerte enfoque en UI/UX, con 8 pantallas planificadas íntegramente en Figma: onboarding educativo (3 slides + permisos GPS), mapa principal con búsqueda y chips de favoritos, configuración del viaje (bottom sheet con 3 snap points), monitoreo activo con barra de progreso, pantalla de alarma inmersiva con slide-to-dismiss y haptics progresivos, gestión de lugares (CRUD con swipe-to-delete + undo), historial de viajes y configuración global.\n\nA nivel técnico, implementa geofencing real en background con expo-location y expo-task-manager (funciona con pantalla apagada), animaciones fluidas con react-native-reanimated, mapas nativos (react-native-maps), audio de alarma con expo-av y storage local síncrono con MMKV (~30× más rápido que AsyncStorage). Sin servidor, sin cuenta: 100% offline y privado.',
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
  // TODO: descomentar cuando el proyecto esté listo para publicar.
  /*
  {
    title: 'Mis Gastos',
    description:
      'Aplicación web de finanzas personales adaptada al mercado argentino: seguimiento mensual de gastos, ingresos, deudas, ahorro y salario con dashboards analíticos, cotización del dólar en tiempo real y reportes exportables.',
    longDescription:
      'Sistema web de finanzas personales orientado al mercado argentino. Resuelve carencias de apps genéricas: soporte simultáneo de pesos y dólares con cotización Blue/Oficial/MEP/CCL en tiempo real (dolarapi.com), manejo de cuotas para deudas, múltiples lugares de trabajo con tarifa por hora y cálculo de aguinaldo semestral.\n\nEl frontend Angular implementa dashboard mensual navegable con indicator cards (ingreso, saldo, gasto fijo, ahorro — cada uno con delta % respecto al mes anterior), grilla semanal de gastos diarios coloreados por categoría (Víveres, Particular, Salidas), gráficos interactivos con ng-apexcharts (donut de distribución, barras de presupuesto con alerta al 90%, gasto acumulado vs ritmo ideal, evolución del ahorro), metas de ahorro con progress bars animadas, y módulos de deudas con pagos parciales y lista de deseos con dual currency ARS/USD.\n\nCaracterísticas transversales: Command Palette (Ctrl+K) con búsqueda fuzzy, Quick Expense modal (Ctrl+Shift+E) desde cualquier pantalla, historial comparativo multi-mes (4 gráficos + toggle tabla accesible), resumen anual con estadísticas consolidadas, exportación de reportes en PDF (jsPDF) y Excel (xlsx), onboarding de 4 pasos para nuevos usuarios, PWA instalable con Angular Service Worker y soporte offline.\n\nPanel de configuración con CRUD de gastos fijos y workplaces (drag & drop con Angular CDK), presupuestos default por categoría, recordatorios in-app, tema claro/oscuro persistido, export/import backup JSON.\n\nBackend Node.js + Express con PostgreSQL 16 (Prisma ORM — type-safe, migraciones automáticas). Autenticación JWT (access 15min + refresh 7d), validación con Zod, seguridad OWASP: helmet, CORS, rate limiting, bcrypt. Deploy en Railway (backend + PostgreSQL managed) + Vercel (frontend estático). Diseño completo de UI/UX realizado en Figma.',
    image: 'assets/img/portfolio/mis_gastos.webp',
    images: [
      'assets/img/portfolio/mis_gastos.webp',
    ],
    status: 'in-dev',
    statusLabel: 'En planeamiento',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['Angular', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Railway', 'Figma'],
    featured: false,
  },
  */
  // TODO: descomentar cuando el proyecto esté listo para publicar.
  /*
  {
    title: 'Web IFTS 2.0',
    description:
      'Plataforma web institucional universal para IFTS de CABA: un solo código base configurable para cualquier instituto, con 28 páginas públicas, panel admin de 19 módulos, theming dinámico y multi-tenancy.',
    longDescription:
      'Evolución del sitio estático del IFTS N°26 hacia un sistema web completo y universal para Institutos de Formación Técnica Superior de CABA. Cada instituto despliega su propia instancia con identidad visual, contenido y datos académicos propios sin modificar código — solo configuración desde el panel de administración.\n\nEl frontend Angular implementa 28 páginas públicas organizadas en features con lazy loading: home con 12 bloques dinámicos configurables (hero, features, stats con contadores animados, carreras, accesos rápidos, convenios, eventos, testimonios, CTA, contacto rápido y 2 bloques custom), detalle de carreras con plan de estudios interactivo y comparador, blog de noticias con filtros y paginación, calendario académico, horarios de cursada filtrables, mesas de exámen, FAQs con acordeón, contacto con Google Maps y búsqueda global (Ctrl+K) con full-text search en PostgreSQL (tsvector español).\n\nEl panel admin ofrece 19 módulos con CRUD completo: editor de instituto (colores con preview en vivo), gestor de páginas con drag & drop (Angular CDK), editor de bloques del home, CRUD de noticias con rich text, calendario, mesas de examen, carreras con plan de estudios inline, autoridades, contacto, enlaces externos, FAQs, textos i18n, catálogo de imágenes, upload de documentos PDF (multer, 10MB max), horarios editables, índice de búsqueda regenerable, páginas custom con contenido libre y configuración de cuenta. Incluye SaveBar sticky, toast notifications, optimistic updates, dirty state tracking y export/import JSON de toda la configuración.\n\nBackend Node.js + Express con PostgreSQL 16 (17 tablas, Knex.js para migraciones y queries). Autenticación JWT (access 15min + refresh 7d en httpOnly cookie con hash en DB). Seguridad OWASP: helmet, CORS restrictivo, rate limiting (100 req/min público, 30 login), bcrypt (rounds ≥12), express-validator, sanitize-html. Multi-tenancy por subdominio, variable de entorno o header custom. Docker Compose para desarrollo local (app + PostgreSQL).',
    image: 'assets/img/portfolio/web_ifts.webp',
    images: [
      'assets/img/portfolio/web_ifts.webp',
    ],
    status: 'in-dev',
    statusLabel: 'En planeamiento',
    teamType: 'individual',
    teamLabel: 'Individual',
    technologies: ['Angular', 'Node.js', 'Express', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'Docker', 'Figma'],
    featured: false,
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
