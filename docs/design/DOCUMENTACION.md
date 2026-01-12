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

| Token | Valor | Uso |
|-------|-------|-----|
| `$color-header` | #042A2B | Header y fondos oscuros |
| `$color-fondo` | #EAF8F4 | Fondo general de la página |
| `$color-botones` | #34C6A0 | Botones y acciones principales |
| `$color-botones-hover` | #2AAE8E | Estado hover de botones |

**¿Por qué estos colores?** La paleta verde transmite salud, energía y bienestar, conceptos asociados con gimnasios y fitness.

### Colores semánticos

| Token | Valor | Uso |
|-------|-------|-----|
| `$color-exito` | #2ECC71 | Mensajes de éxito |
| `$color-error` | #E74C3C | Errores de validación |
| `$color-warning` | #FFA726 | Advertencias |
| `$color-info` | #1976D2 | Información neutral |

Son los colores universales que cualquier usuario reconoce.

### Modo oscuro

Para el modo oscuro uso versiones más vibrantes de los colores para mantener el contraste:

| Token | Valor | Diferencia |
|-------|-------|------------|
| `$oscuro-fondo` | #0F1C1C | Fondo oscuro con tinte verde |
| `$oscuro-boton` | #00E5A0 | Verde neón, más brillante |
| `$oscuro-texto` | #F0FAF7 | Texto claro |

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
$transicion-rapida: 0.15s ease;   // Hovers rápidos
$transicion-estandar: 0.3s ease;  // Cambios de estado
$transicion-lenta: 0.5s ease;     // Animaciones de entrada
```

Para el **cambio de tema** aplico transiciones globales de 200ms en background, border y box-shadow.

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

## 2. HTML semántico y estructura

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

## 3. Sistema de componentes UI

### 3.1 Componentes implementados

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

**BEM (Bloque-Elemento-Modificador)** es la forma de nombrar las clases CSS que usamos aquí. Básicamente, cada clase te dice qué es y dónde está.

#### **Cómo va:**

**Block (Bloque):** El componente en sí, independiente y reutilizable.
- Sintaxis: `.nombre-componente`
- Ejemplo: `.boton`, `.card`, `.alerta`, `.gym-header`

**Element (Elemento):** Parte interna del bloque que por sí sola no tiene sentido.
- Sintaxis: `.bloque__elemento`
- Ejemplo: `.card__title`, `.gym-header__logo`, `.campo-formulario__label`

**Modifier (Modificador):** Variante o estado del bloque o elemento.
- Sintaxis: `.bloque--modificador` o `.bloque__elemento--modificador`
- Ejemplo: `.boton--primary`, `.card--horizontal`, `.campo-formulario__field--error`

#### **Cuándo usar modificadores y cuándo clases de estado:**

**Modificadores (--):**
- Variantes visuales fijas: `.boton--primary`, `.boton--ghost`, `.alerta--success`
- Tamaños: `.boton--sm`, `.boton--lg`
- Tipos de layout: `.card--horizontal`, `.card--vertical`

**Clases de estado o atributos:**
- Estados que cambian con JavaScript: `[disabled]`, `[aria-hidden]`
- Pseudo-clases CSS: `:hover`, `:focus`, `:active`
- Estados temporales: `.is-open`, `.is-active` (cuando no se pueden usar atributos)

#### **Ejemplos reales del proyecto:**

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

#### **Por qué mola esta forma de nombrar:**

1. **Especificidad baja:** no hay conflictos de cascada
2. **Se lee bien:** la clase te dice qué es y dónde está
3. **Escala:** añadir componentes nuevos no rompe nada
4. **Fácil de mantener:** buscar y modificar estilos es directo
5. **Sin colisiones:** los nombres son únicos por estructura

---

### 3.3 Style Guide

La **Guía de Estilo** (`/guia-estilo`) es una página que tenemos montada dentro del proyecto donde se ven todos los componentes funcionando en tiempo real.

#### **¿Para qué sirve?**

1. **Ver todos los componentes de un vistazo:** Sin tener que navegar por toda la app.

2. **Probar cosas:** Interacciones, estados (hover, disabled, error)… todo aislado para pillar bugs visuales.

3. **Copiar ejemplos:** Los desarrolladores pueden ver cómo está hecho algo y copiarlo directamente del código real.

4. **Control de calidad:** Se ven las inconsistencias entre componentes y se comprueba que respetan las variables de diseño en ambos temas.

5. **Onboarding:** Quien llegue nuevo al proyecto ve de un vistazo qué hay y cómo usarlo.

#### **Componentes en el Style Guide**

**Botones**

![Botones](./img/Botones.png)
Todas las variantes (primario, secundario, ghost, danger), tamaños y estados.

---

**Cards**

![Cards](./img/Cards.png)
Tarjetas verticales y horizontales de gimnasios, con imagen, rating y acciones.

---

**Alertas y feedback**

![Feedback](./img/Feedback.png)
Alertas (éxito, error, advertencia, info) y notificaciones toast, con iconos y cierre.

---

**Formularios**

![Formularios](./img/Formularios.png)
Inputs, selects, textarea y validaciones en todos los estados.

---

**Navegación**

![Navegacion](./img/Navegacion.png)
Menú principal, menú de usuario, breadcrumbs y tabs.

---

**Componentes interactivos**

![Interactivos](./img/Interactivos.png)
Acordeón, tooltips, buscador expandible y demás elementos dinámicos.

---

**Iconos**

![Iconos](./img/Iconos.png)
Set de iconos Lucide para acciones, menús y feedback visual.

---

**Colores**

![Colores](./img/Colores.png)
Paleta de colores de marca, semánticos y modo oscuro/claro.

---

**Tipografía**

![Tipografia](./img/Tipografia.png)
Jerarquía de títulos, textos y estilos tipográficos.

---

## 4. Sistema Responsive

### 4.1 Breakpoints definidos

| Nombre | Valor | Dispositivo | Por qué |
|--------|-------|-------------|---------|
| `$breakpoint-sm` | 640px | Móvil | Cubre la mayoría de móviles actuales (320-639px) |
| `$breakpoint-md` | 768px | Tablet vertical | Punto donde las tablets necesitan otro layout |
| `$breakpoint-lg` | 1024px | Tablet horizontal / Portátil | Transición a layouts de varias columnas |
| `$breakpoint-xl` | 1280px | Escritorio | Monitores 1080p y pantallas grandes |

Estos valores están sacados de los estándares más usados (Tailwind, Bootstrap) y cubren prácticamente todos los dispositivos.

### 4.2 Estrategia responsive

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

### 4.3 Container Queries

Con Container Queries los componentes se adaptan según el ancho de su contenedor, no del viewport. Así se pueden reusar en cualquier contexto.

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

### 4.4 Adaptaciones principales

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

### 4.5 Páginas implementadas

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

## 5. Optimización multimedia

Aquí está todo el curro que se ha hecho para optimizar los recursos gráficos de la app. La idea ha sido bajar el peso de las imágenes sin cargarse la calidad, para que la página cargue rápido en cualquier dispositivo.

### 5.1 Formatos elegidos

Después de mirar las opciones del mercado, hemos ido a por formatos modernos con fallbacks para navegadores viejos.

| Formato | Uso | Por qué |
|---------|-----|---------|
| **WebP** | Logo, favicon, imágenes de interfaz | Comprime entre un 25% y un 35% mejor que JPG con calidad prácticamente igual. Soporte en navegadores: más del 97%. |
| **JPG** | Fallback para fotos | Compatibilidad total con cualquier navegador. Sigue valiendo para fotos donde haga falta máxima compatibilidad. |
| **AVIF** | Para el futuro | Comprime todavía mejor que WebP, pero a día de hoy el soporte no es tan amplio. Ya lo meteremos cuando lo soporte más gente. |

**Decisión:** WebP como formato principal porque es el equilibrio perfecto entre calidad, peso y compatibilidad.

### 5.2 Herramientas utilizadas

Para optimizar las imágenes hemos usado estas herramientas, ambas gratis y online:

| Herramienta | Para qué |
|-------------|----------|
| **Squoosh** (squoosh.app) | Convertir a WebP, redimensionar y ajustar la calidad. Deja comparar el resultado en tiempo real. |
| **TinyPNG** (tinypng.com) | Comprimir PNG y WebP todavía más. Viene bien para afinar el peso final después de convertir. |

### 5.3 Resultados de optimización

Aquí están los resultados de las imágenes principales. En todos los casos se ha bajado bastante el peso sin que se note pérdida de calidad.

| Imagen | Peso original | Peso optimizado | Reducción |
|--------|---------------|-----------------|-----------|
| logo-large.webp | 45 KB (PNG) | 12 KB | 73% |
| logo-medium.webp | 45 KB (PNG) | 6 KB | 87% |
| logo-small.webp | 45 KB (PNG) | 3 KB | 93% |
| favicon-large.webp | 15 KB (PNG) | 4 KB | 73% |
| favicon-medium.webp | 15 KB (PNG) | 2 KB | 87% |

**Requisito cumplido:** Todas las imágenes pesan menos de 200 KB ✓

### 5.4 Tecnologías implementadas

#### Elemento `<picture>` con srcset (Art Direction)

Hemos metido el elemento `<picture>` de HTML5 para servir distintas versiones de una imagen según el tamaño de pantalla. Así los móviles descargan imágenes más ligeras y los ordenadores las de mayor resolución.

```html
<!-- Implementado en: header.html, footer.html, formulario-login, formulario-registro -->
<picture>
  <source media="(max-width: 480px)" srcset="assets/logo-small.webp">
  <source media="(max-width: 768px)" srcset="assets/logo-medium.webp">
  <img src="assets/logo-large.webp" alt="Gymunity" loading="eager">
