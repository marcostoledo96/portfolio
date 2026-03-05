// Pantalla de carga inicial: muestra las iniciales "MT" con animación clip-path y una barra
// de progreso. Al completarse la duración mínima, lanza el evento `finished` para que el
// AppComponent lo retire del DOM.
import {
  Component, Output, EventEmitter, OnInit, OnDestroy,
  signal, ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplashScreenComponent implements OnInit, OnDestroy {
  // Notifica al AppComponent que la animación de salida terminó y puede quitar el splash
  @Output() finished = new EventEmitter<void>();

  // Controla la clase de salida para disparar el fade-out con scale
  readonly exiting = signal(false);

  // Si el usuario prefiere sin animaciones saltamos todo y salimos al instante
  readonly reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  private exitTimer: ReturnType<typeof setTimeout> | null = null;
  private finishTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // Con reduced motion salimos sin esperar para no bloquear al usuario
    const minDuration  = this.reducedMotion ? 0    : 1200;
    const exitDuration = this.reducedMotion ? 0    : 420;

    this.exitTimer = setTimeout(() => {
      this.exiting.set(true);
      // Esperamos que la animación CSS de salida termine antes de emitir el evento al padre
      this.finishTimer = setTimeout(() => {
        this.finished.emit();
      }, exitDuration);
    }, minDuration);
  }

  ngOnDestroy(): void {
    // Limpieza defensiva: si el componente se destruye antes de que terminen los timers
    if (this.exitTimer)  clearTimeout(this.exitTimer);
    if (this.finishTimer) clearTimeout(this.finishTimer);
  }
}
