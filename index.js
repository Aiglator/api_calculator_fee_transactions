const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = 3000;

// Endpoint pour calculer les frais de transaction Bitcoin
app.post('/calculate_fee', async (req, res) => {
    try {
        const amountToSend = req.body.amount; // Montant à envoyer en satoshis

        if (!amountToSend) {
            return res.status(400).send({ error: 'Amount is required' });
        }

        // Obtenir les frais recommandés de Mempool.space
        const response = await axios.get('https://mempool.space/api/v1/fees/recommended');
        const fees = response.data;

        // Calcul des frais (exemple: en utilisant le tarif le plus rapide)
        const feePerByte = fees.fastestFee;
        const estimatedSize = 250; // Taille estimée d'une transaction en bytes (valeur moyenne)
        const totalFee = feePerByte * estimatedSize;

        // Total à envoyer (montant + frais)
        const totalToSend = amountToSend + totalFee;

        res.send({ totalFee, totalToSend });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
