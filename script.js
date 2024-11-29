// Precio base de la quiniela
const BASE_PRICE = 2;

// Generar las opciones de cada carrera (1 a 16)
document.querySelectorAll('.options').forEach((optionsContainer) => {
    for (let i = 1; i <= 16; i++) {
        const option = document.createElement('div');
        option.classList.add('option');
        option.textContent = i;
        option.setAttribute('data-value', i);
        optionsContainer.appendChild(option);
    }
});

// Manejar la selección de opciones por carrera
document.querySelectorAll('.options').forEach(optionsContainer => {
    optionsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('option')) {
            e.target.classList.toggle('selected'); // Alternar selección
            updatePriceSummary(); // Actualizar precio total
        }
    });
});

// Actualizar el resumen de precio
function updatePriceSummary() {
    let totalPrice = BASE_PRICE; // Comenzamos con el precio base
    let currentMultiplier = 1; // Multiplicador inicial

    // Para cada carrera
    document.querySelectorAll('.options').forEach(optionsContainer => {
        const selectedOptions = optionsContainer.querySelectorAll('.option.selected');
        const numSelections = selectedOptions.length;

        if (numSelections > 0) {
            // Calcular el multiplicador para esta carrera
            currentMultiplier *= numSelections;
        }
    });

    totalPrice *= currentMultiplier; // Precio final con el multiplicador total

    // Actualizar el precio total en el DOM
    document.getElementById('totalPrice').textContent = totalPrice;
}

// Generar el ticket al enviar la apuesta
document.getElementById('quinielaForm').addEventListener('submit', e => {
    e.preventDefault();

    const ticketContainer = document.getElementById("ticket");
    const printButton = document.getElementById("printTicket");
    const ticketFecha = new Date().toLocaleString();
    const detalles = [];
    let totalPrice = BASE_PRICE;
    let currentMultiplier = 1;

    // Recorrer cada carrera y generar las selecciones
    document.querySelectorAll('.options').forEach((optionsContainer, index) => {
        const selectedOptions = Array.from(optionsContainer.querySelectorAll('.option.selected')).map(option => option.getAttribute('data-value'));
        if (selectedOptions.length > 0) {
            detalles.push(`<p><strong>Carrera ${index + 1}:</strong> ${selectedOptions.join(", ")}</p>`);
            currentMultiplier *= selectedOptions.length; // Calcular el multiplicador
        }
    });

    totalPrice *= currentMultiplier; // Precio final
    document.getElementById('ticketFecha').textContent = ticketFecha;
    document.getElementById('ticketDetalles').innerHTML = detalles.join("") || "<p>No se seleccionaron opciones.</p>";
    document.getElementById('ticketTotal').textContent = totalPrice;

    // Mostrar el ticket y el botón de impresión
    ticketContainer.style.display = "block";
    printButton.style.display = "inline-block";
});

// Imprimir el ticket
document.getElementById('printTicket').addEventListener('click', () => {
    const ticketContent = document.getElementById("ticket").outerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimir Ticket</title>
            <style>
                body { font-family: Arial, sans-serif; }
                #ticket { width: 300px; margin: auto; padding: 10px; border: 1px solid #000; }
                #ticket p, #ticket h2 { text-align: center; }
            </style>
        </head>
        <body>
            ${ticketContent}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
});
