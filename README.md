# Trabajo Práctico N° 7 - Programación 4

Este proyecto es una aplicación de "Registro de Participantes" dividida en Frontend y Backend. En este TP N° 7, el foco principal fue implementar **autenticación con JWT**, rutas privadas y control de acceso por rol.

1. **Frontend**: Creado con React, TypeScript y Vite. Utiliza la Context API con `useReducer` para el estado global, `react-router-dom` para la navegación multipantalla y un `AuthContext` para el manejo de sesión. Las rutas están protegidas mediante un componente `PrivateRoute` que valida autenticación y rol.
2. **Backend**: Creado con FastAPI y Python. Utiliza SQLite como base de datos local y SQLModel como ORM. Implementa autenticación mediante **JWT** (JSON Web Tokens), hashing de contraseñas con `bcrypt` y protección de endpoints por token y rol.

## Novedades del TP N° 7

- **Tabla `usuarios_db`** con campos `id`, `username`, `password` (hasheada) y `rol`.
- **Roles**: `ADMIN` y `CONSULTA`.
- **Endpoint `POST /login`** que valida credenciales y devuelve un JWT.
- **Protección de todos los endpoints** con verificación de token Bearer.
- **`AuthContext`**: maneja login/logout y persiste el token en `localStorage`.
- **`PrivateRoute`**: redirige a `/login` si no hay sesión, y a `/menu_inicio` si el rol no tiene permiso.
- **Permisos por rol**:
  - `ADMIN`: Leer, Crear, Editar, Eliminar, Resetear datos.
  - `CONSULTA`: Solo ver la lista de participantes.
- **Rutas**:
  - `/` y `/login` → `LoginPage` (pública)
  - `/publica` → `PublicaPage` (pública)
  - `/menu_inicio` → `MenuPage` (privada)
  - `/lista` → `ListaPage` (privada)
  - `/nuevo` → `FormularioPage` (privada, solo ADMIN)
  - `/editar/:id` → `EditarPage` (privada, solo ADMIN)
- **Seed automático** de usuarios y participantes al iniciar el servidor.

---

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| `admin` | `admin123` | ADMIN |
| `consulta` | `consulta123` | CONSULTA |

---

## Estructura del Proyecto

- `/frontend`: Interfaz en React. Rutas en `src/pages`, componentes en `src/components`, contextos en `src/context` y rutas protegidas en `src/routes`.
- `/backend`: API REST en FastAPI con autenticación JWT.

---

## Instrucciones para Ejecutar el Proyecto

Necesitás dos terminales abiertas simultáneamente.

### 1. Iniciar el Backend (FastAPI)

1. Abrí una terminal y dirigite a la carpeta `backend`:
   ```bash
   cd tp7BontornoMasVernier/backend
   ```
2. Creá y activá un entorno virtual:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instalá las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Ejecutá el servidor:
   ```bash
   uvicorn main:app --reload
   ```

> El servidor estará corriendo en `http://localhost:8000`. La primera vez se crea automáticamente `database.db` y se insertan los usuarios y participantes de prueba.

### 2. Iniciar el Frontend (React)

1. Abrí una nueva terminal y dirigite a la carpeta `frontend`:
   ```bash
   cd tp7BontornoMasVernier/frontend
   ```
2. Instalá los paquetes:
   ```bash
   npm install
   ```
3. Iniciá el servidor de desarrollo:
   ```bash
   npm run dev
   ```

> El frontend estará disponible en `http://localhost:5173`.

---

## Inspeccionar la Base de Datos

Los datos se guardan en `backend/database.db`. Para visualizarlos recomendamos la extensión **SQLite Viewer** de Florian Klampfer en Visual Studio Code.
