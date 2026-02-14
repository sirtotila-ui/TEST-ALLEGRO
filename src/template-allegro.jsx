import { useState, useEffect, useRef } from "react";

/* ───────── COUNT-UP (Intersection Observer + requestAnimationFrame) ───────── */
function parseValueWithSuffix(str) {
  const match = String(str).match(/^([\d.]+)(.*)$/);
  if (!match) return { number: 0, suffix: "" };
  return { number: parseFloat(match[1]) || 0, suffix: match[2] };
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function CountUp({ value, start }) {
  const { number: target, suffix } = parseValueWithSuffix(value);
  const isDecimal = target % 1 !== 0;
  const [display, setDisplay] = useState(() => (isDecimal ? "0.0" : "0") + suffix);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (!start || hasStartedRef.current || target === 0) return;
    hasStartedRef.current = true;
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = target % 1 !== 0;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInOut(progress);
      const current = target * eased;
      const formatted = isDecimal ? current.toFixed(1) : Math.round(current);
      setDisplay(formatted + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [start, target, suffix]);

  return <>{display}</>;
}

const SECTIONS = ["home", "problema", "soluzione", "risultati", "servizi", "processo", "pricing", "faq", "contatti"];
const NAV_LABELS = { home: "Home", problema: "Perché Noi", soluzione: "Le Pizze", risultati: "Recensioni", servizi: "Servizi", processo: "Come Ordinare", pricing: "Offerte", faq: "FAQ", contatti: "Contatti" };

const THEME_KEY = "theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/* ───────── NAVBAR ───────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const fromBody = document.body.getAttribute("data-theme");
    if (fromBody === "dark" || fromBody === "light") setTheme(fromBody);
    else {
      const initial = getInitialTheme();
      document.body.setAttribute("data-theme", initial);
      setTheme(initial);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    setTheme(next);
  };

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

  const navStyle = { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "var(--nav-bg)", backdropFilter: "blur(12px)", borderBottom: "2px solid var(--accent)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" };
  const logoStyle = { fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text)", letterSpacing: -0.5 };
  const desktopNavStyle = { display: "flex", gap: 8, alignItems: "center" };

  return (
    <nav style={navStyle}>
      <div style={logoStyle}>
        <span style={{ color: "var(--accent)" }}>🍕</span> Pizzeria Romana
      </div>
      <div style={desktopNavStyle} className="desktop-nav">
        {SECTIONS.map(id => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: active === id ? "var(--accent-soft)" : "transparent", border: "none", cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: active === id ? 700 : 500, color: active === id ? "var(--accent)" : "var(--text-muted-3)", transition: "all .2s" }}>{NAV_LABELS[id]}</button>
        ))}
        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro"} style={{ position: "relative" }}>
          <svg className="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M12 17.25a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5z"/></svg>
          <svg className="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z"/></svg>
        </button>
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 5, padding: 8, zIndex: 1001 }}>
        <span style={{ width: 24, height: 2.5, background: menuOpen ? "var(--accent)" : "var(--text)", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
        <span style={{ width: 24, height: 2.5, background: "var(--text)", borderRadius: 2, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 24, height: 2.5, background: menuOpen ? "var(--accent)" : "var(--text)", borderRadius: 2, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
      </button>
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: "var(--surface)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {SECTIONS.map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: active === id ? "var(--accent-soft)" : "var(--surface-alt)", border: "1px solid var(--border-alt)", cursor: "pointer", padding: "14px 32px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: active === id ? 700 : 500, color: active === id ? "var(--accent)" : "var(--text)", width: "80%", textAlign: "center" }}>{NAV_LABELS[id]}</button>
          ))}
          <button type="button" className="theme-toggle" onClick={() => { toggleTheme(); }} aria-label={theme === "dark" ? "Attiva tema chiaro" : "Attiva tema scuro"} style={{ position: "relative", marginTop: 8 }}>
            <svg className="theme-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M12 17.25a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5z"/></svg>
            <svg className="theme-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z"/></svg>
          </button>
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
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.2, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-hero)", padding: "100px 24px 60px", position: "relative", overflow: "hidden" }}>
      <div className="hero-mesh" aria-hidden="true">
        <div className="hero-mesh-blob" />
        <div className="hero-mesh-blob" />
        <div className="hero-mesh-blob" />
        <div className="hero-mesh-blob" />
      </div>
      <div style={{ maxWidth: 800, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "inline-block", background: "var(--accent)", color: "var(--text-on-dark)", padding: "6px 18px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 24, letterSpacing: 0.5 }}>🍕 PIZZA NAPOLETANA A ROMA</div>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 900, color: "var(--text)", lineHeight: 1.08, margin: "0 0 20px", letterSpacing: -1.5 }}>
          <span className="hero-reveal-word" style={{ animationDelay: "300ms" }}>La</span>{" "}
          <span className="hero-reveal-word" style={{ animationDelay: "380ms" }}>Pizza</span>{" "}
          <span className="hero-reveal-word" style={{ animationDelay: "460ms" }}>che</span>{" "}
          <span className="hero-reveal-word" style={{ animationDelay: "540ms" }}>Senti</span>
          <br />
          <span className="hero-reveal-word" style={{ color: "var(--accent)", animationDelay: "620ms" }}>Fatta</span>{" "}
          <span className="hero-reveal-word" style={{ color: "var(--accent)", animationDelay: "700ms" }}>come</span>{" "}
          <span className="hero-reveal-word" style={{ color: "var(--accent)", animationDelay: "780ms" }}>una</span>{" "}
          <span className="hero-reveal-word" style={{ color: "var(--accent)", animationDelay: "860ms" }}>Volta</span>
        </h1>
        <div className="hero-reveal-after">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px, 2.5vw, 20px)", color: "var(--text-muted)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>Impasto a lunga lievitazione e forno a legna. Tradizione napoletana nel cuore di Roma.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: "var(--accent)", color: "var(--text-on-dark)", border: "none", padding: "16px 36px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px var(--shadow-accent)" }}>Sfoglia il Menu →</button>
            <button style={{ background: "transparent", color: "var(--accent)", border: "2px solid var(--accent)", padding: "16px 36px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Ordina Ora</button>
          </div>
        </div>
        <div ref={statsRef} style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {[["50k+", "Pizze Sfornate"], ["4.8★", "Su Google"], ["15+", "Anni di Tradizione"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--accent)" }}>
                <CountUp value={num} start={statsVisible} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-muted-2)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PERCHÉ NOI ───────── */
function Problem() {
  const points = [
    { emoji: "🌾", title: "Ingredienti Freschi", desc: "Solo farina di qualità, pomodoro San Marzano DOP e mozzarella di bufala campana. Niente conservanti." },
    { emoji: "🔥", title: "Forno a Legna", desc: "Cuociamo ogni pizza a 450°C nel nostro forno a legna. Crosta croccante fuori e morbida dentro, come da tradizione." },
    { emoji: "👨‍🍳", title: "Maestri Pizzaioli", desc: "Il nostro team ha studiato l'arte della pizza napoletana. Lievitazione 24–48 ore e stesura a mano." }
  ];
  return (
    <section id="problema" style={{ padding: "100px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Perché Sceglierci</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-muted-2)", maxWidth: 600, margin: "0 auto 48px" }}>La differenza si sente dal primo morso.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {points.map((p, i) => (
            <div key={i} className="card-hover card-glass" style={{ borderRadius: 20, padding: "36px 28px", textAlign: "left" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>{p.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── LE PIZZE ───────── */
function Solution() {
  const pizzas = [
    { icon: "🍅", title: "Margherita", desc: "Pomodoro San Marzano, mozzarella di bufala, basilico fresco e olio extravergine. La classica che non sbaglia mai." },
    { icon: "🌶️", title: "Diavola", desc: "Pomodoro, mozzarella e salame piccante. Per chi ama un tocco di peperoncino in ogni boccone." },
    { icon: "🧀", title: "Quattro Formaggi", desc: "Mozzarella, gorgonzola, fontina e parmigiano. Cremosità e sapore per i veri amanti del formaggio." }
  ];
  return (
    <section id="soluzione" style={{ padding: "100px 24px", background: "var(--bg-dark)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-on-dark)", marginBottom: 16 }}>Le Nostre <span style={{ color: "var(--accent)" }}>Pizze</span></h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-on-dark-muted)", maxWidth: 600, margin: "0 auto 48px" }}>Alcune delle preferite dai nostri clienti. Menu completo in sede.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {pizzas.map((b, i) => (
            <div key={i} className="card-hover card-glass" style={{ borderRadius: 20, padding: "36px 28px", textAlign: "left" }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: "var(--text-on-dark)", marginBottom: 10 }}>{b.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text-on-dark-muted)", lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── RECENSIONI ───────── */
function SocialProof() {
  const testimonials = [
    { name: "Alessandra M.", role: "Cliente abituale", text: "La migliore pizza a Roma. Impasto perfetto e ingredienti top. Ordino sempre delivery e arriva calda e puntuale." },
    { name: "Luca B.", role: "Food lover", text: "Finalmente una pizzeria che non delude. La Diavola è da urlo. Consigliatissima per una serata in famiglia." },
    { name: "Francesca G.", role: "Google review", text: "Ambiente curato, personale gentile e pizza napoletana autentica. 5 stelle meritate, torneremo sicuro." }
  ];
  return (
    <section id="risultati" style={{ padding: "100px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Cosa Dicono di Noi</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-muted-2)", maxWidth: 500, margin: "0 auto 48px" }}>Le recensioni di chi ha provato la nostra pizza.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} className="card-hover card-glass" style={{ borderRadius: 20, padding: "32px 28px", textAlign: "left" }}>
              <div style={{ color: "var(--accent)", fontSize: 28, marginBottom: 16, fontFamily: "Georgia" }}>"</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text-muted-3)", lineHeight: 1.7, margin: "0 0 20px", fontStyle: "italic" }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #FFA83B)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-on-dark)", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15 }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-muted-5)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SERVIZI ───────── */
function Services() {
  const services = [
    { emoji: "🛵", name: "Delivery", desc: "Pizza a domicilio in 30–45 minuti. Zona Roma centro e limitrofi.", tag: "Più Richiesto" },
    { emoji: "🥡", name: "Asporto", desc: "Ordina e ritira quando preferisci. Pronto in circa 15 minuti.", tag: null },
    { emoji: "🍽️", name: "Sala", desc: "Cena in pizzeria con famiglia e amici. Prenotazione consigliata.", tag: null },
    { emoji: "🎂", name: "Eventi", desc: "Pizza per feste e compleanni. Chiedi un preventivo su misura.", tag: "Novità" },
  ];
  return (
    <section id="servizi" style={{ padding: "100px 24px", background: "var(--bg-alt)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Come Preferisci la Pizza</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-muted-2)", maxWidth: 500, margin: "0 auto 48px" }}>Delivery, asporto o in sala: scegli tu.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
          {services.map((s, i) => (
            <div key={i} className="card-hover card-glass" style={{ borderRadius: 20, padding: "32px 24px", textAlign: "center", position: "relative" }}>
              {s.tag && <div style={{ position: "absolute", top: 14, right: 14, background: "var(--accent)", color: "var(--text-on-dark)", padding: "4px 10px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>{s.tag}</div>}
              <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{s.name}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--text-muted-4)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── COME ORDINARE ───────── */
function Process() {
  const steps = [
    { num: "01", title: "Scegli", desc: "Sfoglia il menu e scegli le pizze che preferisci. Puoi ordinare per delivery, asporto o in sala." },
    { num: "02", title: "Ordina", desc: "Chiamaci o usa il nostro numero WhatsApp. Confermiamo l'ordine e i tempi di consegna." },
    { num: "03", title: "Gusta", desc: "La pizza arriva calda (a casa o la ritiri tu). Buon appetito!" }
  ];
  return (
    <section id="processo" style={{ padding: "100px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Come Ordinare</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-muted-2)", maxWidth: 500, margin: "0 auto 48px" }}>Tre passi e la pizza è da te.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} className="card-hover card-glass" style={{ display: "flex", gap: 28, alignItems: "flex-start", textAlign: "left", padding: "28px 0", borderBottom: i < 2 ? "1px solid var(--border-alt)" : "none" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, fontWeight: 900, color: "var(--accent-soft-2)", lineHeight: 1, minWidth: 70 }}>{s.num}</div>
              <div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 6px" }}>{s.title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text-muted-4)", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── OFFERTE ───────── */
function Pricing() {
  return (
    <section id="pricing" style={{ padding: "100px 24px", background: "var(--bg-pricing)" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text)", marginBottom: 16 }}>Offerta del Mese</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-muted-2)", marginBottom: 40 }}>Pizza + bevanda a prezzo speciale.</p>
        <div className="card-hover card-glass" style={{ borderRadius: 24, padding: "40px 32px", boxShadow: "0 8px 40px var(--shadow-accent-2)" }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: "var(--accent)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Menu Pizza & Bibita</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 52, fontWeight: 900, color: "var(--text)", marginBottom: 24 }}>€12<span style={{ fontSize: 18, fontWeight: 500, color: "var(--text-muted-5)" }}>/persona</span></div>
          {["✅ Una pizza a scelta dal menu", "✅ Birra media o soft drink", "✅ Valida per asporto e in sala", "✅ Disponibile a pranzo e cena", "✅ Tutti i giorni della settimana"].map((f, i) => (
            <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text-muted-3)", padding: "10px 0", borderBottom: i < 4 ? "1px solid var(--divider)" : "none", textAlign: "left" }}>{f}</div>
          ))}
          <button style={{ marginTop: 28, width: "100%", background: "var(--accent)", color: "var(--text-on-dark)", border: "none", padding: "16px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 20px var(--shadow-accent)" }}>Ordina l'offerta →</button>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--text-muted-6)", marginTop: 12 }}>Cita "Offerta web" quando ordini. Valida fino a fine mese.</div>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Quali sono gli orari di apertura?", a: "Siamo aperti dal martedì alla domenica: pranzo 12:00–15:00, cena 19:00–23:30. Lunedì chiusi." },
    { q: "Fate consegna a domicilio?", a: "Sì, delivery in zona Roma centro e limitrofi. Tempo di consegna indicativo 30–45 minuti. Ordina per telefono o WhatsApp." },
    { q: "Avete opzioni per celiaci?", a: "Sì, offriamo base per pizza senza glutine. Avvisaci quando ordini così prepariamo l'impasto dedicato." },
    { q: "Si può prenotare un tavolo?", a: "Sì, la prenotazione è consigliata soprattutto nel weekend. Chiamaci o scrivici su WhatsApp." },
    { q: "Quali metodi di pagamento accettate?", a: "Contanti, carte (Visa, Mastercard), bancomat e satispay. Per la consegna puoi pagare anche in contanti al rider." }
  ];
  return (
    <section id="faq" style={{ padding: "100px 24px", background: "var(--surface)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text)", marginBottom: 48, textAlign: "center" }}>Domande Frequenti</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid var(--border-alt)" }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", textAlign: "left" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, fontWeight: 600, color: "var(--text)" }}>{f.q}</span>
              <span style={{ fontSize: 22, color: "var(--accent)", transition: "transform .2s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 16 }}>+</span>
            </button>
            {open === i && <div style={{ padding: "0 0 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── CONTATTI ───────── */
function FooterCTA() {
  return (
    <section id="contatti" style={{ padding: "100px 24px", background: "var(--bg-dark)", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "var(--text-on-dark)", marginBottom: 16 }}>Vieni a Trovarci</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "var(--text-on-dark-muted)", marginBottom: 36 }}>Ordina per delivery o prenota un tavolo. Ti aspettiamo.</p>
        <button style={{ background: "var(--accent)", color: "var(--text-on-dark)", border: "none", padding: "18px 44px", borderRadius: 12, fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 24px var(--shadow-accent-3)" }}>Ordina o Prenota →</button>
        <div style={{ marginTop: 48, display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
          {[["📞", "+39 06 XXX XXXX"], ["📧", "info@pizzeriaromana.it"], ["📍", "Via Roma 123, Roma"]].map(([icon, text]) => (
            <div key={text} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--text-on-dark-muted-2)" }}>{icon} {text}</div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border-dark-2)", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text-on-dark-muted-3)" }}>© 2026 Pizzeria Romana. Tutti i diritti riservati.</div>
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
