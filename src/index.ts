import dotenv from "dotenv"; // Load environment variables from .env file
import express from "express"; // Import express for creating the server
import mongoose from "mongoose"; // Import mongoose for MongoDB interactions
import userRoute from "./routes/userRoute"; // Import user routes for handling user-related requests
import produitRoute from "./routes/produitRoute"; // Import produit routes for handling user-related requests
import cors from "cors"; // Import CORS middleware for handling cross-origin requests
import path from "path";
import { seedInitialProduits } from "./services/produitServices";
import devisRoute from "./routes/devisRoute";

dotenv.config(); // Load environment variables from .env file

const app = express()
const port = 3001;

app.use(express.json())
app.use(cors()); // Use CORS middleware to allow cross-origin requests

app.use(
  "/public",
  express.static(path.join(__dirname, "../storage/public"))
);

mongoose
		.connect(process.env.DATABASE_URL || "")
		.then(() => console.log('Gamatel data base Connected!'))
		.catch((err) => console.log('Gamatel data base failed to connect!', err));

// seed initial
seedInitialProduits();

// Fichiers statiques du dossier public
app.use('/public', express.static(path.join(__dirname, 'storage/public')));

app.use('/user', userRoute)
app.use('/produits', produitRoute)
app.use("/devis", devisRoute);

app.listen(port, () => {
	console.log(`Server is running at: http://localhost:${port}`);
});

	
