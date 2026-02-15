// Platinum Dental Clinic – Premium Website JS (single-folder build)
(function(){
  const qs = (s, p=document) => p.querySelector(s);
  const qsa = (s, p=document) => [...p.querySelectorAll(s)];

  // Mobile menu
  const menuBtn = qs('[data-menu-btn]');
  const nav = qs('header nav');
  if(menuBtn && nav){
    menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
    qsa('header nav a').forEach(a => a.addEventListener('click', ()=> nav.classList.remove('open')));
  }

  // Dark mode (persist)
  const toggleBtn = qs('[data-dark-toggle]');
  const key = 'pdc_dark';
  const saved = localStorage.getItem(key);
  if(saved === '1') document.body.classList.add('dark-mode');
  if(toggleBtn){
    toggleBtn.addEventListener('click', ()=>{
      document.body.classList.toggle('dark-mode');
      localStorage.setItem(key, document.body.classList.contains('dark-mode') ? '1' : '0');
    });
  }

  // Active nav highlight
  const current = location.pathname.split('/').pop() || 'index.html';
  qsa('header nav a').forEach(a=>{
    const href = a.getAttribute('href') || '';
    if(href.endsWith(current)) a.classList.add('active');
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('show');
    });
  },{threshold:0.12});
  qsa('.reveal').forEach(el=>io.observe(el));

  // Lightbox
  const lb = qs('#lightbox');
  const lbImg = qs('#lightbox img');
  const lbClose = qs('#lightbox .close');
  function openLB(src, alt){
    if(!lb || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || 'Gallery image';
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeLB(){
    if(!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow='';
  }
  qsa('[data-lightbox]').forEach(img=>{
    img.addEventListener('click', ()=> openLB(img.getAttribute('src'), img.getAttribute('alt')));
  });
  if(lb){
    lb.addEventListener('click', (e)=>{
      if(e.target === lb) closeLB();
    });
  }
  if(lbClose) lbClose.addEventListener('click', closeLB);
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeLB(); });

  // Testimonials (optional)
  const tWrap = qs('[data-testimonials]');
  if(tWrap){
    const items = qsa('.testimony', tWrap);
    const dots = qsa('.dots span', tWrap);
    let idx = 0;
    const show = (i)=>{
      items[idx].classList.remove('active');
      if(dots[idx]) dots[idx].classList.remove('active');
      idx = i;
      items[idx].classList.add('active');
      if(dots[idx]) dots[idx].classList.add('active');
    };
    dots.forEach((d, i)=> d.addEventListener('click', ()=>show(i)));
    setInterval(()=> show((idx+1)%items.length), 8000);
  }

  // Booking form -> WhatsApp
  const form = qs('#bookingForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(form);

      const name = (data.get('name')||'').toString().trim();
      const phone = (data.get('phone')||'').toString().trim();
      const branch = (data.get('branch')||'').toString().trim();
      const service = (data.get('service')||'').toString().trim();
      const date = (data.get('date')||'').toString().trim();
      const time = (data.get('time')||'').toString().trim();
      const notes = (data.get('notes')||'').toString().trim() || '-';

      if(!name || !phone || !branch || !service || !date){
        alert('Please fill in Name, Phone, Branch, Service and Date.');
        return;
      }

      const msg =
        "APPOINTMENT REQUEST%0A%0A" +
        "Name: " + encodeURIComponent(name) + "%0A" +
        "Phone: " + encodeURIComponent(phone) + "%0A" +
        "Branch: " + encodeURIComponent(branch) + "%0A" +
        "Service: " + encodeURIComponent(service) + "%0A" +
        "Date: " + encodeURIComponent(date) + "%0A" +
        "Preferred Time: " + encodeURIComponent(time || '-') + "%0A" +
        "Notes: " + encodeURIComponent(notes) + "%0A%0A" +
        "Sent from: platinumdental.co.ke website";

      // Primary WhatsApp number (update if needed)
      const wa = "254732224624";
      window.open("https://wa.me/" + wa + "?text=" + msg, "_blank");
    });
  }

  // Year in footer
  qsa('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

function closeDropdowns(e){
  document.querySelectorAll('.nav-drop[open]').forEach(d=>{
    if(!d.contains(e.target)) d.removeAttribute('open');
  });
}
document.addEventListener('click', closeDropdowns);