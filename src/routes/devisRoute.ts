import express from "express";
import multer from "multer";
import Devis from "../models/DevisModel";
import nodemailer from "nodemailer";
import DevisModel from "../models/DevisModel";
import { log } from "console";

const router = express.Router();

// Upload config
const storage = multer.diskStorage({
  destination: "uploads/devis",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ➕ Créer une demande de devis
router.post("/", async (req, res) => {
  
  try {
    const devis = await DevisModel.create(req.body);
    res.status(201).json(devis);
    
  } catch (err) {
    console.error("Erreur création devis:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 📥 Liste des devis
router.get("/", async (req, res) => {
  const devis = await Devis.find().sort({ createdAt: -1 });
  res.json({ items: devis, itemCount: devis.length });
});

// ❌ Supprimer
router.delete("/:id", async (req, res) => {
  await Devis.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// 📤 Envoyer devis + mise à jour
router.patch("/send/:id", upload.single("devisFile"), async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id);
    if (!devis) {
      return res.status(404).json({ error: "Devis introuvable" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier n'a été uploadé." });
    }

    const filePath = req.file.path;

    // Transporteur mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Envoi email
    await transporter.sendMail({
      from: `"GAMATEL" <${process.env.MAIL_USER}>`,
      to: devis.email,
      subject: "Votre devis demandé",
      text: "Bonjour, veuillez trouver ci-joint votre devis.",
      attachments: [
        {
          filename: req.file.originalname,
          path: filePath,
        },
      ],
    });

    // Mise à jour MongoDB
    devis.statut = "devis envoyé";
    devis.devisFile = filePath;
    await devis.save();

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Erreur lors de l'envoi du devis :", error);
    return res.status(500).json({ error: "Erreur lors de l'envoi du devis" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const total = await Devis.countDocuments();
    const enTraitement = await Devis.countDocuments({ statut: "en traitement" });
    const envoye = await Devis.countDocuments({ statut: "devis envoyé" });

    // Optionnel : Nombre par jour pour 7 derniers jours
    const dailyStats = await Devis.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ total, enTraitement, envoye, dailyStats });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du chargement des statistiques" });
  }
});

export default router;
