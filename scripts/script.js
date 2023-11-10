document.addEventListener('DOMContentLoaded', function () {

// ---------------- BUSCAR REGISTRO ----------------- //
  const btnBuscar = document.getElementById("btnGet1");
  const API_URL = "https://654e1236cbc3253557424f1a.mockapi.io/users"
  btnBuscar.addEventListener("click", () => {
      const inputId = document.getElementById("inputGet1Id").value;
      
      if (inputId === "") {
          // Si el campo del ID está vacío, obtener todos los registros
          obtenerTodosLosRegistros();
      } else {
          // Si se proporciona un ID, obtener el registro específico
          obtenerRegistroPorId(inputId);
      }
  });

  function obtenerTodosLosRegistros() {
      
      fetch(API_URL)
          .then(response => response.json())
          .then(data => {
              mostrarResultados(data);
          })
          .catch(error => {
              console.error('Error al obtener todos los registros:', error);
          });
  }

  function obtenerRegistroPorId(id) {
      const URL = `https://654e1236cbc3253557424f1a.mockapi.io/users/${id}`;
      fetch(URL)
          .then(response => response.json())
          .then(data => {
              mostrarResultados([data]);
          })
          .catch(error => {
              console.error(`Error al obtener el registro con ID ${id}:`, error);
          });
  }

  function mostrarResultados(data) {
      const showInfo = document.getElementById("results");
      
      // Limpiar resultados anteriores
      showInfo.innerHTML = "";

      data.forEach(element => {
          showInfo.innerHTML += ` 
              <p>ID: ${element.id}</p>
              <p>NAME: ${element.name}</p>
              <p>LASTNAME: ${element.lastname}</p>
              <hr>`;
      });
  }

// ---------------- NUEVO REGISTRO ---------------//

  const btnAgregar = document.getElementById("btnPost");
  const inputNombre = document.getElementById("inputPostNombre");
  const inputApellido = document.getElementById("inputPostApellido");

  btnAgregar.addEventListener("click", async () => {
      const nuevoRegistro = {
          name: inputNombre.value,
          lastname: inputApellido.value
      };

      try {
          await agregarNuevoRegistro(nuevoRegistro);
          await obtenerTodosLosRegistros();
      } catch (error) {
          console.error('Error:', error);
      }
  });

  async function agregarNuevoRegistro(nuevoRegistro) {

      const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(nuevoRegistro)
      });

      if (!response.ok) {
          throw new Error(`Error al agregar el nuevo registro. Código de estado: ${response.status}`);
      }
  }

  async function obtenerTodosLosRegistros() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener todos los registros. Código de estado: ${response.status}`);
        }
        const data = await response.json();
        mostrarResultados(data);
    } catch (error) {
        console.error('Error al obtener todos los registros:', error.message);
    }
}


  function mostrarResultados(data) {
      const showInfo = document.getElementById("results");

      // Limpiar resultados anteriores
      showInfo.innerHTML = "";

      data.forEach(element => {
          showInfo.innerHTML += ` 
              <p>ID: ${element.id}</p>
              <p>Nombre: ${element.name}</p>
              <p>Apellido: ${element.lastname}</p>
              <hr>`;
      });
  }

  // ---------------- MODIFICAR REGISTRO ---------------------- //

  const btnGuardarCambios = document.getElementById("btnSendChanges");
  btnGuardarCambios.addEventListener("click", () => {
      const inputId = document.getElementById("inputPutId").value;
      guardarCambios(inputId);
  });


  function editarRegistro(id) {
    // Obtener los valores actuales del registro con el ID proporcionado
    const URL = `${API_URL}/${id}`;
    fetch(URL)
        .then(response => response.json())
        .then(data => {
                // Actualizar el modal con los valores actuales
            document.getElementById('inputPutNombre').value = data.name;
            document.getElementById('inputPutApellido').value = data.lastname;
            document.getElementById('btnSendChanges').addEventListener('click', () => {
                guardarCambios(id);
            });
            $("#dataModal").modal("show");
        })
        .catch(error => {
            console.error(`Error al obtener el registro con ID ${id}:`, error);
        });
}

async function guardarCambios(id) {
    const URL = `${API_URL}/${id}`;
    const nuevoNombre = document.getElementById('inputPutNombre').value;
    const nuevoApellido = document.getElementById('inputPutApellido').value;

    const response = await fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nuevoNombre,
            lastname: nuevoApellido
        })
    });

    if (response.ok) {
      $("#dataModal").modal("hide");  // Ocultar el modal después de guardar los cambios
      obtenerTodosLosRegistros(); // Actualizar la lista de registros

    } 
}
  // ------------------ ELIMINAR REGISTRO --------------------//

const btnEliminar = document.getElementById("btnDelete");
const inputEliminarId = document.getElementById("inputDelete");

btnEliminar.addEventListener("click", async () => {
    const id = inputEliminarId.value;
    if (id) {
        try {
            await eliminarRegistro(id);
            obtenerTodosLosRegistros();
        } catch (error) {
            console.error('Error al eliminar el registro:', error);
        }
    } else {
        console.error('Ingrese un ID válido para eliminar el registro.');
    }
});

async function eliminarRegistro(id) {
    const URL = `${API_URL}/${id}`;
    const response = await fetch(URL, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Error al eliminar el registro. Código de estado: ${response.status}`);
    }
}
});
