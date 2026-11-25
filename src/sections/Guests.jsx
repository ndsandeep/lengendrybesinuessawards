import React, { useState } from "react";
import { TextPressure } from "../components/ui/TextPressure.jsx";
import { Reveal } from "../components/ui/index.jsx";

const guests = [
  {
    name: "Mr. G. Kishan Reddy",
    designation: "Union Cabinet Minister for Coal and Mines; Member of Parliament (Lok Sabha), Secunderabad",
    photo: "/assets/guests/kishan-reddy.webp"
  },
  {
    name: "Mr. Bandi Sanjay Kumar",
    designation: "Union Minister of State for Home Affairs; Member of Parliament (Lok Sabha), Karimnagar",
    photo: "/assets/guests/bandi-sanjay.jpg"
  },
  {
    name: "Mr. Duddilla Sridhar Babu",
    designation: "Minister for Information Technology, Electronics & Communications, Industries & Commerce, and Legislative Affairs, Government of Telangana; Member of the Telangana Legislative Assembly (MLA), Manthani",
    photo: "/assets/guests/sridhar-babu.jpg"
  },
  {
    name: "Mr. Vakiti Srihari",
    designation: "Minister for Animal Husbandry, Dairy Development & Fisheries, and Sports & Youth Services, Government of Telangana; Member of the Telangana Legislative Assembly (MLA), Makthal",
    photo: "/assets/guests/vakiti-srihari.jpg"
  },
  {
    name: "Mrs. D. K. Aruna",
    designation: "Member of Parliament (Lok Sabha), Mahabubnagar",
    photo: "/assets/guests/dk-aruna.jpg"
  },
  {
    name: "Mr. Konda Vishweshwar Reddy",
    designation: "Member of Parliament (Lok Sabha), Chevella",
    photo: "/assets/guests/konda-vishweshwar-reddy.jpg"
  },
  {
    name: "Mr. T. Harish Rao",
    designation: "Member of the Telangana Legislative Assembly (MLA), Siddipet",
    photo: "/assets/guests/harish-rao.jpg"
  },
  {
    name: "Mr. Guntakandla Jagadish Reddy",
    designation: "Member of the Telangana Legislative Assembly (MLA), Suryapet",
    photo: "/assets/guests/jagadish-reddy.jpg"
  },
  {
    name: "Mr. Padi Kaushik Reddy",
    designation: "Member of the Telangana Legislative Assembly (MLA), Huzurabad",
    photo: "/assets/guests/koushik-reddy.jpg"
  }
];

export function Guests() {
  const [unavailableGuests, setUnavailableGuests] = useState(() => new Set());
  const visibleGuests = guests.filter(guest => !unavailableGuests.has(guest.name));

  return (
    <section className="guests section" id="guests" aria-labelledby="guests-title">
      <div className="wrap">
        <header className="heading guests-heading">
          <p className="kicker">Distinguished attendees</p>
          <h2 className="display guests-title" id="guests-title">
            <TextPressure text="Our Invited Guests" />
          </h2>
        </header>

        <div className="guest-grid">
          {visibleGuests.map((guest, i) => (
            <Reveal as="article" className="guest-card" key={guest.name} delay={(i % 4) * 80}>
              <div className="guest-img-wrap">
                <img
                  src={guest.photo}
                  alt={guest.name}
                  className="guest-img"
                  loading="lazy"
                  onError={() => setUnavailableGuests(current => new Set(current).add(guest.name))}
                />
              </div>
              <div className="guest-details">
                <p className="guest-name">{guest.name}</p>
                <p className="guest-designation">{guest.designation}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

