import React, { useEffect, useRef, useState } from "react";
import { ScrollProgress, SiteHeader, StickyBar, FloatingCard } from "./components/layout/SiteChrome.jsx";
import { Hero, Ribbons, Theme } from "./sections/Opening.jsx";
import { Evening, EventFlow, WhyEvent } from "./sections/Evening.jsx";
import { Founders, Awards, Audience, Takeaway } from "./sections/Middle.jsx";
import { Guests } from "./sections/Guests.jsx";
import { Partners, Media, Register, Contact, Finale } from "./sections/Closing.jsx";
import { RegistrationForm } from "./components/forms/RegistrationForm.jsx";
import { WhatsAppEnquiryForm } from "./components/forms/WhatsAppEnquiryForm.jsx";
import { useOnScreen, scrollToId } from "./hooks/useScroll.js";
import { Curtain } from "./components/ui/Showtime.jsx";

export default function App() {
  // null = closed, "" = open with no field preselected, "Field name" = preselected
  const [registration, setRegistration] = useState(null);
  const [enquiry, setEnquiry] = useState(false);

  const heroRef = useRef(null);
  const endRef = useRef(null);
  const heroVisible = useOnScreen(heroRef, "-35% 0px 0px 0px");
  const endVisible = useOnScreen(endRef);

  // Support old/shared links like /#awards on first load.
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (id) setTimeout(() => scrollToId(id), 120);
  }, []);

  const openRegistration = (field = "") => setRegistration(typeof field === "string" ? field : "");
  const openEnquiry = () => setEnquiry(true);
  const chromeHidden = heroVisible || endVisible;

  return (
    <>
      <Curtain />
      <ScrollProgress />
      <SiteHeader onRegister={() => openRegistration()} />

      <main>
        <div ref={heroRef}>
          <Hero onRegister={() => openRegistration()} onEnquire={openEnquiry} />
        </div>
        <Ribbons />
        <Theme />
        <Evening />
        <EventFlow />
        <WhyEvent />
        <Founders />
        <Awards onRegister={openRegistration} />
        <Guests />
        <Audience />
        <Takeaway />
        <Partners onEnquire={openEnquiry} />
        <Media />
        <div ref={endRef}>
          <Register onRegister={openRegistration} onEnquire={openEnquiry} />
          <Contact />
          <Finale />
        </div>
      </main>

      <FloatingCard hidden={chromeHidden} onRegister={() => openRegistration()} />
      <StickyBar hidden={chromeHidden} onRegister={() => openRegistration()} />

      {registration !== null && (
        <RegistrationForm initialCategory={registration} onClose={() => setRegistration(null)} />
      )}
      {enquiry && <WhatsAppEnquiryForm onClose={() => setEnquiry(false)} />}
    </>
  );
}
