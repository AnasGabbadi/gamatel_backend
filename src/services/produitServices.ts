import produitModel from "../models/produitModel";

export const getAllProduits = async () => {
    return await produitModel.find();
};

export const seedInitialProduits = async () => {
    const BASE_URL = process.env.BASE_URL || '';

    try {

        const produits = [
            {
                title: "Ruijie RG-EST350-V2 Point To Point 5KM Neuf", 
                image: `${BASE_URL}/public/produits/20227436723909.jpg`, 
                description: `
                    Fonctionnalités particulières :
                    - Le RG-EST350 V2 peut facilement transmettre des données à 5 Km de portée en temps réel.
                    - Ponts appariés en usine pour une installation longue distance, sans alignement complexe.
                    - Étanchéité IP54, une plage de température de -30 ℃ ~ 65 ℃ garantit un fonctionnement stable en environnement extérieur.
                    - Faisant fonctionner un maximum de 45 caméras de 2 MP à 3 Km, et de 20 caméras de 2 MP à 5 Km.
                    - Statistiques de contrôle intuitif visualisable sur Ruijie Cloud, maintenance facile et à distance.
                `.trim(),
                categorie: "Reseau"
            },
            {
                title: "GWN 802.11ac Wave-2 2x2:2 Access Point", 
                image: `${BASE_URL}/public/produits/{491FC41A-B5DF-4284-B1B9-6701C411F90C}.png`, 
                description: `
                    The GWN7605 is an affordable 802.11ac Wave-2 Wi-Fi access point ideal for small to medium wireless network deployments with medium user density. It offers dual-band 2x2:2 MU-MIMO with beam-forming technology and a sophisticated antenna design for maximum network throughput and expanded Wi-Fi coverage range. 
                    - 1.27Gbps aggregate wireless throughput and 2xGigabit wireline ports
                    - Dual-band 2x2:2 MU-MIMO with beamforming technology
                    - Self power adaptation upon auto detection of PoE/PoE+
                    - Supports 100+ concurrent Wi-Fi client devices
                    - Up to 165-meter coverage range
                    - Advanced QoS to ensure real-time performance of low-latency applications
                    - Anti-hacking secure boot and critical data/control lockdown via digital signatures, unique security certificate/random default password per device
                    - Embedded controller can manage up to 50 local GWN series APs; GDMS Networking offers unlimited AP management; GWN Manager offers premise-based software controller
                `.trim(),
                categorie: "Reseau"
            },
            {
                title: "Caméra de surveillance Ezviz HB90 + panneau solaire 8W", 
                image: `${BASE_URL}/public/produits/{AB404689-D86C-4432-9485-2F7348E767C8}.png`, 
                description: `
                    Caméra : Capteur CMOS 1/3 » 4 mégapixels à balayage progressif, Obturateur auto-adaptatif, Objectif : Objectif supérieur : 2.8mm @ F1.2,
                    Champ de vision : Diagonal 110°, Horizontal 96°, Vertical 54° Objectif inférieur : 6mm @ F1.2, Champ de vision : Diagonal 60°, Horizontal 52°,
                    Vertical 28°, Jour et nuit : Filtre de coupure IR avec interrupteur automatique, 3D DNR, Vidéo & Audio  : Résolution Max. 2K+ (2560 x 1440),
                    Compression vidéo : H.265 / H.264, Débit binaire vidéo : Quad HD; HD; Standard; Adaptive bit rate, Débit binaire audio : Auto-adaptif,
                    Débit max. Bitrate : 2 Mbps (Total), Fonctionnalités  : Alarme intelligente , Suivi automatique, Zone d'alerte personnalisée,
                    Communication bidirectionnelle, Fonction générale : Anti-flicker, Dual-Stream, Heart Beat, Protection par mot de passe, Filigrane, 
                    Conditions de fonctionnement : Température de fonctionnement -20°C à 50°C, Humidité 95% ou moins (sans condensation), 
                    Alimentation électrique : DC 5 V / 2 A (l'adaptateur doit être acheté séparément), Consommation électrique : Max. 10 W ; 
                    Panneau solaire 8 W : Tension d'alimentation : 5.4 V ± 5%, Efficacité de la cellule solaire : 23.5%, 
                    Conditions de fonctionnement : -20 °C à 60 °C, Humidité 90 % ou moins (sans condensation), IP65, Cellules solaires monocristallines, 
                    Longueur du câble d'alimentation : 3 mètres
                `.trim(),
                categorie: "Reseau"
            },
        ];

        const existProduits = await getAllProduits();

        if (existProduits.length === 0) {
            await produitModel.insertMany(produits);
        }
    } catch (error: any) {
        console.error("Error seeding initial produits:", error.message);
    }
};