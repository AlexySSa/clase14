async function descargar() {
    const url = document.getElementById('url').value;
    document.getElementById('status').innerText = "Descargando...";
    
    try {
        const response = await fetch('http://localhost:3000/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('status').innerHTML = 
                `<a href="http://localhost:3000/download/${data.file}" download>Descargar MP3</a>`;
        } else {
            document.getElementById('status').innerText = "Error: " + data.error;
        }
    } catch (error) {
        document.getElementById('status').innerText = "Error al descargar.";
    }
}
