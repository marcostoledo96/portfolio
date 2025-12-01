# GUÍA Técnica Integral del Portfolio

Esta es mi documentación personal del proyecto. La armé para estudiar, recordar decisiones técnicas y poder explicar mi código en entrevistas o demos. Voy línea por línea en las partes importantes, explicando qué hace cada cosa y por qué lo hice así.

---

## Tabla de Contenidos

1. [Visión General de la Arquitectura](#1-visión-general-de-la-arquitectura)
2. [Cómo Arranca la Aplicación Angular](#2-cómo-arranca-la-aplicación-angular)
3. [Componentes de Layout](#3-componentes-de-layout)
4. [Servicios: Estado Compartido](#4-servicios-estado-compartido)
5. [HomeComponent: El Corazón del Portfolio](#5-homecomponent-el-corazón-del-portfolio)
6. [Formularios Reactivos en Profundidad](#6-formularios-reactivos-en-profundidad)
7. [Backend Serverless con Node.js](#7-backend-serverless-con-nodejs)
8. [Estilos SCSS y Variables CSS](#8-estilos-scss-y-variables-css)
9. [Internacionalización (i18n)](#9-internacionalización-i18n)
10. [Testing Unitario](#10-testing-unitario)
11. [Build y Deployment en Vercel](#11-build-y-deployment-en-vercel)
12. [Checklist para Defender el Proyecto](#12-checklist-para-defender-el-proyecto)

---

## 1) Visión General de la Arquitectura

### ¿Qué es este proyecto?

Es un portfolio personal hecho con Angular 20. Es una **Single Page Application (SPA)**, lo que significa que cargo una sola página HTML y JavaScript se encarga de cambiar el contenido dinámicamente sin recargar el navegador.

**Ventajas de una SPA:**
- Navegación instantánea (no hay recarga de página)
- Animaciones suaves entre secciones
- Menor carga en el servidor (solo sirve archivos estáticos)

### ¿Por qué elegí Angular?

**Angular vs JavaScript Vanilla:**
- Angular me da **componentes reutilizables**: en vez de tener un HTML gigante, divido la interfaz en piezas pequeñas (sidebar, header, formulario, etc.)
- **TypeScript**: detecta errores mientras escribo código (antes de ejecutarlo)
- **Servicios**: me permite compartir datos entre componentes fácilmente
- **Formularios reactivos**: validaciones automáticas y manejo del estado del formulario

**Angular vs React:**
- Angular incluye todo (routing, formularios, HTTP) sin instalar librerías extras
- TypeScript es obligatorio (me fuerza a escribir código más seguro)
- Tiene una estructura clara: sé dónde poner cada cosa

### Arquitectura General

```
FRONTEND (Angular 20)
├── AppComponent (shell raíz)
├── Layout (sidebar, header, drawer)
├── HomeComponent (todas las secciones)
└── Servicios (theme, drawer, api, notifications)

BACKEND (Node.js Serverless)
└── api/index.js (función que envía emails)

ESTILOS
└── styles.scss (un solo archivo con todo el CSS)

INTERNACIONALIZACIÓN
├── messages.xlf (español)
└── messages.en.xlf (inglés)
```

### Tecnologías y por qué las uso

**TypeScript en vez de JavaScript:**
```ts
// JavaScript (sin tipos)
function sumar(a, b) {
  return a + b;
}
sumar(5, "10");  // "510" 😱 JavaScript concatena en vez de sumar

// TypeScript (con tipos)
function sumar(a: number, b: number): number {
  return a + b;
}
sumar(5, "10");  // ❌ ERROR en tiempo de desarrollo! TypeScript me avisa
```

**RxJS y Observables:**
Los Observables son como "canales de datos" donde puedo suscribirme para recibir actualizaciones.

```ts
// Sin Observables: tengo que preguntar manualmente si cambió
let tema = 'oscuro';
setInterval(() => {
  if (tema !== temaAnterior) {
    // Hago algo
  }
}, 100);

// Con Observables: me avisan automáticamente cuando cambia
tema$.subscribe(nuevoTema => {
  // Se ejecuta automáticamente cada vez que cambia el tema
  console.log('Tema cambió a:', nuevoTema);
});
```

**SCSS en vez de CSS:**
```scss
// SCSS permite variables
$color-primario: #007bff;
$espaciado: 16px;

.boton {
  color: $color-primario;
  padding: $espaciado;
  
  // Puedo anidar selectores (más legible)
  &:hover {
    opacity: 0.8;
  }
  
  .icono {
    margin-right: 8px;
  }
}

// Se compila a CSS normal:
// .boton { color: #007bff; padding: 16px; }
// .boton:hover { opacity: 0.8; }
// .boton .icono { margin-right: 8px; }
```

**Vercel Serverless Functions:**
No tengo un servidor Node.js corriendo 24/7. En vez de eso, tengo una función que solo se ejecuta cuando alguien envía el formulario.

```
Usuario envía formulario
  ↓
Vercel activa la función
  ↓
La función envía el email
  ↓
La función responde al usuario
  ↓
Vercel apaga la función
```

Esto es más barato (solo pago cuando se usa) y no tengo que preocuparme por mantener un servidor.

---

## 2) Cómo Arranca la Aplicación Angular

### El flujo completo de inicio

```
1. El navegador carga index.html
   ↓
2. index.html carga los archivos JavaScript de Angular
   ↓
3. main.ts arranca Angular
   ↓
4. Angular busca <app-root> en el HTML
   ↓
5. Angular renderiza AppComponent ahí
   ↓
6. AppComponent monta Sidebar, Header, Drawer y Router
   ↓
7. Router renderiza HomeComponent
   ↓
8. ¡La aplicación está lista!
```

### index.html - La página base

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Portfolio - Marcos Ezequiel Toledo</title>
  <base href="/">
  
  <!-- Esto le dice a Angular dónde está la raíz de la app -->
  <!-- Por ejemplo, si mi sitio está en example.com/portfolio/
       pongo <base href="/portfolio/"> -->
  
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- viewport hace que el sitio sea responsive en móviles -->
  
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  
  <!-- Cargo la librería de iconos desde un CDN -->
  <!-- CDN = Content Delivery Network (servidor externo rápido) -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  
  <!-- Google Analytics (comentado, para activar poner el ID real) -->
  <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script> -->
</head>
<body>
  <!-- Este es el punto de entrada de Angular -->
  <app-root></app-root>
  
  <!-- Angular busca este tag y renderiza AppComponent ahí -->
  <!-- Si JavaScript está deshabilitado, se muestra el mensaje de abajo -->
  
  <noscript>
    Por favor habilita JavaScript para ver esta aplicación.
  </noscript>
</body>
</html>
```

### main.ts - El arranque de Angular

```ts
/// <reference types="@angular/localize" />
// Esta línea le dice a TypeScript que use los tipos de @angular/localize
// (necesario para i18n - internacionalización)

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// platformBrowserDynamic prepara Angular para correr en el navegador
// (existe también platformServer para Server-Side Rendering)

import { AppModule } from './app/app.module';
// Importo el módulo raíz de mi aplicación

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  // Le digo a Angular: "arrancá con AppModule"
  // Angular lee AppModule, ve que bootstrap: [AppComponent],
  // y renderiza AppComponent en <app-root>
  
  .catch(err => console.error(err));
  // Si algo sale mal al arrancar, muestro el error en consola
```

**¿Qué es un Módulo en Angular?**

Un módulo es como una "caja" que agrupa componentes, servicios y configuraciones relacionadas.

```ts
@NgModule({
  declarations: [Componente1, Componente2],  // Componentes de este módulo
  imports: [OtroModulo, HttpClientModule],   // Módulos que necesito
  providers: [Servicio1],                    // Servicios disponibles
  bootstrap: [AppComponent]                  // Componente inicial (solo en el módulo raíz)
})
export class AppModule { }
```

### AppModule - El módulo raíz

```ts
import { NgModule } from '@angular/core';
// NgModule es un decorador (una función que modifica una clase)
// Los decoradores en TypeScript empiezan con @

import { BrowserModule } from '@angular/platform-browser';
// BrowserModule es OBLIGATORIO en el módulo raíz
// Habilita funcionalidades básicas para que Angular funcione en el navegador
// Incluye cosas como *ngIf, *ngFor, etc.

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Habilita animaciones de Angular (aunque uso pocas)
// Sin esto, las transiciones y animaciones no funcionan

import { HttpClientModule } from '@angular/common/http';
// Me da el servicio HttpClient para hacer peticiones HTTP
// Sin esto, no puedo hacer llamadas AJAX (como fetch en JavaScript)

import { ReactiveFormsModule } from '@angular/forms';
// Para formularios reactivos (como el de contacto)
// Existe también FormsModule (template-driven), pero prefiero reactivos

import { IMAGE_CONFIG } from '@angular/common';
// Para configurar cómo Angular maneja imágenes

import { SidebarComponent } from './core/layout/sidebar/sidebar.component';
import { MobileHeaderComponent } from './core/layout/mobile-header/mobile-header.component';
import { DrawerComponent } from './core/layout/drawer/drawer.component';
import { HomeComponent } from './features/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    // Acá declaro TODOS los componentes que creé
    // Si no están acá, Angular no los reconoce y tira error
    AppComponent,
    SidebarComponent,
    MobileHeaderComponent,
    DrawerComponent,
    HomeComponent
  ],
  
  imports: [
    // Módulos que necesito importar
    BrowserModule,              // SIEMPRE va primero en el módulo raíz
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule            // El módulo de rutas SIEMPRE va último
  ],
  
  providers: [
    // Servicios y configuraciones globales
    {
      provide: IMAGE_CONFIG,
      // Esto le dice a Angular: "cuando alguien pida IMAGE_CONFIG,
      // dale este objeto que está en useValue"
      
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true
      }
      
      // ¿Por qué deshabilito warnings de imágenes?
      // Uso logos de tecnologías pequeños (50x50px) a propósito
      // Angular por defecto dice "esta imagen es muy chica, usa una más grande"
      // Como es intencional, desactivo el warning
    }
  ],
  
  bootstrap: [AppComponent]
  // Le digo a Angular: "cuando arranques, renderizá AppComponent"
  // Solo el módulo raíz tiene bootstrap
})
export class AppModule { }
```

**Concepto: Dependency Injection (Inyección de Dependencias)**

Cuando pongo un servicio en el constructor, Angular automáticamente me lo da:

```ts
// Sin Dependency Injection (manual)
class MiComponente {
  private apiService: ApiService;
  
  constructor() {
    this.apiService = new ApiService();  // Yo creo la instancia
  }
}

// Con Dependency Injection (Angular)
class MiComponente {
  constructor(private apiService: ApiService) {
    // Angular ve que necesito ApiService y me lo pasa automáticamente
    // Además, me da LA MISMA instancia en todos lados (singleton)
  }
}
```

### AppRoutingModule - Sistema de rutas

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

// Defino las rutas de mi aplicación
const routes: Routes = [
  {
    path: '',               // Ruta raíz (http://miapp.com/)
    component: HomeComponent  // Muestro HomeComponent
  },
  
  {
    path: 'portfolio',      // http://miapp.com/portfolio
    redirectTo: '',         // Redirijo a la ruta raíz
    pathMatch: 'full'       // Solo si la ruta coincide exactamente
  },
  
  {
    path: '**',             // ** = cualquier ruta no definida arriba
    redirectTo: ''          // Redirijo a la ruta raíz (404 friendly)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // forRoot se usa en el módulo raíz
      // forChild se usaría en módulos de features (no tengo en este proyecto)
      
      scrollPositionRestoration: 'enabled',
      // Recuerda la posición del scroll al navegar
      // Si voy de /proyectos a /contacto y vuelvo, 
      // me lleva a la misma posición donde estaba
      
      anchorScrolling: 'enabled'
      // Permite navegar a elementos con ID
      // Ejemplo: <a href="#sobre-mi"> hace scroll a <section id="sobre-mi">
    })
  ],
  exports: [RouterModule]
  // Exporto RouterModule para que AppModule pueda usar <router-outlet>
})
export class AppRoutingModule { }
```

**¿Por qué tan pocas rutas?**

Es una SPA de una sola página. Todo el contenido (sobre mí, proyectos, experiencia, contacto) está en `HomeComponent`. No son páginas separadas, son secciones del mismo componente.

**¿Cómo funciona el routing entonces?**

```html
<!-- app.component.html -->
<router-outlet></router-outlet>

<!-- Angular mira la URL, busca la ruta en AppRoutingModule
     y renderiza el componente correspondiente aquí -->
```

Si la URL es `http://miapp.com/` → renderiza `HomeComponent`
Si la URL es `http://miapp.com/asdfgh` → redirige a `/` → renderiza `HomeComponent`

### AppComponent - El componente raíz

```ts
import { Component, OnInit } from '@angular/core';

// Declaro que existe una variable global llamada 'lucide'
// (la cargo desde el CDN en index.html)
// 'any' significa "puede ser de cualquier tipo"
declare const lucide: any;

@Component({
  selector: 'app-root',
  // Este es el tag que Angular busca en index.html
  // <app-root></app-root>
  
  templateUrl: './app.component.html',
  // Ruta al archivo HTML del componente
  
  styleUrls: ['./app.component.scss']
  // Ruta al archivo de estilos (puede ser un array de varios archivos)
})
export class AppComponent implements OnInit {
  // implements OnInit es una "interfaz"
  // Me obliga a tener el método ngOnInit()
  
  title = 'Portfolio - Marcos Ezequiel Toledo';
  // Esta propiedad aparece en el <title> del navegador
  
  ngOnInit(): void {
    // ngOnInit se ejecuta UNA sola vez cuando el componente se crea
    // Es como componentDidMount en React
    
    // Verifico que lucide se haya cargado desde el CDN
    if (typeof lucide !== 'undefined') {
      // createIcons() busca todos los <i data-lucide="nombre-icono">
      // y los reemplaza con el SVG del ícono
      lucide.createIcons();
      
      // Ejemplo:
      // <i data-lucide="home"></i>
      // se convierte en:
      // <svg class="lucide lucide-home">...</svg>
    }
  }
}
```

**Template del AppComponent:**

```html
<!-- app.component.html -->

<!-- Layout para desktop (visible solo en pantallas > 1024px) -->
<app-sidebar></app-sidebar>

<!-- Layout para móviles (visible solo en pantallas < 1024px) -->
<app-mobile-header></app-mobile-header>
<app-drawer></app-drawer>

<!-- Acá Angular renderiza el componente según la ruta -->
<router-outlet></router-outlet>

<!-- Como solo tengo una ruta (HomeComponent),
     siempre renderiza HomeComponent acá -->
```

**¿Cómo funciona la visibilidad responsive?**

No uso *ngIf para ocultar/mostrar. Uso CSS puro (más eficiente):

```scss
// En styles.scss

.barra-lateral {  // Sidebar
  display: flex;
  
  @media (max-width: 1023px) {
    display: none;  // Oculto en móviles
  }
}

.encabezado-movil {  // Header
  display: none;
  
  @media (max-width: 1023px) {
    display: flex;  // Muestro en móviles
  }
}
```

---

## 3) Componentes de Layout

Los componentes de layout son el "esqueleto" de la aplicación. Se renderizan una sola vez y siempre están ahí.

### Sidebar - Menú lateral (desktop)

El sidebar es la barra lateral izquierda que se ve en pantallas grandes. Tiene:
- Logo y nombre
- Links a las secciones
- Botón de cambio de tema
- Indicador de sección activa

**Archivo:** `frontend/src/app/core/layout/sidebar/sidebar.component.ts`

```ts
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService, Theme } from '../../services/theme.service';

declare const lucide: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  
  // === PROPIEDADES ===
  
  temaActual: Theme = 'oscuro';
  // Tema actual ('claro' o 'oscuro')
  // Lo uso en el template para mostrar el ícono correcto en el toggle
  
  seccionActiva: string = 'sobre-mi';
  // Qué sección está visible en pantalla
  // Lo uso para agregar la clase 'activo' al link correspondiente
  
  private destruir$ = new Subject<void>();
  // Subject para cancelar suscripciones cuando el componente se destruya
  // Previene memory leaks
  
  private observador?: IntersectionObserver;
  // El IntersectionObserver que detecta qué sección está en pantalla
  
  private iconosPendientes = false;
  // Flag para evitar renderizar iconos múltiples veces

  constructor(
    private servicioTema: ThemeService,
    // Inyecto el servicio de tema
    
    private zone: NgZone
    // NgZone me permite forzar la detección de cambios de Angular
    // Lo necesito porque IntersectionObserver es una API del navegador
    // y Angular no detecta automáticamente sus cambios
  ) {}

  ngOnInit(): void {
    // === SUSCRIPCIÓN AL TEMA ===
    
    this.servicioTema.tema$
      // tema$ es un Observable que emite cuando el tema cambia
      
      .pipe(takeUntil(this.destruir$))
      // takeUntil cancela la suscripción cuando destruir$ emite
      // Es equivalente a hacer unsubscribe() en ngOnDestroy,
      // pero más elegante y automático
      
      .subscribe(tema => {
        this.temaActual = tema;
        // Actualizo mi variable local cada vez que cambia el tema
      });

    // === CONFIGURACIÓN DEL INTERSECTION OBSERVER ===
    
    this.esperarSeccionesYConfigurarObservador();
    // Las secciones están en HomeComponent, no en Sidebar
    // Entonces espero a que se rendericen antes de observarlas
  }

  private esperarSeccionesYConfigurarObservador(): void {
    // Uso setTimeout con 0ms para esperar al siguiente "tick"
    // del event loop de JavaScript
    // Esto asegura que Angular ya renderizó HomeComponent
    
    setTimeout(() => {
      // Busco todas las secciones con atributo [id]
      const secciones = document.querySelectorAll('section[id]');
      
      if (secciones.length === 0) {
        // Si no hay secciones todavía, reintento en 100ms
        setTimeout(() => this.esperarSeccionesYConfigurarObservador(), 100);
        return;
      }

      // Ya hay secciones! Configuro el observer
      this.configurarObservadorSecciones(secciones);
    }, 0);
  }

  private configurarObservadorSecciones(
    elementosSeccion: NodeListOf<Element>
  ): void {
    
    // === OPCIONES DEL INTERSECTION OBSERVER ===
    
    const opciones: IntersectionObserverInit = {
      root: null,
      // null = uso el viewport del navegador como "contenedor"
      // Si pusiera un elemento específico, usaría ese
      
      rootMargin: '-20% 0px -60% 0px',
      // Ajusto el área de detección
      // Formato: top right bottom left (como margin en CSS)
      // -20% arriba = ignoro el 20% superior del viewport
      // -60% abajo = ignoro el 60% inferior del viewport
      // Entonces solo detecto en el 20% del medio
      
      threshold: 0
      // threshold = qué % del elemento debe estar visible
      // 0 = apenas toca el área
      // 0.5 = 50% visible
      // 1 = 100% visible
    };

    // === CREO EL OBSERVER ===
    
    this.observador = new IntersectionObserver((entradas) => {
      // Este callback se ejecuta cada vez que
      // un elemento entra/sale del área de detección
      
      // entradas es un array con info de todos los elementos observados
      
      // Filtro solo las que están intersectando (visibles)
      const seccionesVisibles = entradas
        .filter(entrada => entrada.isIntersecting)
        // isIntersecting = true si está en el área
        
        .sort((a, b) => {
          // Ordeno por posición vertical
          // La sección más arriba es la "activa"
          
          const rectA = a.boundingClientRect;
          const rectB = b.boundingClientRect;
          // boundingClientRect tiene top, bottom, left, right, etc.
          
          return Math.abs(rectA.top) - Math.abs(rectB.top);
          // La que tenga menor |top| está más arriba
        });

      if (seccionesVisibles.length > 0) {
        const seccionMasVisible = seccionesVisibles[0];
        const idSeccion = seccionMasVisible.target.getAttribute('id');
        
        if (idSeccion && this.seccionActiva !== idSeccion) {
          // Uso NgZone para que Angular detecte el cambio
          this.zone.run(() => {
            this.seccionActiva = idSeccion;
            // Angular ahora sabe que cambió y actualiza la vista
          });
        }
      }
    }, opciones);

    // Observo todas las secciones
    elementosSeccion.forEach(seccion => {
      this.observador!.observe(seccion);
      // ! le dice a TypeScript "confía en mí, observador existe"
    });
  }

  irASeccion(idSeccion: string): void {
    // Método llamado cuando hago click en un link del menú
    
    const elemento = document.getElementById(idSeccion);
    
    if (elemento) {
      elemento.scrollIntoView({
        behavior: 'smooth',  // Scroll animado (no instantáneo)
        block: 'start'       // Alinea el elemento al tope del viewport
      });
    }
  }

  alternarTema(): void {
    // Método llamado cuando hago click en el botón de tema
    
    // Simplemente delego en el servicio
    this.servicioTema.alternarTema();
    
    // El servicio emite el nuevo tema
    // Mi suscripción en ngOnInit lo detecta
    // Y actualiza this.temaActual
  }

  programarIconos(): void {
    // Renderiza los iconos de Lucide de forma diferida
    // (sin bloquear el hilo principal)
    
    if (this.iconosPendientes || typeof lucide === 'undefined') {
      return;  // Ya están pendientes o Lucide no cargó
    }
    
    this.iconosPendientes = true;
    
    const renderizar = () => {
      lucide.createIcons();
      this.iconosPendientes = false;
    };
    
    // requestIdleCallback ejecuta la función cuando el navegador
    // esté "idle" (sin hacer nada importante)
    const idle = (window as any).requestIdleCallback;
    
    if (idle) {
      idle(renderizar);
    } else {
      // Si el navegador no soporta requestIdleCallback,
      // uso setTimeout con delay 0
      setTimeout(renderizar, 0);
    }
  }

  ngOnDestroy(): void {
    // Se ejecuta cuando el componente se destruye
    
    // Emito en destruir$ para cancelar todas las suscripciones
    this.destruir$.next();
    this.destruir$.complete();
    
    // Desconecto el IntersectionObserver
    if (this.observador) {
      this.observador.disconnect();
    }
  }
}
```

**Template del Sidebar:**

```html
<!-- sidebar.component.html -->
<aside class="barra-lateral">
  <div class="contenedor-barra">
    
    <!-- Logo y nombre -->
    <div class="perfil">
      <div class="logo-contenedor">
        <span class="logo-texto">MT</span>
      </div>
      <h2 class="nombre">Marcos Toledo</h2>
      <p class="rol tenue">Desarrollador Full Stack Jr.</p>
    </div>

    <!-- Navegación -->
    <nav class="nav-principal">
      <ul>
        <li>
          <a
            (click)="irASeccion('sobre-mi')"
            [class.activo]="seccionActiva === 'sobre-mi'"
            class="link-nav"
          >
            <!-- (click) = evento click
                 [class.activo] = agrega clase 'activo' si la condición es true -->
            
            <i data-lucide="user"></i>
            <span>Sobre mí</span>
          </a>
        </li>
        
        <li>
          <a
            (click)="irASeccion('habilidades-tecnicas')"
            [class.activo]="seccionActiva === 'habilidades-tecnicas'"
            class="link-nav"
          >
            <i data-lucide="code"></i>
            <span>Habilidades</span>
          </a>
        </li>
        
        <!-- Más links... -->
      </ul>
    </nav>

    <!-- Toggle de tema -->
    <button
      (click)="alternarTema()"
      class="boton-tema"
      [attr.aria-label]="temaActual === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'"
    >
      <!-- [attr.aria-label] = setea un atributo HTML dinámicamente -->
      
      <i
        [attr.data-lucide]="temaActual === 'claro' ? 'moon' : 'sun'"
      ></i>
      <!-- Muestro icono de luna en modo claro (para cambiar a oscuro)
           y sol en modo oscuro (para cambiar a claro) -->
    </button>
    
  </div>
</aside>
```

### MobileHeader - Header para móviles

El header móvil aparece solo en pantallas pequeñas (<1024px). Tiene:
- Logo
- Botón de menú hamburguesa
- Botón de cambio de tema

**Archivo:** `frontend/src/app/core/layout/mobile-header/mobile-header.component.ts`

```ts
import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-mobile-header',
  templateUrl: './mobile-header.component.html',
  styleUrls: ['./mobile-header.component.scss']
})
export class MobileHeaderComponent {
  
  temaActual: Theme = 'oscuro';
  haciendoScroll = false;
  // Uso este flag para ocultar el header mientras hago scroll hacia abajo
  // y mostrarlo cuando hago scroll hacia arriba
  
  private scrollAnterior = 0;
  // Guardo la posición del scroll anterior para saber si subo o bajo

  constructor(
    private servicioTema: ThemeService,
    private servicioDrawer: DrawerService,
    private cdr: ChangeDetectorRef
    // ChangeDetectorRef me permite forzar la detección de cambios
    // Lo uso porque @HostListener es una API del navegador
  ) {
    // Me suscribo al tema
    this.servicioTema.tema$.subscribe(tema => {
      this.temaActual = tema;
    });
  }

  @HostListener('window:scroll', [])
  // @HostListener escucha eventos del navegador
  // 'window:scroll' = evento de scroll de la ventana
  // [] = no paso argumentos extra al método
  
  alHacerScroll(): void {
    // Este método se ejecuta cada vez que hago scroll
    
    const scrollActual = window.pageYOffset || document.documentElement.scrollTop;
    // pageYOffset = cuántos px bajé desde el tope de la página
    
    if (scrollActual > this.scrollAnterior && scrollActual > 80) {
      // Si bajé (scrollActual > scrollAnterior)
      // y estoy más abajo de 80px
      this.haciendoScroll = true;  // Oculto el header
    } else {
      this.haciendoScroll = false;  // Muestro el header
    }
    
    this.scrollAnterior = scrollActual;
    
    // Fuerzo la detección de cambios
    this.cdr.detectChanges();
    // Sin esto, Angular no se entera que haciendoScroll cambió
  }

  alternarTema(): void {
    this.servicioTema.alternarTema();
  }

  abrirMenu(): void {
    // Delego en el servicio de Drawer
    this.servicioDrawer.abrir();
  }
}
```

**Template:**

```html
<!-- mobile-header.component.html -->
<header
  class="encabezado-movil"
  [class.oculto]="haciendoScroll"
>
  <!-- Agrego clase 'oculto' cuando haciendoScroll es true -->
  
  <button (click)="abrirMenu()" class="boton-menu" aria-label="Abrir menú">
    <i data-lucide="menu"></i>
  </button>

  <div class="logo-movil">
    <span>MT</span>
  </div>

  <button (click)="alternarTema()" class="boton-tema-movil" [attr.aria-label]="temaActual === 'claro' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'">
    <i [attr.data-lucide]="temaActual === 'claro' ? 'moon' : 'sun'"></i>
  </button>
</header>
```

**SCSS:**

```scss
// mobile-header.component.scss

.encabezado-movil {
  position: fixed;
  top: 0;
  // fixed = se queda fijo aunque haga scroll
  
  left: 0;
  right: 0;
  height: 64px;
  background: var(--color-fondo);
  border-bottom: 1px solid var(--color-borde);
  display: none;
  // Por defecto oculto (se muestra solo en móviles)
  
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 100;
  transition: transform 0.3s ease;
  // Animación suave al ocultar/mostrar

  @media (max-width: 1023px) {
    display: flex;
  }

  &.oculto {
    transform: translateY(-100%);
    // Muevo el header hacia arriba (fuera de pantalla)
  }

  .boton-menu,
  .boton-tema-movil {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--color-texto);
    
    svg {
      width: 24px;
      height: 24px;
    }
  }

  .logo-movil {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-primario);
  }
}
```

### Drawer - Menú deslizable (móviles)

El Drawer es el menú lateral que se desliza desde la izquierda en móviles.

**Archivo:** `frontend/src/app/core/layout/drawer/drawer.component.ts`

```ts
import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  Inject,
  ElementRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss']
})
export class DrawerComponent implements OnInit, OnDestroy {
  
  estaAbierto = false;
  // Controla si el drawer está abierto o cerrado
  
  private destruir$ = new Subject<void>();
  private oyenteClickFuera?: () => void;
  // Guardo la referencia al listener para poder removerlo después

  constructor(
    private servicioDrawer: DrawerService,
    private renderer: Renderer2,
    // Renderer2 es el servicio de Angular para manipular el DOM
    // NO debo usar document.addEventListener directamente
    // porque Angular puede correr en otros entornos (server, web worker)
    
    @Inject(DOCUMENT) private document: Document,
    // Inyecto el objeto Document de forma segura
    // @Inject(DOCUMENT) es mejor que usar window.document
    
    private elementRef: ElementRef
    // Referencia al elemento host del componente (<app-drawer>)
  ) {}

  ngOnInit(): void {
    // Me suscribo al estado del drawer
    this.servicioDrawer.estaAbierto$
      .pipe(takeUntil(this.destruir$))
      .subscribe(abierto => {
        this.estaAbierto = abierto;
        
        if (abierto) {
          this.bloquearScroll();
          this.agregarListenerClickFuera();
        } else {
          this.desbloquearScroll();
          this.removerListenerClickFuera();
        }
      });
  }

  private bloquearScroll(): void {
    // Evito que el usuario haga scroll cuando el drawer está abierto
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    // Equivalente a: document.body.style.overflow = 'hidden';
    // pero de forma segura para Angular
  }

  private desbloquearScroll(): void {
    this.renderer.removeStyle(this.document.body, 'overflow');
    // Equivalente a: document.body.style.overflow = '';
  }

  private agregarListenerClickFuera(): void {
    // Espero un poco antes de agregar el listener
    // para evitar que el click que abrió el drawer también lo cierre
    setTimeout(() => {
      this.oyenteClickFuera = this.renderer.listen(
        'document',
        'click',
        (evento: Event) => {
          // Se ejecuta cada vez que hago click en cualquier parte del documento
          
          const dentroDelDrawer = this.elementRef.nativeElement.contains(evento.target);
          // contains() = ¿el click fue dentro del drawer?
          
          if (!dentroDelDrawer && this.estaAbierto) {
            // Si hice click fuera del drawer y está abierto, lo cierro
            this.cerrar();
          }
        }
      );
    }, 100);
  }

  private removerListenerClickFuera(): void {
    if (this.oyenteClickFuera) {
      // Llamo a la función que devolvió renderer.listen()
      // Esto remueve el listener
      this.oyenteClickFuera();
      this.oyenteClickFuera = undefined;
    }
  }

  cerrar(): void {
    this.servicioDrawer.cerrar();
  }

  irASeccion(idSeccion: string): void {
    const elemento = this.document.getElementById(idSeccion);
    
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Cierro el drawer después de navegar
      this.cerrar();
    }
  }

  ngOnDestroy(): void {
    this.destruir$.next();
    this.destruir$.complete();
    this.removerListenerClickFuera();
    this.desbloquearScroll();
  }
}
```

**Template:**

```html
<!-- drawer.component.html -->

<!-- Overlay (fondo oscuro semitransparente) -->
<div
  class="overlay-drawer"
  [class.visible]="estaAbierto"
  (click)="cerrar()"
></div>

<!-- Drawer -->
<aside
  class="drawer"
  [class.abierto]="estaAbierto"
>
  <div class="encabezado-drawer">
    <div class="logo-contenedor">
      <span class="logo-texto">MT</span>
    </div>
    <button (click)="cerrar()" class="boton-cerrar" aria-label="Cerrar menú">
      <i data-lucide="x"></i>
    </button>
  </div>

  <nav class="nav-drawer">
    <ul>
      <li>
        <a (click)="irASeccion('sobre-mi')" class="link-nav">
          <i data-lucide="user"></i>
          <span>Sobre mí</span>
        </a>
      </li>
      
      <li>
        <a (click)="irASeccion('habilidades-tecnicas')" class="link-nav">
          <i data-lucide="code"></i>
          <span>Habilidades</span>
        </a>
      </li>
      
      <!-- Más links... -->
    </ul>
  </nav>
</aside>
```

**SCSS:**

```scss
// drawer.component.scss

.overlay-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  // Fondo negro semitransparente
  
  opacity: 0;
  visibility: hidden;
  // Por defecto invisible
  
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 998;

  &.visible {
    opacity: 1;
    visibility: visible;
  }
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100%;
  background: var(--color-fondo);
  transform: translateX(-100%);
  // Por defecto está escondido a la izquierda
  
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;

  &.abierto {
    transform: translateX(0);
    // Cuando está abierto, vuelve a su posición normal
  }

  .encabezado-drawer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--color-borde);
  }

  .boton-cerrar {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    color: var(--color-texto);
  }

  .nav-drawer {
    padding: 1rem 0;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .link-nav {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      color: var(--color-texto);
      text-decoration: none;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: var(--color-hover);
      }

      i {
        margin-right: 0.75rem;
      }
    }
  }
}
```

---

## 4) Servicios: Estado Compartido

Los servicios son clases que se usan para compartir datos y lógica entre componentes.

**¿Por qué uso servicios en vez de @Input/@Output?**

```ts
// Sin servicio: tengo que pasar datos de padre a hijo manualmente

// app.component.html
<app-sidebar [tema]="tema" (cambioTema)="cambiarTema($event)"></app-sidebar>
<app-header [tema]="tema" (cambioTema)="cambiarTema($event)"></app-header>
<app-home [tema]="tema"></app-home>

// Con servicio: todos se suscriben al mismo Observable

// Cualquier componente:
this.servicioTema.tema$.subscribe(tema => {
  // Recibo el tema automáticamente
});
```

### ThemeService - Cambio de tema claro/oscuro

**Archivo:** `frontend/src/app/core/services/theme.service.ts`

```ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

export type Theme = 'claro' | 'oscuro';
// Type alias para tener autocompletado y seguridad de tipos

@Injectable({
  providedIn: 'root'
  // 'root' = este servicio es un singleton global
  // Angular crea UNA sola instancia y la comparte en toda la app
})
export class ThemeService {
  
  private readonly CLAVE_STORAGE = 'tema-preferido';
  // Clave para guardar el tema en localStorage
  
  private temaSubject: BehaviorSubject<Theme>;
  // BehaviorSubject es un tipo especial de Observable
  
  // Observable normal: solo emite valores a los que YA están suscritos
  // BehaviorSubject: guarda el último valor y lo emite a nuevos suscriptores
  
  // Ejemplo:
  // const normal$ = new Subject();
  // normal$.next('hola');
  // normal$.subscribe(v => console.log(v));  // No imprime nada
  
  // const behavior$ = new BehaviorSubject('inicial');
  // behavior$.next('hola');
  // behavior$.subscribe(v => console.log(v));  // Imprime 'hola'
  
  public tema$: Observable<Theme>;
  // Observable público (readonly) para que los componentes se suscriban
  
  private estaEnNavegador: boolean;

  constructor(
    @Inject(PLATFORM_ID) private plataformaId: object,
    // PLATFORM_ID me dice si estoy en el navegador o en el servidor
    // (para Server-Side Rendering)
    
    @Inject(DOCUMENT) private document: Document
  ) {
    this.estaEnNavegador = isPlatformBrowser(this.plataformaId);
    // isPlatformBrowser() devuelve true si estoy en el navegador
    
    const temaInicial = this.cargarTemaDesdeStorage();
    this.temaSubject = new BehaviorSubject<Theme>(temaInicial);
    this.tema$ = this.temaSubject.asObservable();
    // asObservable() convierte el Subject en Observable readonly
    // Los componentes pueden leer pero no pueden hacer .next()
    
    this.aplicarTemaAlDocumento(temaInicial);
  }

  private cargarTemaDesdeStorage(): Theme {
    if (!this.estaEnNavegador) {
      return 'oscuro';  // Default en servidor
    }

    try {
      const guardado = localStorage.getItem(this.CLAVE_STORAGE);
      
      if (guardado === 'claro' || guardado === 'oscuro') {
        return guardado;
      }
    } catch (e) {
      console.warn('No se pudo leer el tema desde localStorage', e);
    }

    // Si no hay nada guardado, uso el del sistema operativo
    return this.detectarTemaDelSistema();
  }

  private detectarTemaDelSistema(): Theme {
    if (!this.estaEnNavegador) {
      return 'oscuro';
    }

    // matchMedia detecta preferencias del sistema
    const preferenceQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return preferenceQuery.matches ? 'oscuro' : 'claro';
  }

  private aplicarTemaAlDocumento(tema: Theme): void {
    if (!this.estaEnNavegador) {
      return;
    }

    // Agrego/quito la clase 'tema-claro' en <html>
    // Esto activa las variables CSS correspondientes
    
    const elemento = this.document.documentElement;
    // documentElement = <html>
    
    if (tema === 'claro') {
      elemento.classList.add('tema-claro');
    } else {
      elemento.classList.remove('tema-claro');
    }
  }

  private guardarTemaEnStorage(tema: Theme): void {
    if (!this.estaEnNavegador) {
      return;
    }

    try {
      localStorage.setItem(this.CLAVE_STORAGE, tema);
    } catch (e) {
      console.warn('No se pudo guardar el tema en localStorage', e);
    }
  }

  obtenerTemaActual(): Theme {
    return this.temaSubject.value;
    // .value me da el último valor emitido sin necesidad de suscribirme
  }

  alternarTema(): void {
    const nuevoTema: Theme = this.temaSubject.value === 'claro' ? 'oscuro' : 'claro';
    this.establecerTema(nuevoTema);
  }

  establecerTema(tema: Theme): void {
    if (tema === this.temaSubject.value) {
      return;  // Ya es ese tema, no hago nada
    }

    this.temaSubject.next(tema);
    // Emito el nuevo tema a todos los suscriptores
    
    this.aplicarTemaAlDocumento(tema);
    this.guardarTemaEnStorage(tema);
  }
}
```

**¿Cómo funciona el tema en CSS?**

```scss
// styles.scss

:root {
  // Variables por defecto (tema oscuro)
  --color-fondo: #0a0a0a;
  --color-texto: #e5e5e5;
  --color-primario: #3b82f6;
}

// Cuando <html> tiene la clase 'tema-claro'
html.tema-claro {
  --color-fondo: #ffffff;
  --color-texto: #1a1a1a;
  --color-primario: #2563eb;
}

// Uso las variables en cualquier componente
.boton {
  background: var(--color-primario);
  color: var(--color-texto);
}
```

### DrawerService - Control del menú móvil

**Archivo:** `frontend/src/app/core/services/drawer.service.ts`

```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  
  private abiertoSubject = new BehaviorSubject<boolean>(false);
  // Por defecto cerrado
  
  public estaAbierto$: Observable<boolean> = this.abiertoSubject.asObservable();

  abrir(): void {
    this.abiertoSubject.next(true);
  }

  cerrar(): void {
    this.abiertoSubject.next(false);
  }

  alternar(): void {
    this.abiertoSubject.next(!this.abiertoSubject.value);
  }
}
```

**¿Por qué un servicio en vez de @Output?**

```ts
// Sin servicio: tengo que pasar eventos hacia arriba

// mobile-header.component.ts
@Output() abrirMenu = new EventEmitter<void>();

abrirMenuClick() {
  this.abrirMenu.emit();  // Emito hacia AppComponent
}

// app.component.html
<app-mobile-header (abrirMenu)="abrirDrawer()"></app-mobile-header>
<app-drawer [abierto]="drawerAbierto"></app-drawer>

// app.component.ts
drawerAbierto = false;
abrirDrawer() {
  this.drawerAbierto = true;
}

// Con servicio: ambos componentes usan el mismo servicio

// mobile-header.component.ts
this.servicioDrawer.abrir();

// drawer.component.ts
this.servicioDrawer.estaAbierto$.subscribe(abierto => {
  this.estaAbierto = abierto;
});
```

### NotificationService - Sistema de notificaciones

**Archivo:** `frontend/src/app/core/services/notification.service.ts`

```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: 'exito' | 'error' | 'info';
  duracion?: number;  // ? = opcional
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private notificacionesSubject = new BehaviorSubject<Notificacion[]>([]);
  public notificaciones$: Observable<Notificacion[]> = this.notificacionesSubject.asObservable();
  
  private siguienteId = 1;
  // Counter para generar IDs únicos

  mostrar(mensaje: string, tipo: 'exito' | 'error' | 'info' = 'info', duracion = 5000): void {
    const notificacion: Notificacion = {
      id: this.siguienteId++,
      mensaje,
      tipo,
      duracion
    };

    // Agrego la notificación al array
    const notificacionesActuales = this.notificacionesSubject.value;
    this.notificacionesSubject.next([...notificacionesActuales, notificacion]);
    // Uso spread operator (...) para crear un nuevo array
    // (RxJS detecta cambios solo si es un nuevo objeto)

    // La elimino automáticamente después de la duración
    if (duracion > 0) {
      setTimeout(() => {
        this.eliminar(notificacion.id);
      }, duracion);
    }
  }

  eliminar(id: number): void {
    const notificaciones = this.notificacionesSubject.value.filter(n => n.id !== id);
    this.notificacionesSubject.next(notificaciones);
  }

  exito(mensaje: string): void {
    this.mostrar(mensaje, 'exito');
  }

  error(mensaje: string): void {
    this.mostrar(mensaje, 'error');
  }

  info(mensaje: string): void {
    this.mostrar(mensaje, 'info');
  }
}
```

**Uso en componentes:**

```ts
// home.component.ts
constructor(private notificaciones: NotificationService) {}

enviarFormulario() {
  this.api.enviarContacto(datos).subscribe({
    next: () => {
      this.notificaciones.exito('¡Mensaje enviado correctamente!');
    },
    error: () => {
      this.notificaciones.error('Hubo un error al enviar el mensaje.');
    }
  });
}
```

### ApiService - Comunicación con el backend

**Archivo:** `frontend/src/app/core/services/api.service.ts`

```ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface DatosContacto {
  nombre: string;
  email: string;
  mensaje: string;
}

export interface RespuestaApi {
  ok: boolean;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private readonly urlBase = '/api';
  // En desarrollo apunta a http://localhost:4200/api
  // Vercel lo redirige a la función serverless en api/index.js

  constructor(private http: HttpClient) {}

  enviarContacto(datos: DatosContacto): Observable<RespuestaApi> {
    const url = `${this.urlBase}/contacto`;
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RespuestaApi>(url, datos, { headers })
      .pipe(
        catchError(error => {
          // catchError se ejecuta si la petición falla
          
          console.error('Error en la petición:', error);
          
          // Creo un Observable que emite un error
          return throwError(() => new Error(error.message || 'Error desconocido'));
        })
      );
  }
}
```

**¿Observable vs Promesa?**

```ts
// Promesa: solo devuelve UN valor
fetch('/api/contacto')
  .then(res => res.json())
  .then(data => console.log(data));  // Se ejecuta UNA vez

// Observable: puede devolver MUCHOS valores
observable$.subscribe(valor => {
  console.log(valor);  // Se ejecuta cada vez que el Observable emite
});

// Además, los Observables se pueden cancelar
const sub = observable$.subscribe(...);
sub.unsubscribe();  // Cancelo la suscripción

// Las promesas NO se pueden cancelar
```

**pipe() y operadores RxJS:**

```ts
this.http.get('/api/datos')
  .pipe(
    map(respuesta => respuesta.data),
    // map transforma el valor
    
    filter(data => data.length > 0),
    // filter solo deja pasar valores que cumplan la condición
    
    catchError(error => {
      // catchError maneja errores
      return of([]);  // Devuelvo un array vacío
    }),
    
    takeUntil(this.destruir$)
    // takeUntil cancela la suscripción cuando destruir$ emite
  )
  .subscribe(data => {
    console.log(data);
  });
```

---

## 5) HomeComponent: El Corazón del Portfolio

HomeComponent es donde está todo el contenido: sobre mí, habilidades, proyectos, experiencia, educación y contacto.

**Archivo:** `frontend/src/app/features/home/home.component.ts`

```ts
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';

declare const lucide: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // === ANIMACIÓN TYPEWRITER ===
  
  subtituloCompleto = 'Desarrollador Full Stack Jr.';
  subtituloMostrado = '';
  // El subtítulo se va escribiendo letra por letra
  
  // === FORMULARIO REACTIVO ===
  
  formularioContacto!: FormGroup;
  // ! le dice a TypeScript "confía en mí, lo inicializo en ngOnInit"
  
  enviandoFormulario = false;
  // Flag para deshabilitar el botón mientras se envía
  
  // === SCROLL REVEAL ===
  
  private observadorScroll?: IntersectionObserver;
  // Para detectar cuándo las secciones entran en pantalla
  
  // === DOBLE TAP EN MÓVILES ===
  
  private ultimoTap = 0;
  private readonly DELAY_DOBLE_TAP = 300;
  // 300ms = tiempo máximo entre taps para considerarlo doble tap
  
  // === CLEANUP ===
  
  private destruir$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    // FormBuilder facilita crear formularios reactivos
    
    private api: ApiService,
    private notificaciones: NotificationService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    // Se ejecuta UNA vez cuando el componente se crea
    
    this.inicializarFormulario();
    this.animarSubtitulo();
  }

  ngAfterViewInit(): void {
    // Se ejecuta DESPUÉS de que el DOM está listo
    // Acá ya existen todos los elementos HTML del componente
    
    this.configurarScrollReveal();
    this.renderizarIconos();
  }

  ngOnDestroy(): void {
    // Se ejecuta cuando el componente se destruye
    
    this.destruir$.next();
    this.destruir$.complete();
    
    if (this.observadorScroll) {
      this.observadorScroll.disconnect();
    }
  }

  // === FORMULARIO ===

  private inicializarFormulario(): void {
    this.formularioContacto = this.fb.group({
      // fb.group() crea un FormGroup
      // Cada propiedad es un FormControl
      
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      // [''] = valor inicial vacío
      // [Validators.required, ...] = array de validadores
      
      email: ['', [Validators.required, Validators.email]],
      
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Helper para acceder a los controles en el template
  get f() {
    return this.formularioContacto.controls;
  }

  enviarFormulario(): void {
    if (this.formularioContacto.invalid) {
      // Marco todos los campos como "touched" para mostrar los errores
      this.formularioContacto.markAllAsTouched();
      return;
    }

    this.enviandoFormulario = true;

    const datos = this.formularioContacto.value;
    // .value me da un objeto con todos los valores del formulario

    this.api.enviarContacto(datos)
      .pipe(takeUntil(this.destruir$))
      .subscribe({
        next: (respuesta) => {
          this.notificaciones.exito(respuesta.mensaje);
          this.formularioContacto.reset();
          // reset() limpia todos los campos
        },
        error: (error) => {
          this.notificaciones.error('Hubo un error al enviar el mensaje. Intentá de nuevo.');
          console.error(error);
        },
        complete: () => {
          this.enviandoFormulario = false;
        }
      });
  }

  // === ANIMACIÓN TYPEWRITER ===

  private animarSubtitulo(): void {
    let indice = 0;
    const intervalo = 100;  // ms entre cada letra

    const timer = setInterval(() => {
      if (indice < this.subtituloCompleto.length) {
        this.subtituloMostrado += this.subtituloCompleto[indice];
        indice++;
        this.cdr.detectChanges();
        // Fuerzo la detección de cambios para que Angular actualice la vista
      } else {
        clearInterval(timer);
      }
    }, intervalo);
  }

  // === SCROLL REVEAL ===

  private configurarScrollReveal(): void {
    // Busco todos los elementos con clase 'revelar'
    const elementos = document.querySelectorAll('.revelar');

    if (elementos.length === 0) {
      return;
    }

    const opciones: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
      // threshold 0.1 = se activa cuando el 10% del elemento es visible
    };

    this.observadorScroll = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          // El elemento entró en pantalla
          
          this.zone.run(() => {
            // Agrego la clase 'visible'
            entrada.target.classList.add('visible');
          });
          
          // Dejo de observar este elemento (solo animo una vez)
          this.observadorScroll!.unobserve(entrada.target);
        }
      });
    }, opciones);

    // Observo todos los elementos
    elementos.forEach(el => {
      this.observadorScroll!.observe(el);
    });
  }

  // === DOBLE TAP PARA ABRIR PROYECTOS ===

  manejarTapProyecto(url: string): void {
    const ahora = new Date().getTime();
    const diferencia = ahora - this.ultimoTap;

    if (diferencia < this.DELAY_DOBLE_TAP) {
      // Es un doble tap!
      window.open(url, '_blank');
    }

    this.ultimoTap = ahora;
  }

  // === RENDER ICONOS ===

  private renderizarIconos(): void {
    if (typeof lucide !== 'undefined') {
      setTimeout(() => {
        lucide.createIcons();
      }, 0);
    }
  }
}
```

---

## 6) Formularios Reactivos en Profundidad

Angular tiene dos formas de manejar formularios:
1. **Template-driven** (basados en directivas en el HTML)
2. **Reactive Forms** (basados en código TypeScript) ← **Uso estos**

**¿Por qué Reactive Forms?**

```ts
// Template-driven: lógica mezclada con HTML
// <input [(ngModel)]="nombre" required minlength="2">

// Reactive: lógica centralizada en TypeScript
this.formularioContacto = this.fb.group({
  nombre: ['', [Validators.required, Validators.minLength(2)]]
});
```

Ventajas:
- Más fácil de testear (puedo probar sin renderizar HTML)
- TypeScript detecta errores mientras escribo
- Validaciones más complejas (síncronas y asíncronas)
- Mejor rendimiento (menos binding bidireccional)

### Estructura del Formulario Reactivo

```ts
// home.component.ts

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class HomeComponent {
  formularioContacto!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formularioContacto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
}
```

**¿Qué es cada cosa?**

- **FormBuilder**: servicio que facilita crear formularios
- **FormGroup**: representa el formulario completo (contenedor de controles)
- **FormControl**: representa un solo campo (nombre, email, etc.)
- **Validators**: validadores predefinidos (required, email, minLength, etc.)

**Anatomía del método `fb.group()`:**

```ts
this.fb.group({
  // nombre_del_campo: [valor_inicial, validadores_síncronos, validadores_asíncronos]
  
  nombre: [
    '',  // Valor inicial (string vacío)
    [Validators.required, Validators.minLength(2)]  // Validadores síncronos
  ],
  
  email: [
    '',
    [Validators.required, Validators.email]
  ]
})
```

### Validadores Síncronos vs Asíncronos

**Síncronos**: se ejecutan instantáneamente

```ts
Validators.required  // No puede estar vacío
Validators.email     // Debe ser un email válido
Validators.minLength(2)  // Mínimo 2 caracteres
Validators.maxLength(100)  // Máximo 100 caracteres
Validators.pattern(/^[0-9]+$/)  // Solo números
```

**Asíncronos**: hacen una petición HTTP (ej: verificar si un username ya existe)

```ts
// custom-validators.ts
export class CustomValidators {
  static usuarioExiste(http: HttpClient): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);  // Si está vacío, no valido
      }

      return http.get(`/api/verificar-usuario/${control.value}`)
        .pipe(
          map(respuesta => respuesta.existe ? { usuarioExiste: true } : null),
          catchError(() => of(null))
        );
    };
  }
}

// Uso:
this.fb.group({
  usuario: ['', [Validators.required], [CustomValidators.usuarioExiste(this.http)]]
  //           ↑ síncronos            ↑ asíncronos
})
```

### Helper `get f()` para el Template

```ts
// En vez de escribir this.formularioContacto.controls.nombre cada vez,
// creo un getter:

get f() {
  return this.formularioContacto.controls;
}

// Ahora en el template puedo hacer:
// <div *ngIf="f.nombre.errors?.required">El nombre es requerido</div>
```

**¿Qué es `?.` (optional chaining)?**

```ts
// Sin optional chaining:
if (f.nombre.errors && f.nombre.errors.required) {
  // ...
}

// Con optional chaining:
if (f.nombre.errors?.required) {
  // Si errors es null/undefined, devuelve undefined
  // Sin tirar error
}
```

### Mostrar Errores en el Template

```html
<!-- home.component.html -->

<form [formGroup]="formularioContacto" (ngSubmit)="enviarFormulario()">
  <!-- [formGroup] vincula el form con el FormGroup de TypeScript -->
  <!-- (ngSubmit) se ejecuta cuando hago submit (Enter o click en botón) -->

  <div class="campo-formulario">
    <label for="nombre">Nombre</label>
    
    <input
      type="text"
      id="nombre"
      formControlName="nombre"
      [class.invalido]="f.nombre.invalid && f.nombre.touched"
    />
    <!-- formControlName vincula el input con el FormControl -->
    <!-- [class.invalido] agrega la clase si la condición es true -->
    
    <!-- Muestro errores solo si el campo fue tocado (touched) -->
    <div class="error" *ngIf="f.nombre.invalid && f.nombre.touched">
      <span *ngIf="f.nombre.errors?.required">
        El nombre es requerido
      </span>
      
      <span *ngIf="f.nombre.errors?.minlength">
        Debe tener al menos {{ f.nombre.errors?.minlength.requiredLength }} caracteres
        <!-- errors.minlength tiene: { requiredLength: 2, actualLength: 1 } -->
      </span>
    </div>
  </div>

  <div class="campo-formulario">
    <label for="email">Email</label>
    
    <input
      type="email"
      id="email"
      formControlName="email"
      [class.invalido]="f.email.invalid && f.email.touched"
    />
    
    <div class="error" *ngIf="f.email.invalid && f.email.touched">
      <span *ngIf="f.email.errors?.required">
        El email es requerido
      </span>
      
      <span *ngIf="f.email.errors?.email">
        Ingresá un email válido
      </span>
    </div>
  </div>

  <div class="campo-formulario">
    <label for="mensaje">Mensaje</label>
    
    <textarea
      id="mensaje"
      formControlName="mensaje"
      rows="5"
      [class.invalido]="f.mensaje.invalid && f.mensaje.touched"
    ></textarea>
    
    <div class="error" *ngIf="f.mensaje.invalid && f.mensaje.touched">
      <span *ngIf="f.mensaje.errors?.required">
        El mensaje es requerido
      </span>
      
      <span *ngIf="f.mensaje.errors?.minlength">
        Debe tener al menos 10 caracteres
      </span>
    </div>
  </div>

  <button
    type="submit"
    [disabled]="formularioContacto.invalid || enviandoFormulario"
  >
    {{ enviandoFormulario ? 'Enviando...' : 'Enviar Mensaje' }}
  </button>
</form>
```

### Lógica del Submit

```ts
enviarFormulario(): void {
  // 1. Verifico que el form sea válido
  if (this.formularioContacto.invalid) {
    // Si es inválido, marco todos los campos como "touched"
    // para mostrar los errores
    this.formularioContacto.markAllAsTouched();
    return;
  }

  // 2. Deshabilito el botón
  this.enviandoFormulario = true;

  // 3. Obtengo los valores del formulario
  const datos = this.formularioContacto.value;
  // datos = { nombre: 'Juan', email: 'juan@example.com', mensaje: '...' }

  // 4. Hago la petición HTTP
  this.api.enviarContacto(datos)
    .pipe(takeUntil(this.destruir$))
    .subscribe({
      next: (respuesta) => {
        // Éxito!
        this.notificaciones.exito(respuesta.mensaje);
        
        // Limpio el formulario
        this.formularioContacto.reset();
        // reset() pone todos los valores en ''
        // y marca todos los campos como untouched/pristine
      },
      error: (error) => {
        // Error!
        this.notificaciones.error('Hubo un error. Intentá de nuevo.');
        console.error(error);
      },
      complete: () => {
        // Se ejecuta siempre al final (éxito o error)
        this.enviandoFormulario = false;
      }
    });
}
```

**Estados de un FormControl:**

- **pristine**: nunca fue modificado
- **dirty**: fue modificado al menos una vez
- **touched**: el usuario hizo focus y luego blur (salió del campo)
- **untouched**: nunca recibió focus
- **valid**: pasa todas las validaciones
- **invalid**: falla alguna validación

```ts
f.nombre.pristine  // true si nunca escribió nada
f.nombre.dirty     // true si escribió algo (aunque después lo borre)
f.nombre.touched   // true si hizo click y salió del campo
f.nombre.valid     // true si pasa todas las validaciones
```

---

## 7) Backend Serverless con Node.js

El backend es una función serverless que se ejecuta en Vercel. Recibe los datos del formulario de contacto y envía un email.

**¿Qué es serverless?**

No tengo un servidor Node.js corriendo 24/7. En vez de eso, tengo una función que:
1. Se activa cuando alguien hace una petición HTTP
2. Se ejecuta
3. Responde
4. Se apaga

**Ventajas:**
- Más barato (solo pago cuando se usa)
- Escalado automático (si hay mucho tráfico, Vercel crea más instancias)
- No tengo que mantener un servidor

**Archivo:** `api/index.js`

```js
// === IMPORTS ===

const express = require('express');
// Express facilita crear rutas HTTP (GET, POST, etc.)

const nodemailer = require('nodemailer');
// Nodemailer envía emails usando SMTP

const { body, validationResult } = require('express-validator');
// Express-validator valida datos del request

const cors = require('cors');
// CORS permite que el frontend (dominio diferente) haga peticiones

// === CONFIGURACIÓN DE EXPRESS ===

const app = express();

// Middleware para parsear JSON
app.use(express.json());
// Sin esto, req.body es undefined

// Configuración de CORS
app.use(cors({
  origin: [
    'http://localhost:4200',  // Desarrollo
    'https://marcostoledo.vercel.app'  // Producción
  ],
  methods: ['POST', 'OPTIONS'],
  // OPTIONS es necesario para preflight requests
  // El navegador envía OPTIONS antes de POST para verificar CORS
  
  credentials: true
}));

// === CONFIGURACIÓN DE NODEMAILER ===

const transporter = nodemailer.createTransport({
  service: 'gmail',
  // Uso Gmail SMTP
  // Podría usar otros: 'hotmail', 'yahoo', o configuración manual
  
  auth: {
    user: process.env.EMAIL_USER,
    // Variable de entorno con el email
    // Ej: 'miportfolio@gmail.com'
    
    pass: process.env.EMAIL_PASS
    // Variable de entorno con la contraseña (o App Password)
    // NUNCA pongo la contraseña directamente en el código
  }
});

// === RUTA POST /contacto ===

app.post(
  '/contacto',
  
  // Array de validadores (se ejecutan antes de la función)
  [
    body('nombre')
      .trim()
      // trim() elimina espacios al inicio/final
      
      .notEmpty()
      .withMessage('El nombre es requerido')
      // notEmpty() = no puede estar vacío
      
      .isLength({ min: 2, max: 100 })
      .withMessage('El nombre debe tener entre 2 y 100 caracteres'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('El email es requerido')
      
      .isEmail()
      .withMessage('Debe ser un email válido')
      // isEmail() valida formato de email
      
      .normalizeEmail(),
      // normalizeEmail() convierte a minúsculas y quita puntos de Gmail
      // 'Juan.Perez@gmail.com' → 'juanperez@gmail.com'

    body('mensaje')
      .trim()
      .notEmpty()
      .withMessage('El mensaje es requerido')
      
      .isLength({ min: 10, max: 1000 })
      .withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
  ],
  
  // Función que maneja el request
  async (req, res) => {
    // async permite usar await
    
    // 1. Verifico si hay errores de validación
    const errores = validationResult(req);
    // errores contiene todos los mensajes de withMessage()
    
    if (!errores.isEmpty()) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Datos inválidos',
        errores: errores.array()
        // array() convierte los errores a un array
      });
    }

    // 2. Extraigo los datos validados
    const { nombre, email, mensaje } = req.body;

    // 3. Configuro el email
    const opcionesEmail = {
      from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
      // El email del remitente (mi cuenta de Gmail)
      
      to: process.env.EMAIL_USER,
      // A quién le llega el email (a mí mismo)
      
      subject: `Nuevo mensaje de ${nombre}`,
      // Asunto del email
      
      text: `
        Nombre: ${nombre}
        Email: ${email}
        
        Mensaje:
        ${mensaje}
      `,
      // Versión texto plano
      
      html: `
        <h2>Nuevo mensaje desde tu portfolio</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `
      // Versión HTML (se ve mejor en clientes de email)
    };

    // 4. Envío el email
    try {
      await transporter.sendMail(opcionesEmail);
      // sendMail() devuelve una Promesa
      // await espera a que se resuelva
      
      // 5. Respondo con éxito
      return res.status(200).json({
        ok: true,
        mensaje: '¡Mensaje enviado correctamente! Te responderé pronto.'
      });
      
    } catch (error) {
      // 6. Si algo sale mal, respondo con error
      console.error('Error al enviar email:', error);
      
      return res.status(500).json({
        ok: false,
        mensaje: 'Hubo un error al enviar el mensaje. Intentá de nuevo más tarde.'
      });
    }
  }
);

// === RUTA DE HEALTH CHECK ===

app.get('/', (req, res) => {
  // Ruta para verificar que la función está funcionando
  res.json({
    ok: true,
    mensaje: 'API de Portfolio funcionando correctamente'
  });
});

// === EXPORTO LA APP PARA VERCEL ===

module.exports = app;
// Vercel busca module.exports y lo usa como función serverless
```

**¿Cómo funcionan las variables de entorno?**

En Vercel Dashboard:
1. Voy a mi proyecto → Settings → Environment Variables
2. Agrego:
   - `EMAIL_USER` = `miportfolio@gmail.com`
   - `EMAIL_PASS` = `xxxx xxxx xxxx xxxx` (App Password de Gmail)

**¿Qué es un App Password de Gmail?**

Google no permite usar la contraseña normal para apps externas (por seguridad). En vez de eso, genera una "contraseña de aplicación":

1. Voy a Google Account → Security
2. Habilito "2-Step Verification"
3. Busco "App passwords"
4. Genero una contraseña para "Mail"
5. Copio la contraseña de 16 dígitos
6. La pongo en `EMAIL_PASS`

**Flujo completo de envío de email:**

```
1. Usuario completa el formulario
   ↓
2. Frontend hace POST /api/contacto con { nombre, email, mensaje }
   ↓
3. Express-validator valida los datos
   ↓
4. Si hay errores, responde con 400 Bad Request
   ↓
5. Si está OK, Nodemailer se conecta a Gmail SMTP
   ↓
6. Gmail envía el email a mi casilla
   ↓
7. Backend responde con 200 OK
   ↓
8. Frontend muestra notificación de éxito
```

---

## 8) Estilos SCSS y Variables CSS

Uso SCSS (Sass) en vez de CSS normal porque me da superpoderes:

**1. Variables:**

```scss
// SCSS
$color-primario: #3b82f6;
$espaciado: 16px;

.boton {
  color: $color-primario;
  padding: $espaciado;
}

// Se compila a CSS:
.boton {
  color: #3b82f6;
  padding: 16px;
}
```

**2. Anidamiento:**

```scss
// SCSS
.card {
  padding: 1rem;
  
  .titulo {
    font-size: 1.5rem;
  }
  
  .contenido {
    margin-top: 0.5rem;
    
    p {
      line-height: 1.6;
    }
  }
}

// Se compila a:
.card { padding: 1rem; }
.card .titulo { font-size: 1.5rem; }
.card .contenido { margin-top: 0.5rem; }
.card .contenido p { line-height: 1.6; }
```

**3. Operador & (parent selector):**

```scss
.boton {
  background: blue;
  
  &:hover {
    background: darkblue;
  }
  
  &.activo {
    background: green;
  }
  
  &--grande {
    font-size: 1.5rem;
  }
}

// Se compila a:
.boton { background: blue; }
.boton:hover { background: darkblue; }
.boton.activo { background: green; }
.boton--grande { font-size: 1.5rem; }
```

### Variables CSS (Custom Properties)

Las variables CSS son diferentes a las de SCSS:

```scss
// SCSS: se compilan antes de llegar al navegador
$color: red;
.boton { color: $color; }
// → .boton { color: red; }

// CSS Variables: existen en runtime (el navegador)
:root {
  --color: red;
}
.boton { color: var(--color); }
// El navegador puede cambiar --color dinámicamente
```

**¿Por qué uso ambas?**

```scss
// styles.scss

:root {
  // Variables CSS para tema oscuro (default)
  --color-fondo: #0a0a0a;
  --color-texto: #e5e5e5;
  --color-primario: #3b82f6;
  --color-borde: rgba(255, 255, 255, 0.1);
}

html.tema-claro {
  // Variables CSS para tema claro
  --color-fondo: #ffffff;
  --color-texto: #1a1a1a;
  --color-primario: #2563eb;
  --color-borde: rgba(0, 0, 0, 0.1);
}

// Variables SCSS para cosas que no cambian
$max-ancho: 1200px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;

// Uso las variables CSS en los estilos
.contenedor {
  max-width: $max-ancho;  // SCSS variable
  background: var(--color-fondo);  // CSS variable
  color: var(--color-texto);
  border: 1px solid var(--color-borde);
}
```

**Ventaja de variables CSS:** puedo cambiarlas con JavaScript

```ts
// theme.service.ts
document.documentElement.classList.add('tema-claro');
// → Cambian TODAS las variables CSS automáticamente
```

### Media Queries Mobile-First

Uso el enfoque "mobile-first": los estilos base son para móviles, y voy agregando para pantallas más grandes.

```scss
// Base: móviles (< 768px)
.contenedor {
  padding: 1rem;
  font-size: 14px;
}

// Tablets (768px+)
@media (min-width: 768px) {
  .contenedor {
    padding: 2rem;
    font-size: 16px;
  }
}

// Desktop (1024px+)
@media (min-width: 1024px) {
  .contenedor {
    padding: 3rem;
    font-size: 18px;
  }
}
```

**¿Por qué mobile-first?**

- La mayoría del tráfico web es móvil
- Es más fácil agregar estilos que quitarlos
- Rendimiento: en móvil carga menos CSS

### Animaciones con Keyframes

```scss
// Animación de fade-in
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.revelar {
  opacity: 0;
  
  &.visible {
    animation: fadeIn 0.6s ease forwards;
    // forwards = mantiene el estado final después de la animación
  }
}
```

**Propiedades de animation:**

```scss
animation: nombre duración timing-function delay iteration-count direction fill-mode;

animation: fadeIn 0.6s ease 0.2s 1 normal forwards;
//         ↑      ↑    ↑    ↑   ↑  ↑      ↑
//         nombre  600ms suave 200ms 1vez  mantiene estado final
```

### Clases Utilitarias

```scss
// Helpers de visibilidad
.oculto-movil {
  @media (max-width: 1023px) {
    display: none !important;
  }
}

.oculto-escritorio {
  @media (min-width: 1024px) {
    display: none !important;
  }
}

// Helpers de texto
.tenue {
  opacity: 0.7;
}

.texto-centrado {
  text-align: center;
}

// Helpers de espaciado
.mt-1 { margin-top: 0.5rem; }
.mt-2 { margin-top: 1rem; }
.mt-3 { margin-top: 1.5rem; }

.mb-1 { margin-bottom: 0.5rem; }
.mb-2 { margin-bottom: 1rem; }
.mb-3 { margin-bottom: 1.5rem; }
```

---

## 9) Internacionalización (i18n)

El portfolio está en español e inglés. Angular tiene un sistema de i18n integrado.

**¿Cómo funciona?**

1. Marco los textos traducibles en el HTML
2. Extraigo los textos a un archivo XLF
3. Traduzco los textos al inglés en otro archivo XLF
4. Genero dos builds (una por idioma)

### Marcar textos traducibles

```html
<!-- home.component.html -->

<h1 i18n="@@home.title">Sobre mí</h1>
<!-- i18n="@@id-unico" -->
<!-- El @@ define un ID único para esta traducción -->

<p i18n>
  Soy un desarrollador full stack apasionado por crear experiencias web.
</p>
<!-- Sin ID, Angular genera uno automático -->
```

### Extraer traducciones

```bash
ng extract-i18n --output-path src/locale
```

Esto genera `src/locale/messages.xlf`:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
  <file source-language="es" target-language="es" datatype="plaintext">
    <body>
      <trans-unit id="home.title" datatype="html">
        <source>Sobre mí</source>
        <target>Sobre mí</target>
      </trans-unit>
      
      <trans-unit id="auto-generated-id" datatype="html">
        <source>Soy un desarrollador full stack...</source>
        <target>Soy un desarrollador full stack...</target>
      </trans-unit>
    </body>
  </file>
</xliff>
```

### Traducir al inglés

Copio `messages.xlf` a `messages.en.xlf` y traduzco los `<target>`:

```xml
<trans-unit id="home.title" datatype="html">
  <source>Sobre mí</source>
  <target>About me</target>
</trans-unit>
```

### Configurar builds en angular.json

```json
{
  "projects": {
    "Portfolio-a": {
      "i18n": {
        "sourceLocale": "es",
        "locales": {
          "en": "src/locale/messages.en.xlf"
        }
      },
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "localize": ["es", "en"]
            }
          }
        }
      }
    }
  }
}
```

### Generar builds

```bash
# Build solo español
npm run build

# Build solo inglés
npm run build:en

# Build ambos idiomas
npm run build:all
```

Esto genera:

```
dist/Portfolio-a/
  ├── es/           ← Versión en español
  │   ├── index.html
  │   └── ...
  └── en/           ← Versión en inglés
      ├── index.html
      └── ...
```

### Servir según el idioma

En Vercel, uso `vercel.json` para redirigir según el idioma del navegador:

```json
{
  "rewrites": [
    {
      "source": "/(en|es)/(.*)",
      "destination": "/$1/$2"
    },
    {
      "source": "/(.*)",
      "destination": "/es/$1"
    }
  ]
}
```

**Explicación:**

1. Si la URL es `/en/algo` → sirve `/en/algo`
2. Si la URL es `/es/algo` → sirve `/es/algo`
3. Si la URL es `/algo` → redirige a `/es/algo` (español por defecto)

---

## 10) Testing Unitario

Uso Jasmine + Karma para tests unitarios.

**¿Qué es cada cosa?**

- **Jasmine**: framework de testing (describe, it, expect)
- **Karma**: test runner (ejecuta los tests en el navegador)

### Estructura de un test

```ts
// theme.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  // describe agrupa tests relacionados
  
  let service: ThemeService;
  
  beforeEach(() => {
    // beforeEach se ejecuta antes de cada test (it)
    
    TestBed.configureTestingModule({});
    // TestBed es el "entorno de testing" de Angular
    // Configura el módulo con las dependencias necesarias
    
    service = TestBed.inject(ThemeService);
    // inject() me da una instancia del servicio
  });

  it('should be created', () => {
    // it = un test individual
    
    expect(service).toBeTruthy();
    // expect() verifica que algo sea verdadero
  });

  it('should have default theme as "oscuro"', () => {
    expect(service.obtenerTemaActual()).toBe('oscuro');
    // toBe() verifica igualdad exacta (===)
  });

  it('should toggle theme', () => {
    service.alternarTema();
    expect(service.obtenerTemaActual()).toBe('claro');
    
    service.alternarTema();
    expect(service.obtenerTemaActual()).toBe('oscuro');
  });

  it('should emit theme changes', (done) => {
    // done es un callback para tests asíncronos
    
    service.tema$.subscribe(tema => {
      expect(tema).toBe('claro');
      done();
      // Llamo a done() cuando el test asíncrono termina
    });
    
    service.establecerTema('claro');
  });
});
```

### Matchers de Jasmine

```ts
expect(valor).toBe(esperado);           // ===
expect(valor).toEqual(esperado);        // Comparación profunda de objetos
expect(valor).toBeTruthy();             // != null && != false && != 0
expect(valor).toBeFalsy();              // == null || == false || == 0
expect(valor).toBeNull();               // === null
expect(valor).toBeUndefined();          // === undefined
expect(valor).toBeDefined();            // !== undefined
expect(array).toContain(elemento);      // array.includes(elemento)
expect(string).toContain('substring');  // string.includes('substring')
expect(valor).toBeGreaterThan(5);       // > 5
expect(valor).toBeLessThan(10);         // < 10
expect(() => funcion()).toThrow();      // Lanza un error
```

### Mockear servicios

```ts
// home.component.spec.ts

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockApi: jasmine.SpyObj<ApiService>;
  // SpyObj es un objeto "espía" que simula el servicio real

  beforeEach(async () => {
    // Creo un mock del ApiService
    mockApi = jasmine.createSpyObj('ApiService', ['enviarContacto']);
    // createSpyObj crea un objeto con métodos "espía"
    
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      providers: [
        { provide: ApiService, useValue: mockApi }
        // Le digo a Angular: "cuando alguien pida ApiService,
        // dale mockApi en vez del servicio real"
      ]
    }).compileComponents();
    // compileComponents() compila los templates del componente

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // detectChanges() ejecuta ngOnInit y renderiza el componente
  });

  it('should send form data', () => {
    // Configuro qué devuelve el mock cuando llamen a enviarContacto()
    mockApi.enviarContacto.and.returnValue(of({ ok: true, mensaje: 'OK' }));
    // of() crea un Observable que emite el valor inmediatamente
    
    // Lleno el formulario
    component.formularioContacto.patchValue({
      nombre: 'Juan',
      email: 'juan@example.com',
      mensaje: 'Hola mundo'
    });
    
    // Envío el formulario
    component.enviarFormulario();
    
    // Verifico que se llamó al servicio con los datos correctos
    expect(mockApi.enviarContacto).toHaveBeenCalledWith({
      nombre: 'Juan',
      email: 'juan@example.com',
      mensaje: 'Hola mundo'
    });
  });
});
```

### Testear peticiones HTTP

```ts
// api.service.spec.ts

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      // HttpClientTestingModule es un mock del HttpClient
      
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifico que no queden peticiones HTTP pendientes
    httpMock.verify();
  });

  it('should send contact data', () => {
    const datosPrueba = {
      nombre: 'Test',
      email: 'test@example.com',
      mensaje: 'Test mensaje'
    };

    const respuestaEsperada = { ok: true, mensaje: 'OK' };

    service.enviarContacto(datosPrueba).subscribe(respuesta => {
      expect(respuesta).toEqual(respuestaEsperada);
    });

    // Capturo la petición HTTP
    const req = httpMock.expectOne('/api/contacto');
    
    // Verifico que sea POST
    expect(req.request.method).toBe('POST');
    
    // Verifico el body
    expect(req.request.body).toEqual(datosPrueba);
    
    // Simulo la respuesta del servidor
    req.flush(respuestaEsperada);
  });
});
```

### Ejecutar tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar con coverage (reporte de cobertura)
ng test --code-coverage

# Ejecutar una vez (sin watch mode)
ng test --watch=false
```

