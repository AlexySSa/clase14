"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // Usa el puerto 3000 o el que esté disponible
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static("public")); // Servir archivos estáticos
// Ruta principal para la página web
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
// Ruta para descargar el audio de YouTube
app.post("/download", (req, res) => {
    const { url } = req.body;
    if (!url || !url.includes("youtube.com")) {
        return res.status(400).json({ error: "URL no válida" });
    }
    const title = `audio_${Date.now()}.mp3`;
    const outputPath = path_1.default.join(__dirname, title);
    // Comando para descargar el audio con yt-dlp
    const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
        if (error) {
            console.error("yt-dlp Error:", stderr);
            return res.status(500).json({ error: "Error al descargar el audio." });
        }
        res.json({ success: true, file: title });
    });
});
// Ruta para descargar el archivo MP3
app.get("/download/:filename", (req, res) => {
    const filePath = path_1.default.join(__dirname, req.params.filename);
    res.download(filePath, (err) => {
        if (!err) {
            fs_1.default.unlinkSync(filePath); // Borra el archivo después de la descarga
        }
    });
});
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
