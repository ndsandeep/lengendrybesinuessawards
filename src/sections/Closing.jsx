import React, { useState } from "react";
import { Check, Phone, Mail, Globe2, MapPin, Send } from "lucide-react";
import {
  EVENT, REGISTRATION_FEE, sponsorPerks, sponsorJourney, mediaPartners, navLinks
} from "../data/siteData.js";
import { Heading, Reveal, Marquee } from "../components/ui/index.jsx";
import { scrollToId } from "../hooks/useScroll.js";
import { openWhatsAppAndRefreshOnReturn } from "../lib/whatsapp.js";

export function Partners({ onEnquire }) {
  return (
    <section className="partners section" id="partners" aria-labelledby="partners-title">
      <div className="wrap">
        <div className="split-head">
          <Heading kicker="Partner with us">
            <span id="partners-title">Build LBA ’26
              <br />with us</span>
          </Heading>
          <Reveal as="p" className="lede">
            Every partnership is tailored. Tell us what you want your brand to be part of, and we will
            build the package around it.
          </Reveal>
        </div>

        <div className="perk-grid">
          {sponsorPerks.map(([title, text], i) => (
            <Reveal as="article" className="perk" key={title} delay={(i % 4) * 70}>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>

        <ol className="journey">
          {sponsorJourney.map(([stage, text], i) => (
            <li key={stage}>
              <span className="journey-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{stage} the event</h3>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="center-cta">
          <button className="btn btn--solid" onClick={onEnquire}>Talk to us about partnering</button>
        </div>
      </div>
    </section>
  );
}

export function Media() {
  const [active, setActive] = useState(0);
  const partner = mediaPartners[active];
  return (
    <section className="media section" id="media" aria-labelledby="media-title">
      <div className="wrap">
        <Heading kicker="On air, online and in print">
          <span id="media-title">Our media partners</span>
        </Heading>
      </div>

      <Marquee
        className="logo-marquee"
        items={mediaPartners}
        speed={28}
        render={item => (
          <span className="logo-tile">
            <img src={item.logo} alt={item.name} loading="lazy" />
          </span>
        )}
      />

      <div className="wrap media-detail">
        <div className="media-tabs" role="tablist" aria-label="Media partners">
          {mediaPartners.map((item, i) => (
            <button
              key={item.name}
              role="tab"
              aria-selected={active === i}
              className={active === i ? "is-active" : ""}
              onClick={() => setActive(i)}
            >
              {item.name}
            </button>
          ))}
        </div>
        <article className="media-card" role="tabpanel" key={partner.name}>
          <img src={partner.logo} alt="" />
          <div>
            <p className="kicker">{partner.role}</p>
            <h3>{partner.name}</h3>
            <p>{partner.description}</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function Register({ onRegister, onEnquire }) {
  return (
    <section className="register section" id="register" aria-labelledby="register-title">
      <div className="wrap">
        <Heading kicker="One night, one stage">
          <span id="register-title">Claim your stage</span>
        </Heading>
        <Reveal as="p" className="lede">
          Nominate in a recognition field, share the nominee’s details and bio, and we will be in touch
          before the night.
        </Reveal>

        <div className="pass-grid pass-grid--single">
          <Reveal as="article" className="pass pass--featured">
            <p className="pass-tag">For nominees</p>
            <h3>Nomination entry</h3>
            <p className="pass-price">
              ₹{REGISTRATION_FEE.toLocaleString("en-IN")}
              <small>per nomination</small>
            </p>
            <ul>
              <li><Check size={16} /> Choose one of 15 recognition fields</li>
              <li><Check size={16} /> Submit nominee details and a short bio</li>
              <li><Check size={16} /> Awards night, {EVENT.dateLabel} at {EVENT.venue}</li>
            </ul>
            <button className="btn btn--solid btn--block" onClick={() => onRegister()}>
              Nominate now
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: "Nomination entry", message: "" });
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const submit = event => {
    event.preventDefault();
    const text = encodeURIComponent(
      `LBA 2026 Enquiry\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n` +
      `Interest: ${form.interest}\n\nMessage:\n${form.message}`
    );
    openWhatsAppAndRefreshOnReturn(`https://wa.me/${EVENT.whatsapp}?text=${text}`);
  };

  return (
    <section className="contact section" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div>
          <Heading kicker="Questions first?">
            <span id="contact-title">Get in touch</span>
          </Heading>
          <p className="lede">
            For sponsorships, partnerships and general questions, reach our team directly.
          </p>
          <ul className="contact-list">
            <li><Phone size={18} /><a href={EVENT.phoneHref}>{EVENT.phone}</a></li>
            <li><Mail size={18} /><a href={`mailto:${EVENT.email}`}>{EVENT.email}</a></li>
            <li><Globe2 size={18} /><a href={EVENT.websiteHref} target="_blank" rel="noreferrer">{EVENT.website}</a></li>
            <li><MapPin size={18} /><a href={EVENT.mapUrl} target="_blank" rel="noreferrer">{EVENT.venue}, {EVENT.city}</a></li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={submit}>
          <div className="field-row">
            <label>
              <span>Full name</span>
              <input required value={form.name} onChange={e => update("name", e.target.value)} autoComplete="name" />
            </label>
            <label>
              <span>Phone</span>
              <input required type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} autoComplete="tel" />
            </label>
          </div>
          <label>
            <span>Email</span>
            <input required type="email" value={form.email} onChange={e => update("email", e.target.value)} autoComplete="email" />
          </label>
          <label>
            <span>I’m interested in</span>
            <select value={form.interest} onChange={e => update("interest", e.target.value)}>
              <option>Nomination entry</option>
              <option>Sponsorship</option>
              <option>Media partnership</option>
              <option>Attending as a guest</option>
              <option>Something else</option>
            </select>
          </label>
          <label>
            <span>Message</span>
            <textarea required rows={4} value={form.message} onChange={e => update("message", e.target.value)} />
          </label>
          <button className="btn btn--solid btn--block" type="submit">
            Continue on WhatsApp <Send size={16} />
          </button>
          <p className="form-note">Opens WhatsApp with your message filled in. Review it and press Send.</p>
        </form>
      </div>
    </section>
  );
}

export function Finale() {
  return (
    <footer className="finale">
      <div className="wrap">
        <h2 className="finale-title" aria-label="One night. Lasting legacy.">
          <span>One night.</span>
          <span>
            Lasting legac<span className="finale-y">y</span>
            <span className="finale-dot">.</span>
          </span>
        </h2>
        <p className="finale-meta">
          {EVENT.name}, {EVENT.dateLong}, {EVENT.time}
          <br />
          <strong>Venue</strong> {EVENT.venue}, {EVENT.city}
        </p>

        <div className="footer-bar">
          <nav aria-label="Footer">
            {navLinks.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollToId(id); }}>{label}</a>
            ))}
          </nav>
          <p>© 2026 PR Agencies &amp; Sindu Advertisers. All rights reserved.</p>
        </div>
        <p className="footer-credit">Developed by Sherize Solutions Pvt Ltd</p>
      </div>
    </footer>
  );
}
