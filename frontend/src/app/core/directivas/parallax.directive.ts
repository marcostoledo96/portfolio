// Directiva de parallax: aplica translateY proporcional al scroll para las figuras decorativas flotantes.
// Corre fuera de NgZone y usa rAF para no cargar el change detection.
import {
  Directive, ElementRef, Input, OnInit, OnDestroy, NgZone, inject, PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements OnInit, OnDestroy {

  // Factor de profundidad: 0.1 = movimiento muy sutil, 0.3 = más pronunciado
  @Input() appParallax = 0.2;

  private container: HTMLElement | null = null; // Contenedor scrollable (<main>)
  private section: Element | null = null;        // <section> padre más cercano
  private rafId = 0;                             // ID de rAF pendiente para cancelarlo en cleanup
  private ticking = false;                       // Evita múltiples rAF en cola
  private reducedMotion = false;                 // Respeta prefers-reduced-motion

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    if (!this.isBrowser) return; // Sin DOM durante prerendering

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) return; // Sin efecto si el sistema pide menos movimiento

    // Busco la sección padre y el contenedor scrollable
    this.section  = this.el.nativeElement.closest('section');
    this.container = document.querySelector('main.layout__main') ?? document.querySelector('main');

    if (!this.container || !this.section) return;

    // Preparo la capa para compositing de GPU antes de la primera animación
    this.el.nativeElement.style.willChange = 'transform';

    // Registro el listener fuera de NgZone para que no dispare change detection en cada frame
    this.ngZone.runOutsideAngular(() => {
      this.container!.addEventListener('scroll', this.onScroll, { passive: true });
    });

    // Aplico posición inicial (por si la sección ya no está en el top)
    this.updateTransform();
  }

  ngOnDestroy(): void {
    this.container?.removeEventListener('scroll', this.onScroll);
    if (this.rafId) cancelAnimationFrame(this.rafId);

    // Limpio will-change al destruir para no retener la capa en memoria
    this.el.nativeElement.style.willChange = '';
    this.el.nativeElement.style.transform  = '';
  }

  // Handler de scroll: usa rAF para asegurar máximo 60fps (patrón throttle standard)
  private onScroll = (): void => {
    if (this.ticking) return;
    this.ticking = true;
    this.rafId = requestAnimationFrame(() => {
      this.updateTransform();
      this.ticking = false;
    });
  };

  // Calcula el offset parallax y lo aplica como translateY
  private updateTransform(): void {
    if (!this.container || !this.section) return;

    const containerRect = this.container.getBoundingClientRect();
    const sectionRect   = this.section.getBoundingClientRect();

    // Cuánto ha "pasado" el tope del contenedor por encima de la sección.
    // Cuando la sección llega al tope: offset ≈ 0. Al scrollear más: offset crece → shape se desplaza.
    const offset = containerRect.top - sectionRect.top;
    const translateY = offset * this.appParallax;

    this.el.nativeElement.style.transform = `translateY(${translateY}px)`;
  }
}
