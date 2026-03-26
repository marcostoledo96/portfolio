// Sección de habilidades técnicas: grilla de tarjetas con efecto flip 3D, contexto y estrellas.
import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, ChangeDetectorRef, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ScrollIndicatorComponent } from '../../scroll-indicator/scroll-indicator.component';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// 'active' = tengo experiencia práctica; 'learning' = en formación activa; 'inactive' = experiencia pasada
type SkillTag = 'active' | 'learning' | 'inactive';

// Categorías para filtrar la grilla de habilidades
type SkillCategory = 'Fundamentos Web' | 'Frameworks' | 'Backend' | 'Bases de datos' | 'QA & Testing' | 'Herramientas';
type SkillCategoryFilter = 'Todas' | SkillCategory;

// Estructura de cada habilidad técnica
interface Skill {
  name: string;
  tag: SkillTag;
  tagLabel: string;       // Texto visible del badge
  context: string;        // Descripción corta que aparece al dar vuelta la tarjeta
  level: number;          // Nivel de 1 a 5 representado con estrellas
  category: SkillCategory; // Categoría para el filtro de pills
  iconName?: string;      // Nombre del ícono Lucide para skills sin imagen .webp
}

// Tabs de filtro: Todas + las 6 categorías
const FILTER_TABS: SkillCategoryFilter[] = [
  'Todas',
  'Fundamentos Web',
  'Frameworks',
  'Backend',
  'Bases de datos',
  'QA & Testing',
  'Herramientas',
];

// Lista completa de habilidades; el orden define la posición en la grilla
const ALL_SKILLS: Skill[] = [
  // --- FUNDAMENTOS WEB ---
  { name: 'HTML',       tag: 'active',   tagLabel: 'En práctica',  context: 'Maquetado semántico y accesible para sitios y apps web.',                          level: 4, category: 'Fundamentos Web' },
  { name: 'CSS',        tag: 'active',   tagLabel: 'En práctica',  context: 'Diseño responsive, Flexbox, Grid y animaciones fluidas.',                         level: 4, category: 'Fundamentos Web' },
  { name: 'JavaScript', tag: 'active',   tagLabel: 'En práctica',  context: 'Lógica de negocio, manejo del DOM e integración de APIs.',                        level: 3, category: 'Fundamentos Web' },
  { name: 'TypeScript', tag: 'learning', tagLabel: 'En formación', context: 'Comprensión de tipado estricto para proyectos escalables.',                       level: 2, category: 'Fundamentos Web' },

  // --- FRAMEWORKS ---
  { name: 'Angular',      tag: 'learning', tagLabel: 'En formación', context: 'Maquetado y estructuración de componentes en proyectos reales.',          level: 3, category: 'Frameworks' },
  { name: 'React',        tag: 'learning', tagLabel: 'En formación', context: 'Comprensión de interfaces, props y gestión de estados.',                   level: 2, category: 'Frameworks' },
  { name: 'React Native', tag: 'learning', tagLabel: 'En formación', context: 'Nociones de desarrollo de apps móviles multiplataforma.',                  level: 2, category: 'Frameworks' },

  // --- BACKEND ---
  { name: 'Node.js & Express', tag: 'active',   tagLabel: 'En práctica',  context: 'Comprensión de enrutamiento backend y conexión a bases de datos.',    level: 2, category: 'Backend' },
  { name: 'ASP.NET',           tag: 'learning', tagLabel: 'En formación', context: 'Soporte y lectura de código en arquitecturas backend colaborativas.', level: 2, category: 'Backend' },

  // --- BASES DE DATOS ---
  { name: 'MySQL',      tag: 'active',   tagLabel: 'En práctica',  context: 'Primer motor de BD relacional que aprendí a usar.',            level: 3, category: 'Bases de datos' },
  { name: 'PostgreSQL', tag: 'learning', tagLabel: 'En formación', context: 'Deploy de BD en la nube con Neon y Supabase.',                  level: 2, category: 'Bases de datos' },
  { name: 'SQL Server', tag: 'learning', tagLabel: 'En formación', context: 'BD para el proyecto en equipo del Grupo Scout.',               level: 2, category: 'Bases de datos' },

  // --- QA & TESTING ---
  // iconName usa ícono Lucide porque no hay imagen .webp disponible para estas herramientas
  { name: 'QA Testing', tag: 'active',   tagLabel: 'En práctica',  context: 'Diseño y ejecución de pruebas funcionales (E2E) y reporte técnico de bugs.', level: 4, category: 'QA & Testing', iconName: 'shield-check' },
  { name: 'Postman',    tag: 'learning', tagLabel: 'En formación', context: 'Validación básica y testeo de endpoints en APIs RESTful.',                     level: 2, category: 'QA & Testing' },

  // --- HERRAMIENTAS ---
  { name: 'Jira & Scrum', tag: 'active', tagLabel: 'En práctica', context: 'Gestión ágil de equipos y tareas ocupando el rol de Scrum Master.', level: 4, category: 'Herramientas' },
  { name: 'Git & GitHub', tag: 'active', tagLabel: 'En práctica', context: 'Control de versiones, flujos colaborativos y ramas de trabajo.',    level: 4, category: 'Herramientas' },
  { name: 'Figma',        tag: 'active', tagLabel: 'En práctica', context: 'Diseño de interfaces y prototipos para agilizar desarrollos.',       level: 4, category: 'Herramientas' },
  { name: 'UML',          tag: 'active', tagLabel: 'En práctica', context: 'Modelado y diagramación lógica para planificar arquitecturas.',      level: 4, category: 'Herramientas' },
];

