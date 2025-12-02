// SidebarComponent: barra lateral fija para pantallas grandes (desktop).
// Acá muestro la foto de perfil, nombre, navegación y el toggle de tema.
// Escucho cambios del ThemeService para sincronizar el botón de tema.
// La navegación usa scroll suave para ir a cada sección.

import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';
import { SectionTrackerService } from '../../services/section-tracker.service';

declare const lucide: any;

type IdleCb = (cb: () => void) => void;

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {
    temaActual: Theme = 'oscuro';
    seccionActiva: string = 'sobre-mi';
    private destruir$ = new Subject<void>();
    private observador: IntersectionObserver | null = null;
    private iconosPendientes = false;
    private ultimasEntradas: Map<string, IntersectionObserverEntry> = new Map();
    private timeoutActualizacion: any = null;

    constructor(
        private servicioTema: ThemeService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef,
        private sectionTracker: SectionTrackerService
    ) { }

    ngOnInit(): void {
        // Me suscribo al tema actual para sincronizar el toggle
        this.servicioTema.tema$
            .pipe(takeUntil(this.destruir$))
            .subscribe((tema: Theme) => {
                this.temaActual = tema;
                this.programarIconos();
                this.cdr.markForCheck();
            });

        this.sectionTracker.seccionActiva
            .pipe(takeUntil(this.destruir$))
            .subscribe((id: string) => {
                if (id && this.seccionActiva !== id) {
                    this.seccionActiva = id;
                    this.cdr.markForCheck();
                }
            });

        // Inicializo el IntersectionObserver después de que el DOM esté listo
        this.esperarSeccionesYConfigurarObservador();
    }

    // Espero a que las secciones estén en el DOM antes de configurar el observer
    private esperarSeccionesYConfigurarObservador(): void {
        let intentos = 0;
        const maxIntentos = 10;

        const intervalo = setInterval(() => {
            const secciones = document.querySelectorAll('section[id]');

            if (secciones.length > 0) {
                clearInterval(intervalo);
                this.configurarObservadorInterseccion();
            } else if (intentos >= maxIntentos) {
                clearInterval(intervalo);
            }

            intentos++;
        }, 100);
    }

    ngOnDestroy(): void {
        this.destruir$.next();
        this.destruir$.complete();
        
        // Limpio el timeout pendiente
        if (this.timeoutActualizacion) {
            clearTimeout(this.timeoutActualizacion);
        }
        
        // Limpio el observer cuando el componente se destruye
        if (this.observador) {
            this.observador.disconnect();
        }
    }

    // Configuro el IntersectionObserver para detectar qué sección está visible
    private configurarObservadorInterseccion(): void {
        const opciones = {
            root: null,
            // Ajusto rootMargin para mejor detección en todas las resoluciones
            rootMargin: '-10% 0px -40% 0px',
            // Múltiples thresholds para mejor detección de secciones largas
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        };

        this.observador = new IntersectionObserver((entradas: IntersectionObserverEntry[]) => {
            // Actualizo el mapa con las últimas entradas de cada sección
            entradas.forEach(entrada => {
                const id = entrada.target.id;
                if (entrada.isIntersecting) {
                    this.ultimasEntradas.set(id, entrada);
                } else {
                    this.ultimasEntradas.delete(id);
                }
            });

            // Cancelo cualquier timeout pendiente
            if (this.timeoutActualizacion) {
                clearTimeout(this.timeoutActualizacion);
            }

            // Espero 100ms para que se acumulen todas las actualizaciones
            this.timeoutActualizacion = setTimeout(() => {
                this.procesarSeccionActiva();
            }, 100);
        }, opciones);

        // Observo todas las secciones
        const secciones = document.querySelectorAll('section[id]');
        secciones.forEach(seccion => {
            if (this.observador) {
                this.observador.observe(seccion);
            }
        });
    }

    private programarIconos(): void {
        if (this.iconosPendientes || typeof lucide === 'undefined') {
            return;
        }
        this.iconosPendientes = true;
        const renderizar = () => {
            lucide.createIcons();
            this.iconosPendientes = false;
        };
        const idle = (window as any).requestIdleCallback as IdleCb;
        if (idle) {
            idle(renderizar);
        } else {
            setTimeout(renderizar, 0);
        }
    }

    // Proceso todas las secciones visibles y determino cuál debería estar activa
    private procesarSeccionActiva(): void {
        const seccionesVisibles = Array.from(this.ultimasEntradas.values());
        
        if (seccionesVisibles.length === 0) return;

        // Si solo hay una sección visible, la selecciono directamente
        if (seccionesVisibles.length === 1) {
            const idObjetivo = seccionesVisibles[0].target.id;
            if (idObjetivo && this.seccionActiva !== idObjetivo) {
                this.ngZone.run(() => {
                    this.seccionActiva = idObjetivo;
                    this.sectionTracker.setSeccionActiva(idObjetivo);
                    this.cdr.markForCheck();
                });
            }
            return;
        }

        // Si hay múltiples secciones visibles, uso el algoritmo de puntuación
        let mejorSeccion: IntersectionObserverEntry | null = null;
        let mejorPuntuacion = -Infinity;

        seccionesVisibles.forEach(entrada => {
            const rect = entrada.boundingClientRect;
            const areaVisible = rect.height * entrada.intersectionRatio;
            const distanciaAlTop = Math.abs(rect.top);
            
            const puntuacionArea = areaVisible / 100;
            const puntuacionDistancia = 1000 / (distanciaAlTop + 100);
            const puntuacionTotal = puntuacionArea + puntuacionDistancia;
            
            if (puntuacionTotal > mejorPuntuacion) {
                mejorPuntuacion = puntuacionTotal;
                mejorSeccion = entrada;
            }
        });

        if (mejorSeccion) {
            const idObjetivo = (mejorSeccion as IntersectionObserverEntry).target.id;
            if (idObjetivo && this.seccionActiva !== idObjetivo) {
                this.ngZone.run(() => {
                    this.seccionActiva = idObjetivo;
                    this.sectionTracker.setSeccionActiva(idObjetivo);
                    this.cdr.markForCheck();
                });
            }
        }
    }

    // Verifico si una sección está activa
    estaActiva(idSeccion: string): boolean {
        return this.seccionActiva === idSeccion;
    }

    // Alterno el tema cuando el usuario hace clic en el toggle
    alternarTema(): void {
        this.servicioTema.alternarTema();
    }

    // Navego a una sección específica con scroll suave
    irASeccion(idSeccion: string): void {
        const elemento = document.getElementById(idSeccion);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
