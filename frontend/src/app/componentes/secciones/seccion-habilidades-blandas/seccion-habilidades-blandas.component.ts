// Sección de habilidades blandas: grilla de 6 tarjetas con ícono, nombre y descripción.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ScrollIndicatorComponent } from '../../scroll-indicator/scroll-indicator.component';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// Estructura de cada habilidad blanda: ícono Lucide + color de acento propio
interface SoftSkill {
  icon: string;
  name: string;
  description: string;
  accent: string; // Color hex individual para la línea superior y el fondo del ícono
}

// Lista estática de habilidades blandas; cada una tiene su propio color de acento
const SOFT_SKILLS: SoftSkill[] = [
  {
    icon: 'users',
    name: 'Liderazgo y trabajo en equipo',
    description: 'Coordino tareas, acompaño a otros y facilito la comunicación en equipos. En proyectos académicos asumí rol como Scrum Master, priorizando objetivos claros y colaboración.',
    accent: '#3b82f6',
  },
  {
    icon: 'lightbulb',
    name: 'Resolución de problemas',
    description: 'Analizo situaciones complejas, busco causas raíz y propongo soluciones prácticas. Me enfoco en resolver con criterio, documentar lo aprendido y evitar que el mismo problema se repita.',
    accent: '#f59e0b',
  },
  {
    icon: 'book-open',
    name: 'Aprendizaje autónomo',
    description: 'Me capacito de forma constante y aprendo construyendo proyectos reales. Integro documentación, pruebas e IA aplicada para mejorar mi forma de trabajar y seguir creciendo técnicamente.',
    accent: '#10b981',
  },
  {
    icon: 'target',
    name: 'Atención al detalle (QA)',
    description: 'Reviso flujos, datos, permisos y casos de borde antes de que impacten en usuarios. Documento bugs con claridad y aplico una mirada de calidad en desarrollo, soporte y testing funcional.',
    accent: '#ef4444',
  },
  {
    icon: 'calendar-check',
    name: 'Organización y planificación',
    description: 'Ordeno tareas, prioridades y entregables con criterio incremental. Me apoyo en documentación, seguimiento y validación para avanzar sin perder de vista el objetivo del producto.',
    accent: '#8b5cf6',
  },
  {
    icon: 'heart-handshake',
    name: 'Voluntariado: Grupo Scout',
    description: 'Tengo +15 años de trayectoria en el Grupo Scout San Patricio y +5 años en roles de liderazgo. Esa experiencia fortaleció mi comunicación, planificación y trabajo con personas.',
    accent: '#4f46e5',
  },
];

@Component({
  selector: 'app-seccion-habilidades-blandas',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective, ScrollIndicatorComponent],
  templateUrl: './seccion-habilidades-blandas.component.html',
  styleUrls: ['./seccion-habilidades-blandas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionHabilidadesBlandasComponent implements AfterViewInit {

  skills = SOFT_SKILLS; // Expongo la constante al template

  // Inicializo los íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