</picture>
```

#### Atributo `loading`

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

#### Favicon responsive

El favicon también está preparado en varios tamaños para adaptarse a distintas densidades de pantalla y usos (pestaña del navegador, acceso directo en móvil…).

```html
<!-- index.html -->
<link rel="icon" type="image/webp" sizes="164x170" href="favicon-large.webp">
<link rel="icon" type="image/webp" sizes="82x85" href="favicon-medium.webp">
<link rel="icon" type="image/webp" sizes="41x43" href="favicon-small.webp">
```

### 5.5 Animaciones CSS

#### Por qué solo animamos `transform` y `opacity`

A la hora de hacer animaciones fluidas, solo animamos `transform` y `opacity`. El motivo es simple: estas dos propiedades no provocan **reflow** (recalculado del layout) ni **repaint** (repintado de píxeles).

El navegador las procesa en la GPU mediante el *compositor layer*, lo que permite llegar a 60 fps sin bloquear el hilo principal de JavaScript. El resultado es una interfaz suave incluso en móviles cutres.

#### Animaciones que tenemos

Estas son las animaciones definidas con `@keyframes`:

| Animación | Componente | Qué anima | Duración |
|-----------|------------|-----------|----------|
| `spinner-giro` | Spinner | transform: rotate | 0.7s |
| `modal-fade` | Ventana emergente | opacity | 0.2s |
| `modal-slide` | Ventana emergente | opacity, transform | 0.3s |
| `toast-entrar` | Toast | opacity, transform | 0.25s |
| `aparecer` | Menú de usuario | opacity, transform | 0.2s |
| `carga-aparecer` | Pantalla de carga global | opacity | 0.3s |

#### Código de las animaciones

```scss
// Spinner - Rotación continua para indicar que algo está cargando
@keyframes spinner-giro {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// Modal - Fade + desplazamiento vertical
@keyframes modal-slide {
  from { opacity: 0; transform: translateY(-1rem) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

// Toast - Entrada desde la derecha
@keyframes toast-entrar {
  from { opacity: 0; transform: translateX(1rem); }
  to { opacity: 1; transform: translateX(0); }
}
```

#### Transiciones en hover y focus

Además de las animaciones, hay transiciones suaves para los estados interactivos. Aquí están los componentes principales:

| Elemento | Propiedades | Duración |
|----------|-------------|----------|
| Logo del header | opacity | 0.2s |
| Botones | transform, background | 0.2s |
| Cards | transform, box-shadow | 0.2s |
| Enlaces del footer | transform | 0.2s |
| Campos de formulario | transform | 0.15s |
| Cabeceras del acordeón | background-color | 0.2s |
| Pestañas (tabs) | color, background | 0.2s |

```scss
// Ejemplo aplicado a las tarjetas de gimnasio
.gym-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-0.25rem);
  }
}
```
