<!DOCTYPE html>
<html>
<head>
    <title>Calculateur de Frais Bitcoin</title>
</head>
<body>

    <h1>Calculateur de Frais de Transaction Bitcoin</h1>

    <form method="post">
        <label for="amount">Montant à envoyer (en satoshis):</label><br>
        <input type="number" id="amount" name="amount" required><br><br>
        <input type="submit" value="Calculer les Frais">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // L'URL de votre serveur Node.js
        $url = 'http://localhost:3000/calculate_fee';
    
        // Récupérer le montant du formulaire
        $amount = $_POST['amount'];
    
        // Données pour la requête POST
        $data = ['amount' => $amount];
    
        // Setup cURL session
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    
        // Exécution de la session cURL et récupération du résultat
        $result = curl_exec($ch);
    
        // Vérification des erreurs cURL
        if (curl_errno($ch)) {
            echo 'Error:' . curl_error($ch);
        } else {
            // Décodage et affichage de la réponse
            $response = json_decode($result, true);
            echo "<pre>";
            print_r($response);
            echo "</pre>";
        }
    
        // Fermeture de la session cURL
        curl_close($ch);
    }
    ?>

</body>
</html>
