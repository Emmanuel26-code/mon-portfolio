# Portfolio de Kobri Emmanuel Kablan

Site statique déployable sur Vercel. Le formulaire de contact utilise la fonction serveur `api/contact.js` et l’API Resend pour envoyer les messages par e-mail ; aucune base de données n’est requise.

## Configurer l’envoi des messages

1. Créer un compte Resend et générer une clé API.
2. Vérifier un domaine d’envoi dans Resend. L’adresse `RESEND_FROM_EMAIL` doit appartenir à ce domaine et être autorisée par Resend.
3. Dans les paramètres Vercel du projet, ajouter ces variables pour les environnements utilisés :
   - `RESEND_API_KEY` : clé API Resend, à garder secrète.
   - `RESEND_FROM_EMAIL` : adresse expéditrice vérifiée, par exemple `Portfolio <contact@votre-domaine.com>`.
   - `CONTACT_EMAIL` : boîte de réception qui doit recevoir les messages, par exemple `kobrikablan@gmail.com`.
4. Redéployer le projet après avoir ajouté ou modifié ces variables.

Ne pas placer la clé API dans les fichiers HTML ou JavaScript publics. Le formulaire affiche une confirmation seulement lorsque Resend accepte le message ; cela confirme son acceptation par le service, pas nécessairement son arrivée dans la boîte de réception.
