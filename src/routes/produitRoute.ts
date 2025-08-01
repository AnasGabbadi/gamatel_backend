import express from "express";
import { getAllProduits } from "../services/produitServices";
import produitModel from "../models/produitModel";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from 'fs';

const router = express.Router();

// Config stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../storage/public/produits');

    // Vérifie si le dossier existe, sinon le crée
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const produits = await getAllProduits();
        const formatted = produits.map((c) => ({
            id: (c._id as mongoose.Types.ObjectId).toString(),
            title: c.title,
            image: c.image,
            description: c.description,
            categorie: c.categorie,
        }));

        res.status(200).json({ items: formatted, itemCount: formatted.length });
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
});

// ✅ GET ONE BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const produit = await produitModel.findById(id).populate("categorie");

    if (!produit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ CREATE
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, categorie } = req.body;

    if (!title || !description || !categorie || !req.file) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/public/produits/${req.file.filename}`;

    const newProduit = await produitModel.create({
      title,
      image: imageUrl,
      description,
      categorie,
    });

    res.status(201).json(newProduit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du produit" });
  }
});

// ✅ UPDATE
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categorie } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/public/produits/${req.file.filename}` : undefined;

    const updatedData: any = { title, description, categorie };
    if (imageUrl) updatedData.image = imageUrl;

    const updatedProduit = await produitModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedProduit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json(updatedProduit);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const deletedProduit = await produitModel.findByIdAndDelete(id);

    if (!deletedProduit) {
      return res.status(404).json({ error: "Produit non trouvé" });
    }

    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

export default router;