El reporte de coverage se genera en `coverage/index.html`.

---

## 11) Build y Deployment en Vercel

### Build local

```bash
# Desarrollo (con hot reload)
npm start
# → http://localhost:4200

# Build de producción
npm run build
# → Genera dist/Portfolio-a/es/

# Build en inglés
npm run build:en
# → Genera dist/Portfolio-a/en/

# Build ambos idiomas
npm run build:all
# → Genera ambos
```

### package.json scripts

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build --configuration production --localize=false",
    "build:en": "ng build --configuration production --localize=false --locale en",
    "build:all": "ng build --configuration production"
  }
}
```

**¿Qué hace cada flag?**

- `--configuration production`: aplica optimizaciones (minificación, tree shaking, AOT)
- `--localize=false`: no genera múltiples locales (solo el source locale)
- `--locale en`: genera solo el locale inglés

### vercel.json - Configuración de Vercel

```json
{
  "version": 2,
  // Versión de la plataforma Vercel
  
  "buildCommand": "npm run build:all",
  // Comando que ejecuta Vercel al hacer deploy
  
  "outputDirectory": "dist/Portfolio-a",
  // Carpeta con los archivos estáticos
  
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    // Todas las rutas /api/* van a la función serverless
    
    {
      "source": "/(en|es)/(.*)",
      "destination": "/$1/$2"
    },
    // /en/algo → sirve /en/algo
    // /es/algo → sirve /es/algo
    
    {
      "source": "/(.*)",
      "destination": "/es/$1"
    }
    // /algo → redirige a /es/algo (español por defecto)
  ],
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    }
  ]
  // Cache de 1 hora (3600 segundos) para todos los archivos
}
```

### Variables de entorno en Vercel

1. Voy al proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrego:
   - `EMAIL_USER` = `miportfolio@gmail.com`
   - `EMAIL_PASS` = `xxxx xxxx xxxx xxxx`

**Importante:** las variables de entorno se leen en la función serverless (`api/index.js`), NO en el frontend.

```js
// ✅ Backend (api/index.js)
const user = process.env.EMAIL_USER;  // Funciona!

