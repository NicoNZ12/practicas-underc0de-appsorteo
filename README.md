<p align="center">
  <h1>🎉 App de Sorteo</h1>
</p>

¡Bienvenidos a la **App de Sorteo**! 🎲

Esta aplicación fue desarrollada como parte de la **práctica profesional**, bajo la organización **UnderC0de**. El objetivo fue crear una herramienta sencilla y funcional para realizar sorteos de manera aleatoria, utilizando una combinación de tecnologías frontend y backend.

### **¡El sorteo está a solo un clic de distancia!** ✨

---

## 📜 Descripción

Esta aplicación consta de dos partes principales:

1. **Frontend**: Una interfaz simple en HTML, CSS y JS donde el usuario puede crear el evento, ingresar los participantes y premios del sorteo.
2. **Backend**: Una API RESTful desarrollada con **Spring Boot** que maneja la lógica del sorteo y la base de datos donde se almacenan los participantes.

### Características principales:

- Crear Evento
- Agregar participantes al sorteo.
- Agregar premios al sorteo.
- Realizar el sorteo de forma aleatoria.
- Resultados visibles de manera inmediata.
- Visualizar historial de eventos por nombre, fecha y detalles como ganadores y premios.
- Backend que interactúa con una base de datos MySQL para almacenar los participantes, datos del evento y premios.

---

## 🔧 Requisitos

### Para el Frontend:

- **HTML, CSS, JS**: Sin dependencias externas, solo un navegador moderno.

### Para el Backend:

- **Java 17**
- **MySQL 8.0**
- **Maven** para gestionar las dependencias del proyecto.
- **Spring Boot 3.3** (lo usaremos para la lógica del backend).

---

## 🚀 Instalación

### 1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/practicas-underc0de-appsorteo.git
cd practicas-underc0de-appsorteo
```

### 2. Configuración del Backend
####  1. Configura MySQL:

Asegúrate de tener MySQL instalado y en funcionamiento.

####  2. : Configura las credenciales de mysql (usuario y contraseña) en tu IDE. 
El backend creará por defecto la base de datos. En caso de que no se cree, deberás crear una base de datos llamada **sorteo_app**


### 3. Configuración del Frontend
#### 1. ve a la carpeta de frontend:

```bash
cd frontend
```

#### 2. Abre el archivo index.html en tu navegador, o usa un servidor local como VSCode Live Server para una mejor experiencia de desarrollo.

---

## 🛠️ Funcionalidad

### En el Frontend:
#### 1. Ingresa el nombre del evento
#### 2. Ingresa los nombres de los participantes en el campo correspondiente junto a los premios.
#### 3. Haz clic en el botón de "Guardar Datos" para guardar todos los datos ingresados.
#### 4. HAz clic en "Realizar Sorteo" para obtener a todos los ganadores aleatoriamente. 

### En el Backend:
- La API RESTful está disponible en el puerto 8080. Aquí puedes interactuar con los endpoints para manejar el flujo de la aplicación:
> - POST /evento - Crea un nuevo evento, verificando si hay uno activo.
> - POST /participante/agregar-participantes - Guarda la lista de participantes.
> - POST /premio/agregar-premio - Guarda la lista de premios y sponsors.
> - POST /evento/sorteo - Realiza un sorteo para un evento específico.

> - GET /participante/mostrar-participantes - Muestra la lista de participantes registradis. 
> - GET /evento/historial - Obtiene todos los eventos realizados con sus detalles y ganadores.
> - GET /evento/historial-paginado - Obtiene eventos paginados con detalles y ganadores.
> - GET /evento/filtrar-historial - Obtiene los eventos con sus detalles y ganadores filtrados por parámetros. 

### Ejemplo de flujo de uso:
1. Agrega participantes usando el formulario en el frontend.
2. El frontend realizará una solicitud al backend para añadir esos participantes a la base de datos.
3. Al hacer clic en "Sortear", el backend seleccionará aleatoriamente a un ganador y devolverá los resultados.

---

## 🖥️ Stack Tecnológico
### Frontend
- **HTML** para la estructura básica.
- **CSS** para el diseño
- **JavaScript** para la lógica de interacción con la API backend

### Backend
- **Spring Boot** Framework basado en Java para crear aplicaciones robustas y escalables
- **MySQL** Sistema de gestión de bases de datos relacional para almacenar la información de los participantes.
- **Spring Data JPA** para interactuar con la base de datos.

---

## 💼 Hecho como Práctica Profesional
Este proyecto fue realizado como parte de la práctica profesional para culminar la carrera, con el apoyo de UnderC0de, una comunidad enfocada en el desarrollo de proyectos y la capacitación profesional en tecnologías de software. ¡Gracias a todos por su apoyo!

---

## 👨‍💻 El Equipo
|  Nombre y Apellido  |  Responsabilidad     |
| -------------------  | :----------: |
| Emiliano Zani | Análisis, Diseño y Programación |
| Romina Rodriguez | Análisis, Diseño y Programación |
| Nicolás Núñez | Análisis, Diseño y Programación |
| Dalma Ponce | Análisis, Diseño y Programación |
