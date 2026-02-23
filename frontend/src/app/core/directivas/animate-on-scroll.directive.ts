// Directiva que agrega la clase 'visible' cuando el elemento entra en el viewport.
// Usa IntersectionObserver fuera de NgZone para no disparar change detection en cada evento de scroll.
import { Directive, ElementRef, Input, OnInit, OnDestroy, NgZone } from '@angular/core';

@Directive({
  selector: '[appAnimateOnScroll]',
  standalone: true,
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() animateDelay = 0;        // Retardo en segundos antes de que inicie la transición CSS
  @Input() animateThreshold = 0.15; // Porcentaje del elemento visible para disparar la animación

  private observer: IntersectionObserver | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    element.classList.add('animate-on-scroll'); // Estado inicial: opacidad 0, listo para animar
    if (this.animateDelay > 0) {
      element.style.transitionDelay = `${this.animateDelay}s`; // Aplico el delay como propiedad CSS inline
    }

    // Corro el observer fuera de NgZone para evitar que cada scroll dispare
    // un ciclo de detección de cambios de Angular (optimización de rendimiento)
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            element.classList.add('visible');    // Activo la transición CSS de entrada
            this.observer?.unobserve(element);  // Dejo de observar: la animación solo ocurre una vez
          }
        },
        { threshold: this.animateThreshold },
      );
      this.observer.observe(element);
    });
  }

  // Desconecto el observer al destruir el componente para evitar memory leaks
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
