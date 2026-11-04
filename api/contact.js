const MAX_NAME_LENGTH = 150;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 10000;

function sendJson(res, status, payload) {
	res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
	res.end(JSON.stringify(payload));
}

function readBody(body) {
	if (typeof body === "string") {
		try {
			return JSON.parse(body);
		} catch {
			return null;
		}
	}

	return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}

module.exports = async function handler(req, res) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return sendJson(res, 405, { success: false, message: "Méthode non autorisée." });
	}

	const body = readBody(req.body);
	if (!body) {
		return sendJson(res, 400, { success: false, message: "Le formulaire est invalide." });
	}

	const name = typeof body.name === "string" ? body.name.trim() : "";
	const email = typeof body.email === "string" ? body.email.trim() : "";
	const subject = typeof body.subject === "string" ? body.subject.trim() : "";
	const message = typeof body.message === "string" ? body.message.trim() : "";
	const errors = {};

	if (!name) errors.name = "Le nom est obligatoire.";
	else if (name.length > MAX_NAME_LENGTH) errors.name = "Le nom est trop long.";

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		errors.email = "Une adresse email valide est requise.";
	} else if (email.length > MAX_EMAIL_LENGTH) {
		errors.email = "L’adresse email est trop longue.";
	}

	if (!subject) errors.subject = "Le sujet est obligatoire.";
	else if (subject.length > MAX_SUBJECT_LENGTH) errors.subject = "Le sujet est trop long.";

	if (!message) errors.message = "Le message ne peut pas être vide.";
	else if (message.length > MAX_MESSAGE_LENGTH) errors.message = "Le message est trop long.";

	if (Object.keys(errors).length) {
		return sendJson(res, 422, {
			success: false,
			message: "Veuillez corriger les champs indiqués.",
			errors
		});
	}

	const apiKey = process.env.RESEND_API_KEY;
	const recipient = process.env.CONTACT_EMAIL;
	const sender = process.env.RESEND_FROM_EMAIL;
	if (!apiKey || !recipient || !sender) {
		console.error("Contact API configuration is incomplete.");
		return sendJson(res, 503, {
			success: false,
			message: "Le formulaire n’est pas encore configuré pour envoyer des messages."
		});
	}

	let providerResponse;
	try {
		providerResponse = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from: sender,
				to: [recipient],
				reply_to: email,
				subject: `[Portfolio Kobri Emmanuel Kablan] ${subject}`,
				text: [
					"Nouveau message reçu depuis le portfolio.",
					"",
					`Nom : ${name}`,
					`Email : ${email}`,
					`Sujet : ${subject}`,
					"",
					"Message :",
					message
				].join("\n")
			})
		});
	} catch (error) {
		console.error("Contact email provider request failed.", error instanceof Error ? error.name : "UnknownError");
		return sendJson(res, 502, {
			success: false,
			message: "Le service d’e-mails est temporairement indisponible. Réessayez plus tard."
		});
	}

	if (!providerResponse.ok) {
		console.error("Contact email provider rejected the request.", providerResponse.status);
		return sendJson(res, 502, {
			success: false,
			message: "Le service d’e-mails n’a pas accepté votre message. Vérifiez les paramètres d’envoi ou réessayez plus tard."
		});
	}

	let providerResult;
	try {
		providerResult = await providerResponse.json();
	} catch {
		console.error("Contact email provider returned an invalid response.");
		return sendJson(res, 502, {
			success: false,
			message: "La confirmation du service d’e-mails est invalide. Réessayez plus tard."
		});
	}

	if (typeof providerResult.id !== "string" || !providerResult.id) {
		console.error("Contact email provider response did not contain an email ID.");
		return sendJson(res, 502, {
			success: false,
			message: "Le service d’e-mails n’a pas confirmé l’envoi. Réessayez plus tard."
		});
	}

	return sendJson(res, 200, {
		success: true,
		message: "Votre message a été accepté pour envoi. Merci pour votre intérêt !"
	});
};
