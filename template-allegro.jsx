import { useState, useEffect } from "react";

const SECTIONS = ["home", "problema", "soluzione", "risultati", "servizi", "processo", "pricing", "faq", "contatti"];
const NAV_LABELS = { home: "Home", problema: "Problema", soluzione: "Soluzione", risultati: "Risultati", servizi: "Servizi", processo: "Come Funziona", pricing: "Prezzi", faq: "FAQ", contatti: "Contatti" };

/* ───────── NAVBAR ───────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const offsets = SECTIONS.map(id => { const el = document.getElementById(id); return el ? { id, top: el.offsetTop - 100 } : null; }).filter(Boolean);
      for (let i = offsets.length - 1; i >= 0; i--) { if (window.scrollY >= offsets[i].top) { setActive(offsets[i].id); break; } }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderBottom: "2px solid #FF6B35", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "#1a1a2e", letterSpacing: -0.5 }}>
        <span style={{ color: "#FF6B35" }}>●</span> NomeBrand
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="desktop-nav">
        {SECTIONS.map(id => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: active === id ? "#FFF0E8" : "transparent", border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: active === id ? 700 : 500, color: active === id ? "#FF6B35" : "#555", transition: "all .2s" }}>{NAV_LABELS[id]}</button>
        ))}
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 8, zIndex: 1001 }}>
        <span style={{ width: 24, height: 2.5, background: menuOpen ? "#FF6B35" : "#1a1a2e", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
        <span style={{ width: 24, height: 2.5, background: "#1a1a2e", borderRadius: 2, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 24, height: 2.5, background: menuOpen ? "#FF6B35" : "#1a1a2e", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
      </button>
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {SECTIONS.map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: active === id ? "#FFF0E8" : "transparent", border: "none", cursor: "pointer", padding: "14px 32px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: active === id ? 700 : 500, color: active === id ? "#FF6B35" : "#333", width: "80%", textAlign: "center" }}>{NAV_LABELS[id]}</button>
          ))}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;700&display=swap');
        .hamburger { display: none !important; }
        @media (max-width: 900px) { .desktop-nav { display: none !important; } .hamburger { display: flex !important; } }
      `}</style>
    </nav>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #FFF5F0 0%, #FFF0E8 50%, #FFE8D6 100%)", padding: "100px 24px 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,107,53,0.08)", filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,168,59,0.1)", filter: "blur(40px)" }} />
      <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "#FF6B35", color: "#fff", padding: "6px 18px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 24, letterSpacing: 0.5 }}>⚡ DAL 2010 A ROMA</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "#1a1a2e", lineHeight: 1.08, margin: "0 0 20px", letterSpacing: -1.5 }}>
          La Headline che Parla<br /><span style={{ color: "#FF6B35" }}>al Tuo Cliente Ideale</span>
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.5vw, 20px)", color: "#666", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>Sotto-titolo che espande il beneficio principale e crea urgenza senza essere aggressivo.</p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ background: "#FF6B35", color: "#fff", border: "none", padding: "16px 36px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.35)" }}>Richiedi Preventivo Gratuito →</button>
          <button style={{ background: "transparent", color: "#FF6B35", border: "2px solid #FF6B35", padding: "16px 36px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Scopri di Più</button>
        </div>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[["500+", "Clienti Soddisfatti"], ["4.9★", "Su Google"], ["10+", "Anni di Esperienza"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: "#FF6B35" }}>{num}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#888" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PROBLEM ───────── */
