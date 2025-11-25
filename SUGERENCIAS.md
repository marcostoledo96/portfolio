# Sugerencias de mejoras futuras (lista personal)

Ideas que quiero implementar para llevar el portfolio a otro nivel. Todo pensado para seguir simple, pero más útil y prolijo.

## UX / UI
- Agregar scroll reveal suave en secciones y cards para dar sensación de fluidez.
- Botón "volver arriba" fijo en mobile/desktop cuando se scrollea mucho.
- Mejorar accesibilidad: focus visible en todos los elementos interactivos y revisión de contraste (WCAG AA).
- Añadir estados de carga/skeletons en el formulario mientras envío.
- Ajustar tipografías y tamaños en mobile para que los textos largos no se corten.

## Rendimiento
- Lazy-loading de imágenes grandes con `loading="lazy"` y formatos más livianos (WebP si aplica).
- Revisar y optimizar el bundle con `ng build --stats-json` + analyzer para detectar peso innecesario.
- Minificar y unificar variables de tema en `styles.scss` para reducir CSS redundante.

## Funcionalidad
- Agregar analytics (por ejemplo GA4 o Plausible) para entender cómo navegan los visitantes.
- Internacionalización básica (es/en) usando `@angular/localize` para mostrar el portfolio en inglés.
- Añadir un bloque de "últimos proyectos" parametrizable desde un JSON en `assets` para no tocar código al actualizar.
- Log de envíos de contacto: guardar en un archivo o planilla (via API externa) además del mail.

## Código y calidad
- Sumar tests unitarios mínimos para servicios (ThemeService, DrawerService, ApiService) con casos clave.
- Configurar CI simple en GitHub Actions: instalar deps, correr `npm run build` y tests del frontend.
- Prettier/ESLint integrados en pre-commit para mantener estilo consistente.

## Deploy y monitoreo
- Revisar la configuración de la función serverless para agregar logs más claros en errores.
- Agregar alertas de error (ej. Sentry) para la función `/api/contact` y el frontend.

## Contenido
- Preparar una sección corta tipo "Sobre mi proceso" con bullets de cómo trabajo (brief, diseño, desarrollo, QA).
- Actualizar las tarjetas de proyectos con links a demos y repos más recientes.

Voy priorizando según tiempo y valor: primero accesibilidad y rendimiento, después analytics y contenido, y por último automatizaciones y monitoreo.
