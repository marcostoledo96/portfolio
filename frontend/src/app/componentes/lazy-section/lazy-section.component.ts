// LazySectionComponent — Skeleton placeholder usado por los bloques @defer de app.component.html.
// Se muestra mientras la sección pesada no ha entrado en el viewport todavía.
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lazy-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lazy-section.component.html',
  styleUrls: ['./lazy-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // Forwadeamos el sectionId para que la navegación #anchor funcione incluso
    // antes de que el componente real cargue.
    '[id]': 'sectionId || null',
    '[style.min-height]': 'minHeight',
    'aria-hidden': 'true',
    class: 'lazy-section-host',
  },
})
export class LazySectionComponent {
  @Input() variant: 'tech-skills' | 'portfolio' | 'contacto' | 'generic' = 'generic';
  @Input() minHeight = '200px';
  @Input() sectionId = '';

  // Arrays para los @for del template — solo definen la cantidad de ítems a renderizar
  readonly techItems = Array(12);
  readonly portfolioCards = Array(6);
  readonly contactCards = Array(3);
}
