// Sección de experiencia profesional: acordeón con múltiples experiencias, expandibles al hacer clic.
import {
  Component, AfterViewInit, ChangeDetectionStrategy,
  signal, computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger, transition, style, animate, state,
} from '@angular/animations';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ScrollIndicatorComponent } from '../../scroll-indicator/scroll-indicator.component';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// Dato puntual de impacto: valor numérico + etiqueta descriptiva
interface Metric {
  value: string;
  label: string;
}

// Enlace externo opcional para proyectos con presencia web
interface ExpLink {
  label: string;
  url: string;
}

// Estructura completa de una experiencia laboral
interface Experience {
  company:          string;
  role:             string;        // Rol principal, en una línea descriptiva
  subtitle:         string;        // Tipo de empresa o contexto del proyecto
  location:         string;
  period:           string;
  description:      string;        // Párrafo introductorio del trabajo realizado
  responsibilities: string[];      // Lista de logros y responsabilidades con bullet
  technologies:     string[];      // Tags de tecnologías utilizadas
  metrics:          Metric[];      // Indicadores de impacto visibles en el header
  links?:           ExpLink[];     // Links externos opcionales (sitio, repo, demo)
}

// Animación de entrada y salida del cuerpo expandible del acordeón.
// Uso Angular Animations para lograr un expand/collapse suave con height: auto real,
// que CSS max-height no puede lograr de forma precisa.
const EXPAND_COLLAPSE = trigger('expandCollapse', [
  transition(':enter', [
    style({ height: '0px', opacity: 0, overflow: 'hidden' }),
    animate('280ms ease-out', style({ height: '*', opacity: 1, overflow: 'hidden' })),
  ]),
  transition(':leave', [
    style({ overflow: 'hidden' }),
    animate('220ms ease-in', style({ height: '0px', opacity: 0 })),
  ]),
]);

