# 📚 Teoría de Diseño CSS/HTML - Gymunity

> **Este documento explica TODO sobre CSS y HTML de forma muy detallada.**
> **No contiene TypeScript ni lógica de Angular, solo diseño y maquetación.**

---

## 🚨 REGLAS OBLIGATORIAS

### ❌ PROHIBIDO

```scss
// ❌ NUNCA usar !important - rompe la cascada CSS
.clase {
  color: red !important; // PROHIBIDO
}

// ❌ NUNCA usar px - usar rem para que escale con preferencias del usuario
.clase {
  padding: 16px; // PROHIBIDO
  font-size: 14px; // PROHIBIDO
}

// ❌ NUNCA usar <br> - el CSS controla los saltos de línea
<p>Línea 1<br>Línea 2</p>  // PROHIBIDO

// ❌ NUNCA usar <div> genéricos - usar etiquetas semánticas
<div class="header"></div>  // PROHIBIDO
```

### ✅ OBLIGATORIO

```scss
// ✅ SIEMPRE usar rem (relativo al tamaño de fuente raíz)
.clase {
  padding: 1rem;     // 16px si el root es 16px
  font-size: 0.875rem; // 14px
}

// ✅ SIEMPRE usar variables del directorio styles/
.clase {
  padding: $space-3;      // Variable de espaciado
  font-size: $texto-s;    // Variable de tipografía
  color: $color-botones;  // Variable de color
}

// ✅ SIEMPRE usar CSS Variables para temas (light/dark)
.clase {
  background: var(--color-fondo);
  color: var(--color-texto);
}

// ✅ SIEMPRE usar etiquetas semánticas HTML5
<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
<figure>, <figcaption>, <ul>, <li>, <a>, <button>, <form>, <search>
```

---

## 📐 ORDEN OBLIGATORIO DE PROPIEDADES CSS

**Cada bloque CSS debe seguir este orden estricto:**

```scss
.elemento {
  // 1️⃣ POSICIONAMIENTO - ¿Dónde está en el espacio?
  position: relative;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;

  // 2️⃣ DISPLAY - ¿Cómo se comporta y organiza sus hijos?
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  // 3️⃣ BOX MODEL - ¿Cuánto espacio ocupa?
  width: 100%;
  max-width: 64rem;
  height: auto;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  // 4️⃣ BACKGROUND - ¿Qué hay detrás?
  background: var(--color-fondo);
  background-image: url('...');
  background-size: cover;

  // 5️⃣ BORDER - ¿Cómo son sus bordes?
  border: 1px solid var(--color-borde);
  border-radius: 0.5rem;

  // 6️⃣ TIPOGRAFÍA - ¿Cómo se ve el texto?
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  font-style: italic;
  line-height: 1.5;
  text-align: center;
  color: var(--color-texto);

  // 7️⃣ EFECTOS VISUALES - ¿Qué efectos tiene?
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 1;
  cursor: pointer;
  outline: none;

  // 8️⃣ TRANSICIONES - ¿Cómo cambia?
  transition: background 0.2s ease, transform 0.2s ease;
}
```

**¿Por qué este orden?**
- Primero definimos DÓNDE está el elemento (posición)
- Luego CÓMO se comporta (display)
- Después su TAMAÑO (box model)
- Seguido de su APARIENCIA (fondo, borde, texto)
- Y finalmente sus ANIMACIONES (transiciones)

---

## 🧠 EL FLUJO NORMAL DEL DOCUMENTO

Por defecto, sin CSS, los elementos HTML se colocan siguiendo el **flujo normal**:

### Elementos de Bloque
`<section>`, `<article>`, `<p>`, `<h1>`, `<header>`, `<footer>`, etc.

- Se apilan **verticalmente**, uno debajo del otro
- Ocupan **todo el ancho** disponible

```
┌─────────────────────────────────────────┐
│           <header>                      │ ← Ocupa todo el ancho
├─────────────────────────────────────────┤
│           <section>                     │ ← Se pone debajo
├─────────────────────────────────────────┤
│           <footer>                      │ ← Se pone debajo
└─────────────────────────────────────────┘
```

### Elementos en Línea
`<span>`, `<a>`, `<strong>`, `<em>`, etc.

- Se colocan **horizontalmente**, uno al lado del otro
- Solo ocupan **lo que necesitan**

