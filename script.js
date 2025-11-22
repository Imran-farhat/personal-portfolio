(function(){
	// Modal logic for projects
	const modal = document.getElementById('projectModal');
	const modalTitle = document.getElementById('modalTitle');
	const modalDesc = document.getElementById('modalDesc');
	const modalCode = document.getElementById('modalCode');
	const modalGit = document.getElementById('modalGit');
	const modalMedia = document.getElementById('modalMedia');
	const modalClose = document.getElementById('modalClose');

	function openProject(el){
		const title = el.dataset.project || 'Project';
		const desc = el.dataset.desc || '';
		const git = el.dataset.github || '#';
		modalTitle.textContent = title;
		modalDesc.textContent = desc;
		modalGit.href = git;
		modalCode.querySelector('code').textContent = `// Example snippet for ${title}\nprint('Hello from ${title}')`;
		// placeholder media
		modalMedia.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--muted)">Preview</div>`;
		modal.setAttribute('aria-hidden','false');
	}

	document.querySelectorAll('.project-card .open-modal').forEach(btn => {
		btn.addEventListener('click', (ev)=>{
			const card = ev.target.closest('.project-card');
			if(card) openProject(card);
		});
	});

	modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
	modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.setAttribute('aria-hidden','true') });

	// Tone toggle (Aggressive / Soft)
	const toneToggle = document.getElementById('toneToggle');
	let aggressive = true;
	toneToggle && toneToggle.addEventListener('click', ()=>{
		aggressive = !aggressive;
		if(aggressive){
			document.documentElement.style.setProperty('--accent','#FF4500');
			document.documentElement.style.setProperty('--muted','#98a1ad');
			toneToggle.textContent = 'Aggressive';
		} else {
			document.documentElement.style.setProperty('--accent','#ff8a65');
			document.documentElement.style.setProperty('--muted','#9fb6c9');
			toneToggle.textContent = 'Soft';
		}
	});

	// Lottie in hero (optional) - looks for .lottie-hero element
	try{
			if(window.lottie){
				const cont = document.getElementById('lottieHero');
				if(cont){
					(async function(){
						const fallback = 'https://assets1.lottiefiles.com/packages/lf20_tfb3estd.json';
						try{
							const resp = await fetch(fallback);
							if(!resp.ok) throw new Error('not ok');
							const data = await resp.json();
							lottie.loadAnimation({container:cont,renderer:'svg',loop:true,autoplay:true,animationData:data});
						}catch(err){
							console.warn('lottie load error', err);
							cont.remove();
						}
					})();
				}
			}
	}catch(e){console.warn('lottie load error',e)}

	// Contact form submit handler -> EmailJS
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
				statusEl && (statusEl.textContent = 'EmailJS failed to load. Please try again later.');
				statusEl && statusEl.classList.add('error');
				return;
			}
			if (!serviceId || !templateId) {
				statusEl && (statusEl.textContent = 'Missing EmailJS configuration.');
				statusEl && statusEl.classList.add('error');
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
					statusEl.classList.add('success');
				}
			} catch (err) {
				if (statusEl) {
					statusEl.textContent = err?.text || err?.message || 'Failed to send message.';
					statusEl.classList.add('error');
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

