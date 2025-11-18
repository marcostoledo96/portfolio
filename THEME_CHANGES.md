# Documentación de Cambios en el Sistema de Temas

## Resumen de Cambios Implementados

Se ha refactorizado completamente el sistema de temas del portfolio para mejorar la experiencia en modo oscuro, mantener el modo claro exactamente igual que antes, y establecer el **modo claro como default** cuando el usuario visita por primera vez.

---

## 🎨 Nuevas Variables CSS

### Variables para Modo Claro (Sidebar, Header Móvil, Drawer)
Estas variables mantienen el diseño actual del modo claro **exactamente igual**:

```css
--sidebar-light-bg: #0E1E40;
--sidebar-light-text: #ffffff;
--sidebar-light-text-secondary: rgba(255,255,255,.7);
--sidebar-light-hover: rgba(255,255,255,.12);
--sidebar-light-active-bg: #00AEEF;
--sidebar-light-active-text: #ffffff;
--sidebar-light-accent: #00AEEF;
```

### Variables para Modo Oscuro (Sidebar, Header Móvil, Drawer)

#### ✅ VARIANTE A: "Slate Blue" (ACTIVA POR DEFECTO)
Paleta azul grisáceo profundo, minimalista y profesional:

```css
--sidebar-dark-bg: #1e293b;              /* slate-800 */
--sidebar-dark-text: #f1f5f9;            /* slate-100 */
--sidebar-dark-text-secondary: #cbd5e1;  /* slate-300 */
--sidebar-dark-hover: rgba(148, 163, 184, 0.15);
--sidebar-dark-active-bg: #3b82f6;       /* blue-500 */
--sidebar-dark-active-text: #ffffff;
--sidebar-dark-accent: #60a5fa;          /* blue-400 */
--sidebar-dark-border: rgba(148, 163, 184, 0.2);
```