```
┌────────┐┌────────┐┌────────┐
│ <span> ││ <span> ││ <span> │ ← Todos en la misma línea
└────────┘└────────┘└────────┘
```

**El CSS nos permite ROMPER este flujo y colocar elementos donde queramos.**

---

## 📦 DISPLAY: Cómo se comporta un elemento

La propiedad `display` es **LA MÁS IMPORTANTE** de CSS. Define cómo se comporta el elemento.

### display: block

```scss
.caja {
  display: block;
}
```

- Ocupa **todo el ancho** disponible
- Se apila **verticalmente**
- Acepta width, height, margin, padding

```
┌─────────────────────────────────┐
│            .caja                │ ← 100% ancho
└─────────────────────────────────┘
┌─────────────────────────────────┐
│          otra .caja             │ ← Debajo
└─────────────────────────────────┘
```

### display: inline

```scss
.etiqueta {
  display: inline;
}
```

- Solo ocupa **lo que necesita**
- Se pone al **lado** de otros inline
- **NO** acepta width ni height

```
┌────────┐┌────────┐┌────────┐
│etiqueta││etiqueta││etiqueta│ ← Lado a lado
└────────┘└────────┘└────────┘
```

### display: inline-block

```scss
.boton {
  display: inline-block;
  width: 10rem;
  height: 3rem;
}
```

- Combina ambos mundos
- Se pone al **lado** de otros (como inline)
- **SÍ** acepta width y height (como block)

### display: flex (FLEXBOX) ⭐

```scss
.contenedor {
  display: flex;
}
```

- Activa **Flexbox** en el contenedor
- Sus hijos se organizan según reglas flexibles
- Por defecto, pone los hijos en **fila**

```
┌─────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐         │
│ │hijo1│ │hijo2│ │hijo3│         │ ← Hijos en fila
│ └─────┘ └─────┘ └─────┘         │
└─────────────────────────────────┘
      contenedor con display:flex
```

### display: grid (CSS GRID) ⭐

```scss
.contenedor {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}
```

- Crea una **cuadrícula** (filas Y columnas)
- Perfecto para layouts complejos

```
┌─────────────────────────────────┐
│ ┌───────┐ ┌───────┐ ┌───────┐   │
│ │ hijo1 │ │ hijo2 │ │ hijo3 │   │ ← Fila 1
│ └───────┘ └───────┘ └───────┘   │
│ ┌───────┐ ┌───────┐ ┌───────┐   │
│ │ hijo4 │ │ hijo5 │ │ hijo6 │   │ ← Fila 2
│ └───────┘ └───────┘ └───────┘   │
└─────────────────────────────────┘
```

---

## 🔄 FLEXBOX EN PROFUNDIDAD

Flexbox es el sistema más usado. **Domínalo.**

### Conceptos clave: Ejes

Flexbox trabaja con dos ejes:

**Con flex-direction: row (default):**
```
         ← ← ← EJE PRINCIPAL (horizontal) → → →
       ↑  ┌─────┐ ┌─────┐ ┌─────┐
       │  │  1  │ │  2  │ │  3  │
 EJE   │  └─────┘ └─────┘ └─────┘
CRUZADO│
(vertical)
       ↓
```

**Con flex-direction: column:**
```
         ← EJE CRUZADO (horizontal) →
       ↑  ┌─────────────────────┐
       │  │         1           │
       │  └─────────────────────┘
 EJE   │  ┌─────────────────────┐
PRINCIPAL │         2           │
(vertical)└─────────────────────┘
       │  ┌─────────────────────┐
       ↓  │         3           │
          └─────────────────────┘
```

### flex-direction: Dirección de los hijos

```scss
.contenedor {
  display: flex;
  flex-direction: row;    // Horizontal (default)
  flex-direction: column; // Vertical
}
```

### justify-content: Alineación en el EJE PRINCIPAL

```scss
// flex-start (default): Al inicio
.contenedor {
  display: flex;
  justify-content: flex-start;
}
```
```
┌─────────────────────────────────┐
│ ┌───┐┌───┐┌───┐                 │ ← Pegados a la izquierda
│ │ 1 ││ 2 ││ 3 │                 │
│ └───┘└───┘└───┘                 │
└─────────────────────────────────┘
```

