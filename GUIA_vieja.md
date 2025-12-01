# GUÍA técnica integral del Portfolio

Esta es mi documentación personal del proyecto. La armé para poder estudiar, recordar decisiones técnicas y defender mi código si me lo piden en una entrevista o demo. Voy línea por línea en las partes más importantes, explicando qué hace cada cosa y por qué lo hice así.

---

## 1) Visión general de la arquitectura

### ¿Qué tecnologías uso y por qué?
**Frontend (Angular 20 + TypeScript):**
Elegí Angular porque me permite organizar el código en componentes reutilizables y servicios. TypeScript me da autocompletado y detecta errores antes de ejecutar. Es una Single Page Application (SPA), lo que significa que cargo una sola página HTML y Angular se encarga de cambiar el contenido sin recargar el navegador.

La estructura es simple:
- Un layout fijo: `sidebar` para escritorio, `header + drawer` para móviles
- Un único componente principal: `HomeComponent` que tiene todas las secciones (sobre mí, proyectos, contacto, etc.)

**Backend (Función serverless en Vercel):**
No tengo un servidor Node.js corriendo 24/7. En cambio, uso una función serverless (`api/index.js`) que solo se ejecuta cuando alguien envía el formulario de contacto. Recibe el POST en `/api/contact` y usa nodemailer para enviarme el email por Gmail. Esto es más barato y simple que mantener un servidor.
---

## 2) Cómo arranca la aplicación Angular

### El punto de entrada: main.ts

Antes de ver el módulo raíz, entiendo cómo Angular inicia todo:

```ts
// frontend/src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)  // Le digo a Angular: "arrancá con AppModule"
  .catch(err => console.error(err));
```

**¿Qué hace esto?**
1. `platformBrowserDynamic()` prepara Angular para ejecutarse en el navegador
2. `.bootstrapModule(AppModule)` busca el módulo raíz y lo inicializa
3. Angular encuentra el selector `<app-root>` en `index.html` y monta ahí mi aplicación

```ts
// frontend/src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IMAGE_CONFIG } from '@angular/common';

// Importo mis componentes
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MobileHeaderComponent } from './core/layout/mobile-header/mobile-header.component';
import { DrawerComponent } from './core/layout/drawer/drawer.component';
import { HomeComponent } from './features/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    // Acá declaro todos los componentes que creé
    // Angular necesita saber qué componentes existen en este módulo
    AppComponent,           // El componente raíz (shell de toda la app)
    SidebarComponent,       // Menú lateral para desktop
    MobileHeaderComponent,  // Header para móviles
    DrawerComponent,        // Menú hamburguesa para móviles
    HomeComponent          // El componente principal con todas las secciones
  ],
  
  imports: [
    // Acá importo módulos de Angular que necesito
    BrowserModule,              // OBLIGATORIO: hace que Angular funcione en el navegador
    BrowserAnimationsModule,    // Habilita animaciones (aunque use pocas, lo necesito para triggers)
    HttpClientModule,           // Me permite hacer peticiones HTTP (para enviar el formulario)
    ReactiveFormsModule,        // Para manejar formularios reactivos (el de contacto)
    AppRoutingModule           // Las rutas de mi aplicación
  ],
  
  providers: [
    // Acá configuro servicios y valores globales
    {
      provide: IMAGE_CONFIG,    // Le digo a Angular cómo manejar imágenes
      useValue: {
        disableImageSizeWarning: true,      // No me molestes con warnings de tamaño
### Sistema de rutas: AppRoutingModule

Angular usa un router para navegar sin recargar la página. Configuré rutas mínimas porque es una SPA simple:

```ts
// frontend/src/app/app-routing.module.ts
### El componente raíz: AppComponent

Este es el "cascarón" de toda la aplicación. Solo monta los componentes de layout y el router.

```ts
// frontend/src/app/app.component.ts
import { Component, OnInit } from '@angular/core';

// Declaro lucide como variable global de JavaScript
// (lo cargo desde un CDN en index.html)
declare const lucide: any;

@Component({
  selector: 'app-root',  // Este es el tag que Angular busca en index.html
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Portfolio - Marcos Ezequiel Toledo';  // Título que aparece en el tab del navegador

  // ngOnInit se ejecuta cuando el componente está listo
  ngOnInit(): void {
    // Verifico que lucide (librería de iconos) se haya cargado desde el CDN
    if (typeof lucide !== 'undefined') {
      // createIcons() busca todos los <i data-lucide="nombre-icono"> y los reemplaza
      // con el SVG correspondiente
      lucide.createIcons();
    }
  }
}
```

**Template del AppComponent:**
```html
<!-- frontend/src/app/app.component.html -->
<!-- Layout para desktop -->
<app-sidebar></app-sidebar>

<!-- Layout para móviles -->
<app-mobile-header></app-mobile-header>
<app-drawer></app-drawer>

<!-- Acá Angular renderiza el componente según la ruta actual -->
<router-outlet></router-outlet>
```

