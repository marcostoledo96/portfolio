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

// Listado completo de experiencias.
// Criterio: trabajos, prácticas y proyectos usados en contexto real por terceros.
// Orden: AEROTEST, Grupo Scout Plataforma Institucional, SanPa Holmes, IFTS N°26.
const EXPERIENCES: Experience[] = [
  // --- BLOQUE AEROTEST ---
  {
    id: 'aerotest',
    company: 'AEROTEST',
    subtitle: 'Consultorio y Laboratorio Médico',
    location: 'Belgrano, CABA',
    period: 'Ene 2022 – Actualidad',
    subEntries: [
      {
        id: 'aerotest-qa',
        company: 'AEROTEST',
        role: 'QA Tester | Soporte IT | Desarrollador Web',
        subtitle: 'Consultorio y Laboratorio Médico',
        location: 'Belgrano, CABA',
        period: 'Dic 2024 – Actualidad',
        description:
          'Participo en la transformación digital del consultorio, combinando QA funcional, soporte IT, automatización de procesos y desarrollo de soluciones web para gestión médica.',
        responsibilities: [
          'Ejecuté pruebas funcionales y no funcionales sobre aerotest.com.ar, documentando más de 80 bugs con foco en interfaz, rendimiento y experiencia de usuario.',
          'Configuré un chatbot de WhatsApp mediante una app externa conectada a Google Sheets, automatizando más de 40 flujos y reduciendo los tiempos de atención en un 80%.',
          'Brindo soporte IT de Nivel 1, resuelvo incidencias operativas y capacito al equipo médico en el uso de herramientas digitales e instructivos técnicos.',
          'Colaboro en el desarrollo de Consultorios Cabildo, plataforma médica full-stack en desarrollo local para gestión de pacientes, turnos y consultas clínicas.',
          'Optimicé procesos administrativos y uso de Google Workspace, mejorando la organización de archivos, almacenamiento y circuitos internos del consultorio.',
        ],
        technologies: [
          'QA Testing',
          'Angular',
          'Node.js',
          'PostgreSQL',
          'Google Sheets',
          'Google Workspace',
          'Soporte IT',
        ],
        metrics: [
          { value: '+80', label: 'Bugs documentados' },
          { value: '-80%', label: 'Tiempos de atención' },
          { value: '+40', label: 'Flujos automatizados' },
          { value: '+8', label: 'Capacitados' },
        ],
      },
      {
        id: 'aerotest-sec',
        company: 'AEROTEST',
        role: 'Secretario Médico & Técnico de Laboratorio',
        subtitle: 'Consultorio y Laboratorio Médico',
        location: 'Belgrano, CABA',
        period: 'Ene 2022 – Actualidad',
        description:
          'Gestión administrativa y técnica en un entorno médico real, con atención directa a pacientes, manejo de estudios clínicos, informes y procesos de facturación.',
        responsibilities: [
          'Gestiono admisión de pacientes, triaje, coordinación de agendas médicas y seguimiento operativo de estudios clínicos.',
          'Redacto y proceso más de 1.500 informes técnicos de estudios de aire espirado, incluyendo SIBO, intolerancias alimentarias y Helicobacter pylori.',
          'Gestiono liquidación mensual de prestaciones para más de 12 coberturas de salud mediante portales B2B como Traditum, Apligem y Swiss Medical.',
          'Produzco materiales instructivos para pacientes, incluyendo guías y videos de preparación para estudios clínicos.',
          'Esta experiencia clínica fortalece mi perfil HealthTech y mi capacidad para entender flujos reales antes de llevarlos a software.',
        ],
        technologies: [
          'Traditum',
          'Apligem',
          'Nomenclador Nacional',
          'CapCut',
          'Gestión Médica',
        ],
        metrics: [
          { value: '+1500', label: 'Informes técnicos' },
          { value: '+12', label: 'Coberturas médicas' },
          { value: '+4', label: 'Años operativos' },
          { value: 'HealthTech', label: 'Base funcional' },
        ],
      },
    ],
  },
  {
    id: 'scout-mod',
    company: 'Grupo Scout N°91 "San Patricio"',
    role: 'Desarrollador Frontend & UI/UX | Soporte Backend (.NET)',
    subtitle: 'Institución Scout — Plataforma institucional',
    location: 'Belgrano, CABA',
    period: 'Dic 2025 – Actualidad',
    description:
      'Participación en la modernización de una plataforma institucional con más de 20 años de historia, actualmente publicada en producción y orientada a una comunidad de más de 180 miembros. Mi rol principal es el frontend y diseño UI/UX, colaborando además en backend y base de datos junto al desarrollador backend principal.',
    responsibilities: [
      'Responsable del frontend y diseño UI/UX del sitio público y panel administrativo, construyendo una experiencia responsive, clara y orientada a usuarios reales con Blazor WebAssembly.',
      'Diseñé y desarrollé interfaces para módulos institucionales como autenticación por roles, perfiles, asistencia, legajos, biblioteca digital y panel de administración.',
      'Colaboré en backend .NET y SQL Server implementando funciones, servicios y tablas puntuales, con foco en integrar correctamente la API con el cliente web.',
      'Implementé la integración con la API oficial de Google Drive para carga y visualización de imágenes, resolviendo bloqueos CORS en producción.',
      'Trabajé en validación funcional, documentación técnica y pruebas sobre flujos críticos, acompañando la evolución de una plataforma publicada y en crecimiento.',
    ],
    technologies: [
      'Blazor WebAssembly',
      '.NET 8',
      'C#',
      'SQL Server',
      'Google Drive API',
      'Figma',
      'GitHub',
    ],
    metrics: [
      { value: '+180', label: 'Miembros' },
      { value: '+500', label: 'Docs digitales' },
      { value: '4', label: 'Roles' },
      { value: 'Prod.', label: 'Web publicada' },
    ],
    links: [
      {
        label: 'Página oficial',
        icon: 'globe',
        url: 'https://www.gruposcoutsanpatricio.com.ar/grupo/',
      },
    ],
  },
  {
    id: 'scout-evento',
    company: 'Grupo Scout N°91 "San Patricio"',
    role: 'E-commerce a beneficio',
    subtitle: 'Proyecto propio — SanPa Holmes',
    location: 'Belgrano, CABA',
    period: 'Sep 2025 – Nov 2025',
    description:
      'E-commerce a beneficio desarrollado para un evento scout real. El sistema fue diseñado mobile-first y permitió gestionar pedidos, comprobantes, estados y ventas durante una jornada operativa con usuarios reales.',
    responsibilities: [
      'Desarrollé la plataforma de punta a punta con React, TypeScript, Tailwind, Node.js, Express y PostgreSQL/Neon, priorizando el uso desde celulares.',
      'Implementé flujo completo de compra: catálogo, carrito, checkout, carga de comprobante, estados de pedido y panel administrativo.',
      'Construí una API REST con JWT, RBAC, transacciones, queries parametrizadas y deploy serverless en Vercel.',
      'Integré exportación operativa a Google Sheets para facilitar el control de ventas durante el evento.',
      'Generé links de WhatsApp con mensaje prearmado para agilizar la comunicación con clientes, sin utilizar API oficial de WhatsApp.',
      'Diseñé y ejecuté testing manual documentado, validando celulares reales, redes móviles 4G/5G, escenarios de conexión limitada y flujo completo de compra.',
    ],
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
    metrics: [
      { value: '+60', label: 'Ventas gestionadas' },
      { value: '~50', label: 'Usuarios' },
      { value: 'Mobile', label: 'First' },
      { value: 'Sheets', label: 'Exportación' },
    ],
    links: [
      {
        label: 'Ver demo',
        icon: 'globe',
        url: 'https://demo-sanpaholmes.vercel.app/',
      },
      {
        label: 'Ver en GitHub',
        icon: 'github',
        url: 'https://github.com/marcostoledo96/sanpaholmes',
      },
    ],
  },
  {
    id: 'ifts26',
    company: 'Instituto de Formación Técnica Superior N°26',
    role: 'Desarrollador Frontend & UI/UX Designer',
    subtitle: 'Práctica profesionalizante — Web institucional para uso real',
    location: 'Chacarita, CABA',
    period: 'Ago 2025 – Dic 2025',
    description:
      'Práctica profesionalizante orientada a la modernización de la web institucional del IFTS N°26, migrando desde Google Sites hacia una interfaz moderna desarrollada con Angular 20 y pensada para uso real por la comunidad educativa.',
    responsibilities: [
      'Diseñé prototipos e interfaces en Figma, definiendo una experiencia visual limpia, responsive y alineada a una institución educativa.',
      'Desarrollé el frontend de más de 30 páginas con Angular 20, TypeScript, SCSS y CoreUI, incluyendo secciones institucionales, carreras, alumnos, docentes, preinscripción y contacto.',
      'Trabajé de forma colaborativa integrando el frontend con la API, backend y CMS headless desarrollados por mi compañero de equipo.',
      'Acompañé la validación visual y funcional del sitio, revisando navegación, contenidos, formularios y consistencia responsive.',
      'El proyecto base fue aprobado institucionalmente y quedó preparado para continuar evolutivos, dominio definitivo y migración de documentación histórica.',
    ],
    technologies: [
      'Angular 20',
      'TypeScript',
      'SCSS',
      'CoreUI',
      'Figma',
      'GitHub',
      'Decap CMS',
    ],
    metrics: [
      { value: '30+', label: 'Páginas' },
      { value: 'Angular', label: 'Frontend' },
      { value: 'CMS', label: 'Integración' },
      { value: '✓', label: 'Aprobado' },
    ],
    links: [
      {
        label: 'Ver sitio en vivo',
        icon: 'globe',
        url: 'https://ifts26.netlify.app/inicio',
      },
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
