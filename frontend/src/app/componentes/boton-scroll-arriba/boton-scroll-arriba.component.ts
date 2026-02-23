// Botón flotante (FAB) que aparece cuando el usuario scrolleó lo suficiente
// y, al hacer clic, vuelve al tope de la página.
// El padre controla su visibilidad con @Input() visible.

import {
  Component, Input, Output, EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations'; // Animación de entrada/salida

// OnPush: el componente solo se re-renderiza cuando cambia el @Input() visible
@Component({
  selector: 'app-boton-scroll-arriba',
  standalone: true,
  templateUrl: './boton-scroll-arriba.component.html',
  styleUrls: ['./boton-scroll-arriba.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    // Animación 'fadeScale': el botón aparece escalando desde 80% con fade in,
    // y desaparece con el efecto inverso.
    trigger('fadeScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(10px)' }))
      ])
    ])
  ]
})
export class BotonScrollArribaComponent {
  @Input() visible = false;                    // El padre lo pone en true cuando hay suficiente scroll
  @Output() clicked = new EventEmitter<void>(); // Emite al padre para que ejecute el scroll al tope
}
