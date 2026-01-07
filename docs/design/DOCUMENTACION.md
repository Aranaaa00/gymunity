# Documentación de Diseño - Gymunity

## Índice

### 1. Fundamentos de diseño
- [1.1 Principios de comunicación visual](#11-principios-de-comunicación-visual)
  - Jerarquía
  - Contraste
  - Alineación
  - Proximidad
  - Repetición
- [1.2 Metodología CSS](#12-metodología-css)
- [1.3 Organización de archivos](#13-organización-de-archivos)
- [1.4 Sistema de Design Tokens](#14-sistema-de-design-tokens)
  - Paleta de colores
  - Tipografía
  - Espaciado
  - Breakpoints
  - Sombras
  - Z-index
  - Bordes y radios
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

## 1.1 Principios de comunicación visual

Hay cinco principios que vienen bien tener en cuenta a la hora de montar una interfaz:

**Jerarquía:** Se trata de colocar los elementos según su importancia. Jugando con tamaños, pesos de fuente y espaciado consigues que el ojo vaya primero a lo que más importa.

![Ejemplo de Jerarquía](img/Ejemplo_jerarquia.png)

**Contraste:** Sirve para que ciertas cosas destaquen sobre el resto. Cambiando colores, tamaños o pesos visuales se consigue que la información clave salte a la vista.

![Ejemplo de Contraste](img/Ejemplo_contraste.png)

**Alineación:** Ordenar los elementos de forma coherente (a la izquierda, centrados, en rejilla…) da estructura y hace que todo sea más fácil de leer.

![Ejemplo de Alineación](img/Ejemplo_alineacion.png)

**Proximidad:** Las cosas que están cerca se entienden como relacionadas. Basta con gestionar bien el espacio para que el usuario capte qué va con qué.

![Ejemplo de Proximidad](img/Ejemplo_proximidad.png)

**Repetición:** Usar los mismos patrones, colores y estilos a lo largo del diseño da coherencia y refuerza la identidad del proyecto.

![Ejemplo de Repetición](img/Ejemplo_repeticion.png)

## 1.2 Metodología CSS

En este proyecto usamos BEM (Bloque, Elemento, Modificador) para nombrar las clases CSS. La gracia de BEM es que el código queda ordenado, se lee bien y escala sin líos.

- **Bloques:** Son los componentes principales. Ejemplo: `.gym-grid`
- **Elementos:** Las partes que cuelgan de un bloque. Ejemplo: `.gym-grid__item`
- **Modificadores:** Variantes o estados. Ejemplo: `.gym-grid--section`

**Ejemplo:**
```scss
.gym-grid {
  /* estilos del bloque */
}
.gym-grid__item {
  /* estilos del elemento */
}
.gym-grid--section {
  /* estilos del modificador */
}
```

Al final, cuando el proyecto crece o entra gente nueva, tener las clases así nombradas es un alivio.

## 1.3 Organización de archivos

Las carpetas van de lo más general a lo más concreto. Primero cargan variables y herramientas, luego resets, estilos base, layouts, componentes y utilidades. Así no hay conflictos y todo el mundo sabe dónde buscar cada cosa.

**Árbol de carpetas:**
```
styles/
├── 00-settings/
│   └── _variables.scss
├── 01-tools/
│   └── _mixins.scss
├── 02-generic/
│   └── _reset.scss
├── 03-elements/
│   └── _elements.scss
├── 04-layout/
│   └── _layout.scss
├── 05-components/
├── 06-utilities/
└── main.scss
```

## 1.4 Sistema de Design Tokens

Los Design Tokens son las variables que guardan los valores base del diseño. Colores, tipografías, espaciados… todo está aquí. Si mañana hay que cambiar el verde corporativo, se toca en un sitio y listo.

### Paleta de colores

**Colores principales de marca:**
```scss
$color-header: #042A2B;        // Header y fondos oscuros
$color-hover-header: #063B3D;  // Hover del header
$color-fondo: #EAF8F4;         // Fondo principal de la app
```

**Colores de acción (botones):**
```scss
$color-botones: #34C6A0;        // Color principal de botones
$color-botones-hover: #2AAE8E;  // Hover
$color-botones-active: #0C5649; // Estado activo
```

**Escala de grises:**
```scss
$gris-50:  #F9FAFB;  // Fondos muy claros
$gris-100: #F3F4F6;  // Fondos claros
$gris-200: #E5E7EB;  // Bordes suaves
$gris-300: #D1D5DB;  // Bordes
$gris-400: #9CA3AF;  // Texto deshabilitado
$gris-500: #6B7280;  // Texto secundario
$gris-600: #4B5563;  // Texto claro
$gris-700: #374151;  // Texto medio
$gris-800: #1F2937;  // Texto oscuro
$gris-900: #111827;  // Texto muy oscuro
```

**Colores semánticos:**
```scss
$color-exito:   #2ECC71;  // Éxito, confirmación
$color-error:   #E74C3C;  // Error, peligro
$color-warning: #FFA726;  // Advertencia
$color-info:    #1976D2;  // Información
```

**Modo oscuro:**
```scss
// Fondos oscuros
$oscuro-fondo: #0F1C1C;
$oscuro-fondo-secundario: #1A2D2D;
$oscuro-header: #081414;

// Textos en modo oscuro
$oscuro-texto: #F0FAF7;
$oscuro-subtitulo: #8EC5B5;

// Acentos vibrantes para contraste
$oscuro-boton: #00E5A0;
$oscuro-boton-hover: #00CC8E;

// Semánticos ajustados para fondos oscuros
$oscuro-exito: #00E676;
$oscuro-error: #FF6B6B;
$oscuro-warning: #FFB74D;
$oscuro-info: #40C4FF;
```

### Tipografía

**Familia tipográfica:**
```scss
$fuente-principal: 'Roboto', Arial, sans-serif;
```

**Escala tipográfica:**
```scss
$texto-xs:  0.75rem;   // 12px - textos muy pequeños
$texto-sm:  0.875rem;  // 14px - textos secundarios
$texto-s:   1rem;      // 16px - texto base
$texto-md:  1rem;      // 16px - texto base (alias)
$texto-lg:  1.25rem;   // 20px - texto destacado
$texto-m:   1.5rem;    // 24px - subtítulos
$texto-l:   2rem;      // 32px - títulos sección
$texto-xl:  2.5rem;    // 40px - títulos grandes
$texto-2xl: 3rem;      // 48px - headings principales
```

**Pesos tipográficos:**
```scss
$font-weight-light: 300;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

**Alturas de línea:**
```scss
$line-height-tight: 1.1;    // Títulos compactos
$line-height-normal: 1.5;   // Texto general
$line-height-relaxed: 1.75; // Texto largo
```

### Espaciado

Sistema de espaciado basado en múltiplos de 8px (0.5rem):

```scss
$space-1:  0.5rem;   // 8px
$space-2:  1rem;     // 16px
$space-3:  1.5rem;   // 24px
$space-4:  2rem;     // 32px
$space-5:  2.5rem;   // 40px
$space-6:  3rem;     // 48px
$space-8:  4rem;     // 64px
$space-10: 5rem;     // 80px
$space-12: 6rem;     // 96px
```

### Breakpoints

Media queries desktop-first:

```scss
$breakpoint-sm: 640px;   // Móviles grandes
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Desktop grande
```

### Sombras

```scss
// Sombras generales
$shadow-sm: 0 1px 4px 0 rgba(0, 0, 0, 0.08);   // Sutil
$shadow-md: 0 2px 8px 0 rgba(0, 0, 0, 0.16);   // Media
$shadow-lg: 0 4px 16px 0 rgba(0, 0, 0, 0.24);  // Pronunciada

// Sombras de botones (con color de marca)
$shadow-boton: 0 4px 12px 0 rgba(52, 198, 160, 0.4);
$shadow-boton-hover: 0 6px 16px 0 rgba(42, 174, 142, 0.5);

// Sombras modo oscuro (glow verde)
$oscuro-shadow-boton: 0 4px 20px 0 rgba(0, 229, 160, 0.35);
```

### Z-index

Sistema de capas ordenado:

```scss
$z-base: 1;       // Nivel base
$z-dropdown: 2;   // Menús desplegables
$z-sticky: 3;     // Elementos sticky
$z-overlay: 4;    // Overlays
$z-modal: 5;      // Modales (máxima prioridad)
```

### Bordes y radios

```scss
// Grosores de borde
$borde-thin: 1px;
$borde-medium: 2px;
$borde-thick: 4px;

// Radios de esquina
$radio-sm: 2px;     // Muy sutil
$radio-md: 4px;     // Botones, inputs
$radio-lg: 8px;     // Cards, contenedores
$radio-xl: 16px;    // Modales
$radio-full: 9999px; // Círculos, pills
```

---

## 1.5 Mixins y funciones

Los mixins son trozos de CSS que se pueden reutilizar sin copiar y pegar. Están en `01-tools/_mixins.scss`.

### Mixins disponibles

#### **respond-down** - Media query desktop-first

Aplica estilos hasta cierto breakpoint. Va de escritorio hacia abajo (max-width).

```scss
// Uso
.elemento {
  padding: $space-6; // Desktop por defecto

  @include respond-down(lg) {
    padding: $space-4; // Tablet y menor
  }

  @include respond-down(sm) {
    padding: $space-2; // Móvil
  }
}
```

**Breakpoints disponibles:**
- `xl`: hasta 1279px
- `lg`: hasta 1023px
- `md`: hasta 767px
- `sm`: hasta 639px

---

#### **flex-center** - Centrar con flexbox

Centra un elemento en ambos ejes con flexbox. Simple pero útil.

```scss
// Definición
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

// Uso
.contenedor-centrado {
  @include flex-center;
  height: 100vh;
}
```

---

#### **box-shadow** - Aplicar sombra

Mete una sombra predefinida o la que le pases como parámetro.

```scss
// Definición
@mixin box-shadow($shadow: $shadow-md) {
  box-shadow: $shadow;
}

// Uso con valor por defecto
.card {
  @include box-shadow; // Usa $shadow-md
}

// Uso con sombra personalizada
.boton {
  @include box-shadow($shadow-boton);
}
```

**Sombras disponibles en variables:**
- `$shadow-sm`: Sombra sutil
- `$shadow-md`: Sombra media (por defecto)
- `$shadow-lg`: Sombra pronunciada
- `$shadow-boton`: Sombra verde para botones primarios

---

## 1.6 ViewEncapsulation en Angular

Angular encapsula los estilos de cada componente por defecto, lo que afecta a cómo se aplican las clases CSS.

### Modos de encapsulación

1. **Emulated (por defecto):** Angular simula Shadow DOM añadiendo atributos únicos a los elementos
2. **ShadowDom:** Usa Shadow DOM nativo del navegador
3. **None:** Sin encapsulación, estilos globales

### Uso del selector :host

Cuando un componente tiene una clase en su elemento raíz (vía `@HostBinding` o `[class]`), hay que usar `:host` para estilizarlo:

```scss
// ❌ INCORRECTO - No funciona con ViewEncapsulation
.acordeon-item--expandido .acordeon__contenido {
  grid-template-rows: 1fr;
}

// ✅ CORRECTO - Funciona con ViewEncapsulation
:host.acordeon-item--expandido .acordeon__contenido {
  grid-template-rows: 1fr;
}
```

### Ejemplo práctico: Componente Acordeón

**TypeScript:**
```typescript
@Component({
  selector: 'app-acordeon-item',
  templateUrl: './acordeon-item.html',
  styleUrls: ['./acordeon-item.scss']
})
export class AcordeonItemComponent {
  expandido = signal(false);

  @HostBinding('class.acordeon-item--expandido')
  get claseExpandido() {
    return this.expandido();
  }
}
```

**SCSS:**
```scss
// El host es el elemento <app-acordeon-item>
:host {
  display: block;
}

// Cuando el host tiene la clase --expandido
:host.acordeon-item--expandido {
  .acordeon__icono {
    transform: rotate(180deg);
  }
  
  .acordeon__contenido {
    grid-template-rows: 1fr;
  }
}
```

### Buenas prácticas

1. **Usar `:host` cuando toque clases del elemento raíz**
2. **No usar `::ng-deep`**, está deprecado
3. **Variables CSS** para valores que vengan del padre
4. **Composición antes que herencia** de estilos

---

## 2. HTML semántico y estructura

### 2.1 Elementos semánticos utilizados

Usamos etiquetas HTML5 semánticas para que la página sea más accesible y se posicione mejor en buscadores:

| Elemento | Uso | Ejemplo en el proyecto |
|----------|-----|------------------------|
| `<header>` | Cabecera principal con logo, buscador y navegación | Layout header |
| `<nav>` | Navegación y enlaces de redes sociales | Header y footer |
| `<main>` | Contenido principal de la página | Layout main |
| `<section>` | Agrupación de contenido relacionado | Contenedores internos |
| `<article>` | Contenido independiente (marca, contacto) | Footer brand/contacto |
| `<footer>` | Pie de página con información de contacto | Layout footer |
| `<search>` | Área de búsqueda (HTML5.2) | Buscador en header |

**Ejemplo de header:**
```html
<header class="gym-header">
  <section class="gym-header__container">
    <a class="gym-header__logo" routerLink="/">
      <img src="assets/logo.png" alt="Gymunity">
    </a>
    <search class="gym-header__buscador">
      <app-buscador placeholder="Buscar..."></app-buscador>
    </search>
    <nav class="gym-header__utils">
      <app-boton-tema></app-boton-tema>
      <app-boton>Iniciar Sesión</app-boton>
    </nav>
  </section>
</header>
```

**Ejemplo de main:**
```html
<main class="gym-main">
  <ng-content></ng-content>
</main>
```

**Ejemplo de footer:**
```html
<footer class="gym-footer">
  <section class="gym-footer__container">
    <article class="gym-footer__brand">
      <img src="assets/logo.png" alt="Gymunity">
      <p class="gym-footer__slogan">Conecta con los mejores gimnasios...</p>
    </article>
    <article class="gym-footer__contacto">
      <nav class="gym-footer__social" aria-label="Redes sociales">
        <!-- Enlaces de las redes sociales -->
      </nav>
    </article>
  </section>
  <p class="gym-footer__copyright">© 2025 Gymunity</p>
</footer>
```

### 2.2 Jerarquía de headings

**Reglas:**
- Un solo `<h1>` por página (el título gordo)
- `<h2>` para secciones principales
- `<h3>` para subsecciones o tarjetas
- No saltarse niveles

**Diagrama de jerarquía:**
```
Página de Inicio
├── h1: "Encuentra el gimnasio perfecto para ti"
│   ├── h2: "Gimnasios más populares"
│   │   └── h3: [Nombre del gimnasio] (en cada tarjeta)
│   └── h2: "Nuevos gimnasios en Gymunity"
│       └── h3: [Nombre del gimnasio] (en cada tarjeta)

Página de Búsqueda
├── h1: "Estos son los gimnasios que hemos encontrado"
│   └── h3: [Nombre del gimnasio] (en cada resultado)

Tarjeta de Gimnasio (detalle)
├── h1: [Nombre del gimnasio]
│   ├── h2: "Profesores y artes impartidas"
│   ├── h2: "Torneos disponibles"
│   └── h2: "Reseñas de otros alumnos"
```

### 2.3 Estructura de formularios

Los formularios siguen las pautas de accesibilidad al pie de la letra:

- **`<fieldset>`**: agrupa campos que van juntos
- **`<legend>`**: describe para qué es ese grupo
- **`<label>`**: vinculado al input con `for` e `id`
- **Atributos ARIA**: `aria-describedby`, `aria-invalid` para lectores de pantalla

**Ejemplo del componente campo-formulario:**
```html
<label class="campo-formulario__label" [for]="inputId">
  {{ label }}
  @if (required) {
    <abbr class="campo-formulario__required" title="Campo obligatorio">*</abbr>
  }
</label>

<input 
  class="campo-formulario__field"
  [type]="type"
  [id]="inputId"
  [name]="name"
  [required]="required"
  [attr.aria-describedby]="helpText ? inputId + '-help' : null"
  [attr.aria-invalid]="hasError"
/>

@if (hasError && errorMessage) {
  <small class="campo-formulario__error" [id]="inputId + '-error'" role="alert">
    {{ errorMessage }}
  </small>
}
```

**Ejemplo de formulario completo (registro):**
```html
<form class="formulario-auth">
  <fieldset class="formulario-auth__fieldset">
    <legend class="formulario-auth__legend">Crear cuenta</legend>
    
    <app-campo-formulario
      label="Usuario o email:"
      type="email"
      inputId="registro-email"
      name="email"
      [required]="true">
    </app-campo-formulario>
    
    <app-campo-formulario
      label="Contraseña:"
      type="password"
      inputId="registro-password"
      name="password"
      [required]="true">
    </app-campo-formulario>
    
    <app-boton tipo="submit">Registrarse</app-boton>
  </fieldset>
</form>
```

La asociación `for`/`id` hace que al pulsar en el label se active el input. Es un detalle que mejora mucho la usabilidad, sobre todo en móviles.

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
