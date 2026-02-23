// Sección de educación: tarjetas con carrera, institución, promedio y badge de estado.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';

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
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './seccion-educacion.component.html',
  styleUrls: ['./seccion-educacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionEducacionComponent implements AfterViewInit {

  // Lista de formaciones académicas, ordenadas de más reciente a más antigua
  educations: Education[] = [
    {
      career: 'T\u00e9cnico Superior en Desarrollo de Software',
      institution: 'IFTS N\u00ba16',
      description:
        'Carrera de 2 a\u00f1os y medio. Cursando el \u00faltimo cuatrimestre. Pr\u00e1cticas profesionalizantes enfocadas en soluciones digitales para el sistema de salud, con foco en calidad, documentaci\u00f3n y trabajo colaborativo.',
      status: 'in-progress',
      statusLabel: 'En curso',
      period: '2024 \u2013 Actualidad',
      average: 9.19,
      averageLabel: 'Promedio actual',
      icon: 'graduation-cap',
      color: '#3b82f6',
    },
    {
      career: 'T\u00e9cnico Superior en Radiolog\u00eda',
      institution: 'Instituto Superior de Ciencias de la Salud',
      description:
        'Formaci\u00f3n con base hospitalaria que permite detectar oportunidades de mejora para pacientes y equipos m\u00e9dicos desde una mirada integral.',
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
