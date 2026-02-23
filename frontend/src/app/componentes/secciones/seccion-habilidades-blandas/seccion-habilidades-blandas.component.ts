// Sección de habilidades blandas: grilla de 6 tarjetas con ícono, nombre y descripción.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';

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
    description: 'Coordino y acompaño a equipos multidisciplinarios, fomentando la comunicación asertiva para alcanzar los objetivos del proyecto.',
    accent: '#3b82f6',
  },
  {
    icon: 'lightbulb',
    name: 'Resolución de problemas',
    description: 'Analizo escenarios complejos y diseño soluciones pragmáticas, apoyándome en herramientas de IA para optimizar tiempos y resultados.',
    accent: '#f59e0b',
  },
  {
    icon: 'heart-handshake',
    name: 'Voluntariado: Grupo Scout',
    description: 'Dirigente de jóvenes (11-17 años). Facilito espacios de formación en valores, liderazgo, planificación y gestión de proyectos.',
    accent: '#4f46e5',
  },
  {
    icon: 'target',
    name: 'Atención al detalle (QA)',
    description: 'Aseguro la calidad de cada entrega mediante testing riguroso, garantizando accesibilidad y una excelente experiencia de usuario.',
    accent: '#ef4444',
  },
  {
    icon: 'calendar-check',
    name: 'Organización y planificación',
    description: 'Gestiono tareas mediante metodologías ágiles, priorizando entregables críticos para mantener la calidad en entornos dinámicos.',
    accent: '#8b5cf6',
  },
  {
    icon: 'book-open',
    name: 'Aprendizaje autónomo',
    description: 'Me capacito continuamente en nuevas tecnologías y metodologías, integrando IA en mi flujo de trabajo para potenciar la productividad.',
    accent: '#10b981',
  },
];

@Component({
  selector: 'app-seccion-habilidades-blandas',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
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
