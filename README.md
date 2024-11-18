<p align="center">
  <h1>🎉 App de Sorteo</h1>
</p>

¡Bienvenidos a la **App de Sorteo**! 🎲

Esta aplicación fue desarrollada como parte de la **práctica profesional**, bajo la organización **UndeC0de**. El objetivo fue crear una herramienta sencilla y funcional para realizar sorteos de manera aleatoria, utilizando una combinación de tecnologías frontend y backend.

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
git clone https://github.com/tu-usuario/app-de-sorteo.git
cd app-de-sorteo
```

### 2. Configuración del Backend
####  1. Configura MySQL:

Asegúrate de tener MySQL instalado y en funcionamiento.

####  2. : Configura las variables de entorno (usuario y contraseña) en tu IDE. El backend creará por defecto la base de datos. En caso de que no se cree, deberás crear una base de datos llamada **sorteo_app**


### 3. Configuración del Frontend
#### 1. ve a la carpeta de frontend:

```bash
cd frontend
```

#### 2. Abre el archivo index.html en tu navegador, o usa un servidor local como VSCode Live Server para una mejor experiencia de desarrollo.

---

## 🛠️ Funcionalidad

### En el Frontend:
#### 1. Ingresa los nombres de los participantes en el campo correspondiente.
#### 2. Haz clic en el botón de "Sortear" para obtener un ganador aleatorio.

### En el Backend:
- La API RESTful está disponible en el puerto 8080. Aquí puedes interactuar con los endpoints para manejar los participantes:
> - POST /api/participants - Añadir un nuevo participante al sorteo.
> - GET /api/participants - Obtener la lista de participantes.
> - GET /api/draw - Realizar el sorteo y obtener un ganador aleatorio.

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
Este proyecto fue realizado como parte de la práctica profesional para culminar la carrera, con el apoyo de UndeC0de, una comunidad enfocada en el desarrollo de proyectos y la capacitación profesional en tecnologías de software. ¡Gracias a todos por su apoyo!

---

## 👨‍💻 El Equipo
|  Nombre y Apellido  |  Responsabilidad     |
| -------------------  | :----------: |
| Emiliano Zani | Análisis, Diseño y Programación |
| Romina Rodriguez | Análisis, Diseño y Programación |
| Nicolás Núñez | Análisis, Diseño y Programación |
| Dalma Ponce | Análisis, Diseño y Programación |