```scss
// center: En el centro
.contenedor {
  display: flex;
  justify-content: center;
}
```
```
┌─────────────────────────────────┐
│        ┌───┐┌───┐┌───┐          │ ← Centrados
│        │ 1 ││ 2 ││ 3 │          │
│        └───┘└───┘└───┘          │
└─────────────────────────────────┘
```

```scss
// space-between: Espacio ENTRE elementos
.contenedor {
  display: flex;
  justify-content: space-between;
}
```
```
┌─────────────────────────────────┐
│ ┌───┐         ┌───┐        ┌───┐│ ← Separados al máximo
│ │ 1 │         │ 2 │        │ 3 ││
│ └───┘         └───┘        └───┘│
└─────────────────────────────────┘
```

```scss
// flex-end: Al final
.contenedor {
  display: flex;
  justify-content: flex-end;
}
```
```
┌─────────────────────────────────┐
│                 ┌───┐┌───┐┌───┐ │ ← Pegados a la derecha
│                 │ 1 ││ 2 ││ 3 │ │
│                 └───┘└───┘└───┘ │
└─────────────────────────────────┘
```

### align-items: Alineación en el EJE CRUZADO

```scss
// El contenedor necesita altura para ver el efecto
.contenedor {
  display: flex;
  height: 10rem;
  align-items: flex-start; // Arriba
}
```
```
┌─────────────────────────────────┐
│ ┌───┐ ┌───┐ ┌───┐               │ ← Pegados arriba
│ └───┘ └───┘ └───┘               │
│                                 │
│                                 │
└─────────────────────────────────┘
```

```scss
.contenedor {
  display: flex;
  height: 10rem;
  align-items: center; // Centro
}
```
```
┌─────────────────────────────────┐
│                                 │
│ ┌───┐ ┌───┐ ┌───┐               │ ← Centrados verticalmente
│ └───┘ └───┘ └───┘               │
│                                 │
└─────────────────────────────────┘
```

```scss
.contenedor {
  display: flex;
  height: 10rem;
  align-items: flex-end; // Abajo
}
```
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│ ┌───┐ ┌───┐ ┌───┐               │ ← Pegados abajo
│ └───┘ └───┘ └───┘               │
└─────────────────────────────────┘
```

### gap: Espacio entre elementos

```scss
.contenedor {
  display: flex;
  gap: 1rem; // 1rem de espacio entre cada hijo
}
```
```
┌─────────────────────────────────┐
│ ┌───┐   ┌───┐   ┌───┐           │
│ │ 1 │ ↔ │ 2 │ ↔ │ 3 │           │ ← gap = espacio entre ellos
│ └───┘   └───┘   └───┘           │
└─────────────────────────────────┘
       1rem   1rem
