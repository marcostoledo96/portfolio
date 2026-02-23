// Sección de experiencia profesional: una única tarjeta con roles, métricas, responsabilidades y tecnologías.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

// Dato puntual de impacto: valor numérico + etiqueta descriptiva
interface Metric {
  value: string;
  label: string;
}

// Estructura completa de una experiencia laboral
interface Experience {
  company: string;
  subtitle: string;
  location: string;
  period: string;
  roles: string[];           // Chips de rol mostrados como pills de color
  responsibilities: string[]; // Lista con bullet de acento
  technologies: string[];    // Tags de tecnologías usadas
  metrics: Metric[];         // Métricas de impacto con animación escalonada
}

@Component({
  selector: 'app-seccion-experiencia',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './seccion-experiencia.component.html',
  styleUrls: ['./seccion-experiencia.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionExperienciaComponent implements AfterViewInit {

  // Dato único de experiencia; si en el futuro hay más, esto se convierte en un array
  exp: Experience = {
    company: 'AEROTEST',
    subtitle: 'Consultorio y Laboratorio Médico',
    location: 'Belgrano, CABA',
    period: 'Enero 2022 \u2013 Actualidad',
    roles: [
      'Tester Web',
      'Soporte Técnico IT',
      'Desarrollo de Chatbot',
      'Desarrollo web en proceso',
      'Técnico en laboratorio',
    ],
    metrics: [
      { value: '30+', label: 'Bugs detectados' },
      { value: '80%', label: 'Reducción tiempos' },
      { value: '40+', label: 'Respuestas automáticas' },
      { value: '10+', label: 'Personas capacitadas' },
    ],
    responsibilities: [
      'Diseñé y ejecuté pruebas funcionales y no funcionales sobre aerotest.com.ar, detectando más de 30 hallazgos que agilizaron la operatoria administrativa.',
      'Implementé un chatbot con más de 40 respuestas automáticas, reduciendo los tiempos de respuesta en un 80% y liberando al equipo.',
      'Estoy en proceso de migrar el chatbot desde una aplicación de terceros hacia WhatsApp Cloud API para contar con métricas propias y flujos escalables.',
      'Estoy en desarrollo de una aplicación web de historias clínicas y turnos utilizando Angular, Node.js y PostgreSQL, con roles por perfil, login seguro y CRUD completo de pacientes y consultas.',
      'Redacté guías operativas y tutoriales que estandarizaron procesos y redujeron la curva de aprendizaje interna.',
      'Capacité a más de 10 personas en herramientas digitales, brindando soporte cercano y seguimiento continuo.',
      'Me encargo de analizar y redactar informes de test de aire espirado para SIBO, Intolerancias y Helicobacter Pylori.',
    ],
    technologies: [
      'Google Workspace',
      'HTML',
      'CSS',
      'JavaScript',
      'Node.js',
      'MySQL',
    ],
  };

  // Inicializo los íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}
