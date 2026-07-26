export interface SubCategory {
  name: string;
  href: string;
}

export interface Category {
  id: string;
  name: string;
  href: string;
}

export const CATEGORIES: Category[] = [
  { id: "trending", name: "Trending 🔥", href: "/categories/trending" },
  {
    id: "graphics-design",
    name: "Graphics & Design",
    href: "/categories/graphics-design",
  },
  {
    id: "programming-tech",
    name: "Programming & Tech",
    href: "/categories/programming-tech",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    href: "/categories/digital-marketing",
  },
  {
    id: "video-animation",
    name: "Video & Animation",
    href: "/categories/video-animation",
  },
  {
    id: "writing-translation",
    name: "Writing & Translation",
    href: "/categories/writing-translation",
  },
  { id: "music-audio", name: "Music & Audio", href: "/categories/music-audio" },
  { id: "business", name: "Business", href: "/categories/business" },
  { id: "finance", name: "Finance", href: "/categories/finance" },
  { id: "ai-services", name: "AI Services", href: "/categories/ai-services" },
];

export const SUB_CATEGORIES: Record<string, SubCategory[]> = {
  trending: [
    { name: "AI Artists", href: "/categories/trending/ai-artists" },
    { name: "Logo Design", href: "/categories/trending/logo-design" },
    {
      name: "WordPress Development",
      href: "/categories/trending/wordpress-development",
    },
    {
      name: "Social Media Marketing",
      href: "/categories/trending/social-media-marketing",
    },
    { name: "Voice Over", href: "/categories/trending/voice-over" },
  ],
  "graphics-design": [
    {
      name: "Logo & Brand Identity",
      href: "/categories/graphics-design/logo-brand-identity",
    },
    {
      name: "Web & App Design",
      href: "/categories/graphics-design/web-app-design",
    },
    {
      name: "Art & Illustration",
      href: "/categories/graphics-design/art-illustration",
    },
    {
      name: "Marketing Design",
      href: "/categories/graphics-design/marketing-design",
    },
    {
      name: "Packaging & Covers",
      href: "/categories/graphics-design/packaging-covers",
    },
  ],
  "programming-tech": [
    {
      name: "Website Development",
      href: "/categories/programming-tech/website-development",
    },
    {
      name: "Mobile App Development",
      href: "/categories/programming-tech/mobile-app-development",
    },
    {
      name: "Software Development",
      href: "/categories/programming-tech/software-development",
    },
    {
      name: "Game Development",
      href: "/categories/programming-tech/game-development",
    },
    {
      name: "DevOps & Cloud",
      href: "/categories/programming-tech/devops-cloud",
    },
  ],
  "digital-marketing": [
    {
      name: "Search Engine Optimization (SEO)",
      href: "/categories/digital-marketing/seo",
    },
    {
      name: "Social Media Advertising",
      href: "/categories/digital-marketing/social-media-advertising",
    },
    {
      name: "Video Marketing",
      href: "/categories/digital-marketing/video-marketing",
    },
    {
      name: "Email Marketing",
      href: "/categories/digital-marketing/email-marketing",
    },
    {
      name: "Content Marketing",
      href: "/categories/digital-marketing/content-marketing",
    },
  ],
  "video-animation": [
    {
      name: "Video Editing",
      href: "/categories/video-animation/video-editing",
    },
    {
      name: "Character Animation",
      href: "/categories/video-animation/character-animation",
    },
    {
      name: "Motion Graphics",
      href: "/categories/video-animation/motion-graphics",
    },
    {
      name: "Explainer Videos",
      href: "/categories/video-animation/explainer-videos",
    },
    {
      name: "Visual Effects (VFX)",
      href: "/categories/video-animation/visual-effects",
    },
  ],
  "writing-translation": [
    {
      name: "Articles & Blog Posts",
      href: "/categories/writing-translation/articles-blog-posts",
    },
    {
      name: "Translation",
      href: "/categories/writing-translation/translation",
    },
    {
      name: "Proofreading & Editing",
      href: "/categories/writing-translation/proofreading-editing",
    },
    {
      name: "Resume Writing",
      href: "/categories/writing-translation/resume-writing",
    },
    {
      name: "Copywriting",
      href: "/categories/writing-translation/copywriting",
    },
  ],
  "music-audio": [
    { name: "Voice Over", href: "/categories/music-audio/voice-over" },
    {
      name: "Producers & Composers",
      href: "/categories/music-audio/producers-composers",
    },
    {
      name: "Mixing & Mastering",
      href: "/categories/music-audio/mixing-mastering",
    },
    { name: "Sound Design", href: "/categories/music-audio/sound-design" },
    {
      name: "Audiobook Production",
      href: "/categories/music-audio/audiobook-production",
    },
  ],
  business: [
    { name: "Business Plans", href: "/categories/business/business-plans" },
    { name: "Market Research", href: "/categories/business/market-research" },
    {
      name: "Project Management",
      href: "/categories/business/project-management",
    },
    {
      name: "Virtual Assistant",
      href: "/categories/business/virtual-assistant",
    },
    {
      name: "E-Commerce Management",
      href: "/categories/business/ecommerce-management",
    },
  ],
  finance: [
    {
      name: "Accounting & Bookkeeping",
      href: "/categories/finance/accounting-bookkeeping",
    },
    {
      name: "Financial Consulting",
      href: "/categories/finance/financial-consulting",
    },
    { name: "Tax Consulting", href: "/categories/finance/tax-consulting" },
    {
      name: "Business Valuation",
      href: "/categories/finance/business-valuation",
    },
  ],
  "ai-services": [
    {
      name: "AI Applications",
      href: "/categories/ai-services/ai-applications",
    },
    {
      name: "AI Agents & Automation",
      href: "/categories/ai-services/ai-agents-automation",
    },
    {
      name: "Prompt Engineering",
      href: "/categories/ai-services/prompt-engineering",
    },
    {
      name: "AI Video Generation",
      href: "/categories/ai-services/ai-video-generation",
    },
  ],
};