```

**⚠️ IMPORTANTE**: `gap` es el espacio **ENTRE** elementos, no afecta los bordes del contenedor. Para el borde usas `padding`.

### flex: Cómo crecen los hijos

```scss
.hijo {
  flex: 1; // Ocupa todo el espacio disponible
}
```

```scss
// Ejemplo: 3 hijos con flex diferentes
.hijo-1 { flex: 1; } // 1 parte
.hijo-2 { flex: 2; } // 2 partes
.hijo-3 { flex: 1; } // 1 parte
// Total: 4 partes
```
```
┌─────────────────────────────────────┐
│ ┌───────┐ ┌─────────────┐ ┌───────┐ │
│ │  25%  │ │     50%     │ │  25%  │ │
│ │ flex:1│ │   flex:2    │ │ flex:1│ │
│ └───────┘ └─────────────┘ └───────┘ │
└─────────────────────────────────────┘
```

---

## 📊 CSS GRID EN PROFUNDIDAD

Grid es perfecto para layouts de **dos dimensiones** (filas y columnas).

### Crear columnas

```scss
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; // 3 columnas iguales
}
```
```
┌───────────┬───────────┬───────────┐
│    1fr    │    1fr    │    1fr    │
│   (33%)   │   (33%)   │   (33%)   │
└───────────┴───────────┴───────────┘
```

### ¿Qué es `1fr`?

`fr` = **fracción** del espacio disponible DESPUÉS de restar gaps y elementos fijos.

```scss
// ¿Por qué 1fr es mejor que porcentajes?
grid-template-columns: 33.33% 33.33% 33.33%; // ❌ Problemas con gap
grid-template-columns: 1fr 1fr 1fr;          // ✅ Siempre perfecto
```

Con **porcentajes**: cada columna es 33.33%, pero el gap también suma → overflow
Con **fr**: el navegador calcula: espacio total - gaps, divide el resto → perfecto

### repeat(): Repetir columnas

```scss
// Estas dos líneas hacen lo mismo:
grid-template-columns: 1fr 1fr 1fr;
grid-template-columns: repeat(3, 1fr);
```

### Mezclar unidades

```scss
.header-grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  //                      ↑    ↑    ↑
  //                    logo buscador botones
  //                    (su   (ocupa   (su
  //                   tamaño espacio  tamaño
  //                   natural) libre) natural)
}
```
```
┌────────────────────────────────────────────────┐
│ ┌──────┐ ┌────────────────────────┐ ┌────────┐ │
│ │ Logo │ │       Buscador         │ │ Botones│ │
│ │(auto)│ │         (1fr)          │ │ (auto) │ │
│ └──────┘ └────────────────────────┘ └────────┘ │
└────────────────────────────────────────────────┘
```

### gap en Grid

```scss
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; // Espacio entre filas Y columnas
  // O separado:
  row-gap: 1rem;
  column-gap: 2rem;
}
```

---

## 📏 BOX MODEL: El modelo de caja

**Cada elemento HTML es una "caja" con capas:**

```
┌─────────────────────────────────────────────────┐
│                    MARGIN                       │ ← Espacio FUERA
│   ┌─────────────────────────────────────────┐   │
│   │                BORDER                   │   │ ← Borde visible
│   │   ┌─────────────────────────────────┐   │   │
│   │   │            PADDING              │   │   │ ← Espacio DENTRO
│   │   │   ┌─────────────────────────┐   │   │   │
│   │   │   │        CONTENIDO        │   │   │   │ ← Tu texto, imagen
│   │   │   └─────────────────────────┘   │   │   │
│   │   └─────────────────────────────────┘   │   │
│   └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### margin vs padding

```scss
.elemento {
  margin: 1rem;   // Empuja a OTROS elementos lejos de mí
  padding: 0.5rem; // Empuja mi CONTENIDO hacia dentro
}
```

```
                   ↕ margin-top (empuja al de arriba)
            ┌──────────────────────┐
margin-left │  ┌────────────────┐  │ margin-right
   ←──────→ │  │   padding      │  │ ←──────→
            │  │  ┌──────────┐  │  │
            │  │  │contenido │  │  │
            │  │  └──────────┘  │  │
            │  └────────────────┘  │
            └──────────────────────┘
                   ↕ margin-bottom (empuja al de abajo)
```

### Sintaxis abreviada (shorthand)

```scss
// 1 valor → los 4 lados iguales
margin: 1rem;

// 2 valores → vertical | horizontal
margin: 1rem 2rem;
//      ↑       ↑
//  top/bottom  left/right

// 3 valores → arriba | horizontal | abajo
margin: 1rem 2rem 3rem;
//      ↑       ↑      ↑
//     top  left/right bottom

// 4 valores → arriba | derecha | abajo | izquierda (sentido reloj 🕐)
margin: 1rem 2rem 3rem 4rem;
//      ↑     ↑     ↑     ↑
//     top  right bottom left
```

### box-sizing: border-box

```scss
* {
  box-sizing: border-box;
}
```

**Sin border-box:**
- width: 100px + padding: 20px + border: 5px = **150px total**

**Con border-box:**
- width: 100px (incluye padding y border) = **100px total**

**Siempre usa border-box** (está en nuestro reset CSS).

### Centrar horizontalmente con margin

```scss
.contenedor {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto; // margin-left y margin-right en "auto"
}
```
```
┌───────────────────────────────────────────────────┐
│ ← auto →  ┌─────────────────────┐  ← auto →       │
│           │    .contenedor      │                 │
│           │    (max 64rem)      │                 │
│           └─────────────────────┘                 │
└───────────────────────────────────────────────────┘
                    CENTRADO
```

---

## 🎯 POSITION: Colocar elementos fuera del flujo

La propiedad `position` permite **sacar elementos del flujo normal**.

### position: static (default)

```scss
.elemento {
  position: static; // Comportamiento normal
}
```
- El elemento sigue el flujo normal
- `top`, `right`, `bottom`, `left` no hacen nada

### position: relative