**¿Qué hace `<router-outlet>`?**
Es un placeholder. Angular mira la URL, busca la ruta en `app-routing.module.ts` y renderiza el componente correspondiente en ese lugar. En mi caso, siempre renderiza `HomeComponent`.
    path: '**', 
    redirectTo: '' 
  }  // Cualquier ruta no encontrada, la mando a /
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',  // Recuerda dónde estaba scrolleado
      anchorScrolling: 'enabled'            // Permite navegar a #seccion-id
    })
  ],
  exports: [RouterModule]  // Exporto para que AppModule pueda usarlo
})
export class AppRoutingModule { }
```

**¿Por qué tan pocas rutas?**
Es una SPA de una sola página. Todo el contenido está en `HomeComponent`. Las secciones (sobre mí, proyectos, contacto) son parte del mismo componente, no rutas separadas. Uso `anchorScrolling` para que los links internos (`#sobre-mi`, `#proyectos`) funcionen con scroll suave.
    }
  ],
  
  bootstrap: [AppComponent]  // Le digo a Angular: "cuando arranques, cargá AppComponent"
})
export class AppModule { }
```

**Conceptos clave:**

- **@NgModule**: Es un decorador. En TypeScript, los decoradores son funciones que modifican clases. Este le dice a Angular "esto es un módulo".

- **declarations**: Lista de componentes, directivas y pipes que pertenecen a este módulo. Solo los que están acá pueden usarse en los templates.

- **imports**: Módulos externos que necesito. Por ejemplo, `HttpClientModule` me da el servicio `HttpClient` para hacer peticiones AJAX.

- **providers**: Servicios y configuraciones. En este caso, solo configuro `IMAGE_CONFIG`. Mis servicios (`ThemeService`, etc.) usan `providedIn: 'root'` y no necesitan estar acá.

- **bootstrap**: El componente raíz. Angular lo busca en el HTML y lo monta ahí.     MobileHeaderComponent,
        DrawerComponent,
        HomeComponent
    ],
    imports: [                                          // Módulos base.
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    providers: [                                        // Configuro IMAGE_CONFIG para silenciar warnings por icons pequeños.
        {
            provide: IMAGE_CONFIG,
            useValue: {
                disableImageSizeWarning: true,
                disableImageLazyLoadWarning: true
            }
        }
    ],
    bootstrap: [AppComponent]                           // Punto de entrada de la app.
})
export class AppModule { }
```

### `frontend/src/app/app-routing.module.ts`
- Ruta vacía (`path: ''`) -> `HomeComponent`.
- `path: 'portfolio'` redirige a `''` para mantener single page.
- `path: '**'` redirige a `''` como catch-all.
- `scrollPositionRestoration: 'enabled'` y `anchorScrolling: 'enabled'` para que el navegador recuerde la posición y funcione el scroll a anclas.

### `frontend/src/app/app.component.ts` (shell)
```ts
import { Component, OnInit } from '@angular/core';
declare const lucide: any;                          // Acceso al objeto global de iconos.

@Component({ selector: 'app-root', ... })
export class AppComponent implements OnInit {
    title = 'Portfolio - Marcos Ezequiel Toledo';   // Título base.

    ngOnInit(): void {
        if (typeof lucide !== 'undefined') {        // Si cargó el CDN de Lucide...
            lucide.createIcons();                   // ...renderizo todos los <i data-lucide="...">.
        }
    }
}
```
`app.component.html` solo monta: `<app-sidebar>`, `<app-mobile-header>`, `<app-drawer>` y `<router-outlet>`.

---

## 3) Componentes de Layout explicados a fondo

### Sidebar (menú lateral para desktop)

El sidebar es el menú que se ve siempre a la izquierda en pantallas grandes. Tiene links a las secciones, muestra cuál está activa y permite cambiar el tema.

**Propiedades principales:**
```ts
// frontend/src/app/core/layout/sidebar/sidebar.component.ts
export class SidebarComponent implements OnInit, OnDestroy {
  temaActual: Theme = 'oscuro';        // Tema actual (claro u oscuro)
  seccionActiva: string = 'sobre-mi';  // Qué sección está visible en pantalla
  
  // Subject para desusc
**Propiedades principales:**
```ts
// frontend/src/app/core/layout/sidebar/sidebar.component.ts
export class SidebarComponent implements OnInit, OnDestroy {
  temaActual: Theme = 'oscuro';        // Tema actual (claro u oscuro)
  seccionActiva: string = 'sobre-mi';  // Qué sección está visible en pantalla
  
  // Subject para desuscribirme cuando se destruya el componente
  // Esto evita memory leaks (fugas de memoria)
### Mobile Header (cabecera para móviles)

En pantallas chicas (< 1024px) no muestro el sidebar. En su lugar, muestro un header compacto arriba con:
- Logo MT (que además sirve como botón "volver arriba")
- Toggle de tema
### Drawer (menú deslizable móvil)

El drawer es el menú que se desliza desde la izquierda cuando toco el botón hamburguesa en móviles.

```ts
// frontend/src/app/core/layout/drawer/drawer.component.ts
export class DrawerComponent implements OnInit, OnDestroy {
  drawerAbierto: boolean = false;
  seccionActiva: string = 'sobre-mi';
  private destruir$ = new Subject<void>();
  private observador?: IntersectionObserver;

  constructor(
    private servicioDrawer: DrawerService,
    private zone: NgZone,
    private renderer: Renderer2  // Para manipular el DOM de forma segura
  ) {}

  ngOnInit(): void {
    // Me suscribo al estado del drawer
    this.servicioDrawer.drawerAbierto$
      .pipe(takeUntil(this.destruir$))
      .subscribe(abierto => {
        this.drawerAbierto = abierto;
        
        // Cuando abro el drawer, bloqueo el scroll del body
        if (abierto) {
          this.renderer.addClass(document.body, 'drawer-open');
        } else {
          this.renderer.removeClass(document.body, 'drawer-open');
        }
      });

    // Reutilizo la lógica del IntersectionObserver del sidebar
    this.esperarSeccionesYConfigurarObservador();
  }

  // Escucho clicks en todo el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.drawerAbierto) return;  // Si no está abierto, no hago nada

    const target = event.target as HTMLElement;
    
    // Verifico si el click fue fuera del drawer y del botón toggle
    const dentroDelDrawer = target.closest('.cajon-movil');
    const esBotonToggle = target.closest('.boton-drawer');

    // Si clickeé afuera y no fue el botón, cierro el drawer
    if (!dentroDelDrawer && !esBotonToggle) {
      this.servicioDrawer.cerrar();
    }
  }

  irASeccion(idSeccion: string): void {
    const elemento = document.getElementById(idSeccion);
    
    if (elemento) {
      // Primero navego con scroll suave
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Después cierro el drawer con un pequeño delay
      setTimeout(() => {
        this.servicioDrawer.cerrar();
      }, 300);  // Espero 300ms para que el scroll arranque antes de cerrar
    }
  }
}
```

**¿Qué es `Renderer2`?**
Es un servicio de Angular para manipular el DOM de forma segura. Podría hacer `document.body.classList.add('drawer-open')` directamente, pero Renderer2 funciona también en entornos donde no hay DOM (como Server-Side Rendering). Es buena práctica usarlo.

**¿Por qué bloqueo el scroll?**
Cuando el drawer está abierto, no quiero que el usuario pueda scrollear el contenido de abajo. En CSS tengo:
```scss
body.drawer-open {
  overflow: hidden;  // Bloquea el scroll vertical
}
```
  temaActual: Theme = 'oscuro';
  drawerAbierto: boolean = false;
  mostrarVolverArriba: boolean = false;  // Muestro el botón solo si scrolleé bastante
  
