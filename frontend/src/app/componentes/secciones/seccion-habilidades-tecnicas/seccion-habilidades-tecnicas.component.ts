// Sección de habilidades técnicas: grilla de tarjetas con efecto flip 3D, contexto y estrellas.
import { Component, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// 'active' = tengo experiencia práctica; 'learning' = en formación activa; 'inactive' = experiencia pasada
type SkillTag = 'active' | 'learning' | 'inactive';

// Estructura de cada habilidad técnica
interface Skill {
  name: string;
  tag: SkillTag;
  tagLabel: string; // Texto visible del badge
  context: string;  // Descripción corta que aparece al dar vuelta la tarjeta
  level: number;    // Nivel de 1 a 5 representado con estrellas
}

// Lista completa de habilidades; el orden define la posición en la grilla
const ALL_SKILLS: Skill[] = [
  { name: 'HTML',          tag: 'active',   tagLabel: 'En práctica',        context: 'Maquetado semántico y accesible para sitios y apps web.',              level: 4 },
  { name: 'CSS',           tag: 'active',   tagLabel: 'En práctica',        context: 'Diseño responsive, Flexbox, Grid y animaciones fluidas.',              level: 4 },
  { name: 'JavaScript',    tag: 'active',   tagLabel: 'En práctica',        context: 'Lógica de negocio, manejo del DOM e integración de APIs.',             level: 3 },
  { name: 'TypeScript',    tag: 'learning', tagLabel: 'En formación',       context: 'Tipado estricto para código escalable en Angular y React.',            level: 2 },
  { name: 'Angular',       tag: 'learning', tagLabel: 'En formación',       context: 'Desarrollo de SPAs modulares (Ej: sitio IFTS N°26).',                 level: 3 },
  { name: 'React',         tag: 'learning', tagLabel: 'En formación',       context: 'Proyectos grupales en la tecnicatura y portfolio personal.',           level: 2 },
  { name: 'React Native',  tag: 'learning', tagLabel: 'En formación',       context: 'Apps móviles multiplataforma (Ej: GeoDespertador).',                  level: 2 },
  { name: 'Java',          tag: 'inactive', tagLabel: 'Experiencia previa', context: 'POO aplicada en la materia de Programación del instituto.',            level: 2 },
  { name: 'Node.js',       tag: 'active',   tagLabel: 'En práctica',        context: 'Backend principal para APIs en proyectos personales.',                 level: 2 },
  { name: 'Express',       tag: 'learning', tagLabel: 'En formación',       context: 'Servidor y rutas REST con Node.js en la tecnicatura.',                level: 2 },
  { name: 'MySQL',         tag: 'active',   tagLabel: 'En práctica',        context: 'Primer motor de BD relacional que aprendí a usar.',                   level: 3 },
  { name: 'PostgreSQL',    tag: 'learning', tagLabel: 'En práctica',        context: 'Deploy de BD en la nube con Neon y Supabase.',                        level: 2 },
  { name: 'SQL Server',    tag: 'learning', tagLabel: 'En formación',       context: 'BD para el proyecto en equipo del Grupo Scout.',                      level: 2 },
  { name: 'ASP.NET',       tag: 'learning', tagLabel: 'En formación',       context: 'Framework .NET junto a C# para la web del Grupo Scout.',              level: 2 },
  { name: 'Git',           tag: 'active',   tagLabel: 'En práctica',        context: 'Control de versiones y flujos colaborativos en proyectos.',            level: 4 },
  { name: 'Figma',         tag: 'active',   tagLabel: 'En práctica',        context: 'Diseño de interfaces y prototipos para agilizar desarrollos.',        level: 4 },
  { name: 'UML',           tag: 'active',   tagLabel: 'En práctica',        context: 'Diagramas para planificar y organizar proyectos en equipo.',          level: 4 },
  { name: 'Jira',          tag: 'active',   tagLabel: 'En práctica',        context: 'Gestión ágil como Scrum Master en proyectos del instituto.',          level: 4 },
];

@Component({
  selector: 'app-seccion-habilidades-tecnicas',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective],
  templateUrl: './seccion-habilidades-tecnicas.component.html',
  styleUrls: ['./seccion-habilidades-tecnicas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionHabilidadesTecnicasComponent implements AfterViewInit, OnDestroy {

  skills = ALL_SKILLS;
  flippedIndex: number | null = null;       // Índice de la tarjeta actualmente volteada
  activeHoverIndex: number | null = null;   // Índice en estado pre-flip (hover visual en mobile)

  // Estado de la tarjeta especial Proactividad
  proactividadFlipped  = false;
  proactividadHover    = false;

  private autoFlipTimer: any = null;
  private hoverTimer: any = null;
  private proactHoverTimer: any = null;
  private isMobile = false; // Determina si uso comportamiento táctil o de mouse

  // Mapa nombre → ruta de imagen para cada habilidad
  readonly imgMap: Record<string, string> = {
    'HTML':         'assets/img/HTML.webp',
    'CSS':          'assets/img/CSS.webp',
    'JavaScript':   'assets/img/js.webp',
    'TypeScript':   'assets/img/typescript.webp',
    'Angular':      'assets/img/angular.webp',
    'React':        'assets/img/React-Logo-PNG.webp',
    'React Native': 'assets/img/react_native.webp',
    'Java':         'assets/img/java.webp',
    'Node.js':      'assets/img/nodejs.webp',
    'Express':      'assets/img/express.webp',
    'MySQL':        'assets/img/mysql.webp',
    'PostgreSQL':   'assets/img/postgresql.svg',
    'SQL Server':   'assets/img/sql_server.webp',
    'C#':           'assets/img/c_.webp',
    'ASP.NET':      'assets/img/net.webp',
    'Git':          'assets/img/git.webp',
    'Figma':        'assets/img/figma.svg',
    'Jira':         'assets/img/jira.webp',
    'UML':          'assets/img/uml.webp',
  };

  private resizeCleanup?: () => void;

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    this.checkMobile();
  }

  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    // Escucho resize fuera de la zona de Angular para no disparar change detection innecesario
    this.ngZone.runOutsideAngular(() => {
      const handler = () => this.checkMobile();
      window.addEventListener('resize', handler, { passive: true });
      this.resizeCleanup = () => window.removeEventListener('resize', handler);
    });
  }

  toggleFlip(index: number): void {
    this.clearTimers();
    // Cerrar la tarjeta de Proactividad si estaba abierta
    this.proactividadFlipped = false;
    this.proactividadHover   = false;

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
    this.isMobile = window.innerWidth < 640;
  }

  // Flip de la tarjeta especial Proactividad — misma lógica mobile/desktop que toggleFlip
  toggleProactividad(): void {
    if (this.proactHoverTimer) { clearTimeout(this.proactHoverTimer); this.proactHoverTimer = null; }
    // Cerrar cualquier tarjeta de skill que estuviera abierta
    this.flippedIndex        = null;
    this.activeHoverIndex    = null;
    this.clearTimers();
    if (!this.isMobile) {
      this.proactividadFlipped = !this.proactividadFlipped;
      return;
    }
    if (this.proactividadFlipped) {
      this.proactividadFlipped = false;
      this.proactividadHover   = false;
      return;
    }
    if (!this.proactividadHover) {
      this.proactividadHover = true;
      this.proactHoverTimer  = setTimeout(() => {
        this.proactividadFlipped = true;
        this.proactividadHover   = false;
        this.cdr.markForCheck();
      }, 1000);
      return;
    }
    this.proactividadFlipped = true;
    this.proactividadHover   = false;
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
