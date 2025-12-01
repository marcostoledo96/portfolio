// ============================================================================
// HomeComponent: este es el componente principal del portfolio.
// ============================================================================
// Acá puse todas las secciones (sobre mí, habilidades, experiencia, etc.).
// El efecto de texto animado lo hago con un solo intervalo para reducir timers.
// También está el formulario de contacto integrado.
// Agregué scroll reveal para animaciones suaves al hacer scroll.
// Implementé la lógica para que el logo MT en el header sirva para volver arriba.

// === IMPORTS DE ANGULAR ===
// Component: decorador que convierte una clase TypeScript en un componente Angular
// OnInit: interfaz que obliga a tener el método ngOnInit() (se ejecuta al crear el componente)
// AfterViewInit: interfaz para ngAfterViewInit() (se ejecuta después de renderizar el HTML)
// ChangeDetectionStrategy: estrategia de detección de cambios (OnPush = más eficiente)
// OnDestroy: interfaz para ngOnDestroy() (se ejecuta al destruir el componente)
// ChangeDetectorRef: servicio para forzar la detección de cambios manualmente
// HostListener: decorador para escuchar eventos del navegador (scroll, resize, etc.)
import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';

// === IMPORTS DE FORMULARIOS REACTIVOS ===
// FormBuilder: servicio que facilita crear formularios (sin él tendría que hacerlo manualmente)
// FormGroup: representa el formulario completo (contenedor de campos)
// Validators: validadores predefinidos (required, email, minLength, etc.)
// FormControl: representa un solo campo del formulario
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

// === IMPORTS DE MIS SERVICIOS ===
// ApiService: servicio para hacer peticiones HTTP al backend
// NotificationService: servicio para mostrar mensajes de éxito/error al usuario
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

// === DECLARACIÓN DE VARIABLE GLOBAL ===
// 'declare const' le dice a TypeScript: "existe una variable global llamada lucide"
// (la cargo desde un CDN en index.html, por eso no la importo)
// 'any' significa que puede ser de cualquier tipo (TypeScript no valida su estructura)
declare const lucide: any;

