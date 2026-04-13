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

// Enlace externo opcional para proyectos con presencia web.
// icon: nombre del ícono Lucide a mostrar (globe para sitios, github para repos).
interface ExpLink {
  label: string;
  url:   string;
  icon?: string; // Ícono Lucide; default 'external-link' si no se especifica
}

// Estructura completa de una experiencia laboral.
// Cuando tiene subEntries es un grupo de roles en la misma empresa;
// en ese caso los campos de contenido son opcionales (están en cada sub-entry).
interface Experience {
  id:                string;         // Identificador único para el toggle
  company:           string;
  role?:             string;         // Rol principal (opcional en grupos)
  subtitle:          string;         // Tipo de empresa o contexto del proyecto
  location:          string;
  period:            string;
  description?:      string;         // Párrafo introductorio (opcional en grupos)
  responsibilities?: string[];       // Lista de logros (opcional en grupos)
  technologies?:     string[];       // Tags de tecnologías (opcional en grupos)
  metrics?:          Metric[];       // Indicadores de impacto (opcional en grupos)
  links?:            ExpLink[];      // Links externos opcionales (sitio, repo, demo)
  subEntries?:       Experience[];   // Sub-entries cuando una misma empresa tiene múltiples roles
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

// Listado completo de experiencias. Orden: AEROTEST (grupo), Grupo Scout Modernización,
// IFTS N°26, Grupo Scout Plataforma Evento.
const EXPERIENCES: Experience[] = [
  // --- BLOQUE AEROTEST ---
  {
    id:       'aerotest',
    company:  'AEROTEST',
    subtitle: 'Consultorio y Laboratorio Médico',
    location: 'Belgrano, CABA',
    period:   'Ene 2022 – Actualidad',
    subEntries: [
      {
        id:          'aerotest-qa',
        company:     'AEROTEST',
        role:        'QA Tester & Desarrollador Web | Soporte IT',
        subtitle:    'Consultorio y Laboratorio Médico',
        location:    'Belgrano, CABA',
        period:      'Dic 2024 – Actualidad',
        description: 'Lidero la transformación digital del consultorio, asegurando la calidad del software, desarrollando herramientas internas y optimizando procesos mediante automatización.',
        responsibilities: [
          'Ejecuté pruebas funcionales y no funcionales (QA) en el sitio web aerotest.com.ar, documentando más de 80 errores para optimizar la operación.',
          'Implementé un chatbot automatizado reduciendo tiempos de atención en un 80% (actualmente en proceso de integración con WhatsApp Cloud API).',
          'Brindo soporte técnico de Nivel 1 y optimicé la gestión de Google Workspace, liberando más del 80% de almacenamiento en la nube.',
          'Capacité a más de 8 personas del equipo en herramientas digitales mediante instructivos técnicos.',
          'Desarrollo de plataforma EMR/EHR de gestión médica integral (turnos, pacientes, consultas clínicas) — Angular 18, Node.js/Express, PostgreSQL 15, JWT con RBAC (Administrador, Médico, Secretario). Proyecto en desarrollo activo desde octubre de 2025.',
        ],
        technologies: ['Angular 18', 'QA Testing', 'Node.js', 'PostgreSQL', 'WhatsApp Cloud API', 'Google Workspace'],
        metrics: [
          { value: '+80', label: 'Bugs documentados'  },
          { value: '80%', label: 'Reducción tiempos'  },
          { value: '+40', label: 'Flujos automáticos' },
          { value: '+8', label: 'Capacitados'        },
        ],
      },
      {
        id:          'aerotest-sec',
        company:     'AEROTEST',
        role:        'Secretario Médico & Técnico de Laboratorio',
        subtitle:    'Consultorio y Laboratorio Médico',
        location:    'Belgrano, CABA',
        period:      'Ene 2022 – Actualidad',
        description: 'Gestión integral administrativa y técnica del laboratorio, brindando atención directa al paciente y operando sistemas de salud complejos.',
        responsibilities: [
          'Analizo y redacto informes técnicos de test de aire espirado (SIBO, Intolerancias, Helicobacter Pylori).',
          'Gestiono la liquidación mensual de prestaciones médicas de más de 12 coberturas de salud, operando portales de gestión (Traditum, Apligem, Swiss Medical).',
          'Administro la admisión de pacientes y la coordinación general de la agenda médica del consultorio.',
          'Produzco y edito material didáctico audiovisual (utilizando CapCut) para instruir a los pacientes sobre la correcta preparación para sus estudios clínicos.',
        ],
        technologies: ['Traditum', 'Apligem', 'Nomenclador Nacional', 'CapCut', 'Gestión Médica'],
        metrics: [
          { value: '+1500', label: 'Informes procesados' },
          { value: '+12',   label: 'Coberturas médicas'  },
          { value: '4',     label: 'Videos instructivos' },
          { value: '+4',    label: 'Años operativos'     },
        ],
      },
    ],
  },
  {
    id:       'scout-mod',
    company:  'Grupo Scout N°91 "San Patricio"',
    role:     'Desarrollador Frontend & UI/UX | Soporte Backend (.NET)',
    subtitle: 'Institución Scout — Modernización web',
    location: 'Belgrano, CABA',
    period:   'Dic 2025 – Actualidad',
    description:
      'Rediseño integral y modernización de una plataforma web con más de 20 años de antigüedad, transformada en un sistema de gestión dinámica para una comunidad de más de 170 miembros activos. Trabajo en dupla bajo el liderazgo técnico de un Desarrollador Backend Senior. MVP lanzado en producción el 10 de abril de 2026.',
    responsibilities: [
      'Diseñé las interfaces (UI/UX) en Figma y construí desde cero todo el Frontend responsivo utilizando Blazor y Bootstrap, dándole identidad visual e interactividad a la plataforma.',
      'Desarrollé las vistas y la interacción del lado del cliente para módulos administrativos complejos (sistema de autenticación por roles, autogestión de perfiles, control de asistencia y legajos virtuales), consumiendo e integrando la API provista por el líder técnico.',
      'Maqueté e integré desde el Frontend un CMS a medida para la creación de noticias y una biblioteca digital escalable (+400 documentos), conectando además APIs públicas de ciencias naturales.',
      'Brindé soporte activo en el Backend (C#, ASP.NET, SQL Server) creado por el desarrollador Senior, adaptando rutas, resolviendo bugs y aplicando ajustes en la base de datos para asegurar una correcta comunicación con el cliente web.',
      'Dirigí la suite de tests unitarios del backend (72+ tests con xUnit, Moq y FluentAssertions), cubriendo servicios, validators de dominio y lógica de negocio bajo el patrón AAA.',
      'Implementé la integración con la API oficial de Google Drive para la carga y lectura de fotos de la plataforma, eliminando los problemas de bloqueo de imágenes causados por restricciones CORS que impedían su visualización, y reduciendo costos de almacenamiento al centralizar los archivos en Drive.',
      'Trabajé bajo un ciclo de vida de desarrollo estructurado, utilizando GitHub de forma colaborativa para el control de versiones y un sistema de tracking (Kanban) para el seguimiento diario de prioridades y tareas.',
    ],
    technologies: ['Blazor', 'Bootstrap', 'C#', 'ASP.NET', 'SQL Server', 'Figma', 'GitHub'],
    metrics: [
      { value: '+170', label: 'Miembros activos' },
      { value: '+400', label: 'Docs digitales'   },
      { value: '55+',  label: 'Funcionalidades'  },
      { value: '4',    label: 'Roles permisos'   },
    ],
    links: [
      { label: 'Página oficial', icon: 'globe', url: 'https://www.gruposcoutsanpatricio.com.ar/grupo/' },
    ],
  },
  {
    id:       'ifts26',
    company:  'Instituto de Formación Técnica Superior N°26',
    role:     'Desarrollador Frontend & UI/UX Designer',
    subtitle: 'Institución educativa — Rediseño web institucional',
    location: 'Chacarita, CABA',
    period:   'Ago 2025 – Dic 2025',
    description:
      'Rediseño y modernización de la plataforma web institucional oficial, migrando desde Google Sites hacia una arquitectura moderna con Angular 20 y CoreUI 5. El sitio abarca 30+ páginas con un CMS headless (Decap CMS) para edición de contenido sin código. El proyecto cuenta con aprobación institucional.',
    responsibilities: [
      'Lideré el diseño de interfaces (UI/UX) utilizando Figma, creando prototipos para asegurar una experiencia de usuario moderna, limpia y completamente responsiva.',
      'Desarrollé íntegramente las 30+ páginas del Frontend utilizando Angular 20, TypeScript, SCSS y CoreUI 5 como framework CSS, abarcando secciones de carreras, alumnos, docentes, institucional, pre-inscripción y contacto.',
      'Trabajé de forma colaborativa integrando el Frontend con la API, el Backend y el CMS headless (Decap CMS) desarrollados por mi compañero, asegurando el correcto funcionamiento de los formularios de contacto y la gestión dinámica de datos.',
      'Implementé un flujo de integración y despliegue continuo (CI/CD) automatizado conectando GitHub con Netlify.',
      'Entregué el proyecto base aprobado. Actualmente el sitio se encuentra en proceso de adquisición de dominio definitivo y migración de la documentación histórica.',
      'Continuaré liderando evolutivos durante el próximo cuatrimestre para integrar nuevas funcionalidades y refinar detalles de diseño UI/UX.',
    ],
    technologies: ['Angular 20', 'TypeScript', 'SCSS', 'CoreUI', 'Decap CMS', 'Figma', 'GitHub', 'Netlify', 'CI/CD'],
    metrics: [
      { value: '30+',   label: 'Páginas'            },
      { value: 'CMS',   label: 'Headless (Decap)'   },
      { value: 'CI/CD', label: 'Deploy automático'   },
      { value: '✓',     label: 'Aprobación oficial'  },
    ],
    links: [
      { label: 'Ver sitio en vivo', icon: 'globe', url: 'https://ifts26.netlify.app/inicio' },
    ],
  },
  {
    id:       'scout-evento',
    company:  'Grupo Scout N°91 "San Patricio"',
    role:     'Desarrollador Full-Stack',
    subtitle: 'Proyecto propio — Plataforma evento benéfico',
    location: 'Belgrano, CABA',
    period:   'Jul 2025 – Sep 2025',
    description:
      'Aplicación web Full-Stack desarrollada con React, TypeScript y Tailwind CSS (frontend), y Node.js, Express y PostgreSQL con autenticación JWT (backend). Desplegada en producción (Vercel) para un evento temático de recaudación de fondos. Tomé la iniciativa de diseñar esta plataforma para reemplazar un formulario básico, logrando un sistema con 3 roles de acceso que operó con éxito bajo presión procesando más de 60 ventas reales simultáneas.',
    responsibilities: [
      'Desarrollé íntegramente la plataforma de principio a fin (Frontend, Backend y Base de Datos), creando una experiencia inmersiva mobile-first con React, TypeScript, Tailwind CSS y shadcn/ui para que los usuarios exploren el menú y adjunten comprobantes de pago.',
      'Construí un panel de administración a medida para gestionar los estados de los pedidos en tiempo real (Abonado, Listo, Retirado).',
      'Diseñé el backend utilizando Node.js y Express, con una base de datos PostgreSQL alojada en Neon para gestionar la lógica de inventario de forma robusta y segura. Implementé autenticación JWT con bcrypt y un sistema de 3 roles (admin, vendedor, visitador) con permisos granulares.',
      'Sincronicé los datos en tiempo real con Google Sheets para facilitar el control operativo de la cocina durante el evento.',
      'Implementé un sistema ágil de notificaciones por WhatsApp mediante enlaces pregenerados, optimizando la comunicación entre los vendedores y los clientes al momento de entregar los pedidos.',
    ],
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'JWT', 'Vercel', 'Google Sheets'],
    metrics: [
      { value: '+60',       label: 'Ventas simultáneas' },
      { value: '3',         label: 'Roles con permisos JWT' },
      { value: 'Real-time', label: 'Sincronización'     },
      { value: 'Mobile',    label: 'First approach'     },
    ],
    links: [
      { label: 'Ver demo',        icon: 'globe',  url: 'https://demo-sanpaholmes.vercel.app/'          },
      { label: 'Ver en GitHub',   icon: 'github', url: 'https://github.com/marcostoledo96/sanpaholmes' },
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

  // ID de la entrada actualmente abierta. null = todas cerradas.
  readonly openIndex = signal<string | null>(null);

  // Lista de experiencias disponible desde el template
  readonly experiences = EXPERIENCES;

  // Alterna el estado de una entrada por su ID. Solo una puede estar abierta a la vez.
  // El setTimeout re-inicializa Lucide luego de que Angular inserta el cuerpo del acordeón en el DOM,
  // porque los nodos con data-lucide son nuevos y Lucide no los reconoce automáticamente.
  // La guarda typeof está DENTRO del callback para que se evalúe al momento de ejecución,
  // no al de scheduling (evita ReferenceError si lucide fue limpiado entre ambos momentos).
  toggleExperience(id: string): void {
    this.openIndex.update(prev => (prev === id ? null : id));
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 0);
  }

  // Informa si la entrada con el ID dado está abierta (útil para bindings del template)
  isOpen(id: string): boolean {
    return this.openIndex() === id;
  }

  // Inicializo los íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
