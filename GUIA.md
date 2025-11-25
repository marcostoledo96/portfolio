# GUIA COMPLETA del Portfolio (nota personal)

Actualizo esta guía con los cambios recientes:
- Arquitectura simple (un solo AppModule, HomeComponent como feature principal).
- Tarjetas de habilidades técnicas con efecto flip y un único ítem volteado a la vez.
- Ajustes responsive en habilidades, blandas, educación y contacto.

## Estructura de carpetas (resumen)
```
frontend/
├─ src/app/
│  ├─ app.module.ts              # Declaro AppComponent + layout + Home
│  ├─ app-routing.module.ts      # Ruta '' -> HomeComponent
│  ├─ app.component.*            # Shell: sidebar + header móvil + drawer + router-outlet
│  ├─ core/
│  │  ├─ layout/                 # Sidebar, MobileHeader, Drawer
│  │  └─ services/               # ThemeService, DrawerService, ApiService, NotificationService
│  └─ features/home/             # HomeComponent (todas las secciones + formulario + habilidades)
│     ├─ home.component.ts
│     ├─ home.component.html
│     └─ home.component.scss
├─ src/assets/img/               # Logos y portadas (incluye versiones WebP)
├─ src/styles.scss               # Estilos globales + responsive
└─ api/index.js                  # Función serverless /api/contact
```

## Cambios recientes
1) **Habilidades técnicas con flip**
   - Lista declarada en `home.component.ts` como `habilidadesTecnicas` (nombre, img, alt, nivel).
   - Vista en `home.component.html`: `*ngFor` genera cada tarjeta; click/Enter/Espacio la voltea.
   - Estado en `home.component.ts`: `tarjetaVolteada` garantiza que solo una tarjeta esté girada.
   - Estilos en `home.component.scss`: bloque `.tarjeta-habilidad--flip` y estado `.volteada` (resaltado, color hover). Texto de dorso: “Nivel {{hab.nivel}}” sin leyendas extra.

2) **Responsive** (mobile <= 768px)
   - Habilidades técnicas: 2 columnas, tarjetas más compactas.
   - Habilidades blandas y Educación: 1 tarjeta por fila para legibilidad.
   - Contacto: padding lateral reducido y grid a 1 columna para evitar cortes.
   - Ajustes extra <= 400px/350px mantienen legibilidad en pantallas muy chicas.

3) **Animación del subtítulo**
   - En `home.component.ts`: `TICK_MS`, `esperaEscritura`, `esperaCambio` controlan la velocidad del “typed”.
   - Uso de `ChangeDetectionStrategy.OnPush` y `ChangeDetectorRef.markForCheck()` para que el texto se actualice.

4) **Observer de secciones**
   - Sidebar y Drawer: `rootMargin` y `threshold` ajustados para detectar “portafolio” correctamente.

## Cómo editar habilidades técnicas
- Archivo: `frontend/src/app/features/home/home.component.ts`.
- Propiedad: `habilidadesTecnicas: { nombre, img, alt, nivel }[]`.
- Las imágenes están en `frontend/src/assets/img/` (se usan rutas relativas `assets/img/...`).
- El nivel se muestra en el dorso (“Nivel <valor>”).
- Solo una tarjeta queda volteada a la vez (`tarjetaVolteada`).

## Estilos globales
- `src/styles.scss`: único archivo con índice al inicio para ubicar rápido cada bloque.
  - [01] Variables, [02] Base/Utilitarias, [03] Layout, [04] Sidebar, [05] Header/Drawer,
    [06] Secciones (hero, habilidades, blandas, experiencia, educación, portafolio, contacto),
    [07] Componentes (cards, fichas, botones), [08] Responsive, [09] Notificaciones.
- Overrides responsive incluyen ajustes de grillas y contenedores para mobile.

## Snippets útiles
- Flip de tarjeta (estado único):
```ts
// home.component.ts
alternarTarjeta(nombre: string) {
  this.tarjetaVolteada = this.tarjetaVolteada === nombre ? null : nombre;
  this.cdr.markForCheck();
}
```
- Template de tarjeta:
```html
<div class="tarjeta-habilidad--flip" [class.volteada]="estaVolteada(hab.nombre)" (click)="alternarTarjeta(hab.nombre)">
  <div class="tarjeta-habilidad__cara--frente">...</div>
  <div class="tarjeta-habilidad__cara--dorso">Nivel {{ hab.nivel }}</div>
</div>
```
- Ajustes de velocidad “typed”:
```ts
// home.component.ts
private readonly TICK_MS = 45;      // intervalo de escritura/borrado
const esperaEscritura = 900;        // pausa al terminar frase
const esperaCambio = 320;           // pausa al cambiar frase
```

## Checklist rápido
- Si agrego/quito habilidades: actualizar `habilidadesTecnicas` y asegurar que la imagen exista en `assets/img`.
- Si cambio estilos globales: respetar el índice y los bloques en `styles.scss` para ubicar rápido.
- Si toco el typed: ajustar `TICK_MS`, `esperaEscritura`, `esperaCambio` en `home.component.ts`.
- Si el observer no detecta una sección: revisar `rootMargin`/`threshold` en sidebar/drawer.

