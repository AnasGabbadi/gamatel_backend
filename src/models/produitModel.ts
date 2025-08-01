import mongoose, {Schema,Document} from "mongoose";

export interface IProduit extends Document {
    title: string;
    image: string;
    description: string;
    categorie: string;
}

const produitSchema = new Schema<IProduit>({
    title: {type: String, required: true},
    image: {type: String, required: true},
    description: {type: String, required: true},
    categorie: {type: String, required: true},
});

const produitModel = mongoose.model<IProduit>('Produit', produitSchema);

export default produitModel;