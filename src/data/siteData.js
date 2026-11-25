// All editable content for the LBA '26 one-page site lives here.

export const EVENT = {
  name: "Legendary Business Awards 2026",
  short: "LBA '26",
  date: "2026-12-19T18:00:00+05:30",
  dateLabel: "19 Dec 2026",
  dateLong: "Saturday, 19 December 2026",
  time: "6 PM onwards",
  venue: "Hotel Daspalla",
  city: "Hyderabad",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Daspalla+Hyderabad",
  phone: "+91 81218 17372",
  phoneHref: "tel:+918121817372",
  whatsapp: "918121817372",
  whatsappLabel: "+91 81218 17372",
  email: "info@legendarybusinessawards.com",
  website: "legendarybusinessawards.com",
  websiteHref: "https://legendarybusinessawards.com"

};

export const REGISTRATION_FEE = 2499;

// Header navigation: [label, section id]
export const navLinks = [
  ["The night", "evening"],
  ["Why this event", "why-event"],
  ["Awards", "awards"],
  ["Who attends", "audience"],
  ["Partners", "partners"],
  ["Contact", "contact"]
];

// Recognition fields, grouped for the tabbed awards section.
export const fieldGroups = [
  {
    name: "Business & leadership",
    fields: [
      ["Business Excellence", "For companies setting the standard in their market."],
      ["Entrepreneurial Leadership", "For founders who built something from nothing."],
      ["Innovation & Technology", "For teams turning new ideas into working products."],
      ["Women Leadership", "For women leading businesses, teams and change."],
      ["Finance & Investment", "For leaders growing capital and the companies it backs."]
    ]
  },
  {
    name: "Industry",
    fields: [
      ["Healthcare Excellence", "For care that is better, safer and easier to reach."],
      ["Education & Skill Development", "For institutions and programmes that build careers."],
      ["Real Estate & Infrastructure", "For builders shaping how Hyderabad lives and works."],
      ["Manufacturing Excellence", "For plants and makers raising quality at scale."],
      ["Retail & Consumer Business", "For brands customers keep coming back to."],
      ["Media & Communications", "For voices that inform, connect and persuade."]
    ]
  },
  {
    name: "Society & culture",
    fields: [
      ["Social Impact", "For work that measurably improves lives."],
      ["Sustainability & Environment", "For businesses doing right by the planet."],
      ["Arts, Culture & Heritage", "For keeping Telugu culture alive and growing."],
      ["Community Leadership", "For people who show up for their community."]
    ]
  }
];

// Flat list used by the registration form dropdown: [[title], ...]
export const fields = fieldGroups.flatMap(group => group.fields.map(([title]) => [title]));

export const audiences = [
  ["Awardees", "Entrepreneurs and contributors recognised for meaningful impact in business and society."],
  ["Entrepreneurs", "Builders of new ventures driving growth and market change."],
  ["Executives", "Senior leaders and decision-makers steering company strategy."],
  ["Business owners", "Proprietors and family-enterprise leaders with long-standing legacies."],
  ["Professionals", "Specialists, advisors and practitioners across sectors."],
  ["Community leaders", "Changemakers and advocates shaping civic life in the region."],
  ["Next-gen founders", "Young founders and startup builders shaping what comes next."],
  ["Telugu diaspora", "NRI entrepreneurs and international delegates flying in for the night."]
];

export const evening = [
  {
    kicker: "First, you arrive",
    word: "Arrive",
    text: "Red carpet, a warm welcome and your first look at the stage at Hotel Daspalla, from 6 PM.",
    art: "carpet"
  },
  {
    kicker: "Then, the names are called",
    word: "Rise",
    text: "Fifteen fields, one stage. Each awardee is called up, honoured and photographed in front of the room.",
    art: "trophy"
  },
  {
    kicker: "Then, you connect",
    word: "Connect",
    text: "Dinner and conversation with entrepreneurs, executives and the global Telugu business community.",
    art: "network"
  }
];

export const eventProgram = [
  {
    title: "Jyothi Prajwalana",
    description: "A traditional lamp-lighting ceremony to open the evening."
  },
  {
    title: "Welcome to our chief guests",
    description: "An opening welcome for the distinguished guests joining the celebration."
  },
  {
    title: "Awards presentation",
    description: "The first presentation celebrating achievement across the recognition fields."
  },
  {
    title: "Cultural activities",
    description: "Live performances bring energy, creativity and local culture to the stage."
  },
  {
    title: "Awards continue",
    description: "The remaining award presentations honour more outstanding business leaders."
  },
  {
    title: "Ramp walk",
    description: "A closing spotlight moment to celebrate the nominees and the evening."
  }
];

