async function enviarFormulario() {
    let valido = true;

    // Ocultar errores anteriores
    document.querySelectorAll('.campo-error').forEach(error => {
        error.style.display = 'none';
    });

    document.querySelectorAll('.campo-input').forEach(input => {
        input.classList.remove('input-error');
    });

    // Obtener campos
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const evento = document.getElementById("evento");
    const comentarios = document.getElementById("comentarios");

    // Validaciones
    if (!nombre.value.trim()) {
        document.getElementById("error-nombre").style.display = "block";
        nombre.classList.add("input-error");
        valido = false;
    }

    if (!apellido.value.trim()) {
        document.getElementById("error-apellido").style.display = "block";
        apellido.classList.add("input-error");
        valido = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo.value.trim())) {
        document.getElementById("error-correo").style.display = "block";
        correo.classList.add("input-error");
        valido = false;
    }

    if (!telefono.value.trim() || telefono.value.trim().length < 7) {
        document.getElementById("error-telefono").style.display = "block";
        telefono.classList.add("input-error");
        valido = false;
    }

    if (!valido) return;

    try {

        const respuesta = await fetch("http://localhost:3000/api/contacto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre.value.trim(),
                apellido: apellido.value.trim(),
                email: correo.value.trim(),
                codigo_pais: "+57",
                telefono: telefono.value.trim(),
                tipo_evento: evento.value,
                comentarios: comentarios.value.trim()
            })
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {

            document.getElementById("mensaje-exito").style.display = "block";

            // Limpiar formulario
            nombre.value = "";
            apellido.value = "";
            correo.value = "";
            telefono.value = "";
            evento.selectedIndex = 0;
            comentarios.value = "";

        } else {
            alert(datos.error || "No fue posible enviar el formulario.");
        }

    } catch (error) {
        console.error(error);
        alert("No fue posible conectar con el servidor.");
    }
}