// Listado completo de experiencias. Orden: AEROTEST, Grupo Scout Modernización,
// IFTS N°26, Grupo Scout Plataforma Evento.
const EXPERIENCES: Experience[] = [
  {
    company:  'AEROTEST',
    role:     'Desarrollador Web & QA Tester | Soporte Técnico',
    subtitle: 'Consultorio y Laboratorio Médico',
    location: 'Belgrano, CABA',
    period:   'Ene 2022 – Actualidad',
    description:
      'Desempeño múltiples roles técnicos en un consultorio médico, abarcando desde pruebas de calidad web hasta desarrollo de herramientas internas y capacitación del equipo.',
    responsibilities: [
      'Ejecuté pruebas funcionales y no funcionales (QA) en el sitio web aerotest.com.ar, documentando más de 30 errores, lo que optimizó drásticamente los procesos operativos.',
      'Brindo soporte técnico de Nivel 1 (Tier 1), identificando y resolviendo bugs de primera mano en la plataforma web y equipos del consultorio, reduciendo los tiempos de espera del soporte externo.',
      'Estoy en proceso de desarrollo de una aplicación web de gestión de historias clínicas con Node.js y base de datos PostgreSQL, implementando roles de usuario, autenticación segura y sistema CRUD de pacientes.',
      'Implementé un chatbot automatizado con más de 40 flujos de respuestas, reduciendo el tiempo de atención en un 80% (actualmente en proceso de integración con WhatsApp Cloud API oficial de Meta).',
      'Automaticé y optimicé la gestión de Google Workspace, implementando filtros de limpieza que liberaron más del 80% del almacenamiento en la nube.',
      'Capacité a más de 10 personas del equipo en herramientas digitales, creando instructivos técnicos para mejorar la productividad.',
    ],
    technologies: ['Google Workspace', 'HTML', 'CSS', 'JavaScript', 'Node.js', 'PostgreSQL', 'WhatsApp Cloud API'],
    metrics: [
      { value: '30+', label: 'Bugs detectados'    },
      { value: '80%', label: 'Reducción tiempos'  },
      { value: '40+', label: 'Flujos automáticos' },
      { value: '10+', label: 'Capacitados'        },
    ],
  },
  {
    company:  'Grupo Scout N°91 "San Patricio"',
    role:     'Desarrollador Frontend & UI/UX | Soporte Backend (.NET)',
    subtitle: 'Institución Scout — Modernización web',
    location: 'Buenos Aires',
    period:   'Dic 2025 – Actualidad',
    description:
      'Rediseño integral y modernización de una plataforma web con más de 20 años de antigüedad, transformada en un sistema de gestión dinámica para una comunidad de más de 170 miembros activos. Trabajo en dupla bajo el liderazgo técnico de un Desarrollador Backend Senior, aplicando metodologías de trabajo colaborativo. El lanzamiento del MVP está programado para abril de 2026.',
    responsibilities: [
      'Diseñé las interfaces (UI/UX) en Figma y construí desde cero todo el Frontend responsivo utilizando Blazor y Bootstrap, dándole identidad visual e interactividad a la plataforma.',
      'Desarrollé las vistas y la interacción del lado del cliente para módulos administrativos complejos (sistema de autenticación por roles, autogestión de perfiles, control de asistencia y legajos virtuales), consumiendo e integrando la API provista por el líder técnico.',
      'Maqueté e integré desde el Frontend un CMS a medida para la creación de noticias y una biblioteca digital escalable (+400 documentos), conectando además APIs públicas de ciencias naturales.',
      'Brindé soporte activo en el Backend (C#, ASP.NET, SQL Server) creado por el desarrollador Senior, adaptando rutas, resolviendo bugs y aplicando ajustes en la base de datos para asegurar una correcta comunicación con el cliente web.',
      'Resolví desafíos técnicos puntuales de integración, como la investigación y configuración de políticas CORS para permitir la correcta visualización de imágenes alojadas dinámicamente en Google Drive.',
      'Trabajé bajo un ciclo de vida de desarrollo estructurado, utilizando GitHub de forma colaborativa para el control de versiones y un sistema de tracking (Kanban) para el seguimiento diario de prioridades y tareas.',
    ],
    technologies: ['Blazor', 'Bootstrap', 'C#', 'ASP.NET', 'SQL Server', 'Figma', 'GitHub'],
    metrics: [
      { value: '170+', label: 'Miembros activos' },
      { value: '400+', label: 'Docs digitales'   },
      { value: '20+',  label: 'Años de legado'   },
      { value: 'MVP',  label: 'Abril 2026'        },
    ],
    links: [
      { label: 'Página oficial', url: 'https://www.gruposcoutsanpatricio.com.ar/grupo/' },
    ],
  },
  {
    company:  'Instituto de Formación Técnica Superior N°26',
    role:     'Desarrollador Frontend & UI/UX Designer',
    subtitle: 'Institución educativa — Rediseño web institucional',
    location: 'CABA',
    period:   'Ago 2025 – Dic 2025',
    description:
      'Rediseño y modernización de la plataforma web institucional oficial, migrando el sistema desde su antigua versión en Google Sites hacia una arquitectura web moderna y escalable. El proyecto cuenta con aprobación institucional.',
    responsibilities: [
      'Lideré el diseño de interfaces (UI/UX) utilizando Figma, creando prototipos para asegurar una experiencia de usuario moderna, limpia y completamente responsiva.',
      'Desarrollé íntegramente la maquetación y la lógica del Frontend utilizando Angular, logrando una navegación fluida y un rendimiento web optimizado.',
      'Trabajé de forma colaborativa integrando el Frontend con la API y el Backend, asegurando el correcto funcionamiento de los formularios de contacto y la gestión dinámica de datos.',
      'Implementé un flujo de integración y despliegue continuo (CI/CD) automatizado conectando GitHub con Netlify.',
      'Entregué el proyecto base aprobado. Actualmente el sitio se encuentra en proceso de adquisición de dominio definitivo y migración de la documentación histórica.',
      'Continuaré liderando evolutivos durante el próximo cuatrimestre para integrar nuevas funcionalidades y refinar detalles de diseño UI/UX.',
    ],
    technologies: ['Angular', 'TypeScript', 'SCSS', 'Figma', 'GitHub', 'Netlify', 'CI/CD'],
    metrics: [
      { value: '1',     label: 'Plataforma migrada' },
      { value: 'CI/CD', label: 'Deploy automático'  },
      { value: '100%',  label: 'Responsive'         },
      { value: '✓',     label: 'Aprobación oficial' },
    ],
    links: [
      { label: 'Ver sitio', url: 'https://ifts26.netlify.app/inicio' },
    ],
  },
  {
    company:  'Grupo Scout N°91 "San Patricio"',
    role:     'Desarrollador Full-Stack',
    subtitle: 'Proyecto propio — Plataforma evento benéfico',
    location: 'Buenos Aires',
    period:   'Jul 2025 – Sep 2025',
    description:
      'Aplicación web Full-Stack desarrollada y desplegada en producción (Vercel) para un evento temático de recaudación de fondos. Tomé la iniciativa de diseñar esta plataforma para reemplazar un formulario básico, logrando un sistema que operó con éxito bajo presión procesando más de 60 ventas reales simultáneas.',
    responsibilities: [
      'Desarrollé íntegramente la plataforma de principio a fin (Frontend, Backend y Base de Datos), creando una experiencia inmersiva mobile-first con React para que los usuarios exploren el menú y adjunten comprobantes de pago.',
      'Construí un panel de administración a medida para gestionar los estados de los pedidos en tiempo real (Abonado, Listo, Retirado).',
      'Diseñé el backend utilizando Node.js y Express, con una base de datos PostgreSQL alojada en Neon para gestionar la lógica de inventario de forma robusta y segura.',
      'Sincronicé los datos en tiempo real con Google Sheets para facilitar el control operativo de la cocina durante el evento.',
      'Implementé un sistema ágil de notificaciones por WhatsApp mediante enlaces pregenerados, optimizando la comunicación entre los vendedores y los clientes al momento de entregar los pedidos.',
    ],
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Neon', 'Vercel', 'Google Sheets API'],
    metrics: [
      { value: '60+',       label: 'Ventas simultáneas' },
      { value: '3',         label: 'Capas (Full-Stack)' },
      { value: 'Real-time', label: 'Sincronización'     },
      { value: 'Mobile',    label: 'First approach'     },
    ],
    links: [
      { label: 'Web demo',    url: 'https://demo-sanpaholmes.vercel.app/'              },
      { label: 'Repositorio', url: 'https://github.com/marcostoledo96/sanpaholmes'     },
    ],
  },
];

@Component({
  selector: 'app-seccion-experiencia',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective, ScrollIndicatorComponent],
  templateUrl: './seccion-experiencia.component.html',
  styleUrls: ['./seccion-experiencia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
  animations: [EXPAND_COLLAPSE],
})
export class SeccionExperienciaComponent implements AfterViewInit {

  // Índice de la entrada actualmente abierta. null = todas cerradas.
  readonly openIndex = signal<number | null>(null);

  // Lista de experiencias disponible desde el template
  readonly experiences = EXPERIENCES;

  // Alterna el estado de una entrada: si ya estaba abierta, se cierra; si no, se abre.
  // Solo una entrada puede estar abierta a la vez.
  toggleExperience(index: number): void {
    this.openIndex.update(prev => (prev === index ? null : index));
  }

  // Informa si una entrada en particular está abierta (útil para bindings del template)
  isOpen(index: number): boolean {
    return this.openIndex() === index;
  }

  // Inicializo los íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