  private destruir$ = new Subject<void>();

  constructor(
    private servicioTema: ThemeService,
    private servicioDrawer: DrawerService,
    private cdr: ChangeDetectorRef  // Para forzar detección con OnPush
  ) {}

  ngOnInit(): void {
    // Me suscribo a ambos servicios
    this.servicioTema.tema$
      .pipe(takeUntil(this.destruir$))
      .subscribe(tema => {
        this.temaActual = tema;
        this.cdr.markForCheck();  // Marco que hay cambios
      });

    this.servicioDrawer.drawerAbierto$
      .pipe(takeUntil(this.destruir$))
      .subscribe(abierto => {
        this.drawerAbierto = abierto;
        this.cdr.markForCheck();
      });
  }

  // Escucho el scroll del window
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Si scrolleé más de 300px, muestro el botón
    this.mostrarVolverArriba = window.scrollY > 300;
    this.cdr.markForCheck();
  }

  volverArriba(): void {
    // Hago scroll suave hasta arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Además navego a la sección sobre-mi por si acaso
    setTimeout(() => {
      const elemento = document.getElementById('sobre-mi');
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  alternarDrawer(): void {
    this.servicioDrawer.alternar();
  }

  alternarTema(): void {
    this.servicioTema.alternarTema();
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
  }
}
```

**¿Qué es `@HostListener('window:scroll')`?**
Es un decorador que me permite escuchar eventos del navegador. En este caso, cada vez que hago scroll, se ejecuta `onWindowScroll()`. Es más limpio que hacer `window.addEventListener('scroll', ...)` manualmente.

**¿Por qué uso `ChangeDetectorRef`?**
El componente usa `ChangeDetectionStrategy.OnPush` (lo configuro en el decorador). Esto significa que Angular solo verifica cambios cuando:
1. Un `@Input()` cambia
2. Un evento del template se dispara
3. Un Observable emite

Como `window.scroll` no es ninguna de esas cosas, Angular no detecta el cambio automáticamente. Por eso llamo `markForCheck()` manualmente.
  
  // Flag para evitar renderizar iconos múltiples veces
  private iconosPendientes = false;

  constructor(
    private servicioTema: ThemeService,  // Inyecto el servicio de tema
    private zone: NgZone                // Para forzar detección de cambios
  ) {}
}
```

**¿Qué es NgZone?**
Angular tiene un sistema de detección de cambios. A veces, cuando modifico cosas desde callbacks de APIs del navegador (como IntersectionObserver), Angular no se entera. `NgZone` me permite decirle "che, revisá que cambió algo".

**Inicialización del componente:**
```ts
ngOnInit(): void {
  // Me suscribo al Observable del tema
  // Cada vez que el tema cambie, actualizo mi variable local
  this.servicioTema.tema$
    .pipe(takeUntil(this.destruir$))  // Me desuscribo automáticamente al destruir
    .subscribe(tema => {
      this.temaActual = tema;
    });

  // Espero a que las secciones estén en el DOM antes de configurar el observer
  this.esperarSeccionesYConfigurarObservador();
}
```

**¿Qué es `takeUntil(this.destruir$)`?**
Es un operador de RxJS. Le digo: "mantené esta suscripción activa hasta que `destruir$` emita un valor". Cuando el componente se destruye, emito en `destruir$` y todas las suscripciones se cancelan automáticamente. Esto previene memory leaks.

**IntersectionObserver: detectando qué sección está visible**

Este es el código más interesante del sidebar. Usa una API del navegador llamada IntersectionObserver para saber qué sección está en pantalla:

```ts
private esperarSeccionesYConfigurarObservador(): void {
  // Uso setTimeout para esperar a que Angular renderice todo
  // (las secciones existen en HomeComponent, no acá)
  setTimeout(() => {
    const secciones = document.querySelectorAll('section[id]');
    
    if (secciones.length === 0) {
      // Si no hay secciones todavía, reintento en 100ms
      setTimeout(() => this.esperarSeccionesYConfigurarObservador(), 100);
      return;
    }

    this.configurarObservadorSecciones(secciones);
  }, 0);
}

private configurarObservadorSecciones(elementosSeccion: NodeListOf<Element>): void {
  // Opciones del IntersectionObserver
  const opciones: IntersectionObserverInit = {
    root: null,  // null = viewport del navegador
    rootMargin: '-20% 0px -60% 0px',  // Ajusto el área de detección
    threshold: 0  // 0 = dispara apenas la sección toca el área
  };

  // Creo el observer
  this.observador = new IntersectionObserver((entradas) => {
    // Este callback se ejecuta cada vez que una sección entra/sale del área
    
    // Filtro solo las que están intersectando (visibles)
    const seccionesVisibles = entradas
      .filter(entrada => entrada.isIntersecting)
      .sort((a, b) => {
        // Ordeno por posición vertical (la más arriba primero)
        const rectA = a.boundingClientRect;
        const rectB = b.boundingClientRect;
        return Math.abs(rectA.top) - Math.abs(rectB.top);
      });

    if (seccionesVisibles.length > 0) {
      const seccionMasVisible = seccionesVisibles[0];
      const idSeccion = seccionMasVisible.target.getAttribute('id');
      
      if (idSeccion && this.seccionActiva !== idSeccion) {
        // Uso NgZone para que Angular detecte el cambio
        this.zone.run(() => {
          this.seccionActiva = idSeccion;
        });
      }
    }
  }, opciones);

  // Observo todas las secciones
  elementosSeccion.forEach(seccion => this.observador!.observe(seccion));
}
```

**¿Qué hace `rootMargin: '-20% 0px -60% 0px'`?**
Imagina el viewport dividido en 3 partes:
- 20% superior: no cuenta
- 20% medio: **ZONA ACTIVA** (acá detecto la sección)
- 60% inferior: no cuenta

Entonces, la sección activa es la que está más cerca del tope de esa zona activa. Por eso ordeno por `Math.abs(rectA.top)`.

**Navegación a secciones:**
```ts
irASeccion(idSeccion: string): void {
  const elemento = document.getElementById(idSeccion);
  
  if (elemento) {
    // scrollIntoView hace scroll suave hasta el elemento
    elemento.scrollIntoView({ 
      behavior: 'smooth',  // Scroll animado
      block: 'start'      // Alinea el elemento al tope del viewport
    });
  }
}
```

**Cambio de tema:**
```ts
alternarTema(): void {
  // Simplemente delego en el servicio
  // El servicio emitirá el nuevo tema y mi suscripción lo detectará
  this.servicioTema.alternarTema();
}
```

**Limpieza al destruir:**
```ts
ngOnDestroy(): void {
  // Emito en destruir$ para cancelar suscripciones
  this.destruir$.next();
  this.destruir$.complete();
  
  // Desconecto el observer para liberar memoria
  if (this.observador) {
    this.observador.disconnect();
  }
}
```

### Mobile header (`core/layout/mobile-header/mobile-header.component.ts`)
- Escucha `ThemeService` y `DrawerService` para mostrar estado del toggle y del menú.
- `@HostListener('window:scroll')` setea `mostrarVolverArriba` cuando `scrollY > 300`.
- `volverArriba()` hace `scrollTo({top:0, behavior:'smooth'})` y además scroll a `sobre-mi` por si falla la primera llamada.

### Drawer (`core/layout/drawer/drawer.component.ts`)
- Se suscribe a `DrawerService.drawerAbierto$` para abrir/cerrar y añade `class drawer-open` al `<body>` para bloquear scroll de fondo.
- Reutiliza la lógica de IntersectionObserver para marcar el link activo.
- `@HostListener('document:click')` cierra el cajón si se hace click fuera del panel y no se tocó el botón toggle.
- `irASeccion(id)` navega con scroll suave y luego `DrawerService.cerrar()`.

---

---

## 4) Servicios: el estado compartido de la aplicación

Los servicios son clases que viven durante toda la vida de la aplicación y me permiten:
1. Compartir datos entre componentes
2. Encapsular lógica de negocio
3. Hacer peticiones HTTP

Uso `@Injectable({ providedIn: 'root' })` que hace que Angular cree una única instancia del servicio (singleton) para toda la app.

### ThemeService: manejo del tema claro/oscuro

Este servicio maneja el tema visual (claro/oscuro), lo persiste en localStorage y lo comparte con todos los componentes.

**Conceptos clave:**
```ts
// frontend/src/app/core/services/theme.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'claro' | 'oscuro';

@Injectable({ providedIn: 'root' })  // Singleton global
export class ThemeService {
  // KEY para localStorage
  private readonly CLAVE_TEMA = 'tema';
  
  // BehaviorSubject: es como una variable que emite cuando cambia
  // La diferencia con Subject es que guarda el último valor
  // Entonces si alguien se suscribe tarde, recibe el valor actual inmediatamente
  private temaActual: BehaviorSubject<Theme>;
  
  // Observable público (solo lectura)
  // Los componentes se suscriben a esto para recibir cambios
  public tema$: Observable<Theme>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Leo el tema guardado en localStorage (o uso 'oscuro' por defecto)
    const temaGuardado = (localStorage.getItem(this.CLAVE_TEMA) as Theme) || 'oscuro';
    
    // Inicializo el BehaviorSubject con el valor guardado
    this.temaActual = new BehaviorSubject<Theme>(temaGuardado);
    
    // Expongo el Observable (sin permitir emitir valores desde afuera)
    this.tema$ = this.temaActual.asObservable();
    
    // Aplico el tema al cargar (agrego/quito la clase CSS)
    this.aplicarTema(temaGuardado);
  }

  // Getter simple: devuelve el tema actual sin suscripciones
  obtenerTemaActual(): Theme {
    return this.temaActual.value;  // .value es la forma de leer un BehaviorSubject
  }

  // Cambio entre claro y oscuro
  alternarTema(): void {
    const nuevoTema: Theme = this.temaActual.value === 'claro' ? 'oscuro' : 'claro';
    this.establecerTema(nuevoTema);
  }

  // Setter: establece un tema específico
  establecerTema(tema: Theme): void {
    // Emito el nuevo valor (todos los suscritos lo reciben)
    this.temaActual.next(tema);
    
    // Actualizo las clases CSS
    this.aplicarTema(tema);
    
    // Guardo en localStorage para que persista
    localStorage.setItem(this.CLAVE_TEMA, tema);
  }

  // Aplica/quita la clase 'claro' en <body> y <html>
  private aplicarTema(tema: Theme): void {
    const body = this.document.body;
    const html = this.document.documentElement;

    if (tema === 'claro') {
      body.classList.add('claro');
      html.classList.add('claro');
    } else {
      body.classList.remove('claro');
      html.classList.remove('claro');
    }
  }
}
```

**¿Por qué inyecto `DOCUMENT`?**
Podría usar `document` directamente (es una variable global de JavaScript), pero inyectar `DOCUMENT` me permite:
1. Testear el servicio más fácilmente (puedo mockear el documento)
2. Funcionar en Server-Side Rendering donde no existe `window.document`

**Flujo completo del cambio de tema:**
1. Usuario toca el botón de tema en sidebar/header
2. El componente llama `servicioTema.alternarTema()`
3. El servicio:
   - Calcula el nuevo tema (opuesto al actual)
   - Emite el nuevo valor con `.next()`
   - Aplica las clases CSS
   - Guarda en localStorage
4. Todos los componentes suscritos a `tema$` reciben el nuevo valor
5. Actualizan su variable local y re-renderizan

### DrawerService: estado del menú móvil

Servicio super simple que solo guarda si el drawer está abierto o cerrado.

```ts
### NotificationService: sistema de notificaciones toast

Este servicio maneja notificaciones tipo "toast" (esos mensajitos que aparecen arriba). Todavía no tengo el componente visual, pero la lógica ya está lista.

```ts
// frontend/src/app/core/services/notification.service.ts
### ApiService: comunicación con el backend

Este servicio maneja las peticiones HTTP al backend. Por ahora solo tiene un método: enviar el formulario de contacto.

```ts
// frontend/src/app/core/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// Interfaces para tipar los datos
export interface DatosContacto {
  name: string;
  email: string;
  message: string;
}

export interface RespuestaApi {
  success: boolean;
  message?: string;
  errors?: string[];
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  // Leo la URL base desde environment
  // En dev y prod es '/api', Vercel lo rutea a la función serverless
  private urlApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendContactMessage(datos: DatosContacto): Observable<RespuestaApi> {
    // Armo la URL completa
    const url = `${this.urlApi}/contact`;
    
    // Headers HTTP
    const encabezados = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // POST request
    // http.post<T>(...) me da un Observable<T>
    // catchError captura errores y los transforma
    return this.http
      .post<RespuestaApi>(url, datos, { headers: encabezados })
      .pipe(
        catchError(this.manejarError)  // Si hay error, ejecuta esto
      );
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente (red, etc)
      mensajeError = `Error: ${error.error.message}`;
    } else {
      // Error del servidor (4xx, 5xx)
      // Intento usar el mensaje del backend si existe
      mensajeError = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }

    console.error('ApiService error:', mensajeError);
    
    // throwError crea un Observable que emite un error
    // () => new Error(...) es la forma moderna (antes era solo throwError(...))
    return throwError(() => new Error(mensajeError));
  }
}
```

**¿Cómo funciona el flujo HTTP?**
1. El componente llama `apiService.sendContactMessage(datos)`
2. El servicio hace un POST a `/api/contact`
3. Vercel rutea eso a la función serverless `api/index.js`
4. La función valida, envía el email y responde con JSON
5. El Observable emite la respuesta
6. El componente la recibe en `.subscribe()` y muestra una notificación

**¿Qué es un Observable?**
Es como una Promesa pero más poderoso:
- Puede emitir múltiples valores (las Promesas solo uno)
- Es lazy (no se ejecuta hasta que alguien se suscribe)
- Puedo cancelar suscripciones
- Tiene operadores tipo `map`, `filter`, `catchError` para transformar datos

En este caso, `http.post()` devuelve un Observable que:
1. Emite la respuesta del servidor (un solo valor)
2. Se completa automáticamente
3. Si hay error, emite un errorhowInfo(mensaje: string, duracion = 5000): void {
    this.agregarNotificacion('info', mensaje, duracion);
  }

  private agregarNotificacion(tipo: Notificacion['tipo'], mensaje: string, duracion: number): void {
    // Genero un ID único con timestamp + random
    const id = `${Date.now()}-${Math.random()}`;
    
    const notificacion: Notificacion = { id, tipo, mensaje, duracion };
    
    // Agrego la notificación a la lista
    const actual = this.notificaciones.value;
    this.notificaciones.next([...actual, notificacion]);
    
    // Programo su eliminación automática
    setTimeout(() => {
      this.eliminarNotificacion(id);
    }, duracion);
  }

  eliminarNotificacion(id: string): void {
    // Filtro la notificación por ID
    const actual = this.notificaciones.value;
    const nuevas = actual.filter(n => n.id !== id);
    this.notificaciones.next(nuevas);
  }
}
```

**Ejemplo de uso en un componente:**
```ts
// Notificación de éxito
this.servicioNotificaciones.showSuccess('Mensaje enviado con éxito!');

// Notificación de error
this.servicioNotificaciones.showError('Error al enviar el mensaje.');

// Notificación con duración custom (10 segundos)
this.servicioNotificaciones.showInfo('Guardando...', 10000);
```
export class DrawerService {
  // Inicializo cerrado (false)
  private estadoDrawer = new BehaviorSubject<boolean>(false);
  
  // Observable público
  public drawerAbierto$: Observable<boolean> = this.estadoDrawer.asObservable();

  // Getter booleano
  estaAbierto(): boolean {
    return this.estadoDrawer.value;
  }

  // Métodos de control
  abrir(): void {
    this.estadoDrawer.next(true);
  }

  cerrar(): void {
    this.estadoDrawer.next(false);
  }

  alternar(): void {
    this.estadoDrawer.next(!this.estadoDrawer.value);
  }
}
```

**¿Por qué un servicio tan simple?**
Podría manejar esto con un `@Output()` del header al drawer, pero el servicio me da ventajas:
1. **Desacoplamiento**: Header y Drawer no se conocen entre sí
2. **Testeable**: Puedo testear cada componente independientemente
3. **Escalable**: Si mañana necesito cerrar el drawer desde otro lugar, ya está listo

### `NotificationService` (`core/services/notification.service.ts`)
- Mantiene un `BehaviorSubject<Notificacion[]>`.
- `showSuccess/showError/showInfo` llaman a `agregarNotificacion` y luego `setTimeout` borra la notificación a los 5s.
- `eliminarNotificacion(id)` filtra la lista.
- (Aún no hay componente de UI, pero están los estilos listos en `styles.scss`).

### `ApiService` (`core/services/api.service.ts`)
```ts
private urlApi = environment.apiUrl;                     // '/api' en dev/prod.

sendContactMessage(datos: DatosContacto): Observable<RespuestaApi> {
    const url = `${this.urlApi}/contact`;                // Endpoint final.
    const encabezados = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<RespuestaApi>(url, datos, { headers: encabezados })
        .pipe(catchError(this.manejarError));            // Manejo centralizado de errores.
}

private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {             // Error de red/cliente.
        mensajeError = `Error: ${error.error.message}`;
    } else {                                             // Error HTTP del server.
        mensajeError = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }
    console.error('ApiService error:', mensajeError);
    return throwError(() => new Error(mensajeError));    // Emite error al subscriber.
}
```

---

## 5) HomeComponent (TypeScript) explicado
Archivo: `frontend/src/app/features/home/home.component.ts`. Es el corazón del portfolio.

### Propiedades y datos base
- `formularioContacto: FormGroup;` + `enviando` para el estado del submit.
- `mostrarVolverArriba`: flag para mostrar el botón del logo MT en mobile.
- `tooltipActivo` + `esMobile`: controlan el doble toque en botones sociales.
- `idiomas`: array de objetos `{ nombre, nivel, detalle, bandera }`.
- `frases`: lista de textos para la animación tipo “typed”.
- Estado del typed: `subtituloAnimado`, `indiceFraseActual`, `indiceLetra`, `borrando`, `intervaloTyped`, `TICK_MS`, `pausaRestante`.
- `habilidadesTecnicas`: array con `nombre`, `img`, `alt`, `nivel`.
- `tarjetaVolteada`: guarda qué tarjeta está dada vuelta.

### Constructor
```ts
constructor(
    private constructorFormularios: FormBuilder,         // Helper para crear el FormGroup.
    private servicioApi: ApiService,                     // Llamadas HTTP.
    private servicioNotificaciones: NotificationService, // Toasts de feedback.
    private cdr: ChangeDetectorRef                       // Forzar detección con OnPush.
) {
    this.formularioContacto = this.constructorFormularios.group({
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });                                                  // FormGroup reactivo con validaciones síncronas.
}
```

### Ciclo de vida
- `ngOnInit()`: llama a `programarIconos()` (render diferido de Lucide), detecta si es mobile y agrega listener a `resize`.
- `ngAfterViewInit()`: arranca la animación del subtítulo (`iniciarAnimacionTexto()`), vuelve a renderizar iconos, configura scroll reveal con `configurarScrollReveal()`.
- `ngOnDestroy()`: limpia `setTimeout`/`setInterval` si quedaron activos.

### Comportamientos clave (métodos explicados línea por línea)
**Detectar mobile y tooltips:**
```ts
private detectarMobile(): void {
    this.esMobile = window.innerWidth <= 768;         // Define umbral mobile.
    if (!this.esMobile) { this.tooltipActivo = null; } // Si dejo de ser mobile, escondo tooltips.
    this.cdr.markForCheck();                          // OnPush: marco para render.
}
```
```ts
manejarClickSocial(event: Event, id: string): void {
    if (!this.esMobile) return;                       // En desktop no hago nada especial.
    if (this.tooltipActivo === id) {                  // Segundo toque:
        this.tooltipActivo = null;                    // cierro tooltip
        this.cdr.markForCheck();
        return;                                       // y dejo que el link navegue.
    }
    event.preventDefault();                           // Primer toque: cancelo navegación,
    this.tooltipActivo = id;                          // muestro tooltip,
    this.cdr.markForCheck();
    setTimeout(() => {                                // y lo oculto si no hay segundo toque en 3s.
        if (this.tooltipActivo === id) {
            this.tooltipActivo = null;
            this.cdr.markForCheck();
        }
    }, 3000);
}
```

**Botón volver arriba (header mobile):**
```ts
@HostListener('window:scroll', [])
onWindowScroll(): void {
    this.mostrarVolverArriba = window.scrollY > 300; // Activo flag si bajé 300px.
    this.cdr.markForCheck();
}

volverArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll suave al top.
}
```

**Scroll reveal con IntersectionObserver:**
```ts
private configurarScrollReveal(): void {
    const opciones = { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('revelado'); // Agrego clase CSS cuando entra.
                observer.unobserve(entrada.target);       // Dejo de observar para no repetir.
            }
        });
    }, opciones);
    const elementosAnimados = document.querySelectorAll('.scroll-reveal');
    elementosAnimados.forEach(el => observer.observe(el)); // Observo todas las secciones marcadas.
}
```

**Animación “typed” con un solo intervalo:**
```ts
private iniciarAnimacionTexto(): void {
    if (this.intervaloTyped) clearInterval(this.intervaloTyped); // Limpio si ya había uno.
    const esperaEscritura = 1400;   // Pausa cuando termino de escribir.
    const esperaCambio = 400;       // Pausa al cambiar de frase.

    this.intervaloTyped = setInterval(() => {
        if (this.pausaRestante > 0) {               // Manejo pausa sin crear otro timer.
            this.pausaRestante -= this.TICK_MS;
            return;
        }
        const fraseActual = this.frases[this.indiceFraseActual];
        if (!this.borrando) {                       // Fase de escritura.
            this.subtituloAnimado = fraseActual.substring(0, this.indiceLetra + 1);
            this.indiceLetra++;
            this.cdr.markForCheck();
            if (this.indiceLetra === fraseActual.length) {
                this.borrando = true;
                this.pausaRestante = esperaEscritura;
            }
        } else {                                    // Fase de borrado.
            this.subtituloAnimado = fraseActual.substring(0, this.indiceLetra - 1);
            this.indiceLetra--;
            this.cdr.markForCheck();
            if (this.indiceLetra === 0) {           // Cuando borré todo, paso a la siguiente frase.
                this.borrando = false;
                this.indiceFraseActual = (this.indiceFraseActual + 1) % this.frases.length;
                this.pausaRestante = esperaCambio;
            }
        }
    }, this.TICK_MS);                               // Tick de 45 ms.
}
```

**Render diferido de iconos Lucide:**
```ts
private programarIconos(): void {
    if (this.iconosPendientes || typeof lucide === 'undefined') return; // Evito duplicar.
    this.iconosPendientes = true;
    const renderizar = () => { lucide.createIcons(); this.iconosPendientes = false; };
    const idle = (window as any).requestIdleCallback;
    idle ? idle(renderizar) : setTimeout(renderizar, 0); // Si hay idle, uso idle; si no, setTimeout.
}
```

**Scroll a secciones y helper de formulario:**
```ts
irASeccion(idSeccion: string): void {
    const elemento = document.getElementById(idSeccion);
    if (elemento) elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

get f(): { [key: string]: FormControl } {           // Atajo para usar f['name'] en el template.
    return this.formularioContacto.controls as { [key: string]: FormControl };
}
```

**Submit del formulario de contacto:**
```ts
enviarFormulario(): void {
    if (this.formularioContacto.invalid) {                     // Si hay errores...
        Object.keys(this.formularioContacto.controls).forEach(campo =>
            this.formularioContacto.controls[campo].markAsTouched()); // marco todos como tocados
        this.servicioNotificaciones.showError('Por favor completa todos los campos correctamente.');
        return;
    }
    this.enviando = true;
    const datos = this.formularioContacto.value;
    this.servicioApi.sendContactMessage(datos).subscribe({     // Llamo al backend.
        next: (respuesta) => {
            if (respuesta.success) {
                this.servicioNotificaciones.showSuccess('Mensaje enviado con éxito! Te responderé pronto.');
                this.formularioContacto.reset();               // Limpio el form.
                this.programarIconos();                        // Vuelvo a renderizar iconos después del reset.
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
```

**Efecto flip en habilidades:**
```ts
alternarTarjeta(nombre: string): void {
    this.tarjetaVolteada = this.tarjetaVolteada === nombre ? null : nombre; // Solo una tarjeta activa.
    this.cdr.markForCheck();
}

estaVolteada(nombre: string): boolean {
    return this.tarjetaVolteada === nombre;
}
```

---

## 6) HomeComponent (HTML) - qué hace cada sección
Archivo: `frontend/src/app/features/home/home.component.html`. Todo es single page; uso clases utilitarias y `.scroll-reveal` para animaciones.

- **Hero (`#sobre-mi`):** título con mi nombre, subtítulo animado (`{{ subtituloAnimado }}` + cursor), descripción con `i18n`, y botones sociales. En mobile los botones usan la lógica de doble toque (tooltip con `tooltipActivo`).
- **Habilidades técnicas (`#habilidades-tecnicas`):** `*ngFor` recorre `habilidadesTecnicas`. Cada tarjeta usa `[class.volteada]` y eventos `(click)`, `(keyup.enter/space)` para accesibilidad. Cara frontal muestra logo, dorso muestra nivel.
- **Habilidades blandas:** tarjetas estáticas con iconos Lucide.
- **Idiomas (`#idiomas`):** `*ngFor` sobre `idiomas`, muestra bandera (flagcdn) + nivel.
- **Experiencia (`#experiencia`):** timeline con un único artículo; iconos y etiquetas para rol, ubicación y fechas.
- **Educación (`#educacion`):** dos tarjetas con estado (En curso/Completado) y promedios.
- **Portfolio (`#portafolio`):** tarjetas de proyectos; cada una tiene portada (`<img>`), insignias de estado (online, desarrollo, etc.), texto, stack y links a demo/repos.
- **Contacto (`#contacto`):** formulario reactivo enlazado con `formGroup`. Uso `[class.input-error]` + `*ngIf` para mensajes de validación. El botón muestra ícono dinámico `data-lucide` según `enviando`. Abajo incluyo bloques de contacto directo (GitHub, LinkedIn, email, CV).
- **Footer:** texto simple de derechos.

---

## 7) Estilos globales (`frontend/src/styles.scss`)
- Archivo único con índice comentado. Uso variables CSS en `:root` para paleta, tamaños y sombras.
- Modo claro/oscuro: la clase `claro` en `<body>` y `<html>` cambia colores base.
- Layout: `.seccion`, `.contenedor`, `.barra-lateral`, `.encabezado-movil`, `.cajon-movil`.
- Componentes: botones (`.boton`, `.primario`), tarjetas (habilidades, blandas, educación, proyectos), insignias, timeline.
- Animaciones: `.scroll-reveal` + clase `.revelado`, keyframes `pulso` para el botón volver arriba.
- Responsive: media queries específicas para 1023px, 768px, 640px, 520px, 400px, 350px, 300px. Ajusto grids, paddings, tamaños de tipografía y comportamientos de drawer.
- Notificaciones: estilos listos para toasts (`.notificaciones-contenedor`) aunque aún no hay componente visible.

---

## 8) Backend serverless (`api/index.js`) explicado
Función que vive en Vercel y responde `/api/contact`.

```js
import nodemailer from 'nodemailer';                      // Cliente SMTP.
import { body, validationResult } from 'express-validator'; // Validaciones de request.

const transporter = nodemailer.createTransport({          // Transporte Gmail.
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Validadores de campos:
const validadores = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email').trim().notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 1000 }).withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
];

const validate = async (req) => {                         // Ejecuta validadores secuencialmente.
  for (const validator of validadores) await validator.run(req);
  return validationResult(req);
};

export default async function handler(req, res) {
  // CORS y preflight:
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  if (req.method !== 'POST') {                            // Solo POST permitido.
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const errors = await validate(req);                     // Valido body.
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => e.msg)
    });
  }

  const { name, email, message } = req.body;
  const mailOptions = {                                   // Armo el email HTML.
    from: process.env.EMAIL_USER,
    to: 'marcostoledo96@gmail.com',
    subject: `Nuevo mensaje de contacto de ${name}`,
    html: `<div>...${message}...</div>`,                  // (Plantilla resumida acá).
    replyTo: email
  };

  try {
    await transporter.sendMail(mailOptions);              // Envío real.
    res.status(200).json({ success: true, message: 'Mensaje enviado con éxito! Te responderé pronto.' });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.' });
  }
}
```
Notas:
- Depende de `EMAIL_USER` y `EMAIL_PASS` en Vercel. En local se puede setear `.env` (está gitignored).
- Habilito CORS amplio porque la SPA puede venir de cualquier origen en dev.

---

## 9) Datos, assets e internacionalización
- **Proyectos parametrizables:** `frontend/src/assets/data/proyectos.json` (editar sin tocar código).
- **Imágenes y CV:** en `frontend/src/assets/img/` y `frontend/src/assets/doc/`.
- **i18n:** Textos marcados con `i18n="@@clave"` en el HTML. Archivos `frontend/src/locale/messages.xlf` (es) y `messages.en.xlf` (en). Comando: `npm run extract-i18n` genera/actualiza XLF.
- **Environment:** `frontend/src/environments/environment.ts` usa `apiUrl: '/api'` tanto en dev como prod; Vercel lo reescribe al serverless local.

---

## 10) Build, deploy y configuración de Vercel
- `vercel.json`:
  - `"installCommand": "cd frontend && npm install"`
  - `"buildCommand": "cd frontend && npm run build"`
  - `"outputDirectory": "frontend/dist/portfolio-frontend/browser"`
  - Rewrites: `/api/:path* -> /api` (función serverless) y todo lo demás a `/index.html` para SPA.
- Scripts útiles:
  - `npm start` (frontend dev en 4200).
  - `npm run build` (prod es).
  - `npm run build:en` / `build:all` para builds con traducciones.
  - `npm run test` para unit tests.

---

## 11) Testing y calidad
- Tests unitarios:
  - `drawer.service.spec.ts`: abre/cierra/alternar + emisiones del observable.
  - `theme.service.spec.ts`: alterna tema, persiste en localStorage, aplica clases a body/html.
  - `api.service.spec.ts`: verifica POST, headers, manejo de errores 500 y de red.
- CI/CD: `.github/workflows/ci.yml` corre en cada push a `main` (instala deps, build, tests).
- Linting: no hay configuración explícita en la raíz, pero Angular CLI ya trae TSLint/Eslint por defecto si se habilita.

---

## 12) Checklist para demo técnica
1. Abrir la app: mostrar layout desktop, luego viewport móvil para el drawer y el botón volver arriba.
2. Alternar tema: demostrar cómo persiste al recargar (localStorage).
3. Mostrar animación typed y scroll reveal (secciones se revelan al bajar).
4. Hacer flip en habilidades y explicar `tarjetaVolteada` (solo una activa).
5. Probar doble toque en botones sociales desde mobile (tooltip).
6. Completar el formulario (happy path) y mostrar mensaje de éxito. Si se quiere, forzar error desconectando red para mostrar manejo de errores.
7. Explicar backend: POST `/api/contact` con validación y envío por nodemailer.
8. Contar cómo parametrizo proyectos desde `assets/data/proyectos.json`.
9. Mencionar i18n: atributo `i18n` + `messages.en.xlf`.
10. Mostrar tests de servicios y pipeline de GitHub Actions.

---

## 13) Privacidad de este archivo en GitHub
GitHub no permite que un archivo individual sea privado dentro de un repo público. Opciones que puedo usar:
- Mantener `GUIA.md` fuera del repo público: agregarlo a `.gitignore` y guardarlo solo en local o en un repositorio privado aparte (por ejemplo, un fork privado o un Gist privado).
- Si ya está trackeado en el repo público, debo eliminarlo del historial público (rewrite) o moverlo a un repo privado; no hay forma de ocultarlo selectivamente.
- Alternativa: crear una rama privada (no publicada) con este archivo, o subirlo a un repo privado separado y enlazarlo solo para mí.

---

Con esto tengo una radiografía completa del proyecto y puedo defender cada pieza, desde el layout y la interacción en Angular hasta el envío de mails en la función serverless y los tests que validan los servicios.
