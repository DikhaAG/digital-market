export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Categories",
    links: [
      { label: "Graphics & Design", href: "/categories/graphics-design" },
      { label: "Digital Marketing", href: "/categories/digital-marketing" },
      {
        label: "Writing & Translation",
        href: "/categories/writing-translation",
      },
      { label: "Video & Animation", href: "/categories/video-animation" },
      { label: "Music & Audio", href: "/categories/music-audio" },
      { label: "Programming & Tech", href: "/categories/programming-tech" },
      { label: "AI Services", href: "/categories/ai-services" },
      { label: "Consulting", href: "/categories/consulting" },
      { label: "Data", href: "/categories/data" },
      { label: "Business", href: "/categories/business" },
      {
        label: "Personal Growth & Hobbies",
        href: "/categories/personal-growth",
      },
      { label: "Photography", href: "/categories/photography" },
      { label: "Finance", href: "/categories/finance" },
      { label: "End-to-End Projects", href: "/categories/projects" },
      { label: "Service Catalog", href: "/categories/catalog" },
    ],
  },
  {
    title: "For Clients",
    links: [
      { label: "How Fiverr Works", href: "/how-it-works" },
      { label: "Customer Success Stories", href: "/stories" },
      { label: "Quality Guide", href: "/quality-guide" },
      { label: "Fiverr Guides", href: "/guides" },
      { label: "Fiverr Answers", href: "/answers" },
      { label: "Browse Freelance By Skill", href: "/skills" },
    ],
  },
  {
    title: "For Freelancers",
    links: [
      { label: "Become a Fiverr Freelancer", href: "/become-seller" },
      { label: "Become an Agency", href: "/agencies" },
      { label: "Community Hub", href: "/community" },
      { label: "Forum", href: "/forum" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Business Solutions",
    links: [
      { label: "Fiverr Pro", href: "/pro" },
      { label: "Project Management Service", href: "/project-management" },
      { label: "Expert Sourcing Service", href: "/expert-sourcing" },
      { label: "AutoDS - Dropshipping Tool", href: "/autods" },
      { label: "Digis - Software Development", href: "/digis" },
      { label: "AI store builder", href: "/ai-store-builder" },
      { label: "Fiverr Logo Maker", href: "/logo-maker" },
      { label: "Contact Sales", href: "/contact-sales" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Fiverr", href: "/about" },
      { label: "Help Center", href: "/help" },
      { label: "Trust & Safety", href: "/trust-safety" },
      { label: "Social Impact", href: "/social-impact" },
      { label: "Careers", href: "/careers" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      {
        label: "Do not sell or share my personal information",
        href: "/privacy-choices",
      },
      { label: "Partnerships", href: "/partnerships" },
      { label: "Creator Network", href: "/creator-network" },
      { label: "Affiliates", href: "/affiliates" },
      { label: "Invite a Friend", href: "/referral" },
      { label: "Press & News", href: "/press" },
      { label: "Investor Relations", href: "/investors" },
    ],
  },
];
