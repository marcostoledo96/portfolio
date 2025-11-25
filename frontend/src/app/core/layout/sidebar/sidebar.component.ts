// SidebarComponent: barra lateral fija para pantallas grandes (desktop).
// Acá muestro la foto de perfil, nombre, navegación y el toggle de tema.
// Escucho cambios del ThemeService para sincronizar el botón de tema.
// La navegación usa scroll suave para ir a cada sección.

import { Component, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ThemeService, Theme } from '../../services/theme.service';

declare const lucide: any;

@Component({
    selector: 'app-sidebar',
    standalone: false,
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
    temaActual: Theme = 'oscuro';
    seccionActiva: string = 'sobre-mi';
    private destruir$ = new Subject<void>();
    private observador: IntersectionObserver | null = null;

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
                // Re-renderizo los iconos de Lucide cuando cambia el tema
                if (typeof lucide !== 'undefined') {
                    setTimeout(() => lucide.createIcons(), 0);
                }
            });

        // Inicializo el IntersectionObserver después de que el DOM esté listo
        this.esperarSeccionesYConfigurarObservador();
    }

    // Espero a que las secciones estén en el DOM antes de configurar el observer
    private esperarSeccionesYConfigurarObservador(): void {
        let intentos = 0;
        const maxIntentos = 20; // 2 segundos máximo (20 * 100ms)

        const intervalo = setInterval(() => {
            const secciones = document.querySelectorAll('section[id]');

            if (secciones.length > 0) {
                clearInterval(intervalo);
                console.log(`Secciones cargadas: ${secciones.length}`);
                this.configurarObservadorInterseccion();
            } else if (intentos >= maxIntentos) {
                clearInterval(intervalo);
                console.error('No se encontraron secciones después de 2 segundos');
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
            rootMargin: '-10% 0px -70% 0px',
            threshold: 0.1
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
        console.log(`Secciones observadas: ${secciones.length}`);
        
        secciones.forEach(seccion => {
            if (this.observador) {
                this.observador.observe(seccion);
            }
        });
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
