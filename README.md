# Trabajo Práctico N° 6 - Programación 4

Este proyecto consiste en una aplicación de "Registro de Participantes" dividida en dos partes. En este TP N° 6, el foco principal fue integrar navegación multipantalla (SPA) utilizando **React Router**.

1. **Frontend**: Creado con React, TypeScript y Vite. Utiliza la Context API y el hook `useReducer` para la gestión global y centralizada del estado. Se ha implementado `react-router-dom` para separar la aplicación en páginas (Listado, Formulario de Alta y Edición) acompañadas de una barra de navegación (Navbar) responsive con estilo "burger menu".
2. **Backend**: Creado con FastAPI y Python. Utiliza SQLite como base de datos local y SQLModel (ORM) para la gestión y validación de datos. Proporciona los endpoints CRUD consumidos por el Frontend.

## Novedades del TP N° 6

- Implementación de **React Router** (`<BrowserRouter>`, `<Routes>`, `<Route>`).
- Pantallas separadas:
  - `/` -> `ListaPage`: Muestra el listado y los filtros.
  - `/nuevo` -> `FormularioPage`: Permite dar de alta a un nuevo participante.
  - `/editar/:id` -> `EditarPage`: Recupera la información de un participante y la carga en el formulario para editarlo.
- **Navbar Responsive**: Barra de navegación superior con menú hamburguesa para dispositivos móviles.

---

## Estructura del Proyecto

- `/frontend`: Código fuente de la interfaz de usuario en React, con rutas en `src/pages` y componentes compartidos en `src/components`.
- `/backend`: Código fuente de la API REST en FastAPI.

---

## Instrucciones para Ejecutar el Proyecto

Para hacer funcionar la aplicación en tu entorno local, necesitas levantar tanto el servidor Backend como el servidor Frontend de manera simultánea en dos terminales distintas.

### 1. Iniciar el Backend (FastAPI)

1. Abre una terminal y dirígete a la carpeta `backend`:
   ```bash
   cd TP6/backend
   ```
2. Instala las dependencias necesarias (si es la primera vez que lo ejecutas):
   ```bash
   pip install -r requirements.txt
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   uvicorn main:app --reload
   ```
> El servidor estará corriendo en `http://localhost:8000`. Además, la primera vez que inicies el servidor se creará automáticamente el archivo `database.db` que aloja la base de datos de SQLite.

### 2. Iniciar el Frontend (React)

1. Abre una nueva terminal y dirígete a la carpeta `frontend`:
   ```bash
   cd TP6/frontend
   ```
2. Instala los paquetes de Node. Al haber clonado el proyecto o añadido `react-router-dom`, es importante ejecutar esto:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
> El servidor te indicará en qué URL local está corriendo el proyecto (por lo general, `http://localhost:5173`). ¡Abre ese enlace en tu navegador para usar la aplicación y probar la navegación!

---

## 💾 Inspeccionar la Base de Datos

Los participantes se guardan de forma persistente en el archivo `database.db` (dentro de `/backend`). Para ver el contenido de las tablas directamente desde tu editor sin usar código, recomendamos la siguiente extensión para **Visual Studio Code**:

1. Ve a la sección de **Extensiones** en VS Code.
2. Busca e instala la extensión **"SQLite Viewer"** (autor: *Florian Klampfer*).
3. Una vez instalada, simplemente haz clic sobre el archivo `backend/database.db` desde tu explorador de archivos en VS Code. Se abrirá una pestaña interactiva donde podrás explorar las tablas, filas y columnas de manera visual.
