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

// Tipe untuk sub-item (bisa berupa string biasa atau object dengan badge isNew)
export type SubCategoryItem = string | { name: string; isNew?: boolean };

export interface ExploreGridItem {
  title: string;
  desc?: string;
  image?: string;
  items: SubCategoryItem[];
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
    title: "Support & Cybersecurity",
    desc: "IT Support, Cloud & Security Services",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
    items: [
      "Support & IT",
      "Cloud Computing",
      { name: "DevOps Engineering", isNew: true },
      "Cybersecurity",
      "Development for Streamers",
      "Convert Files",
    ],
  },
  {
    title: "Websites",
    desc: "Custom Code, WordPress, Shopify",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=600&auto=format&fit=crop",
    items: [
      "Website Development",
      "Website Maintenance",
      { name: "WordPress", isNew: true },
      "Shopify",
      "Custom Websites",
    ],
  },
  {
    title: "Application Development",
    desc: "Web Apps, SaaS & Portals",
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop",
    items: [
      "Web Applications",
      "Desktop Applications",
      "Software Applications",
      "QA & Testing",
    ],
  },
  {
    title: "AI Services",
    desc: "Agents, Models & Integration",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop",
    items: [
      "AI Applications",
      { name: "AI Agents & Automation", isNew: true },
      "Prompt Engineering",
      "Machine Learning",
    ],
  },
];
