import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Dossier de stockage
const uploadDir = path.join(__dirname, "../../storage/public/produits");

// Crée le dossier s’il n’existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Config multer pour stocker fichiers avec nom unique
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Ex : produit-1234567890.jpg
    const ext = path.extname(file.originalname);
    const basename = "produit-" + Date.now();
    cb(null, basename + ext);
  },
});

const upload = multer({ storage });

// Route POST /upload pour upload image unique
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu" });
  }

  // Construire URL publique (adapter host/port si besoin)
  const url = `${req.protocol}://${req.get("host")}/public/produits/${req.file.filename}`;

  res.json({ url });
});

export default router;