```scss
.elemento {
  position: relative;
  top: 10px;    // Se mueve 10px hacia abajo
  left: 20px;   // Se mueve 20px hacia la derecha
}
```
- El elemento **mantiene su espacio** en el flujo
- Se desplaza **respecto a su posición original**
- Otros elementos no se mueven

```
Espacio original      Elemento desplazado
     │                      │
     ▼                      ▼
┌────────┐            ┌ ─ ─ ─ ─ ┐  ← Espacio original preservado
│        │             
└────────┘            │         │
                       ┌────────┐
                      ││elemento│ ← Movido 10px abajo, 20px derecha
                       └────────┘
                      └ ─ ─ ─ ─ ┘
```

### position: absolute

```scss
.padre {
  position: relative; // El padre debe tener position
}

.hijo {
  position: absolute;
  top: 0;
  right: 0;
}
```
- El elemento **sale del flujo** (no ocupa espacio)
- Se posiciona **respecto al ancestro con position**
- Si no hay ancestro con position, usa el viewport

```
┌─────────────────────────────────┐
│ .padre (position: relative)  ┌──┤
│                              │X │ ← .hijo (absolute, top:0, right:0)
│                              └──┤
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Uso común**: botones de cerrar, badges, overlays

### position: fixed

```scss
.notificacion {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}
```
- Se posiciona **respecto al viewport** (pantalla)
- **NO hace scroll** con la página
- Siempre visible en la misma posición

```
┌─────────────────────────────────────┐
│                                     │
│     Contenido de la página...       │
│     (hace scroll)                   │
│                                     │
│                                     │
│                           ┌───────┐ │
│                           │ Toast │ │ ← Siempre aquí
│                           └───────┘ │
└─────────────────────────────────────┘
           VIEWPORT
```

### position: sticky

```scss
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}
```
- Actúa como `relative` hasta llegar al umbral
- Luego actúa como `fixed`
- **Perfecto para headers que se quedan pegados**

```
Al inicio:                    Al hacer scroll:
┌────────────────────┐        ┌────────────────────┐
│      HEADER        │ ←──────│      HEADER        │ ← Se queda
├────────────────────┤        ├────────────────────┤
│                    │        │                    │
│   Contenido...     │   ↓    │   Más contenido    │
│                    │        │                    │
└────────────────────┘        └────────────────────┘
```

### z-index: Capas

```scss
.elemento-arriba {
  position: relative; // Necesita position
  z-index: 10;        // Número más alto = más arriba
}

.elemento-abajo {
  position: relative;
  z-index: 1;
}
```
```
Vista lateral:
         z-index: 10
              ↓
         ┌────────┐
         │ arriba │
    ┌────┴────────┴────┐
    │      abajo       │
    └──────────────────┘
              ↑
         z-index: 1
```

**Guía de z-index:**
- Contenido normal: 1-10
- Headers sticky: 100
- Modales: 500
- Notificaciones/Toast: 1000

---

## 🎨 VARIABLES SCSS vs CSS

### Variables SCSS ($)

```scss
// Definición en _variables.scss
$color-botones: #34C6A0;
$space-3: 1rem;
$texto-s: 0.875rem;

// Uso
.boton {
  background: $color-botones;
  padding: $space-3;
  font-size: $texto-s;
}
```

- Se compilan a valores fijos en el CSS final
- **No cambian en tiempo de ejecución**
- Perfectas para valores que nunca cambian

### Variables CSS (Custom Properties) (--)

```scss
// Definición en _css-variables.scss
:root {
  --color-fondo: #EAF8F4;
  --color-texto: #212529;
}

// Tema oscuro
[data-theme="dark"] {
  --color-fondo: #1a1a2e;
  --color-texto: #f5f5f5;
}

// Uso
.elemento {
  background: var(--color-fondo);
  color: var(--color-texto);
}
```

- **Cambian en tiempo real** (para temas)
- El mismo CSS funciona en modo claro y oscuro
- Usa `var(--nombre)` para acceder

### ¿Cuándo usar cada una?

| Variable SCSS ($) | Variable CSS (--) |
|-------------------|-------------------|
| Espaciados fijos | Colores de tema |
| Tamaños de fuente | Fondos que cambian |
| Border-radius | Colores de texto |
| Breakpoints | Sombras con color de tema |
| Valores que nunca cambian | Valores que cambian con tema |

---

## 🔄 TRANSICIONES Y ANIMACIONES

### transition: Cambios suaves

```scss
.boton {
  background: var(--color-boton);
  transform: scale(1);
  transition: background 0.2s ease, transform 0.2s ease;
  //          ↑          ↑      ↑
  //       propiedad  duración  curva
  
  &:hover {
    background: var(--color-boton-hover);
    transform: scale(1.05);
  }
}
```

**Sintaxis:**
```scss
transition: propiedad duración curva-de-tiempo;