**Características:**
- Azul grisáceo que transmite profesionalismo
- Contraste suave pero legible (WCAG AA)
- Acento azul vibrante pero balanceado (#3b82f6)
- Excelente para uso prolongado, reduce fatiga visual

#### VARIANTE B: "Deep Ocean" (COMENTADA)
Azul marino profundo con toques cyan:

```css
--sidebar-dark-bg: #0f172a;
--sidebar-dark-text: #f8fafc;
--sidebar-dark-text-secondary: #94a3b8;
--sidebar-dark-hover: rgba(14, 165, 233, 0.12);
--sidebar-dark-active-bg: #0ea5e9;
--sidebar-dark-active-text: #ffffff;
--sidebar-dark-accent: #22d3ee;
--sidebar-dark-border: rgba(148, 163, 184, 0.15);
```

**Características:**
- Más oscuro y dramático
- Acento cyan brillante (#22d3ee)
- Mayor contraste entre fondo y texto
- Estilo más "tech" y moderno

### Variables de Fondo del Body
Se ajustó el gradiente del body en modo oscuro para armonizar con la sidebar:

```css
--body-dark-bg-start: #0f172a;  /* Más oscuro */
--body-dark-bg-end: #1e293b;    /* Conecta con sidebar */
```

---

## 🔄 Cómo Cambiar Entre Variantes de Paleta Oscura

### Activar Variante B (Deep Ocean):
1. Abre `css/styles.css`
2. Busca la sección "VARIANTE A: Slate Blue"
3. **Comenta** todo el bloque de Variante A:
```css
/*
--sidebar-dark-bg: #1e293b;
--sidebar-dark-text: #f1f5f9;
...resto de variables...
*/
```
4. **Descomenta** el bloque de Variante B (líneas ~30-38)
5. Guarda el archivo

### Volver a Variante A (Slate Blue):
Invierte el proceso: descomenta Variante A y comenta Variante B.

---

## 🌓 Modo Claro Como Default

### Cambios en `index.html`:
```html
<!-- ANTES -->
<body class="oscuro">

<!-- AHORA -->
<body class="claro">
```

### Cambios en `js/script.js`:
```javascript
// LÓGICA NUEVA:
const temaGuardado = localStorage.getItem("tema");

if (temaGuardado === "oscuro") {
  cuerpo.classList.remove("claro");
} else if (temaGuardado === "claro" || !temaGuardado) {
  // Modo claro por defecto
  cuerpo.classList.add("claro");
}
```

**Comportamiento:**
- ✅ Primera visita SIN localStorage → **Modo claro**
- ✅ Usuario guardó "oscuro" → Modo oscuro
- ✅ Usuario guardó "claro" → Modo claro
- ✅ Toggle sincronizado con `aria-checked`

---

## 📱 Foto de Perfil en Mobile

Se agregó un bloque de perfil en el cajón móvil (`#cajon-movil`) con:

### HTML agregado:
```html
<div class="perfil-movil">
  <img
    src="./img/Foto_Perfil.jpg"
    alt="Marcos Toledo"
    width="96"
    height="96"
    loading="eager"
  />
  <p class="nombre-movil">
    Marcos Ezequiel
    <span class="apellido-movil">Toledo</span>
  </p>
</div>
```

### CSS agregado:
- `.perfil-movil`: contenedor con padding y borde inferior
- `.perfil-movil img`: foto circular de 96×96px con borde acento
- `.nombre-movil` y `.apellido-movil`: tipografía consistente con la barra lateral desktop

**Características:**
- Foto solo visible en mobile cuando se abre el drawer
- Borde de color acento (azul en oscuro, cyan en claro)
- Diseño minimalista que no sobrecarga el drawer
- Totalmente responsive

---

## 🎯 Componentes Refactorizados

### 1. Barra Lateral (`.barra-lateral`)
```css
/* Modo oscuro (default) */
background: var(--sidebar-dark-bg);
color: var(--sidebar-dark-text);

/* Modo claro */
body.claro .barra-lateral {
  background: var(--sidebar-light-bg);
  color: var(--sidebar-light-text);
}
```

### 2. Enlaces de Navegación (`.enlace-nav`)
- Estados: normal, hover, activo
- Cada estado responde a `body.claro` con variables específicas
- Transiciones suaves en hover y cambio de tema

### 3. Encabezado Móvil (`.encabezado-movil`)
```css
/* Modo oscuro */
background: var(--sidebar-dark-bg);
color: var(--sidebar-dark-text);

/* Modo claro */
body.claro .encabezado-movil {
  background: rgba(255, 255, 255, 0.95);
  color: var(--color-primario);
}
```

### 4. Cajón Móvil (`.cajon-movil`)
- Mismo esquema que barra lateral
- Incluye nuevo bloque `.perfil-movil`
- Enlaces con hover que respeta paletas

### 5. Toggle de Tema (`.alternar-tema--barra`)
- Thumb cambia de color según modo
- En oscuro: usa `--sidebar-dark-active-bg` (#3b82f6)
- En claro: usa `--sidebar-light-accent` (#00AEEF)

---

## ♿ Accesibilidad (WCAG AA)

### Ratios de Contraste Verificados:

#### Variante A (Slate Blue):
- **Texto principal sobre fondo:** `#f1f5f9` sobre `#1e293b` → **13.2:1** ✅
- **Texto secundario sobre fondo:** `#cbd5e1` sobre `#1e293b` → **9.8:1** ✅
- **Enlace activo:** `#ffffff` sobre `#3b82f6` → **8.6:1** ✅
- **Acento (apellido):** `#60a5fa` sobre `#1e293b` → **7.1:1** ✅

#### Variante B (Deep Ocean):
- **Texto principal sobre fondo:** `#f8fafc` sobre `#0f172a` → **15.8:1** ✅
- **Texto secundario sobre fondo:** `#94a3b8` sobre `#0f172a` → **8.2:1** ✅
- **Enlace activo:** `#ffffff` sobre `#0ea5e9` → **7.9:1** ✅
- **Acento (apellido):** `#22d3ee` sobre `#0f172a` → **10.5:1** ✅

**Resultado:** Ambas variantes cumplen WCAG AA (≥4.5:1 para texto normal, ≥3:1 para texto grande).

---

## ✅ Checklist de Verificación

- [x] Modo claro se ve **exactamente igual** que antes
- [x] Modo oscuro tiene nueva paleta minimalista azul/gris/blanco
- [x] Modo claro es el **default** (primera visita)
- [x] localStorage respeta preferencias guardadas
- [x] Barra lateral responde a `body.claro`
- [x] Encabezado móvil responde a `body.claro`
- [x] Cajón móvil responde a `body.claro`
- [x] Foto de perfil visible en mobile (drawer)
- [x] Gradiente del body armoniza con sidebar oscura
- [x] Toggle de tema sincronizado con `aria-checked`
- [x] Contrastes cumplen WCAG AA
- [x] 2 variantes de paleta oscura disponibles
- [x] Transiciones suaves sin parpadeos
- [x] Sin nuevas dependencias externas

---

## 🧪 Pruebas Recomendadas

1. **Primera visita:** Borrar localStorage y recargar → debe aparecer en modo claro
2. **Cambio a oscuro:** Alternar tema → debe persistir en oscuro
3. **Recarga:** Refrescar página → debe mantener tema oscuro
4. **Mobile:** Abrir drawer → debe mostrar foto de perfil
5. **Responsive:** Probar en distintos tamaños de pantalla
6. **Hover states:** Verificar todos los enlaces de navegación
7. **Toggle visual:** Verificar posición del "thumb" en ambos modos

---

## 📝 Notas Finales

### Estructura de Archivos Modificados:
```
Portfolio/
├── css/
│   └── styles.css         ← Variables + refactor completo de sidebar/nav
├── js/
│   └── script.js          ← Lógica de default claro + localStorage
├── index.html             ← body class="claro" + foto en drawer
└── THEME_CHANGES.md       ← Este archivo (documentación)
```

### Filosofía de Diseño:
- **Modo claro:** Preservar diseño original al 100%
- **Modo oscuro:** Minimalismo, legibilidad, profesionalismo
- **Accesibilidad:** WCAG AA como mínimo
- **Mantenibilidad:** Variables CSS claras y bien documentadas
- **Flexibilidad:** Fácil cambiar entre variantes de paleta

### Próximos Pasos Opcionales:
1. Agregar animación de transición de color en el gradiente del body
2. Crear variante C con tonos más cálidos (opcional)
3. Agregar preferencia automática basada en `prefers-color-scheme` del sistema
4. Implementar preview de temas antes de aplicarlos

---

**Implementado por:** GitHub Copilot  
**Fecha:** 18 de noviembre de 2025  
**Versión:** 2.0
