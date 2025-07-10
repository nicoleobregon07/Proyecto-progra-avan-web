document.addEventListener('DOMContentLoaded', function() {
    const dropColumnButtons = document.querySelectorAll('.drop-column-btn');
    const turnoActualElement = document.getElementById('turno-actual');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const gameOverMessageText = document.getElementById('game-over-message-text');
    const mainMenuBtn = document.getElementById('main-menu-btn');
    const restartGameBtnOverlay = document.getElementById('restart-game-btn'); // Renombrado para evitar conflicto con el botón manual
    
    // Elementos para el reinicio manual
    const reiniciarManualBtn = document.getElementById('reiniciar-manual-btn');
    const mensajeAlerta = document.getElementById('mensaje-alerta');
    const confirmarReinicioBtn = document.getElementById('confirmar-reinicio');
    const cancelarReinicioBtn = document.getElementById('cancelar-reinicio');

    // Elementos de la burbuja de mensajes
    const bubbleMessage = document.getElementById('bubble-message');
    const bubbleText = document.getElementById('bubble-text');

    // Validación de variables globales de Flask 
    if (typeof CURRENT_PARTIDA_ID === 'undefined' || 
        typeof JUGADOR1_ID === 'undefined' || 
        typeof JUGADOR2_ID === 'undefined' ||
        typeof IS_GAME_OVER_INITIAL === 'undefined') {
        console.error("Variables de configuración del juego (IDs de partida/jugadores/estado inicial) no definidas. Asegúrate de pasarlas desde Flask al HTML.");
        mostrarBurbuja("Error de configuración del juego. Recarga la página.");
        return; // Detener la ejecución si las variables críticas faltan
    }

    // Lógica de estado inicial del juego 
    // Si la partida ya está terminada al cargar la página, deshabilitar los botones de columna
    // y mostrar el overlay de fin de juego si no está ya visible.
    if (IS_GAME_OVER_INITIAL) {
        dropColumnButtons.forEach(btn => btn.disabled = true);
        if (gameOverOverlay.classList.contains('hidden')) {
            gameOverOverlay.classList.remove('hidden');
        }
        if (reiniciarManualBtn) {
            reiniciarManualBtn.classList.add('hidden');
        }
    } else {
        if (reiniciarManualBtn) {
            reiniciarManualBtn.classList.remove('hidden');
        }
    }

    // Event Listeners para los botones de columna ---
    dropColumnButtons.forEach(button => {
        button.addEventListener('click', function() {
            const column = this.dataset.column; // Obtiene el valor de 'data-column'
            makeMove(column);
        });
    });

    // Event Listeners para los botones de fin de juego (en el overlay) ---
    mainMenuBtn.addEventListener('click', function() {
        window.location.href = '/'; // Redirige al menú principal
    });

    // Este es el botón "Reiniciar Partida" que está DENTRO del overlay de fin de juego
    if (restartGameBtnOverlay) {
        restartGameBtnOverlay.addEventListener('click', function() {
            window.location.href = `/reiniciar/${CURRENT_PARTIDA_ID}`;
        });
    }

    // Event Listeners para el botón de reinicio manual (fuera del overlay)
    if (reiniciarManualBtn) {
        reiniciarManualBtn.addEventListener("click", () => {
            mensajeAlerta.classList.remove("d-none"); // Mostrar el mensaje de confirmación
        });
    }

    if (confirmarReinicioBtn) {
        confirmarReinicioBtn.addEventListener("click", () => {
            mensajeAlerta.classList.add("d-none"); // Ocultar el mensaje
            window.location.href = `/reiniciar/${CURRENT_PARTIDA_ID}`; // Redirigir para reiniciar
        });
    }

    if (cancelarReinicioBtn) {
        cancelarReinicioBtn.addEventListener("click", () => {
            mensajeAlerta.classList.add("d-none"); // Ocultar el mensaje
        });
    }

    /**
     * Envía la solicitud de movimiento al servidor y actualiza el tablero.
     * @param {string} column El índice de la columna seleccionada (0-6).
     */
    function makeMove(column) {
        // Deshabilitar los botones mientras se procesa el movimiento para evitar clics múltiples
        dropColumnButtons.forEach(btn => btn.disabled = true);
        // Ocultar la alerta de reinicio manual si está visible
        if (!mensajeAlerta.classList.contains('d-none')) {
            mensajeAlerta.classList.add('d-none');
        }

        const url = `/jugar/${CURRENT_PARTIDA_ID}`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ column: column })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || `Error del servidor: ${response.status} ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const row = data.row;
                const col = data.column;
                const playerColorClass = data.player_color == data.jugador1_id ? 'jugador1-ficha' : 'jugador2-ficha';
                const targetCell = document.getElementById(`celda-${row}-${col}`);

                if (targetCell) {
                    const newFicha = document.createElement('div');
                    newFicha.classList.add('ficha', playerColorClass);

                    setTimeout(() => {
                        newFicha.classList.add('caer-animacion');
                    }, 10);

                    targetCell.appendChild(newFicha);
                    
                    if (turnoActualElement) {
                        turnoActualElement.textContent = data.next_player_name;
                    }

                    if (data.game_over) {
                        gameOverMessageText.textContent = data.message;
                        gameOverOverlay.classList.remove('hidden');
                        dropColumnButtons.forEach(btn => btn.disabled = true);
                        // Ocultar el botón de reinicio manual cuando el juego termina
                        if (reiniciarManualBtn) {
                            reiniciarManualBtn.classList.add('hidden');
                        }
                    } else {
                        dropColumnButtons.forEach(btn => btn.disabled = false);
                    }
                } else {
                    console.error(`Celda no encontrada: celda-${row}-${col}`);
                    mostrarBurbuja('Error interno al mostrar ficha.');
                    dropColumnButtons.forEach(btn => btn.disabled = false);
                }
            } else {
                mostrarBurbuja(data.message);
                dropColumnButtons.forEach(btn => btn.disabled = false);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud Fetch:', error);
            mostrarBurbuja(`Error al comunicar con el servidor: ${error.message}`);
            dropColumnButtons.forEach(btn => btn.disabled = false);
        });
    }

    /**
     * Muestra un mensaje temporal en una burbuja en la parte inferior de la pantalla.
     * @param {string} mensaje El texto a mostrar en la burbuja.
     */
    function mostrarBurbuja(mensaje) {
        if (bubbleMessage && bubbleText) {
            bubbleText.textContent = mensaje;
            bubbleMessage.classList.remove('d-none');
            setTimeout(() => {
                bubbleMessage.classList.add('d-none');
            }, 3000);
        } else {
            console.warn("Elementos de burbuja de mensaje no encontrados. Mostrando con alert().");
            alert(mensaje);
        }
    }

    // Lógica para que los flash messages desaparezcan automáticamente
    setTimeout(() => {
        const flashes = document.querySelectorAll('.flash-message');
        flashes.forEach(el => {
            el.classList.add('opacity-0');
            setTimeout(() => el.remove(), 500);
        });
    }, 5000);
});