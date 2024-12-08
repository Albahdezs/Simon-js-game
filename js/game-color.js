document.addEventListener("DOMContentLoaded", function() {
    const colors = ['red', 'blue', 'green', 'yellow'];
    let sequence = [];  // Secuencia de la máquina
    let playerSequence = [];  // Secuencia del jugador
    let canClick = false;  // Para controlar si el jugador puede hacer clic
    let currentStreak = 0;  // Racha actual del jugador
    let bestStreak = 0;  // Mejor racha alcanzada
    let isGameOver = false;  // Para saber si el juego ha terminado
    let gameInProgress = false;  // Para verificar si el juego está en progreso

    const squares = document.querySelectorAll('.square');
    const startButton = document.getElementById('start-button');
    const finishButton = document.getElementById('finish-button');
    const resultMessage = document.getElementById('result-message');

    // Iniciar el juego
    startButton.addEventListener('click', () => {
        if (gameInProgress) return; // No iniciar otro juego si ya está en progreso

        // Resetear juego
        sequence = [];
        playerSequence = [];
        currentStreak = 0;
        isGameOver = false;
        gameInProgress = true;
        resultMessage.textContent = '';  // Limpiar mensaje de resultados

        startButton.disabled = true;
        finishButton.disabled = false;

        nextSequence();  // Comienza la secuencia de la máquina
    });

    // Finalizar el juego
    finishButton.addEventListener('click', () => {
        if (isGameOver) return; // Si el juego ya ha terminado, no hacer nada

        displayResult(`¡Has finalizado el juego! Tu mejor racha ha sido: ${bestStreak}`);  // Mostrar la mejor racha alcanzada
        resetGame();  // Resetear el juego
    });

    // Generar la siguiente secuencia de la máquina
    function nextSequence() {
        if (isGameOver) return;  // No generar secuencia si el juego terminó

        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);  // Agregar el color a la secuencia de la máquina
        playerSequence = [];  // Limpiar la secuencia del jugador

        let delay = 0;
        sequence.forEach((color) => {
            setTimeout(() => {
                flashColor(color);
            }, delay);
            delay += 1000;  // Esperar 1 segundo entre cada color
        });

        setTimeout(() => {
            canClick = true;  // El jugador ahora puede hacer clic
        }, delay);
    }

    // Mostrar el color de la secuencia de la máquina
    function flashColor(color) {
        const square = document.querySelector(`.square[data-color="${color}"]`);
        square.style.backgroundColor = color;
        setTimeout(() => {
            square.style.backgroundColor = 'grey';
        }, 500);
    }

    // Manejar los clics del jugador
    squares.forEach(square => {
        square.addEventListener('click', (e) => {
            if (!canClick || isGameOver) return;  // No hacer nada si el jugador no puede hacer clic o el juego terminó

            const color = e.target.getAttribute('data-color');
            flashPlayerColor(color);  // Animación del clic del jugador
            playerSequence.push(color);  // Agregar el color clicado a la secuencia del jugador

            // Comprobamos si la secuencia es correcta
            if (checkSequence()) {
                currentStreak++;  // Incrementa la racha del jugador

                // Si el jugador ha completado la secuencia, pasamos a la siguiente
                if (playerSequence.length === sequence.length) {
                    canClick = false;  // Impedir más clics hasta que la secuencia termine
                    playerSequence = [];  // Limpiar la secuencia del jugador
                    setTimeout(() => {
                        // Actualizar la mejor racha si es necesario
                        if (currentStreak > bestStreak) {
                            bestStreak = currentStreak;
                        }

                        // Resetear la racha para la próxima secuencia
                        currentStreak = 0;

                        nextSequence();  // Mostrar la siguiente secuencia
                    }, 1000);  // Mostrar la siguiente secuencia
                }
            } else {
                displayResult(`Game Over! Tu mejor racha ha sido: ${bestStreak}`);  // Mostrar la mejor racha alcanzada
                isGameOver = true;  // Terminar el juego
                gameInProgress = false;  // El juego ya ha terminado
                resetGame();  // Resetear el juego
            }
        });
    });

    // Animación para el clic del jugador
    function flashPlayerColor(color) {
        const square = document.querySelector(`.square[data-color="${color}"]`);
        square.style.backgroundColor = color;
        setTimeout(() => {
            square.style.backgroundColor = 'grey';
        }, 300);
    }

    // Comprobar si la secuencia del jugador es correcta
    function checkSequence() {
        const currentIndex = playerSequence.length - 1;
        return playerSequence[currentIndex] === sequence[currentIndex];
    }

    // Mostrar el resultado final
    function displayResult(message) {
        resultMessage.textContent = message;  // Mostrar el mensaje con la mejor racha
    }

    // Resetear el juego al finalizar
    function resetGame() {
        sequence = [];
        playerSequence = [];
        canClick = false;
        currentStreak = 0;  // Resetear la racha de aciertos
        isGameOver = false;
        gameInProgress = false;  // El juego ya no está en progreso

        squares.forEach(square => {
            square.style.backgroundColor = 'grey';  // Resetear los colores de los cuadrados
        });

        startButton.disabled = false;
        finishButton.disabled = true;
    }
});