@Component({
  selector: 'app-seccion-habilidades-tecnicas',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective, ScrollIndicatorComponent],
  templateUrl: './seccion-habilidades-tecnicas.component.html',
  styleUrls: ['./seccion-habilidades-tecnicas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionHabilidadesTecnicasComponent implements AfterViewInit, OnDestroy {

  // --- Filtros ---
  readonly filterTabs = FILTER_TABS;
  activeFilter = signal<SkillCategoryFilter>('Todas');

  // Computed: filtra ALL_SKILLS según el tab activo
  filteredSkills = computed(() => {
    const filter = this.activeFilter();
    return filter === 'Todas'
      ? ALL_SKILLS
      : ALL_SKILLS.filter(s => s.category === filter);
  });

  skills = ALL_SKILLS;
  flippedIndex: number | null = null;       // Índice de la tarjeta actualmente volteada
  activeHoverIndex: number | null = null;   // Índice en estado pre-flip (hover visual en mobile)

  // Estado de la tarjeta especial Proactividad
  proactividadFlipped = false;
  proactividadHover = false;

  private autoFlipTimer: any = null;
  private hoverTimer: any = null;
  private proactHoverTimer: any = null;
  private isMobile = false; // Determina si uso comportamiento táctil o de mouse

  // Mapa nombre → ruta de imagen para cada habilidad
  readonly imgMap: Record<string, string> = {
    'HTML': 'assets/img/HTML.webp',
    'CSS': 'assets/img/CSS.webp',
    'JavaScript': 'assets/img/js.webp',
    'TypeScript': 'assets/img/typescript.webp',
    'Angular': 'assets/img/angular.webp',
    'React': 'assets/img/React-Logo-PNG.webp',
    'React Native': 'assets/img/react_native.webp',
    'Java': 'assets/img/java.webp',
    'Node.js & Express': 'assets/img/nodejs.webp',
    'MySQL': 'assets/img/mysql.webp',
    'PostgreSQL': 'assets/img/postgresql.svg',
    'SQL Server': 'assets/img/sql_server.webp',
    'C#': 'assets/img/c_.webp',
    'ASP.NET': 'assets/img/net.webp',
    'Git & GitHub': 'assets/img/git.webp',
    'Figma': 'assets/img/figma.svg',
    'Jira & Scrum': 'assets/img/jira.webp',
    'UML': 'assets/img/uml.webp',
    'Postman': 'assets/img/postman.webp',
  };

  private resizeCleanup?: () => void;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    this.checkMobile();
  }

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    if (!this.isBrowser) return; // Sin resize listener durante prerendering
    // Escucho resize fuera de la zona de Angular para no disparar change detection innecesario
    this.ngZone.runOutsideAngular(() => {
      const handler = () => this.checkMobile();
      window.addEventListener('resize', handler, { passive: true });
      this.resizeCleanup = () => window.removeEventListener('resize', handler);
    });
  }

  // Cambia el filtro activo y cierra cualquier tarjeta que esté dada vuelta
  setFilter(tab: SkillCategoryFilter): void {
    this.activeFilter.set(tab);
    this.flippedIndex = null;
    this.activeHoverIndex = null;
    this.proactividadFlipped = false;
    this.proactividadHover = false;
    this.clearTimers();
    // Re-ejecuto createIcons() un tick después para que Lucide procese los íconos
    // que @if re-inserta en el DOM (ej: trending-up de la card Proactividad en "Todas")
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 0);
  }

  // Cantidad de skills en una categoría (para el badge contador de cada pill)
  getFilterCount(tab: SkillCategoryFilter): number {
    if (tab === 'Todas') return ALL_SKILLS.length;
    return ALL_SKILLS.filter(s => s.category === tab).length;
  }

  // Índice global en ALL_SKILLS — necesario para que flippedIndex funcione con la grilla filtrada
  getGlobalIndex(skill: Skill): number {
    return ALL_SKILLS.indexOf(skill);
  }

  toggleFlip(index: number): void {
    this.clearTimers();
    // Cerrar la tarjeta de Proactividad si estaba abierta
    this.proactividadFlipped = false;
    this.proactividadHover = false;

    if (!this.isMobile) {
      // Desktop: flip inmediato al hacer clic
      this.flippedIndex = this.flippedIndex === index ? null : index;
      return;
    }

    // Mobile: si toco la tarjeta ya volteada, la cierro
    if (this.flippedIndex === index) {
      this.flippedIndex = null;
      this.activeHoverIndex = null;
      return;
    }

    // Mobile: si la tarjeta no está en estado hover, muestro el hover primero
    if (this.activeHoverIndex !== index) {
      this.activeHoverIndex = index;
      this.flippedIndex = null;
      // Después de 1 segundo hago el flip automáticamente
      this.hoverTimer = setTimeout(() => {
        this.flippedIndex = index;
        this.activeHoverIndex = null;
        this.cdr.markForCheck();
      }, 1000);
      return;
    }

    // Mobile: si toco una tarjeta ya en estado hover, flip inmediato
    this.flippedIndex = index;
    this.activeHoverIndex = null;
  }

  // Genero un array de booleanos para renderizar estrellas llenas/vacías
  starsArray(count: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < count);
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.resizeCleanup?.(); // Elimino el listener de resize al destruir el componente
  }

  // Actualizo isMobile según el ancho de ventana (umbral: 640px = breakpoint sm)
  private checkMobile(): void {
    this.isMobile = this.isBrowser ? window.innerWidth < 640 : false;
  }

  // Flip de la tarjeta especial Proactividad — misma lógica mobile/desktop que toggleFlip
  toggleProactividad(): void {
    if (this.proactHoverTimer) { clearTimeout(this.proactHoverTimer); this.proactHoverTimer = null; }
    // Cerrar cualquier tarjeta de skill que estuviera abierta
    this.flippedIndex = null;
    this.activeHoverIndex = null;
    this.clearTimers();
    if (!this.isMobile) {
      this.proactividadFlipped = !this.proactividadFlipped;
      return;
    }
    if (this.proactividadFlipped) {
      this.proactividadFlipped = false;
      this.proactividadHover = false;
      return;
    }
    if (!this.proactividadHover) {
      this.proactividadHover = true;
      this.proactHoverTimer = setTimeout(() => {
        this.proactividadFlipped = true;
        this.proactividadHover = false;
        this.cdr.markForCheck();
      }, 1000);
      return;
    }
    this.proactividadFlipped = true;
    this.proactividadHover = false;
  }

  // Cancelo ambos timers para evitar efectos secundarios al cambiar de tarjeta
  private clearTimers(): void {
    if (this.autoFlipTimer) {
      clearTimeout(this.autoFlipTimer);
      this.autoFlipTimer = null;
    }
    if (this.hoverTimer) {
      clearTimeout(this.hoverTimer);
      this.hoverTimer = null;
    }
    if (this.proactHoverTimer) {
      clearTimeout(this.proactHoverTimer);
      this.proactHoverTimer = null;
    }
  }
}
