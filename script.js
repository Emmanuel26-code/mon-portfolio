/**
 * PORTFOLIO : Kobri Emmanuel Kablan
 * Interactions & Expérience utilisateur moderne
 */

document.addEventListener("DOMContentLoaded", () => {
	// 1. Mise à jour automatique de l'année du copyright
	const yearSpan = document.querySelector("#year");
	if (yearSpan) {
		yearSpan.textContent = new Date().getFullYear();
	}

	// 2. Barre de progression de défilement (Reading Progress)
	const progressBar = document.querySelector("#reading-progress");
	window.addEventListener("scroll", () => {
		if (!progressBar) return;
		const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
		const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
		const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
		progressBar.style.width = `${scrolled}%`;
	}, { passive: true });

	// 3. Menu mobile réactif et accessible
	const menuToggle = document.querySelector(".menu-toggle");
	const siteNav = document.querySelector("#site-nav");

	if (menuToggle && siteNav) {
		const toggleMenu = (open) => {
			const shouldOpen = open !== undefined ? open : !siteNav.classList.contains("is-open");
			menuToggle.setAttribute("aria-expanded", String(shouldOpen));
			menuToggle.setAttribute("aria-label", shouldOpen ? "Fermer le menu de navigation" : "Ouvrir le menu de navigation");
			siteNav.classList.toggle("is-open", shouldOpen);
		};

		menuToggle.addEventListener("click", () => toggleMenu());

		siteNav.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", () => toggleMenu(false));
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
				toggleMenu(false);
			}
		});

		document.addEventListener("click", (e) => {
			if (siteNav.classList.contains("is-open") && !siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
				toggleMenu(false);
			}
		});
	}

	// 4. ScrollSpy : Navigation active automatique selon la section visible
	const sections = document.querySelectorAll("section[id], [data-nav-section]");
	const navLinks = document.querySelectorAll(".site-nav .nav-link");

	const observerOptions = {
		root: null,
		rootMargin: "-20% 0px -60% 0px",
		threshold: 0
	};

	const sectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const id = entry.target.getAttribute("id");
				navLinks.forEach((link) => {
					const linkUrl = new URL(link.href, window.location.href);
					if (linkUrl.pathname !== window.location.pathname || !linkUrl.hash) return;
					link.classList.toggle("active", linkUrl.hash === `#${id}`);
				});
			}
		});
	}, observerOptions);

	sections.forEach((sec) => sectionObserver.observe(sec));

	// 5. Toast de notification réutilisable
	const toast = document.querySelector("#toast");
	let toastTimeout;

	const showToast = (message, duration = 3500) => {
		if (!toast) return;
		toast.textContent = message;
		toast.classList.add("show");
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => {
			toast.classList.remove("show");
		}, duration);
	};

	// 6. Copie rapide dans le presse-papier (Email)
	const copyButtons = document.querySelectorAll(".btn-copy");
	copyButtons.forEach((btn) => {
		btn.addEventListener("click", async () => {
			const textToCopy = btn.getAttribute("data-copy");
			if (!textToCopy) return;

			try {
				await navigator.clipboard.writeText(textToCopy);
				showToast(`✓ ${textToCopy} copié dans le presse-papier !`);
			} catch (err) {
				// Fallback pour les contextes où l'API Clipboard est restreinte
				const tempInput = document.createElement("input");
				tempInput.value = textToCopy;
				document.body.appendChild(tempInput);
				tempInput.select();
				document.execCommand("copy");
				document.body.removeChild(tempInput);
				showToast(`✓ ${textToCopy} copié dans le presse-papier !`);
			}
		});
	});

	// 7. Modale interactive pour les détails des projets
	const projectModal = document.querySelector("#project-modal");
	const modalContent = document.querySelector("#modal-content");
	const modalClose = document.querySelector("#modal-close");

	const projectData = {
		billingue: {
			title: "Billingue : Apprentissage du Baoulé",
			repository: "https://github.com/kobenanadingraj-code/Projet-de-langue",
			type: "Application Mobile · Préservation culturelle & IA vocale",
			lead: "Application mobile conçue pour démocratiser l'apprentissage de la langue baoulé grâce à une approche interactive et l'assistance de modèles d'intelligence artificielle vocale.",
			problem: "La transmission des langues locales ivoiriennes comme le Baoulé fait face au manque d'outils numériques modernes et accessibles pour la nouvelle génération.",
			solution: "Billingue propose des parcours thématiques (salutations, chiffres, vie quotidienne) avec restitution sonore et validation de la prononciation de l'utilisateur.",
			tech: ["Dart", "Flutter", "Firebase", "OpenAI Whisper"],
			features: [
				"Reconnaissance vocale Speech-to-Text avec OpenAI Whisper pour évaluer la justesse de l'accentuation.",
				"Base de données temps réel sous Firebase pour synchroniser les modules et scores.",
				"Design soigné conçu sous Flutter pour une réactivité optimale sur Android et iOS.",
				"Lectures audio authentiques et flashcards mnémotechniques interactives."
			]
		},
		ecochallenge: {
			title: "EcoChallenge : Sensibilisation au Développement Durable",
			type: "Application Mobile · RSE & Gamification IA",
			lead: "Application mobile visant à transformer la prise de conscience environnementale en actions concrètes au quotidien grâce à des défis et l'IA générative.",
			problem: "Les enjeux climatiques paraissent souvent abstraits et les citoyens manquent de repères concrets pour agir à leur échelle dans leur vie de tous les jours.",
			solution: "EcoChallenge gamifie l'écologie avec des micro-défis quotidiens (réduction des plastiques, transports doux, gestion de l'énergie) et prodigue des conseils sur-mesure grâce à l'IA.",
			tech: ["Dart", "Flutter", "Anthropic Claude", "Figma"],
			features: [
				"Assistant éco-responsable propulsé par l'API Anthropic Claude pour répondre aux questions environnementales et suggérer des alternatives locales.",
				"Calculateur d'économies de CO₂ estimées et suivi d'impact personnel.",
				"Prototypage complet et tests d'ergonomie réalisés sur Figma avant intégration.",
				"Interface mobile dynamique développée avec Flutter & Dart."
			]
		},
		"cahier-texte": {
			title: "Cahier de texte numérique",
			repository: "https://github.com/Emmanuel26-code/cahier-texte-numerique",
			type: "Application web scolaire",
			lead: "Application web de gestion du cahier de texte d’un établissement scolaire. Elle centralise les séances, les documents de cours et le suivi de l’avancement pédagogique.",
			problem: "Les enseignants ont besoin d’un espace commun pour consigner les cours réalisés, communiquer le travail à faire et organiser les supports pédagogiques par classe et matière.",
			solution: "L’application propose des espaces adaptés aux enseignants, élèves et administrateurs. Les enseignants enregistrent leurs séances et peuvent importer un support de cours pour obtenir une proposition de plan structurée par intelligence artificielle.",
			tech: ["Python", "Django 5.2", "MySQL", "Google Gemini API", "Bootstrap 5.3"],
			features: [
				"Tableau d’accueil et navigation adaptés au rôle : enseignant, élève ou administrateur.",
				"Enregistrement des séances avec date, matière, classe, durée, contenu traité et travail à faire ; consultation du cahier de texte par les élèves.",
				"Association des séances aux points du plan de cours pour suivre l’avancement du programme.",
				"Import et classement de supports DOCX, PDF, TXT, PPTX et XLSX (taille maximale : 10 Mo).",
				"Extraction du contenu des fichiers DOCX, PDF et TXT, puis génération par Google Gemini d’une proposition de plan hiérarchisé (parties, chapitres, titres et sous-titres, jusqu’à quatre niveaux).",
				"Le plan généré est proposé pour relecture par l’enseignant avant validation."
			]
		},
		ines: {
			title: "IN-ES GROUP : Co-fondateur",
			type: "Structure Éducative · Préparation aux Concours Post-Bac",
			lead: "Structure dédiée à l'accompagnement d'excellence des nouveaux bacheliers ivoiriens vers les concours des grandes écoles (ESATIC, INP-HB et filières d'ingénierie).",
			problem: "Le passage du lycée aux concours des écoles supérieures d'élite nécessite une préparation méthodologique poussée souvent inaccessible sans encadrement ciblé.",
			solution: "IN-ES GROUP organise des sessions de mentorat intensif, des épreuves blanches corrigées et des ateliers de méthodologie en sciences, logique et informatique.",
			tech: ["Co-fondateur", "Pédagogie", "Gestion de projet", "Leadership"],
			features: [
				"Co-fondation de la structure et coordination des programmes de préparation.",
				"Élaboration de livrets d'entraînement et d'annales corrigées conformes aux standards de l'ESATIC.",
				"Animation de sessions d'orientation et de coaching pour motiver et outiller les candidats.",
				"Taux élevé de réussite et d'intégration dans les grandes écoles technologiques de référence."
			]
		}
	};

	const openModal = (projectId) => {
		const data = projectData[projectId];
		if (!data || !projectModal || !modalContent) return;

		modalContent.innerHTML = `
			<h3 id="modal-title">${data.title}</h3>
			<p class="modal-tagline">${data.type}</p>
			<p class="modal-tagline">Projet d’équipe réalisé à l’ESATIC.</p>
			<p class="modal-lead">${data.lead}</p>

			<h4 class="modal-section-title">Le défi adressé</h4>
			<p>${data.problem}</p>

			<h4 class="modal-section-title">La solution développée</h4>
			<p>${data.solution}</p>

			<h4 class="modal-section-title">Fonctionnalités &amp; Architecture</h4>
			<ul class="modal-feature-list">${data.features.map(f => `<li>${f}</li>`).join("")}</ul>

			<h4 class="modal-section-title">Technologies mobilisées</h4>
			<ul class="tag-list modal-tech-list">${data.tech.map(t => `<li class="tag-strong">${t}</li>`).join("")}</ul>

			<div class="modal-actions">
				<button class="button button-secondary button-sm" type="button" data-modal-close>Fermer</button>
			</div>
		`;

		if (typeof projectModal.showModal === "function") {
			projectModal.showModal();
		} else {
			projectModal.setAttribute("open", "");
		}
		document.body.style.overflow = "hidden";
	};

	const closeModal = () => {
		if (!projectModal) return;
		if (typeof projectModal.close === "function") {
			projectModal.close();
		} else {
			projectModal.removeAttribute("open");
		}
		document.body.style.overflow = "";
	};

	document.querySelectorAll(".btn-open-modal").forEach((btn) => {
		btn.addEventListener("click", () => {
			const modalKey = btn.getAttribute("data-modal");
			openModal(modalKey);
		});
	});

	if (modalClose) {
		modalClose.addEventListener("click", closeModal);
	}

	if (projectModal) {
		projectModal.addEventListener("click", (e) => {
			if (e.target.closest("[data-modal-close]") || e.target === projectModal) {
				closeModal();
			}
		});

		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape" && projectModal.open) {
				closeModal();
			}
		});

		projectModal.addEventListener("cancel", (e) => {
			e.preventDefault();
			closeModal();
		});
	}

	// 8. Validation & Envoi du formulaire de contact
	const contactForm = document.querySelector("#contact-form");
	const formNote = document.querySelector("#form-note");

	if (contactForm) {
		const validateField = (input, errorId, errorMsg) => {
			const errorEl = document.querySelector(`#${errorId}`);
			if (!input.value.trim()) {
				input.classList.add("is-invalid");
				if (errorEl) errorEl.textContent = errorMsg;
				return false;
			}
			if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
				input.classList.add("is-invalid");
				if (errorEl) errorEl.textContent = "Veuillez entrer une adresse email valide.";
				return false;
			}
			input.classList.remove("is-invalid");
			if (errorEl) errorEl.textContent = "";
			return true;
		};

		// Nettoyage des erreurs lors de la saisie
		["name", "email", "subject", "message"].forEach((id) => {
			const el = document.querySelector(`#${id}`);
			if (el) {
				el.addEventListener("input", () => {
					el.classList.remove("is-invalid");
					const err = document.querySelector(`#${id}-error`);
					if (err) err.textContent = "";
				});
			}
		});

		contactForm.addEventListener("submit", async (e) => {
			e.preventDefault();

			const nameInput = document.querySelector("#name");
			const emailInput = document.querySelector("#email");
			const subjectInput = document.querySelector("#subject");
			const messageInput = document.querySelector("#message");

			const isNameValid = validateField(nameInput, "name-error", "Le nom est obligatoire.");
			const isEmailValid = validateField(emailInput, "email-error", "L'adresse email est obligatoire.");
			const isSubjectValid = validateField(subjectInput, "subject-error", "Le sujet est obligatoire.");
			const isMsgValid = validateField(messageInput, "message-error", "Le message ne peut pas être vide.");

			if (!isNameValid || !isEmailValid || !isSubjectValid || !isMsgValid) {
				showToast("Veuillez renseigner tous les champs obligatoires.");
				return;
			}

			const submitButton = contactForm.querySelector("#btn-submit");
			const submitLabel = submitButton?.querySelector("span");
			if (submitButton) submitButton.disabled = true;
			if (submitLabel) submitLabel.textContent = "Envoi en cours…";
			if (formNote) formNote.textContent = "Envoi de votre message…";

			try {
				const response = await fetch(contactForm.action, {
					method: "POST",
					body: JSON.stringify({
						name: nameInput.value.trim(),
						email: emailInput.value.trim(),
						subject: subjectInput.value.trim(),
						message: messageInput.value.trim()
					}),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json"
					}
				});
				let result;
				try {
					result = await response.json();
				} catch {
					throw new Error("Le serveur a renvoyé une réponse illisible.");
				}

				if (result.errors) {
					Object.entries(result.errors).forEach(([field, message]) => {
						const input = contactForm.elements.namedItem(field);
						const error = document.querySelector(`#${field}-error`);
						if (input instanceof HTMLElement) input.classList.add("is-invalid");
						if (error) error.textContent = message;
					});
				}

				if (!response.ok || result.success !== true) {
					throw new Error(result.message || "Le message n’a pas pu être envoyé.");
				}

				contactForm.reset();
				if (formNote) formNote.textContent = result.message;
				showToast(result.message);
			} catch (error) {
				const message = error instanceof Error
					? error.message
					: "Une erreur inattendue a empêché l’envoi du message.";
				if (formNote) {
					formNote.textContent = `${message} Vérifiez votre connexion ou réessayez plus tard.`;
				}
				showToast("L’envoi a échoué. Votre message n’a pas été transmis.");
			} finally {
				if (submitButton) submitButton.disabled = false;
				if (submitLabel) submitLabel.textContent = "Envoyer le message";
			}
		});
	}

});
