/**
 * Social media links data
 */
export const SOCIAL_LINKS = [
  { href: "https://facebook.com/craftflow", label: "Facebook", icon: "facebook" as const },
  { href: "https://twitter.com/craftflow", label: "Twitter", icon: "twitter" as const },
  { href: "https://linkedin.com/company/craftflow", label: "LinkedIn", icon: "linkedin" as const }
] as const;

export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];
export type SocialLink = (typeof SOCIAL_LINKS)[number];