function Problem() {
  const problems = [
    { emoji: "😤", title: "Problema Specifico 1", desc: "Descrizione del dolore che il cliente target vive ogni giorno." },
    { emoji: "😰", title: "Problema Specifico 2", desc: "Un altro problema concreto che costa tempo, soldi o clienti." },
    { emoji: "😩", title: "Problema Specifico 3", desc: "Il terzo problema che rende la situazione insostenibile." }
  ];
  return (
    <section id="problema" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>Ti Riconosci in Questa Situazione?</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 600, margin: "0 auto 48px" }}>Se anche tu stai vivendo uno di questi problemi, non sei solo.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {problems.map((p, i) => (
            <div key={i} style={{ background: "#FFF8F4", borderRadius: 20, padding: "36px 28px", textAlign: "left", border: "1px solid #FFE8D6" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SOLUTION ───────── */
function Solution() {
  const benefits = [
    { icon: "🎯", title: "Beneficio Concreto 1", desc: "Come il servizio risolve il Problema 1 in modo specifico." },
    { icon: "⚡", title: "Beneficio Concreto 2", desc: "Come il servizio risolve il Problema 2 con risultati misurabili." },
    { icon: "🚀", title: "Beneficio Concreto 3", desc: "Come il servizio risolve il Problema 3 meglio di chiunque altro." }
  ];
  return (
    <section id="soluzione" style={{ padding: "100px 24px", background: "linear-gradient(180deg, #1a1a2e 0%, #2d2d44 100%)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>C'è una Soluzione. <span style={{ color: "#FF6B35" }}>Ed è Semplice.</span></h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.6)", maxWidth: 600, margin: "0 auto 48px" }}>Ecco come risolviamo ogni problema, uno per uno.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "36px 28px", textAlign: "left", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{b.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SOCIAL PROOF ───────── */
function SocialProof() {
  const testimonials = [
    { name: "Marco R.", role: "Imprenditore", text: "Testimonial reale e specifico che parla dei risultati ottenuti con numeri concreti." },
    { name: "Laura B.", role: "Professionista", text: "Un altro testimonial che racconta l'esperienza e il cambiamento avvenuto." },
    { name: "Giuseppe M.", role: "Business Owner", text: "Terzo testimonial che conferma la qualità e lo consiglia." }
  ];
  return (
    <section id="risultati" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>Cosa Dicono i Nostri Clienti</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 500, margin: "0 auto 48px" }}>Risultati reali da persone reali.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "#FAFAFA", borderRadius: 20, padding: "32px 28px", textAlign: "left", border: "1px solid #eee" }}>
              <div style={{ color: "#FF6B35", fontSize: 28, marginBottom: 16, fontFamily: "Georgia" }}>"</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B35, #FFA83B)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#999" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SERVICES ───────── */
function Services() {
  const services = [
    { emoji: "💈", name: "Servizio Principale", desc: "Beneficio dal punto di vista del cliente.", tag: "Più Richiesto" },
    { emoji: "✨", name: "Secondo Servizio", desc: "Beneficio concreto che il cliente ottiene.", tag: null },
    { emoji: "🎨", name: "Terzo Servizio", desc: "Altro beneficio specifico e misurabile.", tag: null },
    { emoji: "🔧", name: "Quarto Servizio", desc: "Beneficio pratico che risolve un problema.", tag: "Novità" },
  ];
  return (
    <section id="servizi" style={{ padding: "100px 24px", background: "#FFF8F4" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>I Nostri Servizi</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 500, margin: "0 auto 48px" }}>Tutto quello di cui hai bisogno, sotto un unico tetto.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {services.map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 20, padding: "32px 24px", textAlign: "center", border: "1px solid #FFE8D6", position: "relative" }}>
              {s.tag && <div style={{ position: "absolute", top: 14, right: 14, background: "#FF6B35", color: "#fff", padding: "4px 10px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>{s.tag}</div>}
              <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginBottom: 8 }}>{s.name}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PROCESS ───────── */
function Process() {
  const steps = [
    { num: "01", title: "Contattaci", desc: "Raccontaci di cosa hai bisogno. Rispondiamo entro 24 ore." },
    { num: "02", title: "Pianifichiamo", desc: "Creiamo un piano su misura per le tue esigenze." },
    { num: "03", title: "Realizziamo", desc: "Ci mettiamo al lavoro e ti consegniamo il risultato." }
  ];
  return (
    <section id="processo" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>Come Funziona</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", maxWidth: 500, margin: "0 auto 48px" }}>3 step semplici. Zero complicazioni.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 28, alignItems: "flex-start", textAlign: "left", padding: "28px 0", borderBottom: i < 2 ? "1px solid #eee" : "none" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 900, color: "#FFE0CC", lineHeight: 1, minWidth: 70 }}>{s.num}</div>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: "#1a1a2e", margin: "0 0 6px" }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#777", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PRICING ───────── */
function Pricing() {
  return (
    <section id="pricing" style={{ padding: "100px 24px", background: "linear-gradient(135deg, #FFF5F0, #FFE8D6)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>Pronto a Iniziare?</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "#888", marginBottom: 40 }}>Un investimento che si ripaga da solo.</p>
        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 32px", boxShadow: "0 8px 40px rgba(255,107,53,0.12)", border: "2px solid #FF6B35" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "#FF6B35", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Pacchetto Completo</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 52, fontWeight: 900, color: "#1a1a2e", marginBottom: 24 }}>€XXX<span style={{ fontSize: 18, fontWeight: 500, color: "#999" }}>/progetto</span></div>
          {["✅ Feature beneficio 1", "✅ Feature beneficio 2", "✅ Feature beneficio 3", "✅ Feature beneficio 4", "✅ Feature beneficio 5", "✅ Supporto dedicato", "✅ Garanzia soddisfatti"].map((f, i) => (
            <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#555", padding: "10px 0", borderBottom: i < 6 ? "1px solid #f0f0f0" : "none", textAlign: "left" }}>{f}</div>
          ))}
          <button style={{ marginTop: 28, width: "100%", background: "#FF6B35", color: "#fff", border: "none", padding: "16px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px rgba(255,107,53,0.35)" }}>Richiedi Preventivo Gratuito →</button>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#aaa", marginTop: 12 }}>Nessun impegno. Rispondiamo entro 24h.</div>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Quanto tempo ci vuole?", a: "Risposta specifica con tempistiche reali per il tipo di servizio offerto." },
    { q: "Cosa succede se non sono soddisfatto?", a: "Risposta che elimina il rischio e rassicura con garanzie concrete." },
    { q: "Devo preparare qualcosa prima?", a: "Risposta che semplifica il processo e riduce la friction." },
    { q: "Lavorate anche nel weekend?", a: "Risposta che mostra flessibilità e attenzione al cliente." },
    { q: "Come posso pagare?", a: "Risposta con tutte le opzioni di pagamento disponibili." }
  ];
  return (
    <section id="faq" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#1a1a2e", marginBottom: 48, textAlign: "center" }}>Domande Frequenti</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid #eee" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", textAlign: "left" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, color: "#1a1a2e" }}>{f.q}</span>
              <span style={{ fontSize: 22, color: "#FF6B35", transition: "transform .2s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 16 }}>+</span>
            </button>
            {open === i && <div style={{ padding: "0 0 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "#666", lineHeight: 1.7 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── FOOTER CTA ───────── */
function FooterCTA() {
  return (
    <section id="contatti" style={{ padding: "100px 24px", background: "linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>Pronto a Fare il Prossimo Passo?</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.6)", marginBottom: 36 }}>Contattaci oggi. La consulenza è gratuita e senza impegno.</p>
        <button style={{ background: "#FF6B35", color: "#fff", border: "none", padding: "18px 44px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px rgba(255,107,53,0.4)" }}>Contattaci Ora →</button>
        <div style={{ marginTop: 48, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[["📞", "+39 XXX XXX XXXX"], ["📧", "info@nomebrand.it"], ["📍", "Via Roma 1, Città"]].map(([icon, text]) => (
            <div key={text} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{icon} {text}</div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.3)" }}>© 2026 NomeBrand. Tutti i diritti riservati.</div>
      </div>
    </section>
  );
}

/* ───────── MAIN ───────── */
export default function AllegroTemplate() {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <SocialProof />
      <Services />
      <Process />
      <Pricing />
      <FAQ />
      <FooterCTA />
    </div>
  );
}