// Múltiples propiedades:
transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.3s ease;

// Todas las propiedades (menos eficiente):
transition: all 0.2s ease;
```

### Curvas de tiempo (easing)

```
ease        → Inicio y fin suaves, rápido en medio (DEFAULT)
ease-in     → Inicio lento, acelera
ease-out    → Inicio rápido, frena al final ← MEJOR PARA ENTRADAS
ease-in-out → Lento → rápido → lento
linear      → Velocidad constante
```

```
ease:
╭──────╮     ← Suave
│      │
│      ╰────

ease-in:
        ╭───
       ╱
______╱      ← Acelera

ease-out:
───╮
   │
   ╰────────  ← Frena

linear:
    ╱
   ╱
  ╱          ← Constante
```

### @keyframes: Animaciones complejas

```scss
// Definir la animación
@keyframes deslizar-entrada {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Aplicarla
.notificacion {
  animation: deslizar-entrada 0.3s ease-out;
  //         ↑               ↑        ↑
  //       nombre        duración   curva
}
```

**Con porcentajes para más control:**
```scss
@keyframes rebote {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

.elemento {
  animation: rebote 0.5s ease infinite;
  //                            ↑
  //                    se repite infinitamente
}
```

### transform: Transformaciones

```scss
.elemento {
  // Mover
  transform: translateX(10px);   // Horizontal
  transform: translateY(-5px);   // Vertical
  transform: translate(10px, 5px); // Ambos

  // Escalar
  transform: scale(1.1);         // 10% más grande
  transform: scale(0.9);         // 10% más pequeño
  
  // Rotar
  transform: rotate(45deg);      // 45 grados
  
  // Combinar
  transform: translateY(-5px) scale(1.05);
}
```

**¿Por qué transform es mejor que cambiar top/left?**
- `transform` usa la GPU → más fluido
- No causa "reflow" → mejor rendimiento
- Ideal para animaciones

---

## 🎭 BEM: Nombrar clases CSS

**BEM = Block Element Modifier**

Es una convención para nombrar clases CSS de forma organizada y predecible.

### Estructura

```
.bloque           → Componente independiente
.bloque__elemento → Parte del bloque
.bloque--modifier → Variante del bloque
```

### Ejemplo práctico: Botón

```scss
// BLOQUE: El componente
.boton {
  display: inline-flex;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

// MODIFICADORES: Variantes
.boton--primary {
  background: var(--color-boton);
  color: white;
}

.boton--ghost {
  background: transparent;
  border: 1px solid var(--color-boton);
  color: var(--color-boton);
}

.boton--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}
```

**Uso en HTML:**
```html
<button class="boton boton--primary">Enviar</button>
<button class="boton boton--ghost">Cancelar</button>
<button class="boton boton--primary boton--lg">Grande</button>
```

### Ejemplo práctico: Card

```scss
// BLOQUE
.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

// ELEMENTOS (partes del bloque)
.card__imagen {
  width: 100%;
  border-radius: 0.75rem;
}

.card__titulo {
  font-size: 1rem;
  font-weight: 600;
}

.card__subtitulo {
  font-size: 0.875rem;
  color: var(--color-subtitulo);
}

// MODIFICADOR
.card--horizontal {
  flex-direction: row;
}
```

**Uso:**
```html
<article class="card">
  <img class="card__imagen" src="..." alt="...">
  <h3 class="card__titulo">Título</h3>
  <p class="card__subtitulo">Subtítulo</p>
</article>

<article class="card card--horizontal">
  <!-- Versión horizontal -->
</article>
```

### Reglas de BEM

1. **Bloque**: Nombre del componente (`card`, `boton`, `header`)
2. **Elemento**: Usa `__` doble guión bajo (`card__titulo`)
3. **Modificador**: Usa `--` doble guión (`boton--primary`)
4. **Nunca anidar más de un nivel de elemento**: ❌ `card__body__titulo`

---

## 📱 RESPONSIVE DESIGN

### Media Queries

```scss
.elemento {
  padding: 0.5rem; // Móvil primero
  
  @media (min-width: 768px) {
    padding: 1rem; // Desde 768px
  }
  
  @media (min-width: 1024px) {
    padding: 1.5rem; // Desde 1024px
  }
}
```

### Breakpoints comunes

```scss
// Definidos en variables
$breakpoint-sm: 640px;   // Móviles grandes
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Laptops
$breakpoint-xl: 1280px;  // Escritorio
```

### Mixin para responsive

```scss
// En _mixins.scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == sm {
    @media (min-width: 640px) { @content; }
  } @else if $breakpoint == md {
    @media (min-width: 768px) { @content; }
  } @else if $breakpoint == lg {
    @media (min-width: 1024px) { @content; }
  }
}

