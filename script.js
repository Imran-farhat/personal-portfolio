(function () {
	// Mobile menu toggle
	const menuToggle = document.getElementById('menuToggle');
	const nav = document.getElementById('nav');
	if (menuToggle && nav) {
		menuToggle.addEventListener('click', () => {
			nav.classList.toggle('open');
			const icon = menuToggle.querySelector('i');
			if (icon) {
				icon.classList.toggle('bx-x');
				icon.classList.toggle('bx-menu');
			}
		});

		// Close mobile nav on link click
		document.querySelectorAll('.nav-link').forEach(link => {
			link.addEventListener('click', () => {
				nav.classList.remove('open');
				const icon = menuToggle.querySelector('i');
				if (icon) {
					icon.classList.remove('bx-x');
					icon.classList.add('bx-menu');
				}
			});
		});
	}

	// Active link on scroll
	const sections = document.querySelectorAll('section[id]');
	const navLinks = document.querySelectorAll('.nav-link');

	function activeLinkOnScroll() {
		const scrollY = window.scrollY || window.pageYOffset;
		sections.forEach(current => {
			const sectionHeight = current.offsetHeight;
			const sectionTop = current.offsetTop - 120;
			const sectionId = current.getAttribute('id');

			if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
				navLinks.forEach(link => {
					link.classList.remove('active');
					if (link.getAttribute('href') === `#${sectionId}`) {
						link.classList.add('active');
					}
				});
			}
		});
	}
	window.addEventListener('scroll', activeLinkOnScroll);

	// Reveal-on-scroll IntersectionObserver
	try {
		const reveals = document.querySelectorAll('.reveal-element');
		if ('IntersectionObserver' in window && reveals.length) {
			const obs = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						entry.target.classList.add('reveal-active');
					}
				});
			}, { threshold: 0.1 });
			reveals.forEach(r => obs.observe(r));
		} else {
			reveals.forEach(r => r.classList.add('reveal-active'));
		}
	} catch (err) {
		console.warn('reveal observer error', err);
		document.querySelectorAll('.reveal-element').forEach(r => r.classList.add('reveal-active'));
	}

	// Tone toggle logic (Aggressive vs Soft Theme Accents)
	const toneToggle = document.getElementById('toneToggle');
	let aggressive = true;
	if (toneToggle) {
		toneToggle.addEventListener('click', () => {
			aggressive = !aggressive;
			const root = document.documentElement;
			if (aggressive) {
				root.style.setProperty('--accent', '#00f2fe');
				root.style.setProperty('--accent-secondary', '#9d4edd');
				root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #00f2fe 0%, #9d4edd 100%)');
				root.style.setProperty('--accent-glow', 'rgba(0, 242, 254, 0.15)');
				toneToggle.textContent = 'Aggressive';
			} else {
				// Soft theme: Neon emerald and sky blue
				root.style.setProperty('--accent', '#00ffd0');
				root.style.setProperty('--accent-secondary', '#4facfe');
				root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #00ffd0 0%, #4facfe 100%)');
				root.style.setProperty('--accent-glow', 'rgba(0, 255, 208, 0.15)');
				toneToggle.textContent = 'Soft';
			}
		});
	}

	// Contact form submission to EmailJS
	const contactForm = document.getElementById('contactForm');
	if (contactForm) {
		const statusEl = contactForm.querySelector('.form-status');
		const submitBtn = contactForm.querySelector('.submit');
		const serviceId = contactForm.dataset.emailService;
		const templateId = contactForm.dataset.emailTemplate;
		const canUseEmailJs = typeof emailjs !== 'undefined';

		contactForm.addEventListener('submit', async (event) => {
			event.preventDefault();

			if (!canUseEmailJs) {
				if (statusEl) {
					statusEl.textContent = 'Service is temporarily unavailable. Please try again later.';
					statusEl.className = 'form-status error';
				}
				return;
			}
			if (!serviceId || !templateId) {
				if (statusEl) {
					statusEl.textContent = 'Missing email configuration details.';
					statusEl.className = 'form-status error';
				}
				return;
			}

			if (statusEl) {
				statusEl.textContent = '';
				statusEl.className = 'form-status';
			}
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = 'Sending…';
			}

			const formData = new FormData(contactForm);
			const templateParams = {
				from_name: formData.get('name'),
				reply_to: formData.get('email'),
				subject: formData.get('subject') || 'Portfolio Contact',
				phone: formData.get('phone') || 'N/A',
				message: formData.get('message') || ''
			};

			try {
				await emailjs.send(serviceId, templateId, templateParams);
				contactForm.reset();
				if (statusEl) {
					statusEl.textContent = 'Message sent successfully!';
					statusEl.className = 'form-status success';
				}
			} catch (err) {
				if (statusEl) {
					statusEl.textContent = err?.text || err?.message || 'Failed to send message. Please check connection.';
					statusEl.className = 'form-status error';
				}
			} finally {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = 'Send Message';
				}
			}
		});
	}
})();
