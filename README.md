# Portfolio Personal - Marcos Ezequiel Toledo

Este es mi portfolio personal construido con Angular 20. Lo desarrollé como una single page application donde muestro quién soy, qué tecnologías manejo, mis proyectos y cómo contactarme. Mantengo la arquitectura lo más simple posible para que sea fácil de mantener y escalar.

## Qué incluye

- Barra lateral fija en desktop y drawer deslizable en mobile para navegación.
- Modo claro/oscuro que persiste en localStorage con toggle accesible.
- Hero con texto animado tipo "typed" y enlaces directos a mis redes.
- Botones sociales con doble toque en mobile: primer toque muestra tooltip, segundo ejecuta la acción.
- Sección de habilidades técnicas con tarjetas interactivas con efecto flip.
- Sección de habilidades blandas destacando mis soft skills.
- Sección de idiomas con banderas SVG (español nativo, inglés básico/intermedio).
- Experiencia profesional con timeline visual.
- Educación y formación académica.
- Portfolio de proyectos con tarjetas y links a demos y repositorios.
- Formulario de contacto funcional que envía correos vía función serverless.
- Animaciones de scroll reveal con IntersectionObserver.
- Botón de volver arriba integrado en el logo MT del header mobile.
- Iconos en el menú hamburguesa igual que en el sidebar desktop.
- Internacionalización básica (es/en) con @angular/localize.
- Tipografías optimizadas para mobile con word-break y hyphens.

## Stack y arquitectura

- **Framework:** Angular 20 + TypeScript
- **Estilos:** SCSS con variables CSS unificadas para temas, fuentes Inter y Poppins
- **Iconos:** Lucide Icons vía CDN, banderas SVG de flagcdn.com para idiomas
- **API de contacto:** Función serverless en Vercel con nodemailer
- **Estado:** BehaviorSubject para tema, drawer y notificaciones
- **HTTP:** HttpClient de Angular para comunicación con la API
- **i18n:** @angular/localize para traducciones es/en
- **Testing:** Jasmine/Karma con tests unitarios para servicios
- **CI/CD:** GitHub Actions para build y tests automáticos

## Estructura del repositorio

```
Portfolio-a/
-- frontend/                   # App Angular
   -- src/app/
      -- core/layout/          # Sidebar, mobile header, drawer
      -- core/services/        # ThemeService, DrawerService, ApiService
      -- features/home/        # HomeComponent con todas las secciones
      -- app.module.ts         # Módulo raíz
      -- app.component.ts      # Layout principal
   -- src/assets/
      -- img/                  # Imágenes y logos
      -- doc/                  # CV en PDF
      -- data/                 # JSON de proyectos parametrizable
   -- src/locale/              # Archivos XLF para traducciones
   -- src/styles.scss          # Estilos globales y temas
-- api/index.js                # Función serverless /api/contact
-- .github/workflows/ci.yml    # Pipeline de CI con GitHub Actions
-- vercel.json                 # Configuración de deploy en Vercel
-- GUIA.md                     # Documentación técnica interna
-- SUGERENCIAS.md              # Ideas para mejoras futuras
-- DEPLOY.md                   # Guía de deploy en Vercel
-- README.md                   # Este archivo
```

## Cómo correrlo en local

1. Clonar el repositorio:
```bash
git clone https://github.com/marcostoledo96/portfolio.git
cd portfolio
```

2. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

3. Levantar el servidor de desarrollo:
```bash
npm start
```

4. Abrir http://localhost:4200 en el navegador.

## Scripts disponibles

```bash
npm start            # Servidor de desarrollo
npm run build        # Build de producción (español)
npm run build:en     # Build en inglés
npm run build:all    # Build en ambos idiomas
npm run build:stats  # Build con estadísticas del bundle
npm run analyze      # Analizar tamaño del bundle
npm run extract-i18n # Extraer textos para traducción
npm run test         # Correr tests unitarios
```

## Build y deploy

Para generar el build de producción:
```bash
cd frontend
npm run build
```

El proyecto está configurado para deployar en Vercel automáticamente. El archivo vercel.json contiene la configuración necesaria para el build y los rewrites.

## API de contacto

- **Endpoint:** POST /api/contact
- **Body esperado:** { name, email, message }
- **Variables de entorno en Vercel:** EMAIL_USER, EMAIL_PASS

La función valida los datos con express-validator y envía el correo usando nodemailer con Gmail.

## Tests

El proyecto incluye tests unitarios para los servicios principales (DrawerService, ApiService, ThemeService). Para correrlos:
```bash
cd frontend
npm run test
```

## Internacionalización

El portfolio soporta español (default) e inglés. Los archivos de traducción están en `src/locale/`. Para agregar más textos traducibles, uso el atributo `i18n` en el HTML y luego corro `npm run extract-i18n`.

## CI/CD

Cada push a la rama main dispara el pipeline de GitHub Actions que:
- Instala dependencias
- Corre el build de produccion
- Ejecuta los tests unitarios
- Genera reporte de cobertura

## Características destacadas

### Scroll Reveal
Las secciones y tarjetas aparecen con animaciones suaves al hacer scroll, dando una sensación de fluidez en la navegación.

### Tema claro/oscuro
El toggle de tema persiste la preferencia del usuario en localStorage y actualiza las clases CSS en todo el documento.

### Proyectos parametrizables
Los proyectos del portfolio se pueden actualizar desde el archivo JSON en assets/data/proyectos.json sin tocar el código.

### Analytics
El sitio tiene preparado Google Analytics 4. Solo hay que reemplazar GA_MEASUREMENT_ID en el index.html por el ID de medición real.

## Contacto

- GitHub: @marcostoledo96
- LinkedIn: Marcos Ezequiel Toledo
- Email: marcostoledo96@gmail.com

## Licencia

Este proyecto es de código abierto. Podés usarlo como base para tu propio portfolio, pero agradezco si mencionas la fuente original.
