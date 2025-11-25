// HomeComponent: este es el componente principal del portfolio.
// Acá puse todas las secciones (sobre mí, habilidades, experiencia, etc.).
// El efecto de texto animado lo hago con un solo intervalo para reducir timers.
// También está el formulario de contacto integrado.

import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

declare const lucide: any;

@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    formularioContacto: FormGroup;
    enviando = false;

    // Las frases que van rotando en el subtítulo
    private frases = [
        'Estudiante de Desarrollo de Software.',
        'QA y Tester Web en formación.',
        'Apasionado por el aprendizaje.',
        'Enfocado en soporte técnico y automatización.',
        'Futuro desarrollador full stack.'
    ];

    subtituloAnimado = '';
    private indiceFraseActual = 0;
    private indiceLetra = 0;
    private borrando = false;
    private temporizador: any;
    private iconosPendientes = false;
    private intervaloTyped: any;
    private readonly TICK_MS = 45;
    private pausaRestante = 0;
    // Lista de habilidades técnicas con nivel de dominio
    habilidadesTecnicas = [
        { nombre: 'HTML', img: 'assets/img/HTML.png', alt: 'html', nivel: 'Intermedio' },
        { nombre: 'CSS', img: 'assets/img/CSS.png', alt: 'css', nivel: 'Intermedio' },
        { nombre: 'JavaScript', img: 'assets/img/js.png', alt: 'js', nivel: 'Intermedio' },
        { nombre: 'TypeScript', img: 'assets/img/typescript.png', alt: 'typescript', nivel: 'Intermedio' },
        { nombre: 'Angular', img: 'assets/img/angular.png', alt: 'angular', nivel: 'Intermedio' },
        { nombre: 'Node.js', img: 'assets/img/nodejs.png', alt: 'nodejs', nivel: 'Intermedio' },
        { nombre: 'Express', img: 'assets/img/express.png', alt: 'express', nivel: 'Intermedio' },
        { nombre: 'Java', img: 'assets/img/java.png', alt: 'java', nivel: 'Básico' },
        { nombre: 'React', img: 'assets/img/React-Logo-PNG.webp', alt: 'react', nivel: 'Básico' },
        { nombre: 'Git', img: 'assets/img/git.png', alt: 'git', nivel: 'Intermedio' },
        { nombre: 'SQL', img: 'assets/img/sql.png', alt: 'sql', nivel: 'Intermedio' },
        { nombre: 'PostgreSQL', img: 'assets/img/postgresql.svg', alt: 'postgresql', nivel: 'Intermedio' },
        { nombre: 'PHP MyAdmin', img: 'assets/img/PhpMyAdmin_logo.svg', alt: 'phpmyadmin', nivel: 'Intermedio' },
        { nombre: 'UML', img: 'assets/img/UML_logo.png', alt: 'uml', nivel: 'Intermedio' },
        { nombre: 'Jira', img: 'assets/img/jira.png', alt: 'jira', nivel: 'Intermedio' }
    ];
    tarjetaVolteada: string | null = null;

    constructor(
        private constructorFormularios: FormBuilder,
        private servicioApi: ApiService,
        private servicioNotificaciones: NotificationService,
        private cdr: ChangeDetectorRef
    ) {
        // Armo el formulario con sus validaciones
        this.formularioContacto = this.constructorFormularios.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
    }

    ngOnInit(): void {
        this.programarIconos();
    }

    ngAfterViewInit(): void {
        // Arranco la animación del subtítulo con un solo intervalo
        this.iniciarAnimacionTexto();
        // Vuelvo a renderizar los iconos de forma diferida
        this.programarIconos();
    }

    ngOnDestroy(): void {
        // Limpio timers para no dejar procesos colgados
        if (this.temporizador) {
            clearTimeout(this.temporizador);
        }
        if (this.intervaloTyped) {
            clearInterval(this.intervaloTyped);
        }
    }

    // Animación tipo "typed" para el subtítulo (escribir y borrar) usando un solo intervalo
    private iniciarAnimacionTexto(): void {
        if (this.intervaloTyped) {
            clearInterval(this.intervaloTyped);
        }
        const esperaEscritura = 1400;
        const esperaCambio = 400;

        this.intervaloTyped = setInterval(() => {
            if (this.pausaRestante > 0) {
                this.pausaRestante -= this.TICK_MS;
                return;
            }

            const fraseActual = this.frases[this.indiceFraseActual];

            if (!this.borrando) {
                this.subtituloAnimado = fraseActual.substring(0, this.indiceLetra + 1);
                this.indiceLetra++;
                this.cdr.markForCheck();

                if (this.indiceLetra === fraseActual.length) {
                    this.borrando = true;
                    this.pausaRestante = esperaEscritura;
                }
            } else {
                this.subtituloAnimado = fraseActual.substring(0, this.indiceLetra - 1);
                this.indiceLetra--;
                this.cdr.markForCheck();

                if (this.indiceLetra === 0) {
                    this.borrando = false;
                    this.indiceFraseActual = (this.indiceFraseActual + 1) % this.frases.length;
                    this.pausaRestante = esperaCambio;
                }
            }
        }, this.TICK_MS);
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
        const idle = (window as any).requestIdleCallback;
        if (idle) {
            idle(renderizar);
        } else {
            setTimeout(renderizar, 0);
        }
    }

    // Scroll suave a una sección
    irASeccion(idSeccion: string): void {
        const elemento = document.getElementById(idSeccion);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Atajo para acceder a los controles del formulario desde el template
    get f(): { [key: string]: FormControl } {
        return this.formularioContacto.controls as { [key: string]: FormControl };
    }

    // Envío del formulario de contacto
    enviarFormulario(): void {
        // Marco todos los campos como tocados para que se vean los errores
        if (this.formularioContacto.invalid) {
            Object.keys(this.formularioContacto.controls).forEach(campo => {
                this.formularioContacto.controls[campo].markAsTouched();
            });
            this.servicioNotificaciones.showError('Por favor completa todos los campos correctamente.');
            return;
        }

        this.enviando = true;
        const datos = this.formularioContacto.value;

        this.servicioApi.sendContactMessage(datos).subscribe({
            next: (respuesta) => {
                if (respuesta.success) {
                    this.servicioNotificaciones.showSuccess('¡Mensaje enviado con éxito! Te responderé pronto.');
                    this.formularioContacto.reset();
                    // Recargo los iconos después de resetear
                    this.programarIconos();
                } else {
                    this.servicioNotificaciones.showError(respuesta.message || 'Error al enviar el mensaje.');
                }
                this.enviando = false;
            },
            error: (error) => {
                console.error('Error al enviar mensaje:', error);
                this.servicioNotificaciones.showError('Error de conexión. Por favor, intenta de nuevo.');
                this.enviando = false;
            }
        });
    }

    // Volteo de tarjetas de habilidades
    alternarTarjeta(nombre: string): void {
        this.tarjetaVolteada = this.tarjetaVolteada === nombre ? null : nombre;
        this.cdr.markForCheck();
    }

    estaVolteada(nombre: string): boolean {
        return this.tarjetaVolteada === nombre;
    }
}
