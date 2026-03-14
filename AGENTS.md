# GGA Code Review Rules — Portfolio Angular

## Angular
- Todos los componentes son standalone con `ChangeDetectionStrategy.OnPush`
- Usar signals para estado reactivo; no usar `BehaviorSubject` salvo justificación
- Usar `@for`, `@if`, `@switch` (sintaxis nueva); no usar `*ngFor`, `*ngIf`
- Nunca usar `any` en TypeScript
- Los nombres de archivos, variables, métodos y comentarios van en español

## SCSS
- Variables de tema como CSS Custom Properties en `_theme.scss` (`--variable`)
- Variables estáticas en `_variables.scss` (`$variable`)
- Metodología BEM para nombres de clases
- Mobile-first: estilos base para mobile, mixins `sm/md/lg` para breakpoints mayores
- Nunca usar negro puro `#000` ni blanco puro `#fff`

## Seguridad
- No interpolar variables en `[innerHTML]`
- Links externos siempre con `rel="noopener noreferrer"`
- No hardcodear credenciales ni tokens

## Accesibilidad
- Elementos decorativos con `aria-hidden="true"`
- Botones interactivos con `aria-label` descriptivo
- Respetar `prefers-reduced-motion` en animaciones

## General
- No agregar `console.log` sin comentario explicativo
- No dejar código comentado sin razón
- Imports ordenados: Angular core → Angular modules → Externos → Internos
