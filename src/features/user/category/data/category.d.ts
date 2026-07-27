import {
  Code2,
  Globe,
  Smartphone,
  ShieldCheck,
  Cpu,
  type LucideIcon,
} from "lucide-react";

export interface PopularKeyword {
  label: string;
  icon: LucideIcon;
}

export interface ExploreGridItem {
  title: string;
  desc: string;
  bgGradient: string;
  items: string[];
}

export const POPULAR_KEYWORDS: PopularKeyword[] = [
  { label: "Python Developers", icon: Code2 },
  { label: "HTML & CSS Developers", icon: Globe },
  { label: "JavaScript Developers", icon: Code2 },
  { label: "Mobile App Dev", icon: Smartphone },
  { label: "Cybersecurity", icon: ShieldCheck },
  { label: "AI & Machine Learning", icon: Cpu },
];

export const EXPLORE_GRID_DATA: ExploreGridItem[] = [
  {
    title: "Websites",
    desc: "Custom Code, WordPress, Shopify",
    bgGradient: "from-emerald-950 to-emerald-800",
    items: [
      "Website Development",
      "Website Maintenance",
      "WordPress",
      "Shopify",
      "Custom Websites",
    ],
  },
  {
    title: "Application Development",
    desc: "Web Apps, SaaS & Portals",
    bgGradient: "from-teal-950 to-teal-800",
    items: [
      "Web Applications",
      "Desktop Applications",
      "Software Applications",
      "QA & Testing",
    ],
  },
  {
    title: "Software Development",
    desc: "Architecture & System Design",
    bgGradient: "from-slate-900 to-slate-800",
    items: [
      "Software Architecture",
      "API Integration",
      "Database Design",
      "Scripting & Automation",
    ],
  },
  {
    title: "Mobile Apps",
    desc: "iOS, Android & Cross-Platform",
    bgGradient: "from-rose-950 to-rose-800",
    items: [
      "Mobile App Development",
      "Cross-platform Apps",
      "Android App Dev",
      "iOS App Dev",
    ],
  },
  {
    title: "DevOps & Cloud",
    desc: "Infrastructure & Security",
    bgGradient: "from-indigo-950 to-indigo-800",
    items: [
      "Cloud Computing",
      "DevOps Engineering",
      "Cybersecurity",
      "Database Administration",
    ],
  },
  {
    title: "AI Services",
    desc: "Agents, Models & Integration",
    bgGradient: "from-purple-950 to-purple-800",
    items: [
      "AI Applications",
      "AI Agents & Automation",
      "Prompt Engineering",
      "Machine Learning",
    ],
  },
];
