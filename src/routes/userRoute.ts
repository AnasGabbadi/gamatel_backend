import express from "express";
import { createAdmin, login } from "../services/userServices";
import userModel from "../models/userModel";
import { verifyToken } from "../middlewares/validateJWT";

const router = express.Router();

// UNIQUEMENT POUR INITIALISATION
// router.get("/create-admin", createAdmin);

router.post('/login', async (request, response) => {
  try {
    const { email, password } = request.body;
    const { statusCode, data } = await login({ email, password });
    response.status(statusCode).json(data);
  } catch {
    response.status(500).json({ message: "Internal Server Error" });
  } 
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const admin = await userModel.findById((req as any).user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin non trouvé" });
    }
    res.json(admin);
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;