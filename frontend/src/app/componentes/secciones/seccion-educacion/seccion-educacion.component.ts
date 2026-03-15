// Sección de educación: tarjetas con carrera, institución, promedio y badge de estado.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';
import { ParallaxDirective } from '../../../core/directivas/parallax.directive';
import { ScrollIndicatorComponent } from '../../scroll-indicator/scroll-indicator.component';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// Estructura de datos de cada entrada educativa
interface Education {
  career: string;
  institution: string;
  description: string;
  status: 'in-progress' | 'completed'; // Controla el color del badge y la línea superior
  statusLabel: string;
  period: string;
  average: number;
  averageLabel: string;
  icon: string;  // Nombre del ícono Lucide
  color: string; // Color hexadecimal para el ícono y los acentos de la tarjeta
}

@Component({
  selector: 'app-seccion-educacion',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective, ParallaxDirective, ScrollIndicatorComponent],
  templateUrl: './seccion-educacion.component.html',
  styleUrls: ['./seccion-educacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionEducacionComponent implements AfterViewInit {

  // Lista de formaciones académicas, ordenadas de más reciente a más antigua
  educations: Education[] = [
    {
      career: 'Técnico Superior en Desarrollo de Software',
      institution: 'IFTS N°16',
      description:
        'Último cuatrimestre. Formación integral en arquitectura de software, bases de datos y metodologías ágiles. Prácticas profesionalizantes con fuerte enfoque en QA Testing, documentación técnica y desarrollo Full Stack.',
      status: 'in-progress',
      statusLabel: 'En curso',
      period: '2024 – Actualidad',
      average: 9.19,
      averageLabel: 'Promedio actual',
      icon: 'graduation-cap',
      color: '#3b82f6',
    },
    {
      career: 'Técnico Superior en Radiología',
      institution: 'Instituto Superior de Ciencias de la Salud',
      description:
        'Título que consolida mi perfil HealthTech. Sólida base clínica y hospitalaria que me permite entender los flujos de trabajo médicos reales y diseñar software empático y centrado en el paciente.',
      status: 'completed',
      statusLabel: 'Completado',
      period: 'Finalizado',
      average: 8.28,
      averageLabel: 'Promedio final',
      icon: 'award',
      color: '#10b981',
    },
  ];

  // Inicializo los íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