export const eventReasons = [
  {
    number: "01",
    title: "Make meaningful connections",
    text: "Meet entrepreneurs, professionals and business leaders from across industries, and build relationships that can grow beyond the event."
  },
  {
    number: "02",
    title: "Inspire the next generation",
    text: "Hear the stories behind real achievements and encourage young people to think boldly, build confidently and lead with purpose."
  }
];

export const receipt = [
  ["Grand awards ceremony", "1"],
  ["Recognition on stage", "15 fields"],
  ["Business networking", "300+ guests"],
  ["VIP guest experience", "Incl."],
  ["Photography & video", "Incl."],
  ["TV, digital, print, radio", "4 partners"]
];

export const sponsorPerks = [
  ["Stage & venue branding", "Your brand on the main stage, backdrop, entrance arches and reception."],
  ["Digital & LED exposure", "Logo rotations on the LED walls and event screens all evening."],
  ["Social media exposure", "Partner announcements and spotlight posts across our channels."],
  ["Media & publicity", "Coverage across print, television, digital and official press releases."],
  ["VIP access & networking", "Gala passes, reserved seating and time with business leaders."],
  ["Live stream visibility", "Logo placement and on-air mentions reaching the diaspora worldwide."],
  ["Award category association", "Co-brand and present an official LBA recognition field."],
  ["Photography & video", "Branded step-and-repeat, ceremony photos and highlight films."]
];

export const sponsorJourney = [
  ["Before", "Announcements, digital promotion and pre-event campaigns carry your brand."],
  ["During", "Stage branding, LED exposure, VIP access and the networking floor."],
  ["After", "Photos, highlight films, media coverage and a year of association."]
];

export const mediaPartners = [
  {
    name: "BIG TV",
    role: "TV broadcast partner",
    logo: "/assets/media-partners/big-tv.png",
    description: "24/7 Telugu news channel reaching millions of homes across Telangana and Andhra Pradesh."
  },
  {
    name: "iDream Media",
    role: "Digital video partner",
    logo: "/assets/media-partners/idream.png",
    description: "Telugu digital network with a multi-million YouTube audience at home and abroad."
  },
  {
    name: "Aadab Hyderabad",
    role: "Print media partner",
    logo: "/assets/media-partners/aadab.png",
    description: "Telugu daily newspaper carrying business editorial and event coverage."
  },
  {
    name: "92.7 BIG FM",
    role: "Radio partner",
    logo: "/assets/media-partners/big-fm.png",
    description: "On-air contests, RJ mentions and prime-time airtime across the city."
  }
];

export const founders = [
  {
    name: "Mr. Naresh Gupta",
    role: "Managing Director, PR Agencies",
    photo: "/assets/about/naresh-gupta.jpeg",
    bio: [
      "Naresh Gupta brings over 16 years of media experience, including 12 years in public relations, across advertising, brand promotion and strategic media planning.",
      "With a background in PR agency operations, he specialises in personal branding, promotional campaigns, ad development and media planning across television, print, digital and FM radio.",
      "He continues to shape brand communication, media engagement and promotional work for clients across sectors."
    ]
  },
  {
    name: "Pinnapureddy Suresh Reddy",
    role: "Managing Director, Sindu Advertisers",
    photo: "/assets/about/suresh-reddy.jpeg",
    bio: [
      "Suresh Reddy is the Managing Director of Sindu Advertisers, a Hyderabad-based advertising and communications company founded in 2017. He has built it into a provider of integrated branding, advertising, public relations and promotional services.",
      "His career includes work with leading media organisations in Hyderabad and across India, where he built deep industry knowledge, lasting media relationships and expertise in strategic communication.",
      "He leads hands-on and client-first, with a focus on creative thinking, sound media strategy and on-time delivery, helping businesses strengthen their brand and grow."
    ]
  }
];

export const ribbonA = [
  "Grand awards ceremony",
  "Recognition",
  "Business networking",
  "VIP guest experience",
  "World-class stage",
  "Lasting legacy"
];

export const ribbonB = fieldGroups.flatMap(group => group.fields.map(([title]) => title));