// Uso
.grid {
  display: grid;
  grid-template-columns: 1fr; // 1 columna en móvil
  
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr); // 2 columnas
  }
  
  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr); // 3 columnas
  }
}
```

---

## 🖼️ IMÁGENES RESPONSIVAS

### object-fit: Cómo la imagen llena su contenedor

```scss
.imagen-contenedor {
  width: 100%;
  height: 10rem; // Altura fija
  overflow: hidden;
}

.imagen {
  width: 100%;
  height: 100%;
  object-fit: cover; // Rellena sin distorsionar
}
```

**Valores de object-fit:**
```
cover   → Rellena todo, recorta si es necesario (más común)
contain → Cabe todo, puede dejar espacios
fill    → Estira para llenar (distorsiona)
none    → Tamaño original
```

```
Imagen original: 📷 (16:9)
Contenedor: ⬜ (1:1 cuadrado)

object-fit: cover          object-fit: contain
┌──────────────┐           ┌──────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓│           │              │
│▓▓▓recortado▓▓│           │ ════════════ │ ← Imagen completa
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓│           │              │
└──────────────┘           └──────────────┘
 (llena todo)               (cabe todo)
```

### aspect-ratio: Mantener proporción

```scss
.video-container {
  width: 100%;
  aspect-ratio: 16 / 9; // Siempre 16:9
}

.avatar {
  width: 3rem;
  aspect-ratio: 1; // Cuadrado (1:1)
  border-radius: 50%;
}
```

---

## 🎨 EFECTOS VISUALES

### box-shadow: Sombras

```scss
// Sintaxis: offset-x offset-y blur spread color
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  //          ↑   ↑   ↑         ↑
  //         sin  4px 6px    10% opacidad
  //       offset abajo blur
  //      horiz.
}
```

**Sombras predefinidas:**
```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);   // Sutil
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);    // Normal
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);  // Pronunciada
```

**Sombra de resplandor (glow):**
```scss
.boton:hover {
  box-shadow: 0 0 1rem rgba($color-botones, 0.4);
  //          ↑ ↑   ↑
  //       sin offsets, solo blur = resplandor
}
```

### border-radius: Esquinas redondeadas

```scss
$radio-sm: 0.25rem;    // Sutil
$radio-md: 0.5rem;     // Normal
$radio-lg: 0.75rem;    // Redondeado
$radio-xl: 1rem;       // Muy redondeado
$radio-full: 9999px;   // Círculo/píldora
```

```scss
.boton-normal {
  border-radius: 0.5rem;
}

.boton-pildora {
  border-radius: 9999px; // Siempre redondo
}

.avatar {
  border-radius: 50%; // Círculo perfecto
}
```

### opacity y rgba

```scss
// opacity: afecta TODO el elemento y sus hijos
.elemento {
  opacity: 0.5; // 50% transparente
}

// rgba: solo afecta ese color específico
.elemento {
  background: rgba(0, 0, 0, 0.5); // Fondo 50% transparente
  color: white; // Texto 100% opaco
}
```

---

## 📝 TIPOGRAFÍA

### Sistema tipográfico

```scss
// Familia de fuentes con fallbacks
$fuente-principal: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;

// Escala de tamaños
$texto-xs: 0.75rem;   // 12px - Etiquetas pequeñas
$texto-sm: 0.875rem;  // 14px - Texto secundario
$texto-md: 1rem;      // 16px - Texto base
$texto-lg: 1.25rem;   // 20px - Subtítulos
$texto-xl: 1.5rem;    // 24px - Títulos
$texto-2xl: 2rem;     // 32px - Títulos grandes
$texto-3xl: 2.5rem;   // 40px - Títulos hero