// === DECORADOR @Component ===
// El decorador @Component convierte la clase HomeComponent en un componente Angular
// Los decoradores en TypeScript se escriben con @ y modifican la clase que viene después
@Component({
    // selector: el tag HTML donde Angular renderizará este componente
    // Ej: <app-home></app-home> en el HTML se convierte en este componente
    selector: 'app-home',
    
    // standalone: false significa que este componente pertenece a un NgModule
    // (si fuera true, sería un componente standalone que se importa directamente)
    standalone: false,
    
    // templateUrl: ruta al archivo HTML del componente (la vista)
    // También podría usar 'template' para escribir HTML inline, pero prefiero archivo separado
    templateUrl: './home.component.html',
    
    // styleUrls: array de rutas a archivos de estilos (SCSS en este caso)
    // Los estilos acá son "scoped" (solo afectan a este componente)
    styleUrls: ['./home.component.scss'],
    
    // changeDetection: estrategia para detectar cambios en los datos
    // OnPush = solo detecta cambios cuando:
    //   1. Cambia una @Input
    //   2. Se dispara un evento en el template
    //   3. Llamo manualmente a cdr.markForCheck()
    // Es más eficiente que Default (que revisa todo el tiempo)
    changeDetection: ChangeDetectionStrategy.OnPush
})
// export: hace que la clase sea importable desde otros archivos
// implements: obliga a la clase a tener los métodos de las interfaces
// OnInit → debe tener ngOnInit()
// AfterViewInit → debe tener ngAfterViewInit()
// OnDestroy → debe tener ngOnDestroy()
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
    
    // === PROPIEDADES DEL COMPONENTE ===
    
    // FormGroup: tipo de dato que representa el formulario completo
    // El ! le dice a TypeScript "confía en mí, lo inicializo en el constructor"
    formularioContacto: FormGroup;
    
    // boolean: tipo de dato true/false
    // Lo uso para deshabilitar el botón mientras se envía el formulario
    enviando = false;
    
    // Controlo si muestro el botón para volver arriba (cuando scroll > 300px)
    // TypeScript infiere que es boolean porque le asigno false
    mostrarVolverArriba = false;
    
    // Para el tooltip en mobile de los botones sociales
    // string | null = puede ser un string O null (union type)
    // null significa "no hay tooltip activo"
    tooltipActivo: string | null = null;
    
    // private: solo accesible dentro de esta clase (no desde el template HTML)
    // public: accesible desde cualquier lado (por defecto si no especifico)
    private esMobile = false;
    
    // === ARRAY DE OBJETOS ===
    // Idiomas que manejo actualmente
    // Array = lista de elementos (en este caso, objetos con propiedades nombre, nivel, etc.)
    // Cada objeto tiene la estructura: { nombre: string, nivel: string, detalle: string, bandera: string }
    idiomas = [
        { nombre: 'Español', nivel: 'Nativo', detalle: 'Lengua materna', bandera: 'https://flagcdn.com/ar.svg' },
        { nombre: 'Inglés', nivel: 'Básico/Intermedio', detalle: 'Oral básico, lectura intermedia. Estudios en curso.', bandera: 'https://flagcdn.com/us.svg' }
    ];

    // === ARRAY DE STRINGS ===
    // Las frases que van rotando en el subtítulo
    // private: solo accesible dentro de esta clase (no desde el template)
    // TypeScript infiere el tipo: string[] (array de strings)
    private frases = [
        'Estudiante de Desarrollo de Software.',
        'QA y Tester Web en formación.',
        'Apasionado por el aprendizaje.',
        'Enfocado en soporte técnico y automatización.',
        'Futuro desarrollador full stack.'
    ];

    // === VARIABLES PARA LA ANIMACIÓN TYPEWRITER ===
    
    // subtituloAnimado: el texto que se va mostrando letra por letra
    // '' = string vacío (al inicio no muestra nada)
    subtituloAnimado = '';
    
    // indiceFraseActual: índice del array 'frases' (qué frase estoy mostrando)
    // 0 = primera frase, 1 = segunda, etc.
    private indiceFraseActual = 0;
    
    // indiceLetra: posición en la frase actual (qué letra estoy mostrando)
    // Si la frase es "Hola" y indiceLetra = 2, muestro "Ho"
    private indiceLetra = 0;
    
    // borrando: flag que indica si estoy escribiendo o borrando
    // true = borrando, false = escribiendo
    private borrando = false;
    
    // temporizador: referencia al setTimeout (para poder cancelarlo en ngOnDestroy)
    // any = cualquier tipo (en este caso, es un número que devuelve setTimeout)
    private temporizador: any;
    
    // iconosPendientes: flag para evitar renderizar iconos múltiples veces
    private iconosPendientes = false;
    
    // intervaloTyped: referencia al setInterval de la animación typewriter
    private intervaloTyped: any;
    
    // readonly: constante que no se puede modificar después de asignarla
    // TICK_MS: milisegundos entre cada tick de la animación (45ms = ~22 fps)
    private readonly TICK_MS = 45;
    
    // pausaRestante: milisegundos que faltan antes de la próxima acción
    // (pausa al terminar de escribir antes de empezar a borrar)
    private pausaRestante = 0;
    // Lista de habilidades técnicas con nivel de dominio
    habilidadesTecnicas = [
        { nombre: 'HTML', img: 'assets/img/HTML.webp', alt: 'html', nivel: 'Intermedio' },
        { nombre: 'CSS', img: 'assets/img/CSS.webp', alt: 'css', nivel: 'Intermedio' },
        { nombre: 'JavaScript', img: 'assets/img/js.webp', alt: 'js', nivel: 'Intermedio' },
        { nombre: 'TypeScript', img: 'assets/img/typescript.webp', alt: 'typescript', nivel: 'Básico' },
        { nombre: 'Angular', img: 'assets/img/angular.webp', alt: 'angular', nivel: 'Básico' },
        { nombre: 'Node.js', img: 'assets/img/nodejs.webp', alt: 'nodejs', nivel: 'Intermedio' },
        { nombre: 'Express', img: 'assets/img/express.webp', alt: 'express', nivel: 'Básico' },
        { nombre: 'Java', img: 'assets/img/java.webp', alt: 'java', nivel: 'Básico' },
        { nombre: 'React', img: 'assets/img/React-Logo-PNG.webp', alt: 'react', nivel: 'Básico' },
        { nombre: 'Git', img: 'assets/img/git.webp', alt: 'git', nivel: 'Intermedio' },
        { nombre: 'SQL', img: 'assets/img/sql.webp', alt: 'sql', nivel: 'Intermedio' },
        { nombre: 'PHP MyAdmin', img: 'assets/img/PhpMyAdmin_logo.svg', alt: 'phpmyadmin', nivel: 'Intermedio' },
        { nombre: 'PostgreSQL', img: 'assets/img/postgresql.svg', alt: 'postgresql', nivel: 'Básico' },
        { nombre: 'UML', img: 'assets/img/UML_logo.webp', alt: 'uml', nivel: 'Intermedio' },
        { nombre: 'Jira', img: 'assets/img/jira.webp', alt: 'jira', nivel: 'Intermedio' }
    ];
    tarjetaVolteada: string | null = null;

    // === CONSTRUCTOR ===
    // El constructor se ejecuta UNA vez cuando Angular crea el componente
    // Los parámetros con 'private' se convierten automáticamente en propiedades de la clase
    // Esto se llama "Dependency Injection" (Inyección de Dependencias):
    // Angular ve que necesito FormBuilder, ApiService, etc. y me los pasa automáticamente
    constructor(
        // FormBuilder: servicio para crear formularios reactivos fácilmente
        // Sin 'private' tendría que hacer: this.constructorFormularios = constructorFormularios
        private constructorFormularios: FormBuilder,
        
        // ApiService: mi servicio para hacer peticiones HTTP al backend
        private servicioApi: ApiService,
        
        // NotificationService: mi servicio para mostrar mensajes al usuario
        private servicioNotificaciones: NotificationService,
        
        // ChangeDetectorRef: servicio de Angular para forzar la detección de cambios
        // Lo necesito porque uso ChangeDetectionStrategy.OnPush
        private cdr: ChangeDetectorRef
    ) {
        // === INICIALIZACIÓN DEL FORMULARIO ===
        // constructorFormularios.group() crea un FormGroup (formulario completo)
        // Cada propiedad del objeto es un FormControl (un campo del formulario)
        
        this.formularioContacto = this.constructorFormularios.group({
            // Sintaxis: nombreCampo: [valorInicial, [validadoresSíncronos], [validadoresAsíncronos]]
            
            // Campo 'name':
            name: [
                '',  // Valor inicial: string vacío
                [    // Array de validadores síncronos (se ejecutan instantáneamente)
                    Validators.required,           // No puede estar vacío
                    Validators.minLength(2),       // Mínimo 2 caracteres
                    Validators.maxLength(100)      // Máximo 100 caracteres
                ]
            ],
            
            // Campo 'email':
            email: [
                '',
                [
                    Validators.required,           // No puede estar vacío
                    Validators.email               // Debe ser un email válido (tiene @, dominio, etc.)
                ]
            ],
            
            // Campo 'message':
            message: [
                '',
                [
                    Validators.required,           // No puede estar vacío
                    Validators.minLength(10),      // Mínimo 10 caracteres
                    Validators.maxLength(1000)     // Máximo 1000 caracteres
                ]
            ]
        });
    }

    // === MÉTODO ngOnInit ===
    // ngOnInit() es un "lifecycle hook" (gancho del ciclo de vida)
    // Se ejecuta UNA sola vez, después del constructor, cuando el componente está listo
    // Es el lugar ideal para:
    //   - Inicializar datos
    //   - Hacer peticiones HTTP
    //   - Suscribirse a Observables
    // void = no devuelve nada (en JavaScript sería como no poner 'return')
    ngOnInit(): void {
        // Renderizo los iconos de Lucide de forma diferida
        this.programarIconos();
        
        // Detecto si es mobile para el comportamiento de tooltips
        this.detectarMobile();
        
        // addEventListener: API del navegador para escuchar eventos
        // 'resize' = cuando cambia el tamaño de la ventana
        // () => this.detectarMobile() = arrow function (función anónima)
        // Arrow function: () => {} es equivalente a function() {} pero mantiene el 'this'
        window.addEventListener('resize', () => this.detectarMobile());
    }
    
    // === DETECCIÓN DE PANTALLA MÓVIL ===
    // private: solo accesible dentro de esta clase
    private detectarMobile(): void {
        // window.innerWidth: ancho de la ventana del navegador en píxeles
        // <= 768: menor o igual a 768px (punto de quiebre común para mobile)
        // Asigno true o false a this.esMobile
        this.esMobile = window.innerWidth <= 768;
        
        // Si NO es mobile, oculto cualquier tooltip activo
        if (!this.esMobile) {
            this.tooltipActivo = null;  // null = ningún tooltip activo
        }
        
        // cdr.markForCheck(): le digo a Angular "revisá este componente"
        // Necesario porque uso ChangeDetectionStrategy.OnPush
        // Sin esto, Angular no se daría cuenta que esMobile cambió
        this.cdr.markForCheck();
    }
    
    // === MANEJO DE CLICKS EN BOTONES SOCIALES (MOBILE) ===
    // En mobile: primer click muestra tooltip, segundo click abre el link
    // En desktop: funciona normal (un solo click abre el link)
    // Parámetros:
    //   event: Event = objeto del evento click (tiene info como target, preventDefault, etc.)
    //   id: string = identificador único del botón (ej: 'github', 'linkedin')
    manejarClickSocial(event: Event, id: string): void {
        // Si NO es mobile, salgo de la función inmediatamente
        // return; = termina la ejecución de la función (como un 'break' pero para funciones)
        if (!this.esMobile) {
            // En desktop dejo que funcione normal (el link se abre con un click)
            return;
        }
        
        // Si llego acá, ES mobile
        
        // === = comparación estricta (valor Y tipo deben ser iguales)
        // this.tooltipActivo === id = ¿el tooltip activo es este botón?
        if (this.tooltipActivo === id) {
            // Segundo click: dejo que el link funcione y oculto tooltip
            this.tooltipActivo = null;  // null = ningún tooltip activo
            this.cdr.markForCheck();
            // No hago event.preventDefault(), entonces el link funciona normal
            return;
        }
        
        // Si llego acá, es el PRIMER click
        
        // event.preventDefault(): evita el comportamiento por defecto del evento
        // En este caso, evita que el link <a> se abra
        event.preventDefault();
        
        // Activo el tooltip de este botón
        this.tooltipActivo = id;
        this.cdr.markForCheck();
        
        // setTimeout: API del navegador para ejecutar código después de X milisegundos
        // Sintaxis: setTimeout(función, milisegundos)
        // 3000ms = 3 segundos
        setTimeout(() => {
            // Esta arrow function se ejecuta después de 3 segundos
            
            // Verifico si el tooltip TODAVÍA es este (el usuario podría haber hecho click en otro)
            if (this.tooltipActivo === id) {
                // Oculto el tooltip automáticamente
                this.tooltipActivo = null;
                this.cdr.markForCheck();
            }
        }, 3000);  // 3000 milisegundos = 3 segundos
    }

    // === MÉTODO ngAfterViewInit ===
    // ngAfterViewInit() es otro lifecycle hook
    // Se ejecuta DESPUÉS de que Angular renderizó el HTML del componente
    // Es el lugar ideal para:
    //   - Manipular el DOM (document.querySelector, etc.)
    //   - Inicializar librerías de terceros (como Lucide)
    //   - Configurar IntersectionObserver, etc.
    ngAfterViewInit(): void {
        // Arranco la animación del subtítulo con un solo intervalo
        this.iniciarAnimacionTexto();
        
        // Vuelvo a renderizar los iconos de forma diferida
        // (Lucide necesita que el DOM esté listo)
        this.programarIconos();
        
        // Configuro el IntersectionObserver para las animaciones de scroll reveal
        this.configurarScrollReveal();
    }
    
    // === DETECCIÓN DE SCROLL (DECORADOR @HostListener) ===
    // @HostListener: decorador que escucha eventos del DOM
    // 'window:scroll' = evento scroll de la ventana
    // [] = no paso argumentos extra al método
    // Este método se ejecuta CADA vez que hago scroll
    @HostListener('window:scroll', [])
    onWindowScroll(): void {
        // window.scrollY: cuántos píxeles bajé desde el tope de la página
        // > 300: mayor a 300px
        // Si bajé más de 300px, mostrarVolverArriba = true
        // Si estoy arriba (menos de 300px), mostrarVolverArriba = false
        this.mostrarVolverArriba = window.scrollY > 300;
        
        // Fuerzo la detección de cambios (para actualizar la vista)
        this.cdr.markForCheck();
    }
    
    // === SCROLL SUAVE HASTA ARRIBA ===
    // Método llamado cuando hago click en el botón "volver arriba"
    volverArriba(): void {
        // window.scrollTo: API del navegador para hacer scroll
        // Parámetros: { top: posición Y, behavior: 'smooth' o 'auto' }
        window.scrollTo({ 
            top: 0,              // Posición Y = 0 (el tope de la página)
            behavior: 'smooth'   // Scroll animado (en vez de instantáneo)
        });
    }
    
    // Configuro el IntersectionObserver para las animaciones de scroll reveal
    private configurarScrollReveal(): void {
        const opciones = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('revelado');
                    // Una vez revelado, dejo de observar para no repetir la animación
                    observer.unobserve(entrada.target);
                }
            });
        }, opciones);
        
        // Observo todas las secciones y elementos con clase scroll-reveal
        const elementosAnimados = document.querySelectorAll('.scroll-reveal');
        elementosAnimados.forEach(el => observer.observe(el));
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
