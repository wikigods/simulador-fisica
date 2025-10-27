# Plantilla para Informe de Laboratorio: Movimiento de Proyectiles

---

### **IV. Fundamento Teórico**

*En esta sección, debes explicar los principios físicos que gobiernan el movimiento de un proyectil. Asegúrate de incluir y definir los siguientes conceptos:*

*   **Movimiento Parabólico:** Describe por qué la trayectoria de un proyectil (en ausencia de resistencia del aire) forma una parábola.
*   **Componentes de la Velocidad:** Explica cómo la velocidad inicial se descompone en un componente horizontal (Vx) y un componente vertical (Vy) usando trigonometría.
    *   `Vx = V * cos(θ)`
    *   `Vy = V * sen(θ)`
*   **Independencia de Movimiento:** Menciona que el movimiento horizontal (a velocidad constante) y el movimiento vertical (con aceleración constante debido a la gravedad) son independientes.
*   **Ecuaciones Clave:**
    *   Posición horizontal: `x(t) = Vx * t`
    *   Posición vertical: `y(t) = h + Vy * t - (1/2) * g * t^2`
*   **Conceptos Adicionales (Opcional):** Puedes hablar sobre el alcance máximo, la altura máxima y el efecto de la resistencia del aire si lo consideras relevante para tu experimento.

---

### **V. Procedimiento**

*Aquí, detalla los pasos que seguiste para recolectar tus datos utilizando el simulador. Sé lo más específico posible para que otra persona pueda replicar tu experimento.*

**Ejemplo:**

1.  **Configuración del Simulador:**
    *   Se accedió al simulador de "Movimiento de Proyectiles".
    *   Se seleccionó la "Bala de Cañón" como el tipo de proyectil.
    *   Se estableció la masa en 50 kg y el diámetro en 0.5 m.
    *   Se desactivó la "Resistencia del Aire" para simplificar el análisis inicial.

2.  **Experimento 1: Variación del Ángulo de Lanzamiento:**
    *   Se fijó la velocidad inicial en `25 m/s` y la altura del cañón en `10 m`.
    *   Se realizaron 5 lanzamientos, variando el ángulo de lanzamiento en los siguientes valores: `30°`, `45°`, `60°`, `75°` y `90°`.
    *   Para cada lanzamiento, se utilizó el medidor de trayectoria para registrar el **alcance máximo** (distancia horizontal) y la **altura máxima** alcanzada.
    *   Los datos se anotaron en la tabla de la siguiente sección.

3.  **Experimento 2: Variación de la Velocidad Inicial (si aplica):**
    *   Se fijó el ángulo de lanzamiento en `45°`.
    *   Se realizaron lanzamientos variando la velocidad inicial... (etc.)

---

### **VI. Tabulación de Datos**

*En esta sección, presenta los datos que recolectaste de manera organizada en tablas.*

**Ejemplo de Tabla para el Experimento 1:**

| Ángulo de Lanzamiento (°) | Velocidad Inicial (m/s) | Altura Inicial (m) | Alcance Máximo (m) | Altura Máxima (m) |
| :-----------------------: | :----------------------: | :-----------------: | :----------------: | :----------------: |
|            30             |            25            |         10          |       *Tu dato*      |       *Tu dato*      |
|            45             |            25            |         10          |       *Tu dato*      |       *Tu dato*      |
|            60             |            25            |         10          |       *Tu dato*      |       *Tu dato*      |
|            75             |            25            |         10          |       *Tu dato*      |       *Tu dato*      |
|            90             |            25            |         10          |       *Tu dato*      |       *Tu dato*      |

---

### **VII. Cálculos y Resultados**

*Esta es la sección de análisis. Aquí debes procesar los datos que recolectaste, compararlos con los valores teóricos y discutir tus hallazgos.*

**Ejemplo de Análisis:**

1.  **Cálculos Teóricos:**
    *   Para cada ángulo probado en el Experimento 1, calcula el alcance máximo y la altura máxima teóricos utilizando las ecuaciones del Fundamento Teórico.
    *   *Ejemplo para 30°:*
        *   `Vx = 25 * cos(30°) = 21.65 m/s`
        *   `Vy = 25 * sen(30°) = 12.5 m/s`
        *   *Calcula el tiempo de vuelo y luego el alcance y la altura...*

2.  **Comparación y Porcentaje de Error:**
    *   Crea una nueva tabla comparando tus resultados medidos (de la simulación) con los resultados teóricos (calculados).
    *   Calcula el porcentaje de error para cada medida: `Error % = |(Valor Teórico - Valor Experimental) / Valor Teórico| * 100`

| Ángulo (°) | Alcance Medido (m) | Alcance Teórico (m) | Error % |
| :--------: | :----------------: | :-----------------: | :-----: |
|     30     |      *Tu dato*     |     *Tu cálculo*    |   ...   |
|     45     |      *Tu dato*     |     *Tu cálculo*    |   ...   |
|    ...     |        ...         |         ...         |   ...   |

3.  **Análisis de Resultados:**
    *   ¿A qué ángulo se logró el mayor alcance? ¿Coincide esto con la teoría (45° en terreno plano)?
    *   ¿Cómo afectó el ángulo a la altura máxima?
    *   Si hubo algún porcentaje de error, ¿a qué podría deberse? (Ej. Pequeñas imprecisiones en el medidor del simulador, redondeo, etc.).
    *   **Conclusión:** Resume tus hallazgos principales y confirma si los resultados del simulador se alinean con los principios físicos del movimiento de proyectiles.
