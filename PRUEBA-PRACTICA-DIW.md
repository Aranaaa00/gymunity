## Justificación DIW

### 1. Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?

Es por la especifidad y la carga de css en orden, ya que si fuese al reves, al levantar el contenedor daria error ya que no cargaria todo correctamente.

En Setting estan los valores base del proyecto (colores, espaciados, padding y demas), si se importa antes Component, las variables no estarían disponibles ni definidas aún para usarse, la compilación fallaria, ya que estas rompiendo la especifidad de las variables de setting que deben ir obligatoriamente antes.

### 2. Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).

Con BEM puedo saber que componente pertenece exactamente a cada clase, sin tener que depender de su propio componente, ademas, te evitas tener anidaciones excesivas. Si no usase BEM, tedria que estar llamando a cada selector al lado de otro, y podria ser demasiado lioso si yo quisiera tocar algo muy concreto (el titulo de alguna card que este dentro de un componente padre extra, por ejemplo)