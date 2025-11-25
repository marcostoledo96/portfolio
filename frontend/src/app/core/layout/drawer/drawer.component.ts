// DrawerComponent: panel deslizable lateral que muestra el menú en mobile.
// Yo controlo su estado desde DrawerService y cierro el drawer cuando el usuario
// selecciona una sección o hace clic fuera del panel.

import { Component, OnInit, OnDestroy, HostListener, ElementRef, NgZone, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DrawerService } from '../../services/drawer.service';

@Component({
    selector: 'app-drawer',
    standalone: false,
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit, OnDestroy {
    estaAbierto = false;
    seccionActiva: string = 'sobre-mi';
    private destroy$ = new Subject<void>();
    private observador: IntersectionObserver | null = null;

    constructor(
        private drawerService: DrawerService,
        private elementRef: ElementRef,
        private ngZone: NgZone,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Me suscribo al estado del drawer
        this.drawerService.drawerAbierto$
            .pipe(takeUntil(this.destroy$))
            .subscribe((abierto: boolean) => {
                this.estaAbierto = abierto;
                // Agrego o quito la clase en body para bloquear scroll cuando el drawer está abierto
                if (abierto) {
                    document.body.classList.add('drawer-open');
                } else {
                    document.body.classList.remove('drawer-open');
                }
            });

        // Inicializo el IntersectionObserver después de que el DOM esté listo
        this.esperarSeccionesYConfigurarObservador();
    }

    // Espero a que las secciones estén en el DOM antes de configurar el observer
    private esperarSeccionesYConfigurarObservador(): void {
        let intentos = 0;
        const maxIntentos = 20;

        const intervaloChequeo = setInterval(() => {
            const secciones = document.querySelectorAll('section[id]');

            if (secciones.length > 0) {
                clearInterval(intervaloChequeo);
                this.configurarObservadorInterseccion();
            } else if (intentos >= maxIntentos) {
                clearInterval(intervaloChequeo);
            }

            intentos++;
        }, 100);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        document.body.classList.remove('drawer-open');
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
            let maxRatio = 0;
            let entradaMasVisible: IntersectionObserverEntry | null = null;

            entradas.forEach(entrada => {
                if (entrada.isIntersecting && entrada.intersectionRatio > maxRatio) {
                    maxRatio = entrada.intersectionRatio;
                    entradaMasVisible = entrada;
                }
            });

            if (entradaMasVisible) {
                const idObjetivo = (entradaMasVisible as IntersectionObserverEntry).target.id;
                if (idObjetivo) {
                    // Ejecuto dentro de NgZone para que Angular detecte el cambio correctamente
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

    // Verifico si una sección está activa
    estaActiva(idSeccion: string): boolean {
        return this.seccionActiva === idSeccion;
    }

    // Cierro el drawer cuando hago clic en una sección
    irASeccion(idSeccion: string): void {
        const elemento = document.getElementById(idSeccion);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.drawerService.cerrar();
    }

    // Cierro el drawer cuando hago clic fuera de él
    @HostListener('document:click', ['$event'])
    onDocumentClick(evento: MouseEvent): void {
        const clicDentro = this.elementRef.nativeElement.contains(evento.target);
        const clicEnToggle = (evento.target as HTMLElement).closest('.boton-icono');

        if (this.estaAbierto && !clicDentro && !clicEnToggle) {
            this.drawerService.cerrar();
        }
    }
}
