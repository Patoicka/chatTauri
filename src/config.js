/**
 * URL base del API/servidor (Socket.io y endpoints REST).
 * Se configura en .env como VITE_API_URL para no subir credenciales al repo.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** URL opcional para subir imágenes en tickets (PHP). Ver .env.example */
export const UPLOAD_PHP_URL = import.meta.env.VITE_UPLOAD_PHP_URL || "http://localhost/upload.php";