// ❌ Frontend (home.component.ts)
const user = process.env.EMAIL_USER;  // undefined (no funciona)
```

### Deployment automático con GitHub

Conecto el repositorio de GitHub con Vercel:

1. Voy a Vercel Dashboard
2. New Project → Import Git Repository
3. Selecciono el repo
4. Vercel detecta automáticamente que es Angular
5. Cada push a `main` → deploy automático

**Flujo completo:**

```
1. Hago cambios en el código
   ↓
2. git add . && git commit -m "mensaje" && git push
   ↓
3. GitHub recibe el push
   ↓
4. Vercel detecta el push
   ↓
5. Vercel ejecuta npm run build:all
   ↓
6. Vercel sube los archivos estáticos
   ↓
7. Vercel despliega la función serverless
   ↓
8. ¡Sitio actualizado!
```

---

## 12) Checklist para Defender el Proyecto

Cuando me pregunten en una entrevista o demo técnica, puedo explicar:

### Arquitectura y Decisiones

- ✅ **¿Por qué Angular?** → Estructura clara, TypeScript obligatorio, todo incluido (routing, forms, HTTP)
- ✅ **¿Por qué SPA?** → Navegación instantánea, mejor UX, animaciones suaves
- ✅ **¿Por qué serverless?** → Más barato, escalado automático, no mantener servidor
- ✅ **¿Por qué Vercel?** → Deploy automático con GitHub, fácil configurar variables de entorno

### Frontend

- ✅ **Componentes:** Sidebar, MobileHeader, Drawer, Home
- ✅ **Servicios:** ThemeService (tema), DrawerService (menú móvil), ApiService (HTTP), NotificationService (mensajes)
- ✅ **Routing:** AppRoutingModule con rutas, scroll restoration, anchor scrolling
- ✅ **Forms:** Reactivos con FormBuilder, validación en tiempo real
- ✅ **i18n:** Dos idiomas (español/inglés) con @angular/localize

### APIs del Navegador

- ✅ **IntersectionObserver:** Detecta visibilidad de elementos (scroll reveal, sidebar activo)
- ✅ **localStorage:** Guarda preferencia de tema
- ✅ **matchMedia:** Detecta tema del sistema operativo
- ✅ **scrollIntoView:** Navegación suave a secciones

### RxJS y Observables

- ✅ **BehaviorSubject:** Para estado compartido (tema, drawer)
- ✅ **Observable:** Para peticiones HTTP
- ✅ **takeUntil:** Para cancelar suscripciones
- ✅ **catchError:** Para manejar errores HTTP

### Backend

- ✅ **Express:** Framework HTTP
- ✅ **Nodemailer:** Envío de emails
- ✅ **express-validator:** Validación de datos
- ✅ **CORS:** Permite peticiones desde el frontend

### Estilos

- ✅ **SCSS:** Variables, anidamiento, mixins
- ✅ **CSS Variables:** Tema dinámico (claro/oscuro)
- ✅ **Mobile-first:** Estilos base para móviles
- ✅ **Keyframes:** Animaciones CSS (fadeIn, slide)

### Testing

- ✅ **Jasmine:** Framework de testing
- ✅ **Karma:** Test runner
- ✅ **Mocks:** jasmine.createSpyObj para simular servicios
- ✅ **HttpTestingController:** Para testear peticiones HTTP

### Build y Deploy

- ✅ **AOT:** Compilación ahead-of-time (más rápido en producción)
- ✅ **Tree shaking:** Elimina código no usado
- ✅ **Minificación:** Reduce tamaño de archivos
- ✅ **Lazy loading:** (no implementado, pero sé cómo hacerlo)

---

## Privacidad y Seguridad

### Datos sensibles en .gitignore

NUNCA subir a GitHub:
- `EMAIL_USER` y `EMAIL_PASS`
- Contraseñas
- API keys
- Archivos `.env`

```gitignore
# .gitignore
.env
.env.local
*.log
node_modules/
dist/
```

### App Password de Gmail

Usar App Password en vez de la contraseña real:
1. Google Account → Security
2. 2-Step Verification → ON
3. App passwords → Generate
4. Copiar la contraseña de 16 dígitos
5. Guardar en variable de entorno

### CORS

Solo permitir peticiones desde mi dominio:

```js
app.use(cors({
  origin: ['https://marcostoledo.vercel.app'],
  methods: ['POST']
}));
```

---

## Próximos Pasos (Mejoras Futuras)

- [ ] Agregar tests E2E con Cypress
- [ ] Implementar lazy loading de módulos
- [ ] Agregar Service Worker (PWA)
- [ ] Optimizar imágenes con next/image
- [ ] Agregar Google Analytics
- [ ] Implementar sitemap.xml para SEO
- [ ] Agregar meta tags Open Graph
- [ ] Implementar rate limiting en el backend (evitar spam)

---

**Última actualización:** [Fecha actual]

---

_Esta guía es un documento vivo. La actualizo cada vez que agrego features o aprendo algo nuevo._
