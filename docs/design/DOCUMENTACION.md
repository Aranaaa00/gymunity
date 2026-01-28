# Documentación de Diseño - Gymunity

## Índice

### 1. Arquitectura CSS y comunicación visual
- [1.1 Principios de comunicación visual](#11-principios-de-comunicación-visual)
  - Jerarquía
  - Contraste
  - Alineación
  - Proximidad
  - Repetición
- [1.2 Metodología CSS](#12-metodología-css)
- [1.3 Organización de archivos](#13-organización-de-archivos)
- [1.4 Sistema de Design Tokens](#14-sistema-de-design-tokens)
  - Layout
  - Paleta de colores
  - Colores para buscador
  - Colores semánticos
  - Escala de grises
  - Colores de texto
  - Modo oscuro
  - Variables CSS (Custom Properties)
  - Tipografía
  - Espaciado
  - Breakpoints
  - Sombras
  - Z-index
  - Bordes y radios
  - Transiciones
- [1.5 Mixins y funciones](#15-mixins-y-funciones)
  - respond-down
  - flex-center
  - box-shadow
- [1.6 ViewEncapsulation en Angular](#16-viewencapsulation-en-angular)
  - Modos de encapsulación
  - Uso del selector :host
  - Buenas prácticas

### 2. HTML semántico y estructura
- [2.1 Elementos semánticos utilizados](#21-elementos-semánticos-utilizados)
- [2.2 Jerarquía de headings](#22-jerarquía-de-headings)
- [2.3 Estructura de formularios](#23-estructura-de-formularios)

### 3. Sistema de componentes UI
- [3.1 Componentes implementados](#31-componentes-implementados)
  - Botón
  - Alerta
  - Notificación / Toast
  - Card
  - Card Image
  - Campo de formulario
  - Área de texto
  - Selector
  - Buscador
  - Botón tema
  - Ventana emergente
  - Icono
  - Sección bienvenida
  - Spinner
  - Carga global
  - Acordeón
  - Tabs
  - Breadcrumbs
  - Menu usuario
  - Formulario login
  - Formulario registro
  - Formulario perfil
  - Tooltip
  - Tarjeta profesor
- [3.2 Nomenclatura y metodología BEM](#32-nomenclatura-y-metodología-bem)
- [3.3 Style Guide](#33-style-guide)
  - Botones
  - Alertas
  - Cards
  - Formularios
  - Buscador
  - Colores

### 4. Sistema Responsive
- [4.1 Breakpoints definidos](#41-breakpoints-definidos)
- [4.2 Estrategia responsive](#42-estrategia-responsive)
- [4.3 Container Queries](#43-container-queries)
- [4.4 Adaptaciones principales](#44-adaptaciones-principales)
- [4.5 Páginas implementadas](#45-páginas-implementadas)

### 5. Optimización multimedia
- [5.1 Formatos elegidos](#51-formatos-elegidos)
- [5.2 Herramientas utilizadas](#52-herramientas-utilizadas)
- [5.3 Resultados de optimización](#53-resultados-de-optimización)
- [5.4 Tecnologías implementadas](#54-tecnologías-implementadas)
- [5.5 Animaciones CSS](#55-animaciones-css)

### 6. Sistema de temas
- [6.1 Variables de tema](#61-variables-de-tema)
- [6.2 Implementación del Theme Switcher](#62-implementación-del-theme-switcher)
- [6.3 Capturas comparativas](#63-capturas-comparativas)

### 7. Aplicación completa y despliegue
- [7.1 Estado final de la aplicación](#71-estado-final-de-la-aplicación)
- [7.2 Testing multi-dispositivo](#72-testing-multi-dispositivo)
- [7.3 Testing en dispositivos reales](#73-testing-en-dispositivos-reales)
- [7.4 Verificación multi-navegador](#74-verificación-multi-navegador)
- [7.5 Capturas finales](#75-capturas-finales)
- [7.6 Despliegue](#76-despliegue)
- [7.7 Problemas conocidos y mejoras futuras](#77-problemas-conocidos-y-mejoras-futuras)

---

# Sección 1: Arquitectura CSS y comunicación visual

En esta sección explico cómo he organizado todo el sistema visual de Gymunity: desde los principios de diseño que guían las decisiones, hasta la estructura de archivos y los tokens que uso en todo el proyecto.

---

## 1.1 Principios de comunicación visual

He aplicado los cinco principios fundamentales de comunicación visual para que la interfaz sea clara, coherente y fácil de usar.

### Jerarquía

La jerarquía visual ayuda al usuario a entender qué es más importante. En Gymunity uso distintos tamaños de texto y pesos para crear niveles de importancia:

- Los **títulos principales** son grandes (2rem) y en negrita para que sean lo primero que se vea
- Los **subtítulos** usan un tamaño intermedio (1.5rem) para dividir el contenido en secciones
- El **texto de las tarjetas** es más pequeño (1rem) y sirve para la información de detalle
- Los **metadatos** como direcciones o valoraciones van en gris y tamaño pequeño (0.75rem)

![Jerarquía visual en Gymunity](img/figma-jerarquia.png)

### Contraste

El contraste sirve para diferenciar elementos y destacar lo importante. En el proyecto uso:

- Un **header oscuro** (#042A2B) que contrasta con el fondo claro de la página
- **Botones verdes** (#34C6A0) que destacan sobre fondos claros para llamar la atención
- **Colores semánticos** diferenciados: verde para éxito, rojo para errores, naranja para avisos
- En **modo oscuro**, los colores de acento son más vibrantes (#00E5A0) para mantener el contraste

![Contraste de colores en la interfaz](img/figma-contraste.png)

### Alineación

Para que el diseño se vea ordenado, uso una estrategia de alineación consistente:

- El **contenido principal** está centrado con un ancho máximo de 64rem
- Las **tarjetas** se organizan en un grid que se adapta automáticamente al espacio disponible
- Los **formularios** están alineados a la izquierda para facilitar la lectura
- El **header** usa `space-between` para distribuir logo, buscador y botones

![Alineación en grids y formularios](img/figma-alineacion.png)

### Proximidad

Agrupo los elementos relacionados usando espaciado consistente:

- **Dentro de las tarjetas** uso espacios pequeños (16-24px) entre elementos
- **Entre secciones** uso espacios grandes (32-48px) para separar bloques
- **En los grids** mantengo un gap uniforme entre tarjetas

De esta forma el usuario entiende qué elementos van juntos y cuáles son independientes.

![Espaciado y proximidad entre elementos](img/figma-proximidad.png)

### Repetición

Para crear coherencia visual, repito los mismos patrones en toda la aplicación:

- La **paleta de colores** es limitada y se usa de forma consistente
- Los **bordes redondeados** son siempre iguales (4px para botones, 8px para tarjetas)
- Las **sombras** están estandarizadas en tres niveles (pequeña, media, grande)
- Las **transiciones** duran lo mismo en todos los elementos interactivos

![Patrones repetidos en componentes](img/figma-repeticion.png)

---

## 1.2 Metodología CSS

Uso **BEM (Bloque, Elemento, Modificador)** para nombrar las clases CSS. Esta metodología me ayuda a mantener el código organizado y predecible.

### ¿Por qué BEM?

- **Es claro**: con leer el nombre de la clase ya sé qué es y a qué pertenece
- **Evita conflictos**: cada componente tiene su propio "namespace"
- **Escala bien**: puedo añadir componentes nuevos sin romper los existentes

### Cómo lo uso

**Bloque**: el componente principal
```scss
.card { }
.boton { }
.gym-header { }
```

**Elemento**: una parte interna del bloque (con `__`)
```scss
.card__image { }
.card__title { }
.gym-header__logo { }
```

**Modificador**: una variante o estado (con `--`)
```scss
.card--horizontal { }
.boton--primary { }
.boton--disabled { }
```

### Ejemplos del proyecto

```scss
// Header
.gym-header { }              // Bloque
.gym-header__logo { }        // Elemento: el logo
.gym-header__nav { }         // Elemento: la navegación
.gym-header__nav--abierto { } // Modificador: menú abierto

// Botón
.boton { }
.boton--primary { }
.boton--secondary { }
.boton--sm { }
.boton--lg { }

// Card
.card { }
.card__image { }
.card__body { }
.card__title { }
.card--featured { }
```

---

## 1.3 Organización de archivos

Sigo la arquitectura **ITCSS (Inverted Triangle CSS)**, que organiza los estilos de menor a mayor especificidad. Esto evita problemas con la cascada CSS.

### Estructura de carpetas

```
frontend/src/
├── styles/
│   ├── 00-settings/           ← Variables (no genera CSS)
│   │   ├── _variables.scss
│   │   └── _css-variables.scss
│   ├── 01-tools/              ← Mixins (no genera CSS)
│   │   └── _mixins.scss
│   ├── 02-generic/            ← Reset y base
│   │   └── _reset.scss
│   ├── 03-elements/           ← Estilos de elementos HTML
│   │   └── _elements.scss
│   ├── 04-layout/             ← Grids, contenedores, globales
│   │   ├── _layout.scss
│   │   └── _globals.scss
│   └── main.scss              ← Importa todo en orden
├── styles.scss                ← Solo hace @use de main.scss
└── app/componentes/           ← Estilos de cada componente
```

### Por qué este orden

Las capas van de menor a mayor especificidad:

| Capa | Qué contiene | Ejemplo |
|------|--------------|---------|
| Settings | Variables, no genera CSS | `$color-botones` |
| Tools | Mixins, no genera CSS | `@mixin respond-down` |
| Generic | Reset, selectores generales | `*, body` |
| Elements | Estilos de elementos HTML | `h1, p, a` |
| Layout | Clases de estructura | `.gym-grid` |
| Components | Estilos de componentes | `.card`, `.boton` |

Importando en este orden, los estilos más específicos siempre ganan sin necesidad de `!important`.

---

## 1.4 Sistema de Design Tokens

Los design tokens son las variables centralizadas que definen los valores base del diseño. Si cambio un token, se actualiza toda la aplicación.

### Colores principales

| Token | Valor HSL | Hex | Uso |
|-------|-----------|-----|-----|
| `$color-header` | hsl(181, 79%, 9%) | #042A2B | Header y fondos oscuros |
| `$color-fondo` | hsl(160, 56%, 95%) | #EAF8F4 | Fondo general de la página |
| `$color-botones` | hsl(162, 56%, 49%) | #34C6A0 | Botones y acciones principales |
| `$color-botones-hover` | hsl(162, 61%, 42%) | #2AAE8E | Estado hover de botones |

**¿Por qué estos colores?** La paleta verde transmite salud, energía y bienestar, conceptos asociados con gimnasios y fitness.

### Colores semánticos

| Token | Valor HSL | Hex | Uso |
|-------|-----------|-----|-----|
| `$color-exito` | hsl(145, 63%, 49%) | #2ECC71 | Mensajes de éxito |
| `$color-error` | hsl(6, 78%, 57%) | #E74C3C | Errores de validación |
| `$color-warning` | hsl(36, 100%, 57%) | #FFA726 | Advertencias |
| `$color-info` | hsl(210, 79%, 46%) | #1976D2 | Información neutral |

Son los colores universales que cualquier usuario reconoce.

### Modo oscuro

Para el modo oscuro uso versiones más vibrantes de los colores para mantener el contraste:

| Token | Valor HSL | Hex | Diferencia |
|-------|-----------|-----|------------|
| `$oscuro-fondo` | hsl(180, 29%, 8%) | #0F1C1C | Fondo oscuro con tinte verde |
| `$oscuro-boton` | hsl(161, 100%, 45%) | #00E5A0 | Verde neón, más brillante |
| `$oscuro-texto` | hsl(160, 47%, 97%) | #F0FAF7 | Texto claro |

### Tipografía

```scss
$fuente-principal: 'Roboto', Arial, sans-serif;
```

Uso Roboto porque es una fuente moderna, legible en pantalla y con muchos pesos disponibles.

**Escala de tamaños:**
- `$texto-xs` (12px): metadatos pequeños
- `$texto-s` (16px): texto base
- `$texto-m` (24px): subtítulos
- `$texto-l` (32px): títulos de sección
- `$texto-xl` (40px): títulos grandes

**Pesos:**
- `$font-weight-regular` (400): texto normal
- `$font-weight-medium` (500): botones
- `$font-weight-semibold` (600): subtítulos
- `$font-weight-bold` (700): títulos

### Espaciado

Sistema basado en múltiplos de 8px:

| Token | Valor | Uso típico |
|-------|-------|------------|
| `$space-1` | 8px | Espaciado mínimo |
| `$space-2` | 16px | Espaciado estándar |
| `$space-3` | 24px | Padding interno |
| `$space-4` | 32px | Separación entre secciones |
| `$space-6` | 48px | Gap en grids grandes |

**¿Por qué 8px?** Es un estándar en diseño de interfaces porque se divide fácilmente (8, 4, 2) y escala bien (16, 24, 32...).

### Breakpoints

Uso estrategia **desktop-first** con `max-width`:

| Breakpoint | Valor | Dispositivo |
|------------|-------|-------------|
| `$breakpoint-sm` | 640px | Móviles |
| `$breakpoint-md` | 768px | Tablets vertical |
| `$breakpoint-lg` | 1024px | Tablets horizontal |
| `$breakpoint-xl` | 1280px | Desktop |

### Sombras

Tres niveles de sombra según la importancia del elemento:

```scss
$shadow-sm: 0 1px 4px rgba(0,0,0,0.08);   // Inputs, hovers suaves
$shadow-md: 0 2px 8px rgba(0,0,0,0.16);   // Cards, dropdowns
$shadow-lg: 0 4px 16px rgba(0,0,0,0.24);  // Modales
```

Los botones tienen sombras verdes para reforzar la identidad de marca.

### Transiciones

```scss
$transicion-rapida: 0.15s ease;      // Hovers rápidos
$transicion-estandar: 0.3s ease;     // Cambios de estado
$transicion-lenta: 0.5s ease;        // Animaciones de entrada
$transicion-tema: 0.4s ease-in-out;  // Cambio de tema (sincronizado en toda la app)
```

La variable `$transicion-tema` se usa en **todos los elementos con background** para que el cambio entre modo claro y oscuro sea uniforme y sin desfases visibles.

---

## 1.5 Mixins

Los mixins son bloques de CSS reutilizables que defino en `_mixins.scss`.

### respond-down

Aplica estilos responsive con enfoque desktop-first:

```scss
.elemento {
  padding: $space-6;           // Desktop por defecto

  @include respond-down(lg) {
    padding: $space-4;         // Hasta 1023px
  }

  @include respond-down(md) {
    padding: $space-3;         // Hasta 767px
  }

  @include respond-down(sm) {
    padding: $space-2;         // Hasta 639px
  }
}
```

### flex-center

Centra un elemento en ambos ejes:

```scss
.modal__overlay {
  @include flex-center;
  position: fixed;
  inset: 0;
}
```

### box-shadow

Aplica sombras predefinidas:

```scss
.card {
  @include box-shadow;              // Usa $shadow-md por defecto
}

.boton--primary {
  @include box-shadow($shadow-boton);  // Sombra verde
}
```

---

## 1.6 ViewEncapsulation en Angular

Angular encapsula los estilos de cada componente por defecto. Esto significa que los estilos de un componente no afectan a otros.

### Estrategia elegida

Uso **Emulated** (el modo por defecto) porque:

1. **Aísla los estilos**: cada componente tiene sus propias reglas sin conflictos
2. **Compatible con todos los navegadores**: no depende de Shadow DOM nativo
3. **Permite usar `:host`**: para estilar el elemento raíz del componente

### Uso de :host

Cuando necesito estilar el elemento raíz del componente según una clase dinámica:

```scss
// INCORRECTO - no funciona con encapsulación
.acordeon-item--expandido .acordeon__contenido {
  grid-template-rows: 1fr;
}

// CORRECTO - funciona con encapsulación
:host.acordeon-item--expandido .acordeon__contenido {
  grid-template-rows: 1fr;
}
```

### Buenas prácticas

- Usar `:host` para estilar el elemento raíz
- Evitar `::ng-deep` porque está deprecado
- Usar CSS Custom Properties para comunicar valores entre componentes
- Preferir composición sobre herencia

---

## Sección 2: HTML semántico y estructura

En esta sección explico cómo organizo el HTML del proyecto usando etiquetas semánticas, la estrategia de headings que sigo y cómo estructuro los formularios para que sean accesibles.

---

## 2.1 Elementos semánticos utilizados

Uso etiquetas HTML5 semánticas en lugar de `<div>` genéricos. Esto tiene dos ventajas principales: mejora la accesibilidad (los lectores de pantalla entienden mejor la estructura) y ayuda al SEO (los buscadores indexan mejor el contenido).

### Elementos que uso

| Elemento | Para qué lo uso |
|----------|-----------------|
| `<header>` | La cabecera de la página con logo, buscador y navegación |
| `<nav>` | Zonas de navegación (menú principal, redes sociales) |
| `<main>` | El contenido principal de cada página |
| `<section>` | Agrupar contenido relacionado dentro de una página |
| `<article>` | Contenido que tiene sentido por sí solo (tarjetas, posts) |
| `<aside>` | Contenido secundario (mensajes de ayuda, sidebars) |
| `<footer>` | El pie de página con información de contacto |
| `<search>` | El área del buscador (elemento HTML5.2) |

### Ejemplo: Header

El header contiene el logo, el buscador y los botones de acción. Uso `<search>` para envolver el buscador porque semánticamente indica que ahí hay una funcionalidad de búsqueda.

```html
<header class="gym-header">
  <section class="gym-header__top">
    <a class="gym-header__logo" routerLink="/" aria-label="Ir a inicio">
      <picture>
        <source media="(max-width: 480px)" srcset="assets/logo-blanco-small.webp">
        <source media="(max-width: 768px)" srcset="assets/logo-blanco-medium.webp">
        <img src="assets/logo-blanco-large.webp" alt="Gymunity" loading="eager">
      </picture>
    </a>

    <search class="gym-header__buscador">
      <app-buscador placeholder="Buscar gimnasios..." />
    </search>

    <section class="gym-header__acciones">
      <app-theme-switcher aria-label="Cambiar tema" />
      <nav class="gym-header__nav" role="navigation">
        <app-boton variante="ghost" tamano="sm">Iniciar Sesión</app-boton>
        <app-boton variante="primary" tamano="sm">Registrarse</app-boton>
      </nav>
    </section>
  </section>
</header>
```

### Ejemplo: Main

El main es muy sencillo. Uso `<ng-content>` para proyectar el contenido de cada página dentro del layout.

```html
<main class="gym-main">
  <ng-content></ng-content>
</main>
```

### Ejemplo: Footer

El footer tiene dos `<article>`: uno para la marca (logo + slogan) y otro para el contacto. Dentro del contacto hay un `<nav>` con los enlaces a redes sociales.

```html
<footer class="gym-footer">
  <section class="gym-footer__container">
    <article class="gym-footer__brand">
      <picture class="gym-footer__logo">
        <source media="(max-width: 480px)" srcset="assets/logo-blanco-small.webp">
        <img src="assets/logo-blanco-large.webp" alt="Gymunity" loading="lazy">
      </picture>
      <p class="gym-footer__slogan">Conecta con los mejores gimnasios y torneos de artes marciales.</p>
    </article>
    
    <article class="gym-footer__contacto">
      <p class="gym-footer__email">contacto@gymunity.com</p>
      <nav class="gym-footer__social" aria-label="Redes sociales">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <app-icono nombre="instagram" tamano="lg" />
        </a>
        <a href="mailto:contacto@gymunity.com" aria-label="Email">
          <app-icono nombre="email" tamano="lg" />
        </a>
      </nav>
    </article>
  </section>
  
  <p class="gym-footer__copyright">© 2025 Gymunity. Todos los derechos reservados.</p>
</footer>
```

---

## 2.2 Jerarquía de headings

Los headings (`<h1>` a `<h6>`) estructuran el contenido de la página. Sigo unas reglas claras para mantener la jerarquía correcta:

### Reglas que sigo

1. **Solo un `<h1>` por página**: es el título principal, lo más importante
2. **`<h2>` para secciones principales**: dividen el contenido en bloques grandes
3. **`<h3>` para subsecciones**: contenido dentro de las secciones
4. **Nunca saltar niveles**: no paso de `<h1>` a `<h3>` directamente, siempre uso `<h2>` en medio

### Diagrama de jerarquía

Así queda la estructura de headings en las páginas principales:

```
PÁGINA DE INICIO
└── h1: "Encuentra el gimnasio perfecto para ti"
    ├── h2: "Gimnasios más populares"
    │   ├── h3: "Smart Fit Centro"
    │   ├── h3: "CrossFit Valencia"
    │   └── h3: "Gimnasio Olimpia"
    └── h2: "Nuevos gimnasios en Gymunity"
        ├── h3: "Dojo Karate Madrid"
        └── h3: "Fight Club BCN"
```

```
PÁGINA DE BÚSQUEDA
└── h1: "Resultados de búsqueda"
    ├── h3: "Smart Fit Centro"
    ├── h3: "CrossFit Valencia"
    └── h3: "Gimnasio Olimpia"
```

```
PÁGINA DE DETALLE DE GIMNASIO
└── h1: "Smart Fit Centro"
    ├── h2: "Profesores y artes impartidas"
    ├── h2: "Torneos disponibles"
    │   └── h3: "Torneo de Judo Primavera"
    └── h2: "Reseñas de alumnos"
        ├── h3: "Juan García"
        └── h3: "María López"
```

### Por qué es importante

- Los **lectores de pantalla** usan los headings para navegar por la página
- Los **buscadores** entienden mejor la estructura del contenido
- El **usuario** puede escanear la página más fácilmente

---

## 2.3 Estructura de formularios

Los formularios siguen las pautas de accesibilidad WCAG. Cada campo tiene su label asociado correctamente y uso atributos ARIA cuando es necesario.

### Elementos que uso

| Elemento | Para qué |
|----------|----------|
| `<form>` | Contenedor del formulario |
| `<fieldset>` | Agrupa campos relacionados |
| `<legend>` | Título del grupo de campos |
| `<label>` | Etiqueta del campo, asociada con `for` |
| `<input>` | Campo de entrada con `id` único |
| `<aside>` | Mensajes de ayuda o error |

### Asociación label-input

La asociación entre `<label>` y `<input>` se hace mediante los atributos `for` e `id`. Cuando el usuario hace clic en el label, se activa el input correspondiente. Esto mejora mucho la usabilidad, especialmente en móviles donde los campos son pequeños.

```html
<!-- El for del label coincide con el id del input -->
<label for="email-registro">Email</label>
<input type="email" id="email-registro" name="email">
```

### Componente campo-formulario

He creado un componente reutilizable que encapsula toda la lógica del campo: label, input, mensajes de error y estados de validación.

```html
<!-- Estructura del componente campo-formulario -->

<label class="campo-formulario__label" [for]="inputId()">
  {{ label() }}
  @if (required()) {
    <abbr class="campo-formulario__required" title="Campo obligatorio">*</abbr>
  }
</label>

<input 
  class="campo-formulario__field"
  [class.campo-formulario__field--error]="hasError()"
  [class.campo-formulario__field--validando]="validando()"
  [type]="type()"
  [id]="inputId()"
  [name]="name()"
  [placeholder]="placeholder()"
  [required]="required()"
  [attr.aria-describedby]="hasError() ? inputId() + '-error' : null"
  [attr.aria-invalid]="hasError()"
/>

<aside class="campo-formulario__mensaje-container">
  @if (validando()) {
    <small class="campo-formulario__validando" role="status">Verificando...</small>
  } @else if (hasError() && errorMessage()) {
    <small class="campo-formulario__error" [id]="inputId() + '-error'" role="alert">
      {{ errorMessage() }}
    </small>
  } @else if (helpText()) {
    <small class="campo-formulario__help" [id]="inputId() + '-help'">
      {{ helpText() }}
    </small>
  }
</aside>
```

### Atributos ARIA utilizados

| Atributo | Para qué |
|----------|----------|
| `aria-describedby` | Vincula el input con su mensaje de ayuda o error |
| `aria-invalid` | Indica si el campo tiene un error de validación |
| `role="alert"` | Los lectores de pantalla anuncian el error inmediatamente |
| `role="status"` | Anuncia cambios de estado sin interrumpir |

### Ejemplo de formulario completo

Así queda un formulario de registro usando el componente:

```html
<form class="formulario-auth" (ngSubmit)="onSubmit()">
  <fieldset class="formulario-auth__fieldset">
    <legend class="formulario-auth__legend">Crear cuenta</legend>
    
    <app-campo-formulario
      label="Nombre de usuario"
      type="text"
      inputId="registro-usuario"
      name="usuario"
      [required]="true"
      helpText="Entre 3 y 20 caracteres"
    />
    
    <app-campo-formulario
      label="Email"
      type="email"
      inputId="registro-email"
      name="email"
      [required]="true"
    />
    
    <app-campo-formulario
      label="Contraseña"
      type="password"
      inputId="registro-password"
      name="password"
      [required]="true"
      helpText="Mínimo 8 caracteres"
    />
    
    <app-boton variante="primary" tipo="submit">
      Crear cuenta
    </app-boton>
  </fieldset>
</form>
```

El `<fieldset>` agrupa todos los campos del formulario y el `<legend>` indica el propósito ("Crear cuenta"). Cada campo tiene su label asociado y los mensajes de error aparecen vinculados con `aria-describedby`.

---

# Sección 3: Sistema de componentes UI

En esta sección documento todos los componentes que he creado para Gymunity. Cada componente está pensado para ser reutilizable, accesible y coherente con el sistema de diseño. Explico también la nomenclatura BEM que sigo y la guía de estilo visual donde se pueden ver todos funcionando.

---

## 3.1 Componentes implementados

He creado 24 componentes reutilizables. Para cada uno indico su propósito, las variantes que tiene, los tamaños disponibles, los estados que maneja y un ejemplo de cómo usarlo.

---

#### **Botón** (`app-boton`)

**Nombre:** Botón

**Para qué sirve:** Acciones tipo enviar formularios, abrir modales o navegar.

**Variantes:**
- `primary`: acción principal (fondo verde)
- `secondary`: acción secundaria (fondo gris)
- `ghost`: terciaria (transparente con borde)
- `danger`: acción destructiva (fondo rojo)

**Tamaños:**
- `sm`: pequeño
- `md`: mediano (por defecto)
- `lg`: grande

**Estados:**
- Normal
- Hover
- Active
- Focus
- Disabled

**Ejemplo de uso:**
```html
<app-boton variante="primary" tamanio="md" tipo="submit">
  Registrarse
</app-boton>

<app-boton variante="ghost" tamanio="sm" [disabled]="true">
  Cancelar
</app-boton>
```

---

#### **Alerta** (`app-alerta`)

**Nombre:** Alerta

**Para qué sirve:** Mostrar mensajes de feedback al usuario después de una acción.

**Variantes:**
- `success`: operación correcta
- `error`: ha habido un problema
- `warning`: aviso
- `info`: información general

**Tamaños:** Uno solo, se adapta al contenido

**Estados:**
- Visible
- Cerrable (con botón X)

**Ejemplo de uso:**
```html
<app-alerta 
  tipo="success" 
  mensaje="Registro completado correctamente" 
  [cerrable]="true">
</app-alerta>

<app-alerta 
  tipo="error" 
  mensaje="Email no válido">
</app-alerta>
```

---

#### **Notificación** (`app-notificacion`)

**Nombre:** Notificación

**Para qué sirve:** Mostrar mensajes toast temporales en una esquina de la pantalla.

**Variantes:**
- `success`: confirmación
- `error`: fallo
- `warning`: aviso
- `info`: información

**Tamaños:** Fijo

**Estados:**
- Visible con temporizador (5s por defecto)
- Se puede cerrar a mano

**Ejemplo de uso:**
```html
<app-notificacion 
  tipo="success" 
  mensaje="Cambios guardados" 
  [duracion]="3000"
  [visible]="mostrarNotif"
  (cerrar)="mostrarNotif = false">
</app-notificacion>
```

---

#### **Card** (`app-card`)

**Nombre:** Card (Tarjeta de gimnasio)

**Para qué sirve:** Mostrar info de gimnasios con imagen, título, subtítulo, rating y botón.

**Variantes:**
- `vertical`: imagen arriba
- `horizontal`: imagen a la izquierda

**Tamaños:**
- Vertical: ancho fluido
- Horizontal: max-width 56rem

**Estados:**
- Normal
- Hover (sube un poco, borde verde, zoom en imagen)

**Ejemplo de uso:**
```html
<app-card
  variant="vertical"
  title="Fitness Park"
  subtitle="Boxeo, Karate"
  rating="4.3 ⭐"
  imageSrc="assets/gimnasio1.jpg"
  imageAlt="Gimnasio Fitness Park">
</app-card>

<app-card
  variant="horizontal"
  title="Smart Fit"
  subtitle="MMA, Boxeo"
  rating="3.9 ⭐"
  imageSrc="assets/smart-fit.jpg"
  imageAlt="Smart Fit">
</app-card>
```

---

#### **Campo de formulario** (`app-campo-formulario`)

**Nombre:** Campo de formulario

**Para qué sirve:** Input de texto con label, validación y mensajes de ayuda o error.

**Variantes:** Ninguna

**Tamaños:** Ancho fluido

**Estados:**
- Normal
- Hover
- Focus
- Error
- Disabled

**Ejemplo de uso:**
```html
<app-campo-formulario
  label="Correo electrónico"
  type="email"
  inputId="email"
  name="email"
  [required]="true"
  helpText="Usa tu email personal"
  errorMessage="Email no válido">
</app-campo-formulario>
```

---

#### **Área de texto** (`app-area-texto`)

**Nombre:** Área de texto

**Para qué sirve:** Input multilínea para textos largos (comentarios, descripciones…).

**Variantes:** Ninguna

**Tamaños:** Altura configurable por número de filas

**Estados:**
- Normal
- Hover
- Focus
- Error
- Disabled

**Ejemplo de uso:**
```html
<app-area-texto
  label="Comentario"
  inputId="comentario"
  name="comentario"
  [filas]="4"
  [required]="true">
</app-area-texto>
```

---

#### **Selector** (`app-selector`)

**Nombre:** Selector

**Para qué sirve:** Dropdown para elegir una opción de una lista.

**Variantes:** Ninguna

**Tamaños:** Ancho fluido

**Estados:**
- Normal
- Hover
- Focus
- Error
- Disabled

**Ejemplo de uso:**
```html
<app-selector
  label="Arte marcial"
  inputId="arte"
  name="arte"
  [opciones]="['Karate', 'Judo', 'Boxeo', 'MMA']"
  [required]="true">
</app-selector>
```

---

#### **Buscador** (`app-buscador`)

**Nombre:** Buscador

**Para qué sirve:** Input de búsqueda con icono, expandible en móvil.

**Variantes:** Ninguna

**Tamaños:** Compacto en móvil, expandido en escritorio

**Estados:**
- Normal
- Hover
- Focus
- Expandido (móvil)

**Ejemplo de uso:**
```html
<app-buscador 
  placeholder="Buscar gimnasios..." 
  (buscar)="onBuscar($event)">
</app-buscador>
```

---

#### **Botón tema** (`app-boton-tema`)

**Nombre:** Botón tema

**Para qué sirve:** Cambiar entre modo claro y oscuro.

**Variantes:** Ninguna

**Tamaños:** Uno solo

**Estados:**
- Normal
- Hover
- Active (cambia icono sol/luna según el tema)

**Ejemplo de uso:**
```html
<app-boton-tema aria-label="Cambiar tema"></app-boton-tema>
```

---

#### **Ventana emergente** (`app-ventana-emergente`)

**Nombre:** Ventana emergente (Modal)

**Para qué sirve:** Modal centrado con fondo oscuro para mostrar formularios o contenido importante.

**Variantes:** Ninguna

**Tamaños:** Ancho máximo fijo

**Estados:**
- Abierto (con animación fadeIn y slideUp)
- Cerrado

**Ejemplo de uso:**
```html
<app-ventana-emergente 
  [abierto]="modalAbierto" 
  (cerrar)="modalAbierto = false">
  <app-formulario-login></app-formulario-login>
</app-ventana-emergente>
```

---

#### **Icono** (`app-icono`)

**Nombre:** Icono

**Para qué sirve:** Wrapper para iconos Lucide con tamaño y color coherentes.

**Variantes:** Ninguna

**Tamaños:** 1.25rem × 1.25rem

**Estados:** Normal

**Ejemplo de uso:**
```html
<app-icono nombre="search"></app-icono>
<app-icono nombre="user"></app-icono>
<app-icono nombre="menu"></app-icono>
```

---

#### **Sección bienvenida** (`app-seccion-bienvenida`)

**Nombre:** Sección bienvenida

**Para qué sirve:** Hero de la página de inicio con título, subtítulo y botón principal.

**Variantes:** Ninguna

**Tamaños:** Responsivo

**Estados:** Normal

**Ejemplo de uso:**
```html
<app-seccion-bienvenida
  titulo="Encuentra el gimnasio perfecto"
  subtitulo="según tu estilo y tus metas"
  textoCta="Únete gratis"
  (clickCta)="abrirRegistro()">
</app-seccion-bienvenida>
```

---

#### **Spinner** (`app-spinner`)

**Nombre:** Spinner

**Para qué sirve:** Indicador de carga circular para operaciones asíncronas.

**Variantes:** Ninguna

**Tamaños:**
- `sm`: pequeño (24px)
- `md`: mediano (40px, por defecto)
- `lg`: grande (64px)

**Estados:**
- Normal (animación continua)
- Con porcentaje
- Con overlay (fondo oscuro)

**Ejemplo de uso:**
```html
<app-spinner tamano="md" texto="Cargando datos..."></app-spinner>

<app-spinner 
  tamano="lg" 
  [porcentaje]="75" 
  [overlay]="true">
</app-spinner>
```

---

#### **Carga global** (`app-carga-global`)

**Nombre:** Carga global

**Para qué sirve:** Overlay a pantalla completa para cuando hay que bloquear la interfaz mientras carga algo.

**Variantes:** Ninguna

**Tamaños:** Pantalla completa

**Estados:**
- Visible (cargando)
- Oculto
- Con mensaje
- Con porcentaje de progreso

**Ejemplo de uso:**
```html
<app-carga-global></app-carga-global>
```

---

#### **Acordeón** (`app-acordeon-item`)

**Nombre:** Acordeón

**Para qué sirve:** Panel colapsable para mostrar u ocultar contenido, típico de FAQs o secciones largas.

**Variantes:** Ninguna

**Tamaños:** Ancho fluido

**Estados:**
- Colapsado
- Expandido
- Hover en cabecera
- Focus (navegación por teclado)

**Ejemplo de uso:**
```html
<app-acordeon-item 
  titulo="¿Cómo me registro?" 
  icono="help-circle"
  [abierto]="false">
  <p>Para registrarte, haz clic en el botón "Registrarse"...</p>
</app-acordeon-item>
```

---

#### **Tabs** (`app-tabs`)

**Nombre:** Tabs

**Para qué sirve:** Navegar entre paneles de contenido mediante pestañas.

**Variantes:** Ninguna

**Tamaños:** Ancho fluido

**Estados:**
- Tab activo
- Tab inactivo
- Hover
- Focus
- Navegación por teclado (flechas, Home, End)

**Ejemplo de uso:**
```html
<app-tabs 
  [pestanas]="['Información', 'Horarios', 'Precios']"
  (tabCambiado)="onTabChange($event)">
</app-tabs>
```

---

#### **Breadcrumbs** (`app-breadcrumbs`)

**Nombre:** Breadcrumbs

**Para qué sirve:** Navegación jerárquica que muestra dónde está el usuario dentro de la app.

**Variantes:** Ninguna

**Tamaños:** Fijo

**Estados:**
- Visible (más de un nivel)
- Oculto (página raíz)
- Links clicables (niveles anteriores)
- Texto sin link (nivel actual)

**Ejemplo de uso:**
```html
<app-breadcrumbs></app-breadcrumbs>
<!-- Renderiza automáticamente: Inicio > Gimnasios > Smart Fit -->
```

---

#### **Menu usuario** (`app-menu-usuario`)

**Nombre:** Menú usuario

**Para qué sirve:** Dropdown con avatar del usuario y opciones de perfil, configuración y cerrar sesión.

**Variantes:** Ninguna

**Tamaños:** Fijo

**Estados:**
- Cerrado
- Abierto
- Se cierra al hacer clic fuera
- Se cierra con Escape

**Ejemplo de uso:**
```html
<app-menu-usuario></app-menu-usuario>
```

---

#### **Toast** (`app-toast`)

**Nombre:** Toast

**Para qué sirve:** Notificaciones temporales que no molestan, en una esquina de pantalla.

**Variantes:**
- `success`: confirmación (verde)
- `error`: fallo (rojo)
- `warning`: aviso (naranja)
- `info`: información (azul)

**Tamaños:** Fijo

**Estados:**
- Visible con temporizador
- Animación de entrada/salida
- Se puede cerrar a mano
- Se pausa al pasar el ratón por encima

**Ejemplo de uso:**
```html
<app-toast></app-toast>
<!-- Se controla mediante NotificacionService -->
```

---

#### **Card Image** (`app-card-image`)

**Nombre:** Card Image

**Para qué sirve:** Imagen optimizada para tarjetas con fallback y lazy loading.

**Variantes:**
- `vertical`: para cards verticales
- `horizontal`: para cards horizontales

**Tamaños:**
- `sm`: pequeño
- `md`: mediano (por defecto)
- `lg`: grande

**Estados:**
- Cargando
- Cargada
- Error (muestra placeholder)

**Ejemplo de uso:**
```html
<app-card-image 
  src="assets/gimnasio.jpg" 
  alt="Gimnasio Smart Fit"
  size="md"
  variant="vertical">
</app-card-image>
```

---

#### **Formulario login** (`app-formulario-login`)

**Nombre:** Formulario login

**Para qué sirve:** Formulario de inicio de sesión con validación.

**Variantes:** Ninguna

**Tamaños:** Fijo

**Estados:**
- Normal
- Validando
- Cargando (enviando)
- Error de servidor
- Campos con error de validación

**Ejemplo de uso:**
```html
<app-formulario-login 
  (enviar)="onLogin($event)"
  (irRegistro)="mostrarRegistro()"
  (cerrar)="cerrarModal()">
</app-formulario-login>
```

---

#### **Formulario registro** (`app-formulario-registro`)

**Nombre:** Formulario registro

**Para qué sirve:** Formulario de creación de cuenta con validación completa.

**Variantes:** Ninguna

**Tamaños:** Fijo

**Estados:**
- Normal
- Validación en tiempo real
- Validación asíncrona (usuario/email disponible)
- Indicador de fuerza de contraseña
- Cargando
- Error de servidor

**Ejemplo de uso:**
```html
<app-formulario-registro 
  (enviar)="onRegistro($event)"
  (irLogin)="mostrarLogin()"
  (cerrar)="cerrarModal()">
</app-formulario-registro>
```

---

#### **Formulario perfil** (`app-formulario-perfil`)

**Nombre:** Formulario perfil

**Para qué sirve:** Edición de datos del usuario con campos dinámicos.

**Variantes:** Ninguna

**Tamaños:** Fijo

**Estados:**
- Normal
- Editando
- Validación de campos
- Campos de redes sociales dinámicos (añadir/eliminar)
- Guardando cambios

**Ejemplo de uso:**
```html
<app-formulario-perfil 
  [datosIniciales]="usuario"
  (enviar)="onGuardarPerfil($event)"
  (cancelar)="onCancelar()">
</app-formulario-perfil>
```

---

#### **Tooltip** (`app-tooltip`)

**Nombre:** Tooltip

**Para qué sirve:** Información flotante que aparece al pasar el ratón sobre un elemento.

**Variantes:** Ninguna

**Posiciones:**
- `arriba`: encima del elemento (por defecto)
- `abajo`: debajo
- `izquierda`: a la izquierda
- `derecha`: a la derecha

**Estados:**
- Oculto
- Visible (con animación fadeIn)
- Se reposiciona solo si se sale del viewport

**Ejemplo de uso:**
```html
<app-tooltip texto="Más información" posicion="arriba">
  <button>Ayuda</button>
</app-tooltip>
```

---

#### **Tarjeta profesor** (`app-tarjeta-profesor`)

**Nombre:** Tarjeta profesor

**Para qué sirve:** Mostrar info de un profesor con imagen, nombre y enlace a su perfil.

**Variantes:** Ninguna (se adapta con Container Queries)

**Tamaños:** Fluido, según el contenedor

**Estados:**
- Normal
- Hover (se eleva un poco)
- Adaptación automática (contenedor < 300px)

**Ejemplo:**
```html
<app-tarjeta-profesor
  [profesor]="profesor"
  (click)="verPerfil(profesor.id)">
</app-tarjeta-profesor>
```

**Responsive:**
- Usa Container Queries para adaptarse al ancho del contenedor
- En contenedores estrechos (< 300px): oculta avatar, ajusta tipografía
- Más info en la sección 4.3 Container Queries

---

### 3.2 Nomenclatura y metodología BEM

Uso **BEM (Bloque-Elemento-Modificador)** para nombrar las clases CSS. Esta metodología hace que cada clase te diga qué es y dónde está, evitando conflictos y facilitando el mantenimiento.

#### Estructura BEM

| Tipo | Sintaxis | Qué representa |
|------|----------|----------------|
| **Bloque** | `.nombre-componente` | Componente independiente y reutilizable |
| **Elemento** | `.bloque__elemento` | Parte interna del bloque que por sí sola no tiene sentido |
| **Modificador** | `.bloque--modificador` | Variante o estado del bloque o elemento |

#### Cuándo uso modificadores vs clases de estado

**Modificadores (--):** para variantes visuales fijas
- Variantes: `.boton--primary`, `.boton--ghost`, `.alerta--success`
- Tamaños: `.boton--sm`, `.boton--lg`
- Layout: `.card--horizontal`, `.card--vertical`

**Atributos o pseudo-clases:** para estados dinámicos
- Estados HTML: `[disabled]`, `[aria-hidden]`
- Pseudo-clases: `:hover`, `:focus`, `:active`
- Estados temporales: `.is-open`, `.is-active`

#### Ejemplos reales del proyecto

**Header:**
```scss
.gym-header { 
  /* Bloque: Componente raíz del header */
}

.gym-header__container { 
  /* Elemento: Contenedor interno del header */
}

.gym-header__logo { 
  /* Elemento: Logo dentro del header */
}

.gym-header__buscador { 
  /* Elemento: Zona de búsqueda */
}

.gym-header__nav { 
  /* Elemento: Navegación principal */
}

.gym-header__nav--abierto { 
  /* Modificador: Estado del menú desplegado en mobile */
}
```

**Card:**
```scss
.card { 
  /* Bloque: Componente tarjeta */
}

.card-body { 
  /* Elemento: Cuerpo de la tarjeta */
}

.card-title { 
  /* Elemento: Título de la tarjeta */
}

.card-subtitle { 
  /* Elemento: Subtítulo */
}

.card-rating { 
  /* Elemento: Rating con estrella */
}

.card.horizontal { 
  /* Modificador: Variante horizontal (clase adicional) */
}

.card.vertical { 
  /* Modificador: Variante vertical */
}
```

**Selector (dropdown):**
```scss
.selector { 
  /* Bloque: Componente select */
}

.selector__label { 
  /* Elemento: Etiqueta del campo */
}

.selector__field { 
  /* Elemento: Campo select nativo */
}

.selector__field--error { 
  /* Modificador: Estado de error en el campo */
}

.selector__icon { 
  /* Elemento: Icono dropdown */
}

.selector__field[disabled] { 
  /* Estado: Usando atributo HTML para disabled */
}
```

**Botón:**
```scss
.boton { 
  /* Bloque: Componente botón */
}

.boton--primary { 
  /* Modificador: Variante primaria */
}

.boton--secondary { 
  /* Modificador: Variante secundaria */
}

.boton--ghost { 
  /* Modificador: Variante ghost */
}

.boton--danger { 
  /* Modificador: Variante destructiva */
}

.boton--sm { 
  /* Modificador: Tamaño pequeño */
}

.boton--md { 
  /* Modificador: Tamaño mediano */
}

.boton--lg { 
  /* Modificador: Tamaño grande */
}

.boton:hover { 
  /* Pseudo-clase: Estado hover (no modificador) */
}

.boton[disabled] { 
  /* Atributo: Estado disabled (no modificador) */
}
```

**Campo de formulario:**
```scss
.campo-formulario { 
  /* Bloque: Componente campo de texto */
}

.campo-formulario__label { 
  /* Elemento: Label del input */
}

.campo-formulario__field { 
  /* Elemento: Input de texto */
}

.campo-formulario__error { 
  /* Elemento: Mensaje de error */
}

.campo-formulario__help { 
  /* Elemento: Texto de ayuda */
}

.campo-formulario__required { 
  /* Elemento: Indicador de campo obligatorio (*) */
}
```

#### Por qué esta metodología

| Ventaja | Explicación |
|---------|-------------|
| Especificidad baja | No hay conflictos de cascada CSS |
| Legibilidad | La clase te dice qué es y a qué pertenece |
| Escalabilidad | Añadir componentes nuevos no rompe los existentes |
| Mantenimiento | Buscar y modificar estilos es directo |
| Sin colisiones | Los nombres son únicos por estructura |

---

### 3.3 Style Guide

He montado una **Guía de Estilo** (`/guia-estilo`) dentro del proyecto donde se ven todos los componentes funcionando en tiempo real. Es una página interna que sirve como documentación visual y banco de pruebas.

#### Para qué sirve

| Uso | Descripción |
|-----|-------------|
| **Catálogo visual** | Ver todos los componentes de un vistazo sin navegar por la app |
| **Testing** | Probar interacciones, estados (hover, disabled, error) de forma aislada |
| **Referencia** | Copiar ejemplos directamente del código real |
| **Control de calidad** | Detectar inconsistencias y comprobar que funcionan en ambos temas |
| **Onboarding** | Quien llegue nuevo al proyecto ve qué hay disponible y cómo usarlo |

#### Componentes en el Style Guide

| Sección | Captura | Contenido |
|---------|---------|-----------|
| **Botones** | ![Botones](./img/Botones.png) | Variantes (primario, secundario, ghost, danger), tamaños y estados |
| **Cards** | ![Cards](./img/Cards.png) | Tarjetas verticales y horizontales con imagen, rating y acciones |
| **Alertas y feedback** | ![Feedback](./img/Feedback.png) | Alertas semánticas y notificaciones toast |
| **Formularios** | ![Formularios](./img/Formularios.png) | Inputs, selects, textarea y validaciones |
| **Navegación** | ![Navegacion](./img/Navegacion.png) | Menú principal, menú usuario, breadcrumbs y tabs |
| **Interactivos** | ![Interactivos](./img/Interactivos.png) | Acordeón, tooltips y buscador expandible |
| **Iconos** | ![Iconos](./img/Iconos.png) | Set de iconos Lucide |
| **Colores** | ![Colores](./img/Colores.png) | Paleta de marca, semánticos y modo oscuro |
| **Tipografía** | ![Tipografia](./img/Tipografia.png) | Jerarquía de títulos y estilos tipográficos |

---

# Sección 4: Sistema Responsive

En esta sección explico cómo he implementado el diseño responsive de Gymunity: los breakpoints que uso, la estrategia desktop-first, el uso de Container Queries y las adaptaciones principales en cada tamaño de pantalla.

---

## 4.1 Breakpoints definidos

He definido cuatro breakpoints que cubren prácticamente todos los dispositivos del mercado. Los valores están basados en los estándares más usados (Tailwind, Bootstrap) porque funcionan bien y la gente los conoce.

| Nombre | Valor | Dispositivo | Por qué |
|--------|-------|-------------|---------|
| `$breakpoint-sm` | 640px | Móvil | Cubre la mayoría de móviles actuales (320-639px) |
| `$breakpoint-md` | 768px | Tablet vertical | Punto donde las tablets necesitan otro layout |
| `$breakpoint-lg` | 1024px | Tablet horizontal / Portátil | Transición a layouts de varias columnas |
| `$breakpoint-xl` | 1280px | Escritorio | Monitores 1080p y pantallas grandes |

---

## 4.2 Estrategia responsive

**Enfoque: Desktop-First**

He tirado por Desktop-First por varias razones:
- Los usuarios de gimnasios suelen buscar y comparar opciones desde el ordenador
- Hay mucho contenido (galerías, reseñas, clases) que se ve mejor en pantallas grandes
- Es más fácil simplificar un diseño complejo para móvil que al revés

**Implementación con el mixin `respond-down`:**

```scss
// styles/01-tools/_mixins.scss
@mixin respond-down($breakpoint) {
  @if $breakpoint == xl {
    @media (max-width: #{$breakpoint-xl - 1px}) { @content; }
  } @else if $breakpoint == lg {
    @media (max-width: #{$breakpoint-lg - 1px}) { @content; }
  } @else if $breakpoint == md {
    @media (max-width: #{$breakpoint-md - 1px}) { @content; }
  } @else if $breakpoint == sm {
    @media (max-width: #{$breakpoint-sm - 1px}) { @content; }
  }
}
```

**Ejemplo de uso:**

```scss
.gimnasios-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  // Escritorio: 3 columnas
  gap: $space-4;

  @include respond-down(lg) {
    grid-template-columns: repeat(2, 1fr);  // Tablet: 2 columnas
  }

  @include respond-down(sm) {
    grid-template-columns: 1fr;  // Móvil: 1 columna
    gap: $space-3;
  }
}
```

---

## 4.3 Container Queries

Con Container Queries los componentes se adaptan según el ancho de su contenedor, no del viewport. Esto es clave porque un mismo componente puede aparecer en contextos muy distintos (sidebar estrecho, grid de 3 columnas, pantalla completa) y tiene que verse bien en todos.

**Componentes que usan Container Queries:**

| Componente | Archivo | Para qué |
|------------|---------|----------|
| `Card` | `card/card.scss` | Se usa en grids de 1, 2 o 3 columnas según la página |
| `TarjetaProfesor` | `tarjeta-profesor/tarjeta-profesor.scss` | Aparece en sidebars y grids con anchos distintos |

**Ejemplo en Card:**

```scss
// card.scss
.card {
  container-type: inline-size;
  container-name: card;
  
  // Estilos base...
}

// Si el contenedor tiene menos de 300px, cambia a layout vertical
@container card (max-width: 300px) {
  .card {
    flex-direction: column;
  }
  
  .card__imagen {
    width: 100%;
    height: 180px;
  }
}
```

**Ejemplo en TarjetaProfesor:**

```scss
// tarjeta-profesor.scss
.tarjeta-profesor {
  container-type: inline-size;
  container-name: profesor-card;
}

@container profesor-card (max-width: 300px) {
  .tarjeta-profesor {
    flex-direction: column;
    text-align: center;
  }

  .tarjeta-profesor__boton {
    width: 100%;
  }
}
```

---

## 4.4 Adaptaciones principales

Aquí está el resumen de cómo cambia cada elemento según el tamaño de pantalla:

| Elemento | Móvil (< 640px) | Tablet (640-1023px) | Escritorio (≥ 1024px) |
|----------|-----------------|---------------------|----------------------|
| **Header** | Logo + menú hamburguesa | Logo + navegación en línea | Navegación completa + buscador |
| **Grid gimnasios** | 1 columna | 2 columnas | 3 columnas |
| **Galería** | Imagen + miniaturas verticales | Grid 2 columnas | Imagen grande + grid miniaturas |
| **Cards** | Vertical a ancho completo | 2 por fila | 3 por fila / horizontal |
| **Formularios** | Campos apilados | 2 columnas parcial | 2 columnas completo |
| **Buscador** | Ancho completo, expandido | Ancho fijo, colapsable | Ancho fijo en header |
| **Footer** | Enlaces apilados | 2 columnas | 4 columnas |
| **Mensaje bienvenida** | 2.5rem, menos padding | 3rem | 3.5rem, fondo degradado |

---

## 4.5 Páginas implementadas

Estas son todas las páginas que he maquetado con diseño responsive:

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Inicio** | `/` | Bienvenida personalizada + gimnasios populares, recientes y cercanos |
| **Búsqueda** | `/busqueda` | Grid de resultados con filtros activos y contador |
| **Gimnasio** | `/gimnasio/:id` | Detalle completo con galería, profesores, clases y reseñas |
| **Perfil** | `/perfil` | Datos del usuario que ha iniciado sesión |
| **Configuración** | `/configuracion` | Ajustes de cuenta y preferencias |
| **Guía de Estilo** | `/guia-estilo` | Documentación visual de todos los componentes |
| **No Encontrada** | `/**` | Página 404 con enlace para volver |

---

## 4.6 Screenshots comparativos

Aquí muestro cómo se ven las páginas principales en los tres tamaños clave: móvil (375px), tablet (768px) y escritorio (1280px).

### Página de Inicio

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Inicio móvil](./img/inicio-mobile.png) | ![Inicio tablet](./img/inicio-tablet.png) | ![Inicio desktop](./img/inicio-desktop.png) |

En móvil el contenido va apilado y el menú se convierte en hamburguesa. En tablet aparecen 2 columnas de cards. En escritorio se muestra el layout completo con 3 columnas y buscador visible.

### Página de Búsqueda

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Búsqueda móvil](./img/busqueda-mobile.png) | ![Búsqueda tablet](./img/busqueda-tablet.png) | ![Búsqueda desktop](./img/busqueda-desktop.png) |

El grid de resultados pasa de 1 columna en móvil a 2 en tablet y 3 en escritorio. Los filtros se colapsan en móvil.

### Página de Detalle de Gimnasio

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Gimnasio móvil](./img/gimnasio-mobile.png) | ![Gimnasio tablet](./img/gimnasio-tablet.png) | ![Gimnasio desktop](./img/gimnasio-desktop.png) |

La galería cambia de layout: en móvil es vertical con miniaturas debajo, en escritorio la imagen principal ocupa más espacio con miniaturas en grid lateral.

---

# Sección 5: Optimización multimedia

En esta sección documento todo el trabajo de optimización de recursos gráficos: los formatos que uso, las herramientas, los resultados obtenidos y las tecnologías implementadas para que la página cargue rápido sin sacrificar calidad visual.

---

## 5.1 Formatos elegidos

He optado por formatos modernos con fallbacks para navegadores antiguos. La decisión principal ha sido usar **WebP** como formato por defecto.

| Formato | Cuándo lo uso | Justificación |
|---------|---------------|---------------|
| **WebP** | Logo, favicon, imágenes de interfaz, fotos | Comprime 25-35% mejor que JPG. Soporte: >97% navegadores |
| **JPG** | Fallback para navegadores muy antiguos | Compatibilidad total. Lo uso en `<picture>` como respaldo |
| **AVIF** | Preparado para el futuro | Comprime ~50% mejor que JPG, pero soporte aún no universal |

### ¿Por qué WebP y no AVIF?

Aunque AVIF comprime mejor, WebP tiene mejor equilibrio entre:
- **Compresión**: suficientemente buena para mis necesidades
- **Compatibilidad**: funciona en prácticamente todos los navegadores modernos
- **Velocidad de codificación**: AVIF tarda más en generarse
- **Soporte de herramientas**: más opciones trabajan bien con WebP

---

## 5.2 Herramientas utilizadas

Para optimizar las imágenes he usado herramientas gratuitas y online:

| Herramienta | URL | Para qué la uso |
|-------------|-----|----------------|
| **Squoosh** | squoosh.app | Convertir a WebP, redimensionar y ajustar calidad con comparación en tiempo real |
| **TinyPNG** | tinypng.com | Comprimir PNG y WebP aún más para afinar el peso final |
| **SVGOMG** | jakearchibald.github.io/svgomg | Optimizar SVGs eliminando metadatos innecesarios |

---

## 5.3 Resultados de optimización

Aquí están los resultados de las imágenes principales. En todos los casos he conseguido reducir el peso significativamente sin pérdida visible de calidad.

| Imagen | Formato original | Peso original | Peso final | Reducción |
|--------|------------------|---------------|------------|----------|
| logo-large.webp | PNG | 45 KB | 12 KB | 73% |
| logo-medium.webp | PNG | 45 KB | 6 KB | 87% |
| logo-small.webp | PNG | 45 KB | 3 KB | 93% |
| favicon-large.webp | PNG | 15 KB | 4 KB | 73% |
| favicon-medium.webp | PNG | 15 KB | 2 KB | 87% |
| hero-background.webp | JPG | 320 KB | 85 KB | 73% |
| gimnasio-placeholder.webp | JPG | 180 KB | 45 KB | 75% |

**Resultado:** Todas las imágenes pesan menos de 200 KB ✓

---

## 5.4 Tecnologías implementadas

He implementado varias técnicas de HTML5 para servir imágenes optimizadas según el contexto.

### Elemento `<picture>` con Art Direction

Uso `<picture>` para servir distintas versiones de una imagen según el tamaño de pantalla. Así los móviles descargan imágenes más ligeras.

**Dónde lo uso:** Header, Footer, Formulario login, Formulario registro

```html
<picture>
  <source media="(max-width: 480px)" srcset="assets/logo-small.webp">
  <source media="(max-width: 768px)" srcset="assets/logo-medium.webp">
  <img src="assets/logo-large.webp" alt="Gymunity" loading="eager">
</picture>
```

### Atributo `srcset` para densidad de pantalla

En las tarjetas uso `srcset` con descriptores de densidad para pantallas retina:

```html
<img 
  src="gimnasio-thumb.webp"
  srcset="gimnasio-thumb.webp 1x, gimnasio-thumb@2x.webp 2x"
  alt="Smart Fit Centro"
  loading="lazy"
>
```

### Atributo `loading`

El atributo `loading` de las etiquetas `<img>` controla cuándo empieza el navegador a descargar cada imagen. Hay dos estrategias según dónde esté el elemento:

| Valor | Estrategia | Dónde se usa |
|-------|------------|--------------|
| `eager` | Carga inmediata (lo que se ve nada más cargar) | Header, login, registro, imagen principal de galería |
| `lazy` | Carga diferida (lo que está más abajo) | Footer, miniaturas, tarjetas de profesor, cards |

```html
<!-- Imagen visible nada más cargar -->
<img src="logo.webp" loading="eager">

<!-- Imagen que está más abajo, se carga cuando el usuario se acerca -->
<img src="tarjeta.jpg" loading="lazy">
```

### Favicon responsive

El favicon está en varios tamaños para distintas densidades de pantalla:

```html
<link rel="icon" type="image/webp" sizes="164x170" href="favicon-large.webp">
<link rel="icon" type="image/webp" sizes="82x85" href="favicon-medium.webp">
<link rel="icon" type="image/webp" sizes="41x43" href="favicon-small.webp">
```

---

## 5.5 Animaciones CSS

Todas las animaciones del proyecto están optimizadas para rendimiento. Solo animo propiedades que no provocan reflow ni repaint.

### Por qué solo animo `transform` y `opacity`

Estas dos propiedades son especiales porque el navegador las procesa en la **GPU** mediante el compositor layer, sin tocar el hilo principal de JavaScript. El resultado:

| Propiedad | Reflow | Repaint | GPU | Rendimiento |
|-----------|--------|---------|-----|-------------|
| `width`, `height`, `margin` | Sí | Sí | No | Malo |
| `background`, `color`, `border` | No | Sí | No | Regular |
| `transform`, `opacity` | No | No | Sí | Óptimo |

Animando solo `transform` y `opacity` consigo 60 fps estables incluso en móviles de gama baja.

### Animaciones implementadas

Estas son las animaciones definidas con `@keyframes`:

| Animación | Componente | Qué hace | Duración |
|-----------|------------|----------|----------|
| `spinner-giro` | Spinner | Rotación continua 360° | 0.7s |
| `modal-fade` | Ventana emergente | Fade in del overlay | 0.2s |
| `modal-slide` | Ventana emergente | Fade + slide desde arriba | 0.3s |
| `toast-entrar` | Toast | Fade + slide desde derecha | 0.25s |
| `aparecer` | Menú usuario | Fade + scale desde origen | 0.2s |
| `carga-aparecer` | Carga global | Fade in suave | 0.3s |

### Código de las animaciones

```scss
// Spinner - Rotación continua
@keyframes spinner-giro {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Modal - Entrada con slide y scale
@keyframes modal-slide {
  from { 
    opacity: 0; 
    transform: translateY(-1rem) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

// Toast - Entrada desde la derecha
@keyframes toast-entrar {
  from { 
    opacity: 0; 
    transform: translateX(1rem); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}

// Menú usuario - Aparición con scale
@keyframes aparecer {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
```

### Transiciones en estados interactivos

Además de las animaciones, uso transiciones suaves para hovers y focus:

| Elemento | Propiedades animadas | Duración |
|----------|---------------------|----------|
| Logo header | opacity | 0.2s |
| Botones | transform, background-color | 0.2s |
| Cards | transform, box-shadow | 0.2s |
| Enlaces footer | transform | 0.2s |
| Inputs | border-color, box-shadow | 0.15s |
| Acordeón | background-color | 0.2s |
| Tabs | color, background-color | 0.2s |

```scss
// Ejemplo: hover en cards de gimnasio
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-0.25rem);
    box-shadow: $shadow-lg;
  }
}

// Ejemplo: focus en inputs
.campo-formulario__field {
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  
  &:focus {
    border-color: $color-botones;
    box-shadow: 0 0 0 3px rgba($color-botones, 0.2);
  }
}
```

---

# Sección 6: Sistema de temas

En esta sección documento el sistema de temas claro/oscuro de Gymunity: las variables CSS que definen cada tema, cómo funciona el Theme Switcher y capturas comparativas mostrando ambos modos.

---

## 6.1 Variables de tema

El sistema de temas se basa en **CSS Custom Properties** (variables CSS). Defino un conjunto de variables en `:root` para el tema claro y las sobrescribo con `[data-tema="oscuro"]` para el tema oscuro.

### Estructura del archivo

Las variables están en `styles/00-settings/_css-variables.scss` y se organizan por categoría:

```scss
// ============================================
// TEMA CLARO (por defecto)
// ============================================

:root,
[data-tema="claro"] {
  // Fondos
  --color-fondo: #EAF8F4;
  --color-fondo-secundario: #F9FAFB;
  --color-header: #042A2B;
  
  // Textos
  --color-texto: #333333;
  --color-titulo: #1F2937;
  --color-subtitulo: #6B7280;
  
  // Bordes
  --color-borde: #D1D5DB;
  
  // Botones
  --color-boton: #34C6A0;
  --color-boton-hover: #2AAE8E;
  
  // Semánticos
  --color-exito: #2ECC71;
  --color-error: #E74C3C;
  --color-warning: #FFA726;
  --color-info: #1976D2;
  
  // Sombras
  --shadow-glow: 0 4px 14px rgba(52, 198, 160, 0.4);
}
```

### Tema oscuro

Para el tema oscuro, sobrescribo las variables con colores más vibrantes que mantienen el contraste:

```scss
// ============================================
// TEMA OSCURO
// ============================================

[data-tema="oscuro"] {
  // Fondos
  --color-fondo: #0F1C1C;
  --color-fondo-secundario: #162424;
  --color-header: #0A1414;
  
  // Textos
  --color-texto: #F0FAF7;
  --color-titulo: #F0FAF7;
  --color-subtitulo: #9CA3AF;
  
  // Bordes
  --color-borde: #2D3F3F;
  
  // Botones - más vibrantes para mantener contraste
  --color-boton: #00E5A0;
  --color-boton-hover: #00CC8E;
  
  // Semánticos - versiones más brillantes
  --color-exito: #34D399;
  --color-error: #F87171;
  --color-warning: #FBBF24;
  --color-info: #60A5FA;
  
  // Sombras con glow neón
  --shadow-glow: 0 4px 20px rgba(0, 229, 160, 0.3);
}
```

### Cómo usar las variables en componentes

En los estilos de los componentes, siempre uso las variables CSS en lugar de valores hardcodeados:

```scss
// Correcto - usa variables de tema
.card {
  background: var(--color-fondo-secundario);
  border: 1px solid var(--color-borde);
  color: var(--color-texto);
}

// ❌ Incorrecto - valores fijos que no cambian con el tema
.card {
  background: #ffffff;
  border: 1px solid #e5e5e5;
  color: #333333;
}
```

### Tabla resumen de variables

| Variable | Tema claro | Tema oscuro | Uso |
|----------|------------|-------------|-----|
| `--color-fondo` | #EAF8F4 | #0F1C1C | Fondo general |
| `--color-header` | #042A2B | #0A1414 | Header y footer |
| `--color-texto` | #333333 | #F0FAF7 | Texto principal |
| `--color-boton` | #34C6A0 | #00E5A0 | Botones primarios |
| `--color-borde` | #D1D5DB | #2D3F3F | Bordes y separadores |
| `--shadow-glow` | rgba verde suave | rgba verde neón | Sombras de botones |

---

## 6.2 Implementación del Theme Switcher

El cambio de tema se gestiona mediante un servicio Angular y un componente de botón.

### TemaService

El servicio `TemaService` es el cerebro del sistema. Gestiona el estado del tema, lo persiste en `localStorage` y escucha los cambios de preferencia del sistema operativo.

```typescript
// servicios/tema.ts

@Injectable({ providedIn: 'root' })
export class TemaService {
  // Estado reactivo con Angular Signals
  readonly tema = signal<Tema>(this.obtenerTemaInicial());

  // Alternar entre claro y oscuro
  alternar(): void {
    this.tema.update((actual: Tema): Tema => {
      const esOscuro = actual === 'oscuro';
      return esOscuro ? 'claro' : 'oscuro';
    });
  }

  // Comprobar si está en modo oscuro
  esOscuro(): boolean {
    return this.tema() === 'oscuro';
  }

  // Aplicar el tema al DOM
  private aplicarTema(tema: Tema): void {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem('tema', tema);
  }
}
```

### Flujo de funcionamiento

1. **Inicialización**: Al cargar la app, el servicio comprueba:
   - Si hay un tema guardado en `localStorage` → lo usa
   - Si no, comprueba `prefers-color-scheme` del sistema operativo
   - Por defecto → tema claro

2. **Cambio de tema**: Cuando el usuario hace clic en el botón:
   - Se actualiza la señal `tema`
   - Un `effect()` aplica el atributo `data-tema` al `<html>`
   - Se guarda en `localStorage` para persistir

3. **Escucha del sistema**: Si el usuario cambia el tema del SO y no había guardado preferencia, la app se adapta automáticamente.

### Componente ThemeSwitcher

El componente es un simple botón que alterna entre iconos de sol y luna:

```typescript
// componentes/theme-switcher/theme-switcher.ts

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [Icono],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSwitcher {
  private readonly temaService = inject(TemaService);

  // Señal computada para saber si está en modo oscuro
  readonly esOscuro: Signal<boolean> = computed(() => 
    this.temaService.esOscuro()
  );

  // Método para alternar el tema
  alternar(): void {
    this.temaService.alternar();
  }
}
```

### Template del botón

```html
<button 
  class="theme-switcher"
  type="button"
  (click)="alternar()"
  [attr.aria-label]="esOscuro() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
  aria-pressed="false">
  
  @if (esOscuro()) {
    <app-icono nombre="sun" />
  } @else {
    <app-icono nombre="moon" />
  }
</button>
```

### Transición suave entre temas

Para que el cambio de tema no sea brusco, aplico transiciones globales:

```scss
// styles/04-layout/_globals.scss

* {
  transition: 
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
```

---

## 6.3 Capturas comparativas

Aquí muestro cómo se ven las páginas principales en modo claro y modo oscuro.

### Página de Inicio

| Modo claro | Modo oscuro |
|------------|-------------|
| ![Inicio claro](./img/inicio-claro.png) | ![Inicio oscuro](./img/inicio-oscuro.png) |

En modo oscuro los colores de acento son más vibrantes (#00E5A0) para mantener el contraste sobre fondos oscuros.

### Página de Búsqueda

| Modo claro | Modo oscuro |
|------------|-------------|
| ![Búsqueda claro](./img/busqueda-claro.png) | ![Búsqueda oscuro](./img/busqueda-oscuro.png) |

Las cards mantienen su estructura pero adaptan los colores de fondo y borde.

### Página de Detalle de Gimnasio

| Modo claro | Modo oscuro |
|------------|-------------|
| ![Gimnasio claro](./img/gimnasio-claro.png) | ![Gimnasio oscuro](./img/gimnasio-oscuro.png) |

La galería y los elementos interactivos se adaptan manteniendo la legibilidad.

---

# Sección 7: Aplicación completa y despliegue

Esta última sección recoge el estado final de la aplicación, los resultados del testing en diferentes dispositivos y navegadores, las capturas finales en los tres viewports principales, los datos del despliegue a producción, y una lista de posibles mejoras para el futuro.

---

## 7.1 Estado final de la aplicación

A continuación listo todas las páginas y funcionalidades que he implementado en Gymunity. La aplicación está completamente funcional tanto en desarrollo como en producción.

### Páginas implementadas

**Inicio** (`/`)
- Sección de bienvenida personalizada según si el usuario ha iniciado sesión o no
- Carrusel de gimnasios populares (basado en valoraciones)
- Carrusel de gimnasios recientes (últimos añadidos)
- Carrusel de gimnasios cercanos a la ciudad del usuario (si está autenticado)
- Botón de registro para usuarios no autenticados

**Búsqueda** (`/busqueda`)
- Buscador con autocompletado por nombre y ciudad
- Grid de resultados con paginación infinita (scroll load)
- Contador de resultados encontrados
- Opción de limpiar filtros activos
- Cards de gimnasios con foto, nombre, ciudad, valoración y dirección

**Detalle de Gimnasio** (`/gimnasio/:id`)
- Galería de fotos con imagen principal y miniaturas navegables
- Información completa: nombre, dirección, descripción, valoración media
- Sección de profesores con tarjetas individuales
- Sección de clases disponibles con horarios y posibilidad de reservar
- Sección de torneos organizados por el gimnasio
- Sección de reseñas de otros usuarios con puntuación y comentario
- Modal para reservar clase (requiere autenticación)
- Modal para escribir reseña (requiere autenticación)

**Perfil** (`/perfil`)
- Información del usuario: avatar, nombre, email, ciudad, créditos
- Sistema de pestañas para organizar el contenido
- Pestaña de logros organizados por categorías (entrenamiento, torneos, comunidad, etc.)
- Pestaña de "Mis clases" con las reservas activas y paginación
- Pestaña de "Mis reseñas" con las reseñas escritas por el usuario
- Posibilidad de cancelar reservas desde el perfil

**Configuración** (`/configuracion`)
- Formulario de edición de perfil (nombre de usuario, email, ciudad)
- Validaciones asíncronas para comprobar disponibilidad de username y email
- Cambio de avatar con preview y compresión automática de imagen
- Formulario de cambio de contraseña con indicador de seguridad
- Opción de eliminar cuenta con confirmación

**Guía de Estilo** (`/guia-estilo`)
- Documentación visual de todos los componentes del sistema
- Ejemplos de uso de botones, alertas, cards, formularios, etc.
- Paleta de colores completa

**Página 404** (`/**`)
- Mensaje amigable cuando la ruta no existe
- Enlace para volver al inicio

### Funcionalidades transversales

- **Autenticación completa**: login, registro, logout, persistencia de sesión con JWT
- **Sistema de temas**: modo claro y oscuro con persistencia en localStorage
- **Buscador global**: accesible desde el header, filtra por nombre y ciudad
- **Notificaciones toast**: feedback visual para acciones del usuario
- **Carga global**: indicador de carga durante peticiones al servidor
- **Protección de rutas**: guards para páginas que requieren autenticación
- **Prevención de pérdida de datos**: aviso al salir con cambios sin guardar
- **Breadcrumbs**: navegación contextual en páginas de detalle
- **Menú de usuario**: acceso rápido a perfil, configuración y logout
- **Responsive completo**: adaptación a móvil, tablet y escritorio

---

## 7.2 Testing multi-dispositivo

He probado la aplicación en cinco viewports diferentes usando las DevTools del navegador. En la tabla muestro el resultado de cada prueba:

| Viewport | Ancho | Layout | Navegación | Interacciones | Textos | Resultado |
|----------|-------|--------|------------|---------------|--------|-----------|
| Móvil pequeño | 320px | Correcto | Menú hamburguesa funciona | Botones táctiles OK | Legibles | OK |
| Móvil estándar | 375px | Correcto | Menú hamburguesa funciona | Botones táctiles OK | Legibles | OK |
| Tablet vertical | 768px | Correcto | Menú visible parcial | Todo funciona | Legibles | OK |
| Tablet horizontal | 1024px | Correcto | Menú completo | Todo funciona | Legibles | OK |
| Escritorio | 1280px | Correcto | Menú completo | Todo funciona | Legibles | OK |

Todas las páginas responden correctamente a los breakpoints definidos. No he encontrado problemas de desbordamiento ni elementos que se corten.

---

## 7.3 Testing en dispositivos reales

Además de las DevTools, he probado la aplicación en dispositivos físicos para verificar el comportamiento real:

| Dispositivo | Sistema operativo | Navegador | Resolución | Resultado |
|-------------|-------------------|-----------|------------|-----------|
| Samsung Galaxy Tab A | Android 11 | Chrome 120 | 1920x1200 | Todo funciona correctamente |
| Samsung Galaxy A54 | Android 14 | Chrome 121 | 2340x1080 | Todo funciona correctamente |
| PC sobremesa | Windows 11 | Chrome 121 / Firefox 122 | 1920x1080 | Todo funciona correctamente |

En los tres dispositivos la aplicación se comporta como se espera: la navegación es fluida, los modales se abren y cierran bien, los formularios validan correctamente, y el cambio de tema funciona sin problemas.

---

## 7.4 Verificación multi-navegador

He comprobado la compatibilidad de Gymunity en los navegadores que uso habitualmente:

| Navegador | Versión | Plataforma | CSS moderno | JavaScript | Funcionalidad | Resultado |
|-----------|---------|------------|-------------|------------|---------------|-----------|
| Google Chrome | 121.0.6167 | Windows 11 | Sin problemas | Sin errores | Completa | Compatible |
| Mozilla Firefox | 122.0 | Windows 11 | Sin problemas | Sin errores | Completa | Compatible |

Ambos navegadores renderizan la aplicación de forma idéntica. Las animaciones CSS funcionan correctamente, el lazy loading de imágenes funciona, y no hay errores en la consola.

---

## 7.5 Capturas finales

A continuación dejo las capturas de las páginas principales en los tres tamaños de referencia (móvil 375px, tablet 768px, escritorio 1280px), tanto en modo claro como oscuro.

### Página de Inicio

**Modo claro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Inicio móvil claro](./img/final-inicio-mobile-claro.png) | ![Inicio tablet claro](./img/final-inicio-tablet-claro.png) | ![Inicio escritorio claro](./img/final-inicio-desktop-claro.png) |

**Modo oscuro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Inicio móvil oscuro](./img/final-inicio-mobile-oscuro.png) | ![Inicio tablet oscuro](./img/final-inicio-tablet-oscuro.png) | ![Inicio escritorio oscuro](./img/final-inicio-desktop-oscuro.png) |

### Página de Búsqueda

**Modo claro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Búsqueda móvil claro](./img/final-busqueda-mobile-claro.png) | ![Búsqueda tablet claro](./img/final-busqueda-tablet-claro.png) | ![Búsqueda escritorio claro](./img/final-busqueda-desktop-claro.png) |

**Modo oscuro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Búsqueda móvil oscuro](./img/final-busqueda-mobile-oscuro.png) | ![Búsqueda tablet oscuro](./img/final-busqueda-tablet-oscuro.png) | ![Búsqueda escritorio oscuro](./img/final-busqueda-desktop-oscuro.png) |

### Página de Gimnasio

**Modo claro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Gimnasio móvil claro](./img/final-gimnasio-mobile-claro.png) | ![Gimnasio tablet claro](./img/final-gimnasio-tablet-claro.png) | ![Gimnasio escritorio claro](./img/final-gimnasio-desktop-claro.png) |

**Modo oscuro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Gimnasio móvil oscuro](./img/final-gimnasio-mobile-oscuro.png) | ![Gimnasio tablet oscuro](./img/final-gimnasio-tablet-oscuro.png) | ![Gimnasio escritorio oscuro](./img/final-gimnasio-desktop-oscuro.png) |

### Página de Perfil

**Modo claro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Perfil móvil claro](./img/final-perfil-mobile-claro.png) | ![Perfil tablet claro](./img/final-perfil-tablet-claro.png) | ![Perfil escritorio claro](./img/final-perfil-desktop-claro.png) |

**Modo oscuro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Perfil móvil oscuro](./img/final-perfil-mobile-oscuro.png) | ![Perfil tablet oscuro](./img/final-perfil-tablet-oscuro.png) | ![Perfil escritorio oscuro](./img/final-perfil-desktop-oscuro.png) |

### Página de Configuración

**Modo claro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Configuración móvil claro](./img/final-configuracion-mobile-claro.png) | ![Configuración tablet claro](./img/final-configuracion-tablet-claro.png) | ![Configuración escritorio claro](./img/final-configuracion-desktop-claro.png) |

**Modo oscuro**

| Móvil (375px) | Tablet (768px) | Escritorio (1280px) |
|---------------|----------------|---------------------|
| ![Configuración móvil oscuro](./img/final-configuracion-mobile-oscuro.png) | ![Configuración tablet oscuro](./img/final-configuracion-tablet-oscuro.png) | ![Configuración escritorio oscuro](./img/final-configuracion-desktop-oscuro.png) |

---

## 7.6 Despliegue

La aplicación está desplegada en producción y accesible públicamente.

**URL de producción:** https://clownfish-app-puttm.ondigitalocean.app/

### Verificación del despliegue

He comprobado que todo funciona correctamente en el entorno de producción:

- La página de inicio carga correctamente con los gimnasios populares, recientes y cercanos
- El sistema de autenticación funciona (login, registro, logout)
- Las búsquedas devuelven resultados desde la base de datos de producción
- Los detalles de gimnasios cargan con todas sus secciones (galería, profesores, clases, reseñas)
- El perfil muestra los datos del usuario autenticado
- La configuración permite editar perfil y cambiar contraseña
- El cambio de tema funciona y persiste entre sesiones
- Los modales de reserva y reseña funcionan correctamente
- Las notificaciones toast aparecen tras las acciones del usuario
- La aplicación es responsive en dispositivos reales accediendo a la URL de producción

El backend está desplegado junto con el frontend usando Docker Compose. La base de datos PostgreSQL está configurada con persistencia de datos.

---

## 7.7 Problemas conocidos y mejoras futuras

### Problemas menores

Actualmente no hay bugs críticos conocidos. La aplicación es estable y todas las funcionalidades principales funcionan correctamente.

### Mejoras para futuras versiones

Estas son funcionalidades que me gustaría implementar en el futuro para mejorar la experiencia de usuario:

**Sistema de likes entre usuarios**
Permitir que los usuarios puedan dar like a otros usuarios de la plataforma, creando una red social básica dentro de Gymunity.

**Acceso a perfiles de otros usuarios**
Actualmente solo se puede ver el perfil propio. Sería interesante poder visitar el perfil público de otros usuarios para ver sus logros, gimnasios favoritos y actividad.

**Valoración de profesores con estrellas**
Los usuarios que estén apuntados a una clase podrían valorar al profesor de esa clase con un sistema de estrellas (1-5). Esto ayudaría a otros usuarios a elegir clases basándose en la calidad del profesor.

**Lista de favoritos en el perfil**
Añadir una sección en el perfil para que el usuario pueda guardar una lista de profesores y gimnasios favoritos. Así tendría acceso rápido a sus preferencias sin tener que buscarlos cada vez.
