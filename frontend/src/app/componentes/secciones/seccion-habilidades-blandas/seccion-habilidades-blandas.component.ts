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
    description: 'Acompaño a equipos multidisciplinarios y facilito la comunicación asertiva para alcanzar los objetivos, asumiendo roles como Scrum Master cuando el proyecto lo requiere.',
    accent: '#3b82f6',
  },
  {
    icon: 'lightbulb',
    name: 'Resolución de problemas',
    description: 'Analizo escenarios complejos y diseño soluciones pragmáticas fuertemente, aportando una mirada analítica para optimizar procesos y garantizar la eficiencia operativa.',
    accent: '#f59e0b',
  },
  {
    icon: 'book-open',
    name: 'Aprendizaje autónomo',
    description: 'Me capacito continuamente en nuevas tecnologías y metodologías, integrando herramientas de Inteligencia Artificial en mi flujo de trabajo para potenciar la productividad.',
    accent: '#10b981',
  },
  {
    icon: 'target',
    name: 'Atención al detalle (QA)',
    description: 'Aseguro la calidad de cada entrega mediante un testing riguroso y documentación clara, garantizando productos estables y una excelente experiencia de usuario.',
    accent: '#ef4444',
  },
  {
    icon: 'calendar-check',
    name: 'Organización y planificación',
    description: 'Gestiono ciclos de vida de desarrollo mediante metodologías ágiles (Scrum, Kanban), priorizando entregables críticos en entornos dinámicos y de alta presión.',
    accent: '#8b5cf6',
  },
  {
    icon: 'heart-handshake',
    name: 'Voluntariado: Grupo Scout',
    description: 'Dirigente de jóvenes (11-17 años). Más de 8 años facilitando espacios de formación en valores, liderazgo proactivo y gestión colaborativa de proyectos.',
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
