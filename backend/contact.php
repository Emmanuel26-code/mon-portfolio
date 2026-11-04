<?php
/**
 * Traitement du formulaire de contact — Portfolio Kobri Emmanuel Kablan
 * Réception, validation et envoi de notification par email.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

// Autoriser uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Récupération des données POST
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation
$errors = [];

if ($name === '') {
    $errors['name'] = 'Le nom est obligatoire.';
} elseif (strlen($name) > 150) {
    $errors['name'] = 'Le nom ne doit pas dépasser 150 caractères.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Une adresse email valide est requise.';
} elseif (strlen($email) > 254) {
    $errors['email'] = 'L’adresse email est trop longue.';
}

if ($subject === '') {
    $errors['subject'] = 'Le sujet est obligatoire.';
} elseif (strlen($subject) > 200 || preg_match('/[\r\n]/', $subject)) {
    $errors['subject'] = 'Le sujet est invalide ou trop long.';
}

if ($message === '') {
    $errors['message'] = 'Le message ne peut pas être vide.';
} elseif (strlen($message) > 10000) {
    $errors['message'] = 'Le message ne doit pas dépasser 10 000 caractères.';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Veuillez corriger les erreurs dans le formulaire.',
        'errors'  => $errors,
    ]);
    exit;
}

// Préparation de l'email
$to = ADMIN_EMAIL;
$emailSubject = '=?UTF-8?B?' . base64_encode(sprintf('[Portfolio Kobri Emmanuel Kablan] %s', $subject)) . '?=';
$emailBody = "Nouveau message reçu depuis votre portfolio :\n\n";
$emailBody .= sprintf("Nom : %s\n", str_replace(["\r", "\n"], ' ', $name));
$emailBody .= sprintf("Email : %s\n", $email);
$emailBody .= sprintf("Date : %s\n\n", date('d/m/Y H:i:s'));
$emailBody .= "Message :\n";
$emailBody .= $message . "\n";

$headers = [
    'From' => sprintf('Portfolio <%s>', ADMIN_EMAIL),
    'Reply-To' => $email,
    'X-Mailer' => 'PHP/' . phpversion(),
    'Content-Type' => 'text/plain; charset=UTF-8',
];

// Envoi d'email via la fonction standard mail() de PHP
$mailSent = mail($to, $emailSubject, $emailBody, $headers);

if (!$mailSent) {
    error_log('Échec de l’envoi du message du formulaire de contact.');
    http_response_code(502);
    echo json_encode([
        'success' => false,
        'message' => 'Le serveur n’a pas pu envoyer votre message. Réessayez plus tard ou contactez-moi directement par email.',
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'message' => 'Merci pour votre message ! Il a été transmis à Kobri Emmanuel Kablan.',
]);
exit;
