# Manual de Usuario: Laboratorio de Movimiento de Proyectiles

## 1. Introducción

Bienvenido al Laboratorio Virtual de Movimiento de Proyectiles. Esta herramienta está diseñada para ayudarte a explorar y comprender los principios de la física que gobiernan la trayectoria de los objetos en movimiento bajo la influencia de la gravedad.

A través de este simulador, podrás experimentar cómo diferentes factores, como la velocidad inicial, el ángulo de lanzamiento y la gravedad, afectan el vuelo de un proyectil.

## 2. Componentes de la Interfaz

La interfaz se divide en dos áreas principales: el **Canvas de Simulación** a la izquierda y el **Panel de Control** a la derecha.

### Canvas de Simulación

-   **Cañón:** Desde donde se dispara el proyectil. Su altura y ángulo se pueden ajustar.
-   **Proyectil:** El objeto que se lanza. Puedes cambiar su masa y diámetro.
-   **Objetivo:** Una diana que puedes mover horizontalmente para marcar un punto de referencia.
-   **Herramienta de Medición:** Un medidor amarillo que puedes arrastrar a cualquier punto de la trayectoria para obtener datos específicos (tiempo, distancia, altura) en ese punto.

### Panel de Control

El panel te permite ajustar todas las variables de la simulación:

-   **Condiciones Iniciales:**
    -   **Altura del Cañón:** Ajusta la altura inicial desde la que se dispara el proyectil.
    -   **Velocidad Inicial:** Define la rapidez con la que el proyectil sale del cañón.
    -   **Ángulo de Lanzamiento:** Cambia la inclinación del cañón.
-   **Entorno:**
    -   **Gravedad:** Modifica la aceleración gravitacional. Por defecto, es 9.8 m/s² (Tierra), pero puedes simular condiciones en la Luna (1.6 m/s²) o Marte (3.7 m/s²).
    -   **Resistencia del Aire:** Activa o desactiva la influencia de la fricción del aire.
-   **Proyectil:**
    -   **Tipo de Objeto:** Elige entre diferentes objetos (bala de cañón, piano, etc.).
    -   **Masa y Diámetro:** Ajusta las propiedades físicas del proyectil.

## 3. ¿Cómo Usar el Simulador?

1.  **Ajusta los Parámetros:** Usa los deslizadores o los campos de texto en el Panel de Control para configurar las condiciones de tu experimento.
2.  **Dispara:** Haz clic en el botón rojo **"¡Disparar!"** para lanzar el proyectil.
3.  **Analiza la Trayectoria:**
    -   Observa la parábola azul que dibuja el camino del proyectil.
    -   Arrastra la herramienta de medición amarilla a lo largo de esta línea para ver los datos de **tiempo, distancia y altura** en cualquier punto.
4.  **Reinicia:** Usa el botón **"Reiniciar"** para borrar las trayectorias y preparar un nuevo lanzamiento.

## 4. Ejemplo Práctico del Mundo Real: Un Tiro de Baloncesto

Imaginemos que queremos simular un tiro de baloncesto para ver si la pelota entrará en el aro.

**Escenario:**
Un jugador lanza una pelota desde una altura de 2 metros. El aro está a 7 metros de distancia horizontal y a una altura de 3.05 metros del suelo.

**¿Cómo lo simulamos?**

1.  **Configurar el Entorno:**
    -   **Altura del Cañón:** Fija la altura en **2 m**. Esto representa la altura desde la que el jugador lanza la pelota.
    -   **Gravedad:** Mantenla en **9.8 m/s²**, ya que el partido es en la Tierra.
    -   **Proyectil:** Selecciona un objeto con masa y diámetro similares a los de una pelota de baloncesto (aunque para un cálculo sin resistencia del aire, esto no afectará la trayectoria).

2.  **Posicionar el Objetivo:**
    -   Arrastra la diana roja horizontalmente hasta que la lectura de distancia debajo de ella marque **7.0 m**.
    -   Aunque no podemos ajustar la altura de la diana, sabemos que el aro está a 3.05 m.

3.  **Experimentar con el Lanzamiento:**
    -   **Prueba 1: Un tiro con ángulo de 50 grados.**
        -   Ajusta el **Ángulo de Lanzamiento** a `50°`.
        -   Ahora, ajusta la **Velocidad Inicial** hasta que, al disparar, la trayectoria pase lo más cerca posible de la diana. Por ejemplo, prueba con `8.5 m/s`.
        -   Dispara y observa. ¿La pelota pasa por encima o por debajo de la altura del aro (3.05 m) cuando está a 7 m de distancia?

    -   **Análisis con la Herramienta de Medición:**
        -   Arrastra el medidor amarillo y colócalo exactamente donde la trayectoria cruza la línea vertical de la diana (a 7 metros de distancia).
        -   La ventana emergente te dirá la **altura** del proyectil en ese punto. Si la altura es aproximadamente **3.05 m**, ¡el tiro es bueno!

Este ejemplo te permite entender cómo los atletas ajustan instintivamente la velocidad y el ángulo de sus lanzamientos para alcanzar un objetivo, aplicando los mismos principios de la física que exploras en este laboratorio.
