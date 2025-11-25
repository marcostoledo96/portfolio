// HomeComponent: este es el componente principal del portfolio.
// Acá puse todas las secciones (sobre mí, habilidades, experiencia, etc.)
// El efecto de texto animado lo hago con setTimeout recursivo.
// También está el formulario de contacto integrado.

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

declare const lucide: any;

@Component({
    selector: 'app-home',
    standalone: false,
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
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

    constructor(
        private constructorFormularios: FormBuilder,
        private servicioApi: ApiService,
        private servicioNotificaciones: NotificationService
    ) {
        // Armo el formulario con sus validaciones
        this.formularioContacto = this.constructorFormularios.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            email: ['', [Validators.required, Validators.email]],
            message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
    }

    ngOnInit(): void {
        // Cargo los iconos de Lucide
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    ngAfterViewInit(): void {
        // Arranco la animación del subtítulo con un delay para evitar el error NG0100
        setTimeout(() => {
            this.animarTexto();
        }, 0);

        // Vuelvo a renderizar los iconos por las dudas
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    }

    ngOnDestroy(): void {
        // Limpio el timeout para no dejar procesos colgados
        if (this.temporizador) {
            clearTimeout(this.temporizador);
        }
    }

    // Animación tipo "typed" para el subtítulo (escribir y borrar)
    private animarTexto(): void {
        const fraseActual = this.frases[this.indiceFraseActual];

        if (!this.borrando) {
            // Modo escritura: voy agregando letras
            this.subtituloAnimado = fraseActual.substring(0, this.indiceLetra + 1);
            this.indiceLetra++;

            if (this.indiceLetra === fraseActual.length) {
                // Terminé de escribir, ahora espero y empiezo a borrar
                this.borrando = true;
                this.temporizador = setTimeout(() => this.animarTexto(), 1200);
            } else {
                this.temporizador = setTimeout(() => this.animarTexto(), 60);
            }
        } else {
            // Modo borrado: voy quitando letras
            this.subtituloAnimado = fraseActual.substring(0, this.indiceLetra - 1);
            this.indiceLetra--;

            if (this.indiceLetra === 0) {
                // Terminé de borrar, paso a la siguiente frase
                this.borrando = false;
                this.indiceFraseActual = (this.indiceFraseActual + 1) % this.frases.length;
                this.temporizador = setTimeout(() => this.animarTexto(), 500);
            } else {
                this.temporizador = setTimeout(() => this.animarTexto(), 40);
            }
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
                    setTimeout(() => {
                        if (typeof lucide !== 'undefined') {
                            lucide.createIcons();
                        }
                    }, 100);
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
}
