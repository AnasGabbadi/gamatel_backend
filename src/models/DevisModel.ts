import mongoose, { Schema, Document } from "mongoose";

export interface DevisDocument extends Document {
  nomClient: string;
  nomSociete: string;
  email: string;
  telephone: string;
  service: [string];
  message: string;
  secteur: string;
  statut: "en traitement" | "devis envoyé";
  devisFile?: string;
}

const devisSchema = new Schema<DevisDocument>(
  {
    nomClient: { type: String, required: true },
    nomSociete: { type: String},
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    service: { type: [String], required: true },
    message: { type: String, required: true },
    secteur: { type: String, required: true },
    statut: {
      type: String,
      enum: ["en traitement", "devis envoyé"],
      default: "en traitement",
    },
    devisFile: { type: String }, // URL ou chemin du fichier
  },
  { timestamps: true }
);

export default mongoose.model<DevisDocument>("Devis", devisSchema);