// Pesos
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Interlineado
$line-height-tight: 1.2;   // Títulos
$line-height-normal: 1.5;  // Texto
$line-height-relaxed: 1.75; // Texto espaciado
```

### line-height: Interlineado

```scss
h1 {
  font-size: 2rem;
  line-height: 1.2; // 2rem × 1.2 = 2.4rem de altura de línea
}

p {
  font-size: 1rem;
  line-height: 1.5; // Más espacio para legibilidad
}
```

```
line-height: 1 (muy apretado)
┌────────────────────┐
│Línea de texto      │
│Otra línea de texto │
└────────────────────┘

line-height: 1.5 (cómodo)
┌────────────────────┐
│Línea de texto      │
│                    │
│Otra línea de texto │
│                    │
└────────────────────┘
```

---

## ✅ HTML SEMÁNTICO

### ¿Por qué importa?

1. **Accesibilidad**: Lectores de pantalla entienden la estructura
2. **SEO**: Google entiende mejor tu contenido
3. **Mantenibilidad**: Código más claro y legible

### Etiquetas principales

```html
<header>  → Cabecera de página o sección
<nav>     → Navegación
<main>    → Contenido principal (solo 1 por página)
<section> → Sección temática
<article> → Contenido independiente
<aside>   → Contenido relacionado pero separado
<footer>  → Pie de página o sección
```

### Estructura típica

```html
<body>
  <header class="header">
    <nav>...</nav>
  </header>
  
  <main class="main">
    <section class="hero">
      <h1>Título principal</h1>
    </section>
    
    <section class="productos">
      <h2>Productos</h2>
      <article class="card">...</article>
      <article class="card">...</article>
    </section>
  </main>
  
  <footer class="footer">
    <nav>...</nav>
  </footer>
</body>
```

### Etiquetas para contenido

```html
<figure>      → Imagen con contexto
<figcaption>  → Leyenda de figure
<ul> / <ol>   → Listas
<a>           → Enlaces
<button>      → Acciones
<search>      → Contenedor de búsqueda (HTML5.2)
<time>        → Fechas/horas
```

### Atributos de accesibilidad

```html
<img src="foto.jpg" alt="Descripción de la imagen">
<button aria-label="Cerrar modal">×</button>
<nav aria-label="Menú principal">...</nav>
<div role="alert">Mensaje importante</div>
```

---

## 🔧 TRUCOS Y PATRONES COMUNES

### Centrar con Flexbox

```scss
.centrado {
  display: flex;
  justify-content: center; // Horizontal
  align-items: center;     // Vertical
  height: 100vh;           // Necesita altura
}
```

### Contenedor con max-width centrado

```scss
.contenedor {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1rem; // Respiro en móviles
}
```

### Footer pegado abajo

```scss
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1; // Crece para empujar el footer abajo
}

footer {
  // No necesita nada especial
}
```

### Overlay sobre imagen

```scss
.card {
  position: relative;
}

.card__overlay {
  position: absolute;
  inset: 0; // top:0, right:0, bottom:0, left:0
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .card__overlay {
  opacity: 1;
}
```

### Texto truncado con elipsis

```scss
.texto-truncado {
  white-space: nowrap;     // No salta de línea
  overflow: hidden;        // Oculta lo que sobra
  text-overflow: ellipsis; // Añade "..."
}
```

### Ocultar visualmente (accesible)

```scss
.visualmente-oculto {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 📚 RESUMEN RÁPIDO

### CSS Orden de propiedades
1. Posicionamiento (position, z-index)
2. Display (flex, grid, gap)
3. Box Model (width, margin, padding)
4. Background
5. Border
6. Tipografía (font, color)
7. Efectos visuales (shadow, opacity)
8. Transiciones

### Reglas de oro
- ✅ rem, nunca px
- ✅ Variables para todo
- ✅ CSS Variables para temas
- ✅ Etiquetas semánticas
- ✅ BEM para nombrar clases
- ✅ Mobile first
- ❌ !important
- ❌ `<div>` genéricos
- ❌ `<br>` para espaciado

---

**Última actualización:** Diciembre 2024
**Autor:** Gymunity Team
