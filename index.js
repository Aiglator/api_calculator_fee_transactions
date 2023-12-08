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
        const feesResponse = await axios.get('https://mempool.space/api/v1/fees/recommended');
        const fees = feesResponse.data;

        // Obtenir le taux de change BTC/USD de CoinGecko
        const btcToUsdResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const btcToUsd = btcToUsdResponse.data.bitcoin.usd;

        // Calcul des frais (exemple: en utilisant le tarif le plus rapide)
        const feePerByte = fees.fastestFee;
        const estimatedSize = 250; // Taille estimée d'une transaction en bytes
        const totalFee = feePerByte * estimatedSize;
        const totalToSend = amountToSend + totalFee;

        // Convertir en USD
        const totalFeeInUsd = (totalFee / 100000000) * btcToUsd;
        const totalToSendInUsd = (totalToSend / 100000000) * btcToUsd;

        res.send({ totalFeeInUsd, totalToSendInUsd });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
