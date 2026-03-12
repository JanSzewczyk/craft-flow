/**
 * Team members data for About page
 */
export const TEAM = [
  {
    initials: "KN",
    name: "Kamil Nowak",
    role: "Założyciel & CEO",
    bio: "Stolarz z 12-letnim doświadczeniem. Zbudował CraftFlow, bo sam potrzebował takiego narzędzia. Odpowiada za wizję produktu i relacje z użytkownikami."
  },
  {
    initials: "AW",
    name: "Agata Wróbel",
    role: "Head of Design",
    bio: "Projektantka UX z pasją do prostych interfejsów. Dba o to, żeby CraftFlow było intuicyjne nawet dla tych, którzy niechętnie korzystają z technologii."
  },
  {
    initials: "MK",
    name: "Michał Kowalski",
    role: "Lead Developer",
    bio: "Full-stack developer z 8 latach doświadczenia. Odpowiada za to, żeby CraftFlow działało szybko, niezawodnie i bezpiecznie."
  }
] as const;

export type TeamMember = (typeof TEAM)[number];
