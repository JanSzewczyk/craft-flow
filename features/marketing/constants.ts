/**
 * Star rating indices for 5-star rating display
 */
export const STARS = [0, 1, 2, 3, 4] as const;

/**
 * Testimonials data for marketing page
 */
export const TESTIMONIALS = [
  {
    quote:
      "Odkąd korzystam z CraftFlow, klienci przestali dzwonić z pytaniem 'kiedy będzie gotowe'. Portal robi to za mnie — klient wchodzi, sprawdza, jest spokojny. Oszczędzam co najmniej godzinę telefonów dziennie.",
    name: "Marek Wiśniewski",
    trade: "Stolarz",
    city: "Wrocław",
    initials: "MW"
  },
  {
    quote:
      "Wygląda to bardzo profesjonalnie — klient dostaje linka do swojego projektu i widzi wszystko na bieżąco. Miałem już kilka sytuacji, gdzie klient polecił mnie dalej właśnie przez ten portal. To najlepszy marketing, jaki mogłem sobie zrobić.",
    name: "Piotr Zając",
    trade: "Elektryk",
    city: "Kraków",
    initials: "PZ"
  },
  {
    quote:
      "Wcześniej gubiłem zdjęcia po różnych folderach na telefonie. Teraz wszystko jest w jednym miejscu, klient widzi postęp, a ja mam porządek w dokumentacji. CraftFlow to coś, czego szukałem od lat.",
    name: "Tomasz Nowak",
    trade: "Glazurnik",
    city: "Poznań",
    initials: "TN"
  }
] as const;

/**
 * FAQ items for pricing page
 */
export const FAQ_ITEMS = [
  {
    question: "Czy mogę wypróbować CraftFlow za darmo?",
    answer:
      "Tak, każde nowe konto otrzymuje 14 dni dostępu do planu Premium bez konieczności podania karty kredytowej. Po tym czasie możesz wybrać plan płatny (Basic, Standard lub Premium). CraftFlow nie oferuje bezpłatnego planu — po zakończeniu okresu próbnego konieczne jest wybranie jednego z dostępnych planów płatnych."
  },
  {
    question: "Jak wygląda rozliczenie? Czy mogę anulować w dowolnym momencie?",
    answer:
      "Rozliczamy miesięcznie z góry. Możesz anulować subskrypcję w dowolnym momencie — nie ma umów długoterminowych ani kar za rezygnację. Po anulowaniu zachowujesz dostęp do końca opłaconego okresu rozliczeniowego."
  },
  {
    question: "Czym różni się limit projektów między planami?",
    answer:
      "Limit dotyczy liczby nowo tworzonych projektów w danym miesiącu rozliczeniowym. Projekty zakończone i zarchiwizowane nie wliczają się do limitu. Plan Basic umożliwia tworzenie do 5 projektów miesięcznie, Standard do 20, a Premium nie ma żadnych ograniczeń."
  },
  {
    question: "Czy mój klient musi zakładać konto, żeby zobaczyć projekt?",
    answer:
      "Nie. Każdy projekt ma unikalny link — klient otwiera go w przeglądarce bez rejestracji. Opcjonalnie może założyć konto, żeby mieć dostęp do historii wszystkich swoich zleceń i łatwiej śledzić postępy kolejnych projektów."
  },
  {
    question: "Co to jest własny branding?",
    answer:
      "Na planach Standard i Premium możesz dodać swoje logo i kolor marki. Klient widzi Twój portal — nie logo CraftFlow. Na planie Basic portal wyświetla branding CraftFlow zamiast Twoich danych wizualnych."
  },
  {
    question: "Co się dzieje z moimi danymi po anulowaniu subskrypcji?",
    answer:
      "Twoje dane są bezpieczne przez 30 dni po anulowaniu. W tym czasie możesz je wyeksportować lub wznowić subskrypcję bez utraty danych. Po 30 dniach dane są trwale usuwane z naszych serwerów."
  },
  {
    question: "Czy mogę zmienić plan w trakcie miesiąca?",
    answer:
      "Tak. Możesz przejść na wyższy plan w dowolnym momencie — różnica jest naliczana proporcjonalnie za pozostałe dni okresu rozliczeniowego. Przejście na niższy plan następuje automatycznie od początku kolejnego okresu rozliczeniowego."
  },
  {
    question: "Czy CraftFlow działa na telefonie?",
    answer:
      "Tak. Interfejs wykonawcy jest w pełni responsywny i działa płynnie na telefonach i tabletach. Portal klienta jest zoptymalizowany pod urządzenia mobilne — klienci mogą bez problemu przeglądać projekty i zatwierdzać wyceny na smartfonie."
  }
] as const;

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

/**
 * Footer links data
 */
export const FOOTER_LINKS = {
  produkt: [
    { href: "/features", label: "Funkcje" },
    { href: "/pricing", label: "Cennik" },
    { href: "/about-us", label: "O nas" }
  ] as const,
  firma: [
    { href: "/about-us", label: "Historia" },
    { href: "/contact", label: "Kontakt" },
    { href: "/blog", label: "Blog" }
  ] as const,
  prawne: [
    { href: "/terms", label: "Regulamin" },
    { href: "/privacy", label: "Polityka prywatności" },
    { href: "/cookies", label: "Polityka cookies" }
  ] as const
} as const;

/**
 * Social media links data
 */
export const SOCIAL_LINKS = [
  { href: "https://facebook.com/craftflow", label: "Facebook", icon: "facebook" as const },
  { href: "https://twitter.com/craftflow", label: "Twitter", icon: "twitter" as const },
  { href: "https://linkedin.com/company/craftflow", label: "LinkedIn", icon: "linkedin" as const }
] as const;

/**
 * Types exported for component usage
 */
export type Testimonial = (typeof TESTIMONIALS)[number];
export type FaqItem = (typeof FAQ_ITEMS)[number];
export type TeamMember = (typeof TEAM)[number];
export type SocialIcon = (typeof SOCIAL_LINKS)[number]["icon"];
export type SocialLink = (typeof SOCIAL_LINKS)[number];
export type FooterLink = (typeof FOOTER_LINKS)[keyof typeof FOOTER_LINKS][number];
