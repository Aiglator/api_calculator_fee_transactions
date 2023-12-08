const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const PORT = 3000;

// Endpoint pour calculer les frais de transaction Bitcoin
app.post('/calculate_fee', async (req, res) => {
   try {
       const amountToSend = req.body.amount; // Montant à envoyer en satoshis
       const confirmationSpeed = req.body.speed; // Vitesse de confirmation (rapide, moyen, lent)

       if (!amountToSend || !confirmationSpeed) {
           return res.status(400).send({ error: 'Amount and speed are required' });
       }

       // Obtenir les frais recommandés de Mempool.space
       const feesResponse = await axios.get('https://mempool.space/api/v1/fees/recommended');
       const fees = feesResponse.data;

       // Obtenir le taux de change BTC/USD de CoinGecko
       const btcToUsdResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
       const btcToUsd = btcToUsdResponse.data.bitcoin.usd;

       // Calcul des frais (selon la vitesse choisie)
       let feePerByte;
       if (confirmationSpeed === 'rapide') {
           feePerByte = fees.fastestFee;
       } else if (confirmationSpeed === 'moyen') {
           feePerByte = fees.halfHourFee;
       } else if (confirmationSpeed === 'lent') {
           feePerByte = fees.hourFee;
       } else {
           return res.status(400).send({ error: 'Invalid speed value' });
       }

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
   app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

});