// Sección "Sobre mí": bento grid con bio, ubicación, objetivo, stack actual y tecnologías en aprendizaje.
import { Component, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnScrollDirective } from '../../../core/directivas/animate-on-scroll.directive';

declare const lucide: any; // Lucide cargado desde CDN via script en index.html

@Component({
  selector: 'app-seccion-sobre-mi',
  standalone: true,
  imports: [CommonModule, AnimateOnScrollDirective],
  templateUrl: './seccion-sobre-mi.component.html',
  styleUrls: ['./seccion-sobre-mi.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Solo re-renderizo ante cambios explícitos
})
export class SeccionSobreMiComponent implements AfterViewInit {

  // Tecnologías del stack actual (chips azul-acento en la tarjeta Stack)
  currentStack = [
    'JavaScript', 'TypeScript', 'Angular', 'React',
    'Node.js', 'Express', 'SQL', 'PostgreSQL', 'Git',
  ];

  // Items en aprendizaje (chips violeta en la tarjeta Aprendiendo)
  learning = ['React avanzado', 'Java', 'Testing automatizado', 'CI/CD'];

  // Inicializo íconos de Lucide después de que el DOM esté listo
  ngAfterViewInit(): void {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}
