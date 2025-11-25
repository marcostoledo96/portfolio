// SidebarComponent: barra lateral fija para pantallas grandes (desktop).
// Acá muestro la foto de perfil, nombre, navegación y el toggle de tema.
// Escucho cambios del ThemeService para sincronizar el botón de tema.
// La navegación usa scroll suave para ir a cada sección.

import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';

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

    constructor(
        private servicioTema: ThemeService,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
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
        // Limpio el observer cuando el componente se destruye
        if (this.observador) {
            this.observador.disconnect();
        }
    }

    // Configuro el IntersectionObserver para detectar qué sección está visible
    private configurarObservadorInterseccion(): void {
        const opciones = {
            root: null,
            rootMargin: '-20% 0px -30% 0px',
            threshold: 0.25
        };

        this.observador = new IntersectionObserver((entradas: IntersectionObserverEntry[]) => {
            // Encuentro la entrada con mayor intersectionRatio (la más visible)
            let ratioMaximo = 0;
            let entradaMasVisible: IntersectionObserverEntry | null = null;

            entradas.forEach(entrada => {
                if (entrada.isIntersecting && entrada.intersectionRatio > ratioMaximo) {
                    ratioMaximo = entrada.intersectionRatio;
                    entradaMasVisible = entrada;
                }
            });

            if (entradaMasVisible) {
                const idObjetivo = (entradaMasVisible as IntersectionObserverEntry).target.id;
                if (idObjetivo) {
                    // Ejecuto dentro de NgZone para que Angular detecte el cambio
                    this.ngZone.run(() => {
                        this.seccionActiva = idObjetivo;
                        this.cdr.markForCheck();
                    });
                }
            }
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
