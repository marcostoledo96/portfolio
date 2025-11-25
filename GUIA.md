# GUIA COMPLETA del Portfolio (nota personal)

La escribo para acordarme cómo está armado mi portfolio en Angular 20. Todo está en un solo módulo (`AppModule`) y un solo feature (`HomeComponent`). No uso módulos intermedios: declaro los componentes directamente en el módulo principal para mantenerlo simple.

## Estructura de carpetas
```
frontend/
├─ src/main.ts                 # Bootstrap de Angular
├─ src/index.html              # HTML base + Lucide CDN
├─ src/styles.scss             # Estilos globales, variables y temas
├─ src/app/
│  ├─ app.module.ts            # Declaro AppComponent + layout + Home
│  ├─ app-routing.module.ts    # Ruta '' -> HomeComponent
│  ├─ app.component.ts|html|scss# Shell: sidebar + header móvil + drawer + router-outlet
│  ├─ core/
│  │  ├─ layout/
│  │  │  ├─ sidebar/           # Nav desktop + toggle de tema + observer de sección
│  │  │  ├─ mobile-header/     # Header compacto con toggle tema y botón del drawer
│  │  │  └─ drawer/            # Menú móvil con scroll suave y cierre al click afuera
│  │  └─ services/
│  │     ├─ theme.service.ts   # Clase/BehaviorSubject para tema claro/oscuro
│  │     ├─ drawer.service.ts  # Estado del drawer (open/close)
│  │     ├─ api.service.ts     # POST /api/contact + manejo de errores
│  │     └─ notification.service.ts # Lista de toasts (exito/error/info)
│  └─ features/home/
│     ├─ home.component.ts|html|scss # Todas las secciones + formulario
│     └─ (sin módulo propio)
└─ api/index.js                # Función serverless de contacto
```

## Flujo de arranque
1. `src/main.ts` hace bootstrap de `AppModule`.
2. `AppModule` declara AppComponent, Home y los componentes de layout; importa HttpClientModule, ReactiveFormsModule y AppRoutingModule.
3. `AppRoutingModule` tiene una sola ruta: `path: ''` -> `HomeComponent`.
4. `AppComponent` arma el layout: `<app-sidebar>`, `<app-mobile-header>`, `<app-drawer>` y el `<router-outlet>`.

## Componentes clave
- **SidebarComponent:** usa `IntersectionObserver` para marcar la sección activa mientras hago scroll. Toggle de tema conectado a `ThemeService`. En desktop.
- **DrawerComponent:** escucha `DrawerService`, bloquea scroll del body cuando está abierto y se cierra al hacer click fuera o al navegar. También observa secciones para resaltar la activa.
- **MobileHeaderComponent:** header simple para mobile con toggle de tema y botón que alterna el drawer.
- **HomeComponent:** contiene todo el contenido. Hace la animación “typed” con `setTimeout`, renderiza secciones y maneja el formulario reactivo (`FormBuilder`, `Validators`). Al enviar, llama a `ApiService.sendContactMessage` y muestra toasts con `NotificationService`.

## Servicios
- **ThemeService:** `BehaviorSubject<Theme>` (`claro`|`oscuro`). Aplica la clase `claro` en `<body>` y `<html>` y persiste en `localStorage` bajo la clave `tema`. Métodos: `alternarTema()`, `establecerTema()`, `obtenerTemaActual()`.
- **DrawerService:** `BehaviorSubject<boolean>` para el estado del drawer. Métodos: `abrir()`, `cerrar()`, `alternar()`, `estaAbierto()`.
- **ApiService:** `sendContactMessage(datos)` hace POST a `${environment.apiUrl}/contact` con headers JSON y captura errores. El método `manejarError` arma un mensaje legible y hace `throwError`.
- **NotificationService:** mantiene una lista de notificaciones en un `BehaviorSubject`. Métodos de conveniencia `showSuccess`, `showError`, `showInfo`; cada notificación se borra sola a los 5s o manualmente con `eliminarNotificacion(id)`.

## Estilos y tema
- Uso un solo `styles.scss` con variables CSS, fondos degradados y reglas para `body.claro`. El toggle solo agrega/quita la clase `claro` en `<body>` y `<html>`.
- Los componentes de layout tienen sus propios `.scss` pero heredan colores/variables globales.

## API serverless
- Archivo: `api/index.js`.
- Valido `name`, `email`, `message` con `express-validator` y armo un mail con `nodemailer` usando `EMAIL_USER` y `EMAIL_PASS` (contraseña de aplicación de Gmail).
- Respondo `{ success: true/false, message }` y devuelvo 400 con mensajes claros si faltan datos.

## Bloques de código que me importa recordar
- Ruta única:
```ts
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '' }
];
```
- Animación typed en `HomeComponent` (concepto):
```ts
private animarTexto() {
  const frase = this.frases[this.indiceFraseActual];
  // escribo o borro con setTimeout, alternando bandera this.borrando
}
```
- Envío de formulario:
```ts
this.api.sendContactMessage(this.formularioContacto.value).subscribe({
  next: r => r.success ? this.notif.showSuccess('Mensaje enviado') : this.notif.showError(r.message || 'Error'),
  error: () => this.notif.showError('Error de conexión')
});
```
- Drawer abierto/cerrado:
```ts
this.drawerService.drawerAbierto$
  .subscribe(abierto => document.body.classList.toggle('drawer-open', abierto));
```
- Toggle de tema:
```ts
this.themeService.alternarTema();
```

## Checklist rápido cuando toco algo
- Si sumo un componente nuevo, lo declaro en `AppModule` (no hay módulos feature extra).
- Si agrego assets, van a `frontend/src/assets/img` o `doc` y las rutas son relativas `assets/...`.
- Si cambio el formulario, mantener validaciones en `HomeComponent` y en `api/index.js`.
- Si toco estilos globales, revisar tanto `body` como `body.claro`.
- Antes de deploy: `cd frontend && npm run build` y probar `/api/contact` con las env vars cargadas.
