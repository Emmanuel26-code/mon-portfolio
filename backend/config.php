<?php
/**
 * Configuration du backend — Portfolio Kobri Emmanuel Kablan
 * Fichier prêt pour l'intégration de la base de données (étape ultérieure)
 */

declare(strict_types=1);

// Paramètres de l'application
define('APP_NAME', 'Portfolio Kobri Emmanuel Kablan');
define('ADMIN_EMAIL', 'kobrikablan@gmail.com');

// Paramètres futurs pour la Base de Données (MySQL)
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_emmanuel');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Fonction de connexion PDO prête à être activée lors de l'ajout de la BD
 */
function getDbConnection(): ?PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        error_log('Erreur de connexion BD : ' . $e->getMessage());
        return null;
    }
}
