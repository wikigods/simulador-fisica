# Guía de Pruebas Manuales

Este documento describe los pasos para verificar manualmente las nuevas características de diseño adaptable y escalado dinámico en el simulador de movimiento de proyectiles.

**Requisito Previo:** Asegúrate de que el servidor de desarrollo se esté ejecutando. Si no es así, abre una terminal y ejecuta el comando `npm run dev`.

---

### Parte 1: Verificación del Diseño Adaptable (Responsive)

El objetivo de esta prueba es asegurar que la interfaz de la simulación se ajuste correctamente a diferentes tamaños de pantalla.

**1.1. Vista de Escritorio (Desktop)**

1.  Abre la aplicación en un navegador web en tu computadora (ej. Chrome, Firefox).
2.  En el menú de navegación, haz clic en **"Projectile Motion"**.
3.  **Resultado Esperado:**
    *   Deberías ver el lienzo de la simulación a la izquierda y el "Panel de Control" a la derecha.
    *   Ambos elementos deben estar uno al lado del otro, y todo el contenido debe ser legible y estar bien distribuido.

**1.2. Vista de Tableta**

1.  Abre las herramientas de desarrollador de tu navegador (usualmente con la tecla `F12` o `Cmd+Opt+I` en Mac).
2.  Activa el modo de vista de dispositivo (suele ser un ícono de un teléfono y una tableta).
3.  Selecciona un dispositivo tipo tableta, como "iPad Air".
4.  **Resultado Esperado:**
    *   El diseño debería mantenerse similar al de escritorio, con el lienzo y el panel de control uno al lado del otro. El espacio podría ser más reducido, pero no debería haber elementos superpuestos o cortados.

**1.3. Vista de Móvil**

1.  En el mismo modo de vista de dispositivo, selecciona un dispositivo móvil como "iPhone 12 Pro".
2.  **Resultado Esperado:**
    *   El diseño debe cambiar a una sola columna. El "Panel de Control" ahora debe aparecer **debajo** del lienzo de la simulación.
    *   Los botones "¡Disparar!" y "Reiniciar" deben tener un tamaño ligeramente reducido para ajustarse mejor a la pantalla.
    *   El menú de navegación superior estará colapsado bajo un botón "hamburguesa".

---

### Parte 2: Verificación del Límite de Altura del Cañón (Escalado Dinámico)

El objetivo de esta prueba es confirmar que el cañón nunca desaparece de la pantalla, sin importar la altura inicial seleccionada.

**2.1. Comportamiento con Altura Baja (Por Defecto)**

1.  Asegúrate de estar en la vista de escritorio.
2.  Haz clic en el botón **"Reiniciar"** para volver a los valores por defecto.
3.  **Resultado Esperado:**
    *   El cañón se encuentra cerca de la parte inferior del lienzo. La vista está "acercada" (zoom in), mostrando el cielo azul y el suelo verde.

**2.2. Comportamiento con Altura Alta (Selección de Proyectil)**

1.  En el "Panel de Control", busca el selector desplegable **"Tipo de Objeto"**.
2.  Selecciona la opción **"Piano"**.
3.  **Resultado Esperado:**
    *   La vista del lienzo debe "alejarse" (zoom out) instantáneamente.
    *   El cañón se moverá a una posición mucho más alta en el lienzo, pero debe permanecer **completamente visible** en todo momento, sin ser cortado por el borde superior de la pantalla.

**2.3. Comportamiento con Ajuste Manual Extremo**

1.  Busca el control deslizante (slider) de **"Altura del Cañón"**.
2.  Arrastra el control lentamente hacia la derecha, hasta su valor máximo (100 m).
3.  **Resultado Esperado:**
    *   A medida que arrastras el control, la vista debe alejarse suave y continuamente.
    *   Incluso en la altura máxima, el cañón debe permanecer visible dentro de los límites del lienzo.
