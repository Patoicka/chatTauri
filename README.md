# Chat Tauri

Aplicación de escritorio de chat en tiempo real con soporte para conversaciones entre usuarios y un ChatBot. Desarrollada con **Tauri 2**, **React** y **Vite**, con un backend en **Node.js** que utiliza **Socket.io** y **MySQL**.

---

## ¿Qué hace el proyecto?

- **Chat en tiempo real**: Mensajes instantáneos entre usuarios (GreenPond, BluePond) y con un ChatBot.
- **Sistema de tickets**: Crear, buscar y eliminar tickets desde la interfaz del chat.
- **Subida de imágenes**: Envío de imágenes en mensajes y en tickets (multer en servidor, opción de Cloudinary/PHP según flujo).
- **Indicadores de estado**: “Está escribiendo…” y “Pensando…” durante la escritura y respuestas del bot.
- **Edición de mensajes**: Edición de mensajes propios desde el menú contextual.
- **Persistencia**: Mensajes y datos guardados en base de datos **MySQL**.
- **App de escritorio**: Empaquetado como aplicación nativa multiplataforma gracias a **Tauri**.

---

## Tecnologías utilizadas

### Frontend (cliente)

| Tecnología | Uso |
|------------|-----|
| **React 18** | UI y componentes |
| **Vite 6** | Build y dev server |
| **Tauri 2** | App de escritorio (Rust) |
| **Redux Toolkit** | Estado global (chat, opciones, mensajes) |
| **React Redux** | Integración React–Redux |
| **Tailwind CSS** | Estilos y diseño responsive |
| **PostCSS / Autoprefixer** | Procesado de CSS |
| **Font Awesome** | Iconos (React) |
| **Socket.io Client** | Conexión en tiempo real con el servidor |
| **Axios** | Peticiones HTTP (ej. subida de imágenes) |

### Backend (servidor)

| Tecnología | Uso |
|------------|-----|
| **Node.js** | Entorno de ejecución |
| **Express** | API REST y middleware |
| **Socket.io** | WebSockets y eventos en tiempo real |
| **MySQL2** | Base de datos (tabla `chatbot`, mensajes, etc.) |
| **Multer** | Subida de archivos (carpeta `uploads/`) |
| **CORS** | Configuración de orígenes permitidos |

### Tauri (Rust)

| Tecnología | Uso |
|------------|-----|
| **Tauri 2** | Runtime y ventana nativa |
| **tauri-plugin-opener** | Abrir enlaces/recursos externos |
| **serde / serde_json** | Serialización en Rust |

### Otras dependencias (package.json)

- **openai** – Integración con API OpenAI (respuestas del bot).
- **deepseek** – Posible integración con modelo DeepSeek.
- **cloudinary** – Subida/gestión de imágenes en la nube (según flujo).

---

## Estructura del proyecto

```
chatTauri/
├── index.html              # Entrada HTML (Vite)
├── package.json            # Dependencias y scripts npm
├── vite.config.js         # Configuración Vite (puerto 1420, proxy Socket.io)
├── tailwind.config.cjs     # Configuración Tailwind
├── postcss.config.cjs      # PostCSS
├── server.cjs              # Servidor Express + Socket.io + MySQL (puerto 4000)
│
├── public/
│   └── tauri.svg
│
├── src/                    # Código frontend React
│   ├── main.jsx            # Punto de entrada (Provider Redux + App)
│   ├── App.jsx             # Componente raíz (renderiza Chat)
│   ├── App.css             # Estilos globales
│   │
│   ├── store/
│   │   ├── index.js        # configureStore (Redux)
│   │   └── store.js        # chatSlice (estado del chat, opciones, mensajes)
│   │
│   ├── Pages/
│   │   ├── Home.jsx        # Lista de chats, usuarios (GreenPond/BluePond), acceso al ChatBot
│   │   └── Chat.jsx        # Vista principal del chat (Socket.io, mensajes, Header, Input)
│   │
│   └── Components/
│       ├── Header.jsx      # Cabecera del chat (ChatBot, botón Limpiar)
│       ├── Messages.jsx    # Lista de mensajes, edición, tickets, “escribiendo”/“pensando”
│       ├── Input.jsx       # Campo de texto, envío, subida de imagen
│       ├── SelectOption.jsx # Opciones: Buscar / Crear / Eliminar ticket
│       ├── AddTicket.jsx   # Formulario crear ticket
│       ├── FindTicket.jsx  # Búsqueda de tickets
│       └── DeleteTicket.jsx # Eliminación de tickets
│
└── src-tauri/              # Aplicación Tauri (Rust)
    ├── Cargo.toml          # Dependencias Rust (tauri, tauri-plugin-opener, serde)
    ├── tauri.conf.json     # Configuración Tauri (ventana, build, iconos)
    ├── capabilities/
    │   └── default.json    # Permisos por defecto
    ├── src/
    │   ├── main.rs         # Entrada del binario Tauri
    │   └── lib.rs          # Lógica de la app Tauri
    └── build.rs            # Script de build
```

---

## Requisitos previos

- **Node.js** (v18+ recomendado)
- **Rust** (para compilar Tauri): [rustup](https://rustup.rs/)
- **MySQL**: base de datos `chatBot`, usuario y contraseña configurados en `server.cjs`
- **Carpeta `uploads/`** en la raíz del proyecto (para Multer)

---

## Cómo ejecutar el proyecto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Base de datos

- Crear la base de datos `chatBot` en MySQL.
- Ajustar en `server.cjs`: `host`, `user`, `password`, `database`.
- Asegurar que exista la tabla `chatbot` con columnas acordes a los inserts (por ejemplo: `usuario`, `asunto`, `descripcion`, `date`, `imagen`).

### 3. Iniciar el servidor backend (puerto 4000)

```bash
node server.cjs
```

### 4. Iniciar el frontend / app Tauri

Solo frontend (navegador):

```bash
npm run dev
```

App de escritorio con Tauri (recomendado):

```bash
npm run tauri dev
```

El frontend se sirve en **http://localhost:1420** y el proxy de Vite redirige `/socket.io` al servidor en **http://localhost:4000**.

### 5. Build para producción

Frontend:

```bash
npm run build
```

App de escritorio (Tauri):

```bash
npm run tauri build
```

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Dev server Vite (solo frontend) |
| `npm run build` | Build de producción del frontend |
| `npm run preview` | Vista previa del build estático |
| `npm run tauri dev` | Desarrollo con ventana Tauri |
| `npm run tauri build` | Build instalador de la app de escritorio |
| `npm start` | Inicia `server.js` (si existe; en el repo aparece `server.cjs`) |

---

## Configuración relevante

- **Vite** (`vite.config.js`): puerto **1420**, proxy de `/socket.io` a `http://localhost:4000`.
- **Tauri** (`src-tauri/tauri.conf.json`): ventana 800×600, devUrl `http://localhost:1420`, frontendDist `../dist`.
- **CORS** (en `server.cjs`): orígenes permitidos incluyen `http://localhost:1420` y `http://localhost:3001`.

---

## Recomendaciones de IDE

- [VS Code](https://code.visualstudio.com/)
- Extensión [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

---

## Licencia

ISC
