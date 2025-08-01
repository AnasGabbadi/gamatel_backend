import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface LoginParams {
    email: string,
    password: string
};

const userName = process.env.UserName_Admin;
const email = process.env.Email_Admin;
const password = process.env.Password_Admin;

// Route spéciale pour créer l'admin (à exécuter UNE SEULE FOIS)
export const createAdmin = async (req: any, res: any) => {
  try {
    const existingAdmin = await userModel.findOne({ email: email });

    if (!userName || !email || !password) {
      return res.status(500).json({ message: "Variables d'environnement manquantes" });
    }

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin déjà existant" });
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const admin = await userModel.create({
        userName: userName,
        email: email,
        password: hashedPassword,
    });

    res.status(201).json({ message: "Admin créé avec succès", admin });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err });
  }
};

export const login = async ({ email, password }: LoginParams) => {
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return { data: "Incorrect email or password!", statusCode: 400 };
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);
    if (!passwordMatch) {
      return { data: "Incorrect email or password!", statusCode: 400 };
    }

    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET || "", { expiresIn: "1h" });

    return { data: { token }, statusCode: 200 };
  } catch (error) {
    console.error("Error in login:", error);
    return { data: "Internal Server Error", statusCode: 500 };
  }
};