import { exec } from "child_process";
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

const app = express();
const PORT = process.env.PORT || 3000; // Usa el puerto 3000 o el que esté disponible

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Servir archivos estáticos

// Ruta principal para la página web
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para descargar el audio de YouTube
app.post("/download", (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || !url.includes("youtube.com")) {
    return res.status(400).json({ error: "URL no válida" });
  }

  const title = `audio_${Date.now()}.mp3`;
  const outputPath = path.join(__dirname, title);

  // Comando para descargar el audio con yt-dlp
  const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("yt-dlp Error:", stderr);
      return res.status(500).json({ error: "Error al descargar el audio." });
    }
    res.json({ success: true, file: title });
  });
});

// Ruta para descargar el archivo MP3
app.get("/download/:filename", (req: Request, res: Response) => {
  const filePath = path.join(__dirname, req.params.filename);
  res.download(filePath, (err) => {
    if (!err) {
      fs.unlinkSync(filePath); // Borra el archivo después de la descarga
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